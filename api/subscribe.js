// Opt-in daily/weekly opportunity alerts by email. Needs SUPABASE_URL and SUPABASE_SERVICE_KEY. Stores email, countries, keywords, cadence and an unsubscribe token.
const crypto = require("crypto");
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; if (!url || !key) return res.status(503).json({ error: "not configured" });
  const b = req.body || {}; const email = String(b.email || "").trim().toLowerCase();
  if (!/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email) || b.consent !== true) return res.status(400).json({ error: "valid email and consent required" });
  const row = { email, countries: (b.countries || []).slice(0, 5).map((s) => String(s).slice(0, 60)), kw: String(b.kw || "").slice(0, 80), cadence: b.cadence === "weekly" ? "weekly" : "daily", token: crypto.randomBytes(16).toString("hex"), updated_at: new Date().toISOString() };
  try { const r = await fetch(`${url}/rest/v1/deocoach_alerts?on_conflict=email`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(row) }); res.status(r.ok ? 200 : 502).json({ ok: r.ok }); }
  catch (e) { res.status(502).json({ error: "upstream" }); }
};
