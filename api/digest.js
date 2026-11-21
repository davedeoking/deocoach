// Daily cron (vercel.json): emails each subscriber their opportunities. Needs SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, DIGEST_FROM, CRON_SECRET. Weekly subscribers are sent on Mondays.
const { aggregate } = require("../lib/opps");
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
module.exports = async (req, res) => {
  const e = process.env; if (!e.CRON_SECRET || req.headers.authorization !== `Bearer ${e.CRON_SECRET}`) return res.status(401).end();
  if (!e.SUPABASE_URL || !e.SUPABASE_SERVICE_KEY || !e.RESEND_API_KEY || !e.DIGEST_FROM) return res.status(503).json({ error: "not configured" });
  const subs = await (await fetch(`${e.SUPABASE_URL}/rest/v1/deocoach_alerts?select=email,countries,kw,cadence,token&limit=5000`, { headers: { apikey: e.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${e.SUPABASE_SERVICE_KEY}` } })).json();
  const monday = new Date().getUTCDay() === 1; const cache = {}; let sent = 0; const base = `https://${req.headers.host}`;
  for (const s of Array.isArray(subs) ? subs : []) {
    if (s.cadence === "weekly" && !monday) continue;
    let items = []; for (const c of (s.countries && s.countries.length ? s.countries : [""])) { const k = c + "|" + (s.kw || ""); cache[k] = cache[k] || (await aggregate(c, s.kw).catch(() => [])); items = items.concat(cache[k]); }
    items = items.slice(0, 15); if (!items.length) continue;
    const html = `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="color:#0D1B4B">Your DeoCoach opportunities</h2>${items.map((x) => `<p><b><a href="${esc(x.url)}">${esc(x.title)}</a></b><br><small>${esc(x.type)} · ${esc(x.country)} · ${esc(x.src)}${x.deadline ? " · deadline " + esc(String(x.deadline).slice(0, 10)) : ""}</small></p>`).join("")}<hr><small>Always check details on the original notice. <a href="${base}/api/unsubscribe?t=${s.token}">Unsubscribe</a></small></div>`;
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: e.DIGEST_FROM, to: s.email, subject: `DeoCoach: ${items.length} opportunities for you`, html }) });
    if (r.ok) sent++;
  }
  res.status(200).json({ sent });
};
