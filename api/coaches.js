// Find a Coach: a directory of African coaches (and trainers, facilitators, mentors, speakers, consultants).
// GET                         → {coaches:[…]} approved profiles, public fields only (never emails or phones)
// GET with x-admin-key        → {coaches:[…all, including pending…]}
// POST {action:"list", …}     → a coach applies to be listed (status "pending" until David approves)
// POST {action:"contact", id, name, email, phone?, message, consent} → emails the coach (reply-to the client); the client's email is never shown publicly
// POST {action:"review", id, status:"approved"|"rejected"|"pending", badges?} with x-admin-key → David moderates
const { mail, esc, wrap } = require("../lib/mail");
const clip = (s, n) => String(s || "").trim().slice(0, n);
const arr = (a, n, m) => (Array.isArray(a) ? a : String(a || "").split(",")).map((x) => clip(x, m || 40)).filter(Boolean).slice(0, n);
const PUB = "id,name,title,pro,city,country,niches,langs,formats,audience,bio,years,rate,photo,linkedin,website,badges,created_at";
const okEmail = (e) => /^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/i.test(e);
const okUrl = (u) => !u || /^https:\/\/[^\s"'<>]{4,300}$/i.test(u);
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` }, J = { ...H, "Content-Type": "application/json" };
  const admin = e.CRON_SECRET && req.headers["x-admin-key"] === e.CRON_SECRET;
  try {
    if (req.method === "GET") {
      const q = admin ? `select=*&order=created_at.desc&limit=1000` : `select=${PUB}&status=eq.approved&order=featured.desc.nullslast,created_at.asc&limit=1000`;
      const r = await fetch(`${url}/rest/v1/deocoach_coaches?${q}`, { headers: H });
      return res.json({ coaches: r.ok ? await r.json() : [] });
    }
    if (req.method !== "POST") return res.status(405).end();
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    if (b.action === "review") {
      if (!admin) return res.status(401).json({ error: "wrong key" });
      const patch = {}; if (["approved", "rejected", "pending"].includes(b.status)) patch.status = b.status;
      if (b.badges) patch.badges = arr(b.badges, 6, 30); if (typeof b.featured === "boolean") patch.featured = b.featured;
      const r = await fetch(`${url}/rest/v1/deocoach_coaches?id=eq.${parseInt(b.id, 10)}`, { method: "PATCH", headers: { ...J, Prefer: "return=representation" }, body: JSON.stringify(patch) });
      const row = (r.ok ? await r.json() : [])[0];
      if (row && patch.status === "approved") await mail(e, row.email, "You're now listed on DeoCoach — Find a Coach", wrap(`<p>Dear ${esc(row.name.split(" ")[0])},</p><p>Your profile is now live in <b>Find a Coach</b> on DeoCoach, where clients across Africa and beyond look for coaches: <a href="https://www.deocoach.com/coaches">deocoach.com/coaches</a>.</p><p>When a client contacts you through your profile, their message comes straight to this email address. Reply to them directly.</p>`));
      return res.json({ ok: !!row, row });
    }
    const name = clip(b.name, 80), email = clip(b.email, 200).toLowerCase();
    if (!name || !okEmail(email) || b.consent !== true) return res.status(400).json({ error: "Please give your name, a valid email and your consent." });
    if (b.action === "list") {
      if (!okUrl(b.photo) || !okUrl(b.linkedin) || !okUrl(b.website)) return res.status(400).json({ error: "Links must start with https://" });
      const row = { name, email, phone: clip(b.phone, 30) || null, title: clip(b.title, 100) || null, pro: clip(b.pro, 20) || "coach",
        city: clip(b.city, 60) || null, country: clip(b.country, 60) || null, niches: arr(b.niches, 6), langs: arr(b.langs, 6, 24), formats: arr(b.formats, 3, 20),
        audience: arr(b.audience, 4, 30), bio: clip(b.bio, 700) || null, years: Math.max(0, Math.min(60, parseInt(b.years, 10) || 0)) || null, rate: clip(b.rate, 40) || null,
        photo: clip(b.photo, 300) || null, linkedin: clip(b.linkedin, 300) || null, website: clip(b.website, 300) || null, accred: clip(b.accred, 200) || null, status: "pending", badges: [] };
      const r = await fetch(`${url}/rest/v1/deocoach_coaches`, { method: "POST", headers: { ...J, Prefer: "return=representation" }, body: JSON.stringify(row) });
      if (r.status === 409) return res.status(409).json({ error: "A profile with this email already exists — we'll be in touch." });
      if (!r.ok) return res.status(502).json({ error: "Couldn't save your profile just now. Please try again." });
      await mail(e, email, "We've received your Find a Coach profile", wrap(`<p>Dear ${esc(name.split(" ")[0])},</p><p>Thank you for listing yourself in <b>Find a Coach</b> on DeoCoach. Every profile is reviewed before it goes live, usually within two working days. We'll email you as soon as yours is published.</p>`));
      if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `New coach to approve: ${name} (${row.city || "?"}, ${row.country || "?"})`, `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><b>${esc(name)}</b> · ${esc(row.title || "")} · ${esc(email)}</p><p>${esc(row.niches.join(", "))} · ${esc(row.langs.join(", "))} · ${esc(row.formats.join(", "))}</p><p>${esc(row.bio || "")}</p><p>Approve on <a href="https://www.deocoach.com/footfall.html">your Footfall page</a>.</p></div>`);
      return res.json({ ok: true, status: "pending" });
    }
    if (b.action === "contact") {
      const msg = clip(b.message, 1500); if (msg.length < 10) return res.status(400).json({ error: "Please write a short message (what you'd like help with)." });
      const r = await fetch(`${url}/rest/v1/deocoach_coaches?select=id,name,email&id=eq.${parseInt(b.id, 10)}&status=eq.approved`, { headers: H });
      const c = (r.ok ? await r.json() : [])[0]; if (!c) return res.status(404).json({ error: "That coach isn't available right now." });
      const ok = await mail(e, c.email, `New client enquiry from DeoCoach: ${name}`, wrap(`<p>Dear ${esc(c.name.split(" ")[0])},</p><p>A client found you on <b>DeoCoach · Find a Coach</b> and sent this message:</p><blockquote style="border-left:3px solid #E9B949;margin:12px 0;padding:8px 14px">${esc(msg).replace(/\n/g, "<br>")}</blockquote><p><b>${esc(name)}</b> · <a href="mailto:${esc(email)}">${esc(email)}</a>${b.phone ? " · " + esc(clip(b.phone, 30)) : ""}</p><p>Just press Reply to answer them directly.</p>`), { reply_to: email });
      await mail(e, email, `Your message to ${c.name} has been sent`, wrap(`<p>Dear ${esc(name.split(" ")[0])},</p><p>Your message has gone to <b>${esc(c.name)}</b>, who will reply to you directly by email. Thank you for using DeoCoach to find your coach.</p>`));
      try { await fetch(`${url}/rest/v1/deocoach_signups`, { method: "POST", headers: { ...J, Prefer: "return=minimal" }, body: JSON.stringify({ kind: "lead", name, email, phone: clip(b.phone, 30) || null, org: c.name, ref: String(c.id), note: msg.slice(0, 600), status: ok ? "sent" : "failed" }) }); } catch (x) {}
      return res.json({ ok: true });
    }
    res.status(400).json({ error: "unknown action" });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
