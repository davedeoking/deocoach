// Scheduled reminders (Vercel cron, protected by CRON_SECRET):
//  ?what=acw&when=eve|day  → ACW session registrants, the day before and the morning of Wed 25 Nov
//  ?what=f50               → Founding 100 members with a reserved place, on the morning of each Thursday session
const { mail, esc, wrap } = require("../lib/mail");
const { ACW, F50_SESSIONS, F50_TOPICS } = require("../lib/plans");
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  const auth = req.headers.authorization === `Bearer ${e.CRON_SECRET}` || req.headers["x-admin-key"] === e.CRON_SECRET;
  if (!e.CRON_SECRET || !auth) return res.status(401).end();
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` }, today = new Date().toISOString().slice(0, 10), what = req.query.what;
  let sent = 0;
  if (what === "acw") {
    const r = await fetch(`${url}/rest/v1/deocoach_signups?select=name,email&kind=eq.acw`, { headers: H }); const rows = r.ok ? await r.json() : [];
    const eve = req.query.when === "eve", z = e.ACW_ZOOM_LINK, t = e.ACW_TIME || "";
    for (const p of rows) { if (await mail(e, p.email, eve ? `Tomorrow: ${ACW.title}` : `Today${t ? " at " + t : ""}: ${ACW.title}`, wrap(`<p>Dear ${esc(p.name.split(" ")[0])},</p><p>${eve ? "A reminder that tomorrow" : "Today"}, ${ACW.day}${t ? " at " + esc(t) : ""}, I'll be live on Zoom for <b>${esc(ACW.title)}</b>.</p><p>${z ? `<b>Join here:</b> <a href="${esc(z)}">${esc(z)}</a>` : "The Zoom link will follow shortly."}</p><p>Bring one task you'd love to hand to AI. See you there.</p>`))) sent++; }
    return res.json({ ok: true, sent });
  }
  if (what === "f50") {
    const i = F50_SESSIONS.indexOf(today); if (i < 0 && !req.query.force) return res.json({ ok: true, sent: 0, note: "no session today" });
    const k = i < 0 ? 0 : i, z = e.F50_ZOOM_LINK, wa = e.F50_WHATSAPP_LINK;
    const r = await fetch(`${url}/rest/v1/deocoach_founding50?select=name,email&status=eq.reserved`, { headers: H }); const rows = r.ok ? await r.json() : [];
    for (const p of rows) { if (await mail(e, p.email, `Tonight 7pm WAT · Founding 100 session ${k + 1} of 12: ${F50_TOPICS[k]}`, wrap(`<p>Dear ${esc(p.name.split(" ")[0])},</p><p>Tonight at <b>7pm WAT</b> (6pm UK) is session <b>${k + 1} of 12</b>: <b>${esc(F50_TOPICS[k])}</b>.</p><p>${z ? `<b>Join on Zoom:</b> <a href="${esc(z)}">${esc(z)}</a>` : "The Zoom link follows by email."}</p>${wa ? `<p>Our Founding 100 WhatsApp group: <a href="${esc(wa)}">${esc(wa)}</a></p>` : ""}`))) sent++; }
    return res.json({ ok: true, sent });
  }
  res.status(400).json({ error: "what=acw|f50" });
};
