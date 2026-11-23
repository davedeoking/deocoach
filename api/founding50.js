// The Founding 50: the first 50 coaches David personally helps to automate their practice.
// GET  → {cap, taken, left}            (public, for the live "places left" counter)
// GET with x-admin-key (CRON_SECRET) → {cap, taken, rows:[…]}   (David's list)
// POST {name,email,city,country,pro,practice,wants,consent} → reserves place #n (or the waitlist once 50 are taken),
//      emails the applicant a confirmation and emails David a notification (Resend, when configured).
const CAP = 50;
const clip = (s, n) => String(s || "").trim().slice(0, n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function count(url, H) {
  const r = await fetch(`${url}/rest/v1/deocoach_founding50?select=id&status=neq.withdrawn`, { headers: { ...H, Prefer: "count=exact", Range: "0-0" } });
  const cr = r.headers.get("content-range") || "*/0"; return parseInt(cr.split("/")[1], 10) || 0;
}
async function mail(e, to, subject, html) {
  if (!e.RESEND_API_KEY || !e.DIGEST_FROM || !to) return;
  try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: e.DIGEST_FROM, ...(e.DIGEST_REPLY_TO ? { reply_to: e.DIGEST_REPLY_TO } : {}), to, subject, html }) }); } catch (x) {}
}
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` };
  try {
    if (req.method === "GET") {
      const taken = await count(url, H);
      if (e.CRON_SECRET && req.headers["x-admin-key"] === e.CRON_SECRET) {
        const r = await fetch(`${url}/rest/v1/deocoach_founding50?select=*&order=id.asc&limit=500`, { headers: H });
        return res.json({ cap: CAP, taken, rows: r.ok ? await r.json() : [] });
      }
      return res.json({ cap: CAP, taken, left: Math.max(0, CAP - taken) });
    }
    if (req.method !== "POST") return res.status(405).end();
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    const email = clip(b.email, 200).toLowerCase(), name = clip(b.name, 80);
    if (!name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email) || b.consent !== true) return res.status(400).json({ error: "Please give your name, a valid email and your consent." });
    const before = await count(url, H);
    const row = { name, email, phone: clip(b.phone, 30) || null, city: clip(b.city, 60) || null, country: clip(b.country, 60) || null, pro: clip(b.pro, 20) || null,
      practice: clip(b.practice, 300) || null, wants: clip(b.wants, 600) || null, status: before < CAP ? "reserved" : "waitlist" };
    const r = await fetch(`${url}/rest/v1/deocoach_founding50`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(row) });
    if (r.status === 409) return res.status(409).json({ error: "You've already applied with this email — David will be in touch." });
    if (!r.ok) return res.status(502).json({ error: "Couldn't save your application just now. Please try again." });
    const saved = (await r.json())[0] || {}; const pos = before + 1; const wl = row.status === "waitlist";
    // also put them on the weekly opportunities list (they consented to emails from DeoCoach)
    try { await fetch(`${url}/rest/v1/deocoach_alerts?on_conflict=email`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email, countries: row.country ? [row.country] : [], kw: "coaching leadership training", cadence: "weekly", token: require("crypto").randomBytes(16).toString("hex"), updated_at: new Date().toISOString() }) }); } catch (x) {}
    const first = esc(name.split(" ")[0]);
    await mail(e, email, wl ? "You're on the Founding 50 waiting list" : `Your Founding 50 place is reserved (#${pos} of ${CAP})`,
      `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1d1a14;line-height:1.55">
       <p>Dear ${first},</p>
       <p>${wl ? `Thank you for applying. All ${CAP} Founding places are taken, so you're first in line on the waiting list. If a place opens, or when the next cohort starts, you'll hear from me first.` : `Thank you for applying. <b>Your place in the Founding 50 is reserved — you are #${pos} of ${CAP}.</b>`}</p>
       <p>Over 90 days we'll work through the method together: <b>Map → Automate → Govern → Monetise</b>. I'll email you the start date and the Zoom link for our first live session.</p>
       <p><b>Start today:</b> download the free AI &amp; Automation Starter Kit and fill in your Automation Map before we meet:<br>
       <a href="https://www.deocoach.com/free/ai-automation-starter-kit.html">The AI &amp; Automation Starter Kit</a> · <a href="https://www.deocoach.com/free/automation-map-worksheet.html">The Automation Map</a></p>
       <p>Activating the future with you,<br><b>Coach David Adeoye Abodunrin</b><br>Founder, DeoCoach · <a href="https://www.deocoach.com">deocoach.com</a></p></div>`);
    if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `${wl ? "Waitlist" : "Founding 50 #" + pos}: ${name} (${row.city || "?"}, ${row.pro || "?"})`,
      `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><b>${esc(name)}</b> · ${esc(email)}${row.phone ? " · " + esc(row.phone) : ""}<br>${esc(row.city || "")} ${esc(row.country || "")} · ${esc(row.pro || "")}</p><p><b>Practice:</b> ${esc(row.practice || "—")}</p><p><b>Wants to automate:</b> ${esc(row.wants || "—")}</p><p>${wl ? "On the waiting list." : `Place #${pos} of ${CAP}.`} Full list on <a href="https://www.deocoach.com/footfall.html">your Footfall page</a>.</p></div>`);
    return res.json({ ok: true, status: row.status, position: pos, cap: CAP, left: Math.max(0, CAP - pos), id: saved.id });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
