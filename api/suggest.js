// Native-speaker translation suggestions for review. Needs SUPABASE_URL and SUPABASE_SERVICE_KEY. Stores no names, emails or IP addresses.
const hits = new Map();
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; if (!url || !key) return res.status(503).json({ error: "not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= 60) return res.status(429).end(); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const s = (v, n) => String(v || "").slice(0, n);
  const row = { lang: s(b.lang, 8).replace(/[^a-z-]/g, ""), source: s(b.source, 500), current_text: s(b.current, 500), suggestion: s(b.suggestion, 500), note: s(b.note, 300), status: "pending" };
  if (!row.lang || !row.source || !row.suggestion) return res.status(400).end();
  try { const r = await fetch(`${url}/rest/v1/deocoach_translations`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) }); res.status(r.ok ? 204 : 502).end(); }
  catch (e) { res.status(502).end(); }
};
