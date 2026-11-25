// The Founding 100: the first 100 coaches and consultants David personally helps to automate their practice.
// GET  → {cap, taken, left}            (public, for the live "places left" counter)
// GET with x-admin-key (CRON_SECRET) → {cap, taken, rows:[…]}   (David's list)
// POST {name,email,city,country,pro,practice,wants,consent,code?} → reserves place #n (or the waitlist once 50 are taken),
// Priority codes: LCAN members and ACW participants get a unique single-use code (LCAN50-XXXXXX / ACW50-XXXXXX, table deocoach_f50codes);
//   an LCAN Pro voucher (LCAN-XXXX-XXXX) also counts. F50_RESERVED places (default 20) are held for code holders.
//      emails the applicant a confirmation and emails David a notification (Resend, when configured).
const CAP = +(process.env.F50_CAP || 100);
// Group codes LCAN and ACW announce publicly; entering one emails the person their own unique single-use code.
const GROUP = (e) => ({ [String(e.F50_LCAN_GROUP || "LCAN2026").toUpperCase().replace(/[^A-Z0-9]/g, "")]: "lcan", [String(e.F50_ACW_GROUP || "ACW2026").toUpperCase().replace(/[^A-Z0-9]/g, "")]: "acw" });
const normCode = (c) => { const x = String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  let m = x.match(/^(LCAN50|ACW50)([A-F0-9]{6})$/); if (m) return { code: `${m[1]}-${m[2]}`, kind: m[1] === "ACW50" ? "acw" : "lcan", table: "f50" };
  m = x.match(/^LCAN([A-Z0-9]{4})([A-Z0-9]{4})$/); if (m) return { code: `LCAN-${m[1]}-${m[2]}`, kind: "lcan", table: "voucher" };
  return null; };
const clip = (s, n) => String(s || "").trim().slice(0, n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function count(url, H, extra) {
  const r = await fetch(`${url}/rest/v1/deocoach_founding50?select=id&status=eq.reserved${extra || ""}`, { headers: { ...H, Prefer: "count=exact", Range: "0-0" } });
  const cr = r.headers.get("content-range") || "*/0"; return parseInt(cr.split("/")[1], 10) || 0;
}

async function assign(url, H, kind, name, email) {
  const J = { ...H, "Content-Type": "application/json" };
  const mine = await (await fetch(`${url}/rest/v1/deocoach_f50codes?select=code,used_at&kind=eq.${kind}&assigned_email=eq.${encodeURIComponent(email)}&limit=1`, { headers: H })).json();
  if (Array.isArray(mine) && mine.length) return { code: mine[0].code, again: true, used: !!mine[0].used_at };
  for (let i = 0; i < 6; i++) {
    const free = await (await fetch(`${url}/rest/v1/deocoach_f50codes?select=code&kind=eq.${kind}&batch=like.*AUTO*&assigned_at=is.null&used_at=is.null&order=code.asc&limit=1&offset=${i * 3}`, { headers: H })).json();
    if (!Array.isArray(free) || !free.length) return null;
    const u = await fetch(`${url}/rest/v1/deocoach_f50codes?code=eq.${free[0].code}&assigned_at=is.null`, { method: "PATCH", headers: { ...J, Prefer: "return=representation" }, body: JSON.stringify({ assigned_at: new Date().toISOString(), assigned_email: email, name }) });
    const got = u.ok ? await u.json() : [];
    if (got.length) return { code: got[0].code };
  }
  return null;
}
async function mail(e, to, subject, html) {
  if (!e.RESEND_API_KEY || !e.DIGEST_FROM || !to) return;
  try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: e.DIGEST_FROM, ...(e.DIGEST_REPLY_TO ? { reply_to: "coachdeo@deocoach.com" } : {}), to, subject, html }) }); } catch (x) {}
}
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` };
  try {
    if (req.method === "GET") {
      const taken = await count(url, H), viaTaken = await count(url, H, "&via=not.is.null"), RES = +(e.F50_RESERVED || 40);
      const resLeft = Math.max(0, RES - viaTaken), left = Math.max(0, CAP - taken);
      if (e.CRON_SECRET && req.headers["x-admin-key"] === e.CRON_SECRET) {
        const r = await fetch(`${url}/rest/v1/deocoach_founding50?select=*&order=id.asc&limit=500`, { headers: H });
        return res.json({ cap: CAP, taken, rows: r.ok ? await r.json() : [] });
      }
      if (req.query && req.query.code) { const c = normCode(req.query.code); let ok = false;
        if (c && c.table === "f50") { const j = await (await fetch(`${url}/rest/v1/deocoach_f50codes?select=used_at&code=eq.${c.code}`, { headers: H })).json(); ok = !!(j.length && !j[0].used_at); }
        if (c && c.table === "voucher") { const j = await (await fetch(`${url}/rest/v1/deocoach_vouchers?select=code&code=eq.${c.code}`, { headers: H })).json(); ok = !!j.length; }
        return res.json({ valid: ok, kind: c ? c.kind : null }); }
      return res.json({ cap: CAP, taken, left, reserved: RES, reservedLeft: Math.min(resLeft, left), openLeft: Math.max(0, left - resLeft) });
    }
    if (req.method !== "POST") return res.status(405).end();
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    const email = clip(b.email, 200).toLowerCase(), name = clip(b.name, 80);
    if (!name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email) || b.consent !== true) return res.status(400).json({ error: "Please give your name, a valid email and your consent." });
    const grp = GROUP(e)[String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "")];
    if (grp) {
      const a = await assign(url, H, grp, name, email);
      if (!a) return res.status(410).json({ error: "All personal codes for this group have been given out. Please apply without a code, or contact coachdeo@deocoach.com." });
      const who = grp === "acw" ? "Africa Coaching Week" : "LCAN", link = `https://www.deocoach.com/?code=${a.code}#founding50`, first0 = esc(name.split(" ")[0]);
      await mail(e, email, `Your personal ${who} code for the Founding 100: ${a.code}`,
        `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1d1a14;line-height:1.55"><p>Dear ${first0},</p>
        <p>Here is your personal ${who} priority code for the DeoCoach Founding 100. It is yours alone and works once:</p>
        <p style="font-size:26px;font-weight:bold;letter-spacing:2px;margin:14px 0">${a.code}</p>
        <p><a href="${link}" style="display:inline-block;background:#B8862B;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Claim my priority place ▸</a></p>
        <p>The button opens the Founding 100 page with your code filled in. ${CAP} coaches and consultants, 12 free live sessions with me, every Thursday at 7pm WAT from 10 December. Places held for ${who} are limited, so claim yours today.</p>
        <p>Activating the future with you,<br><b>Coach David Adeoye Abodunrin</b><br>Founder, DeoCoach · <a href="https://www.deocoach.com">deocoach.com</a></p></div>`);
      if (b.claimOnly) return res.json({ ok: true, claimed: true, kind: grp, again: !!a.again, used: !!a.used });
      b.code = a.code;
    }
    const before = await count(url, H), viaBefore = await count(url, H, "&via=not.is.null"), RES = +(e.F50_RESERVED || 40);
    let via = null, codeStr = null;
    if (String(b.code || "").trim()) {
      const c = normCode(b.code);
      if (!c) return res.status(400).json({ error: "That code doesn't look right. LCAN and ACW codes look like LCAN50-1A2B3C or ACW50-1A2B3C." });
      if (c.table === "f50") {
        const own = await (await fetch(`${url}/rest/v1/deocoach_f50codes?select=assigned_email&code=eq.${c.code}`, { headers: H })).json();
        if (Array.isArray(own) && own.length && own[0].assigned_email && own[0].assigned_email !== email) return res.status(409).json({ error: "This code was sent to a different email address. Please apply with that email, or use the group code to get your own." });
        const u = await fetch(`${url}/rest/v1/deocoach_f50codes?code=eq.${c.code}&used_at=is.null`, { method: "PATCH", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ used_at: new Date().toISOString(), name, email }) });
        const got = u.ok ? await u.json() : [];
        if (!got.length) { const chk = await (await fetch(`${url}/rest/v1/deocoach_f50codes?select=email&code=eq.${c.code}`, { headers: H })).json();
          if (!(chk.length && chk[0].email === email)) return res.status(409).json({ error: chk.length ? "This code has already been used. Each code works once." : "We couldn't find that code. Please check it, or apply without a code." }); }
      } else {
        const v = await (await fetch(`${url}/rest/v1/deocoach_vouchers?select=code&code=eq.${c.code}`, { headers: H })).json();
        if (!v.length) return res.status(409).json({ error: "We couldn't find that LCAN code. Please check it, or apply without a code." });
        const dup = await (await fetch(`${url}/rest/v1/deocoach_founding50?select=email&code=eq.${c.code}`, { headers: H })).json();
        if (dup.length && dup[0].email !== email) return res.status(409).json({ error: "This code has already been used for the Founding 100." });
      }
      via = c.kind; codeStr = c.code;
    }
    const resLeft = Math.max(0, RES - viaBefore);
    const confirmed = via ? before < CAP : (CAP - before) > resLeft;
    const row = { name, email, phone: clip(b.phone, 30) || null, city: clip(b.city, 60) || null, country: clip(b.country, 60) || null, pro: clip(b.pro, 20) || null,
      practice: clip(b.practice, 300) || null, wants: clip(b.wants, 600) || null, status: confirmed ? "reserved" : "waitlist", code: codeStr, via };
    const r = await fetch(`${url}/rest/v1/deocoach_founding50`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(row) });
    if (r.status === 409) return res.status(409).json({ error: "You've already applied with this email — David will be in touch." });
    if (!r.ok) return res.status(502).json({ error: "Couldn't save your application just now. Please try again." });
    const saved = (await r.json())[0] || {}; const pos = before + 1; const wl = row.status === "waitlist";
    // also put them on the weekly opportunities list (they consented to emails from DeoCoach)
    try { await fetch(`${url}/rest/v1/deocoach_alerts?on_conflict=email`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email, countries: row.country ? [row.country] : [], kw: require("../lib/prokw").proKw(row.pro), cadence: "weekly", token: require("crypto").randomBytes(16).toString("hex"), updated_at: new Date().toISOString() }) }); } catch (x) {}
    const first = esc(name.split(" ")[0]);
    await mail(e, email, wl ? "You're on the Founding 100 waiting list" : `Your Founding 100 place is reserved (#${pos} of ${CAP})`,
      `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1d1a14;line-height:1.55">
       <p>Dear ${first},</p>
       <p>${wl ? `Thank you for applying. ${before < CAP ? "All open places are taken; the remaining places are held for LCAN members and Africa Coaching Week participants with a priority code." : `All ${CAP} Founding places are taken.`} You're first in line on the waiting list. If a place opens, or when the next cohort starts, you'll hear from me first.` : `Thank you for applying. <b>Your place in the Founding 100 is reserved — you are #${pos} of ${CAP}.</b>`}</p>
       ${via && !wl ? `<p>Your ${via === "acw" ? "Africa Coaching Week" : "LCAN"} code <b>${esc(codeStr)}</b> secured you a priority place.</p>` : ""}<p>Over 90 days we'll work through the method together: <b>Map → Automate → Govern → Monetise</b>.</p>
       ${wl ? "" : `<p><b>We start on Thursday 10 December at 7pm WAT (6pm UK)</b>, then meet live on Zoom every Thursday at the same time for 12 sessions, with a break over Christmas and New Year. The last session is on 11 March 2027.<br>
       <a href="https://www.deocoach.com/free/founding50.ics">Add all 12 sessions to your calendar</a>. The Zoom link comes by email on the morning of each session.${e.F50_WHATSAPP_LINK ? `<br>Join our Founding 100 WhatsApp group: <a href="${esc(e.F50_WHATSAPP_LINK)}">${esc(e.F50_WHATSAPP_LINK)}</a>` : ""}</p>`}
       <p><b>Start today:</b> download the free AI &amp; Automation Starter Kit and fill in your Automation Map before we meet:<br>
       <a href="https://www.deocoach.com/free/ai-automation-starter-kit.html">The AI &amp; Automation Starter Kit</a> · <a href="https://www.deocoach.com/free/automation-map-worksheet.html">The Automation Map</a></p>
       <p>Activating the future with you,<br><b>Coach David Adeoye Abodunrin</b><br>Founder, DeoCoach · <a href="https://www.deocoach.com">deocoach.com</a></p></div>`);
    if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `${wl ? "Waitlist" : "Founding 100 #" + pos}: ${name} (${row.city || "?"}, ${row.pro || "?"})`,
      `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><b>${esc(name)}</b> · ${esc(email)}${row.phone ? " · " + esc(row.phone) : ""}<br>${esc(row.city || "")} ${esc(row.country || "")} · ${esc(row.pro || "")}${via ? " · " + (via === "acw" ? "ACW" : "LCAN") + " code " + esc(codeStr) : ""}</p><p><b>Practice:</b> ${esc(row.practice || "—")}</p><p><b>Wants to automate:</b> ${esc(row.wants || "—")}</p><p>${wl ? "On the waiting list." : `Place #${pos} of ${CAP}.`} Full list on <a href="https://www.deocoach.com/footfall.html">your Footfall page</a>.</p></div>`);
    return res.json({ ok: true, status: row.status, via, position: pos, cap: CAP, left: Math.max(0, CAP - pos), id: saved.id });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
