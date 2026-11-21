// Shared field intelligence: coaches post (opt-in) trends, culture notes, opportunities and issues per city; everyone reads recent notes.
// Needs SUPABASE_URL and SUPABASE_SERVICE_KEY. Stores no names, emails or IP addresses.
const hits = new Map(); const TYPES = ["trend", "culture", "opportunity", "issue"];
module.exports = async (req, res) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  if (req.method === "GET") { const city = String(req.query.city || "").replace(/[^a-z]/g, "").slice(0, 20);
    const r = await fetch(`${url}/rest/v1/deocoach_signals?select=city,kind,niche,note,strength,created_at&city=eq.${city}&order=created_at.desc&limit=30`, { headers: H }); res.setHeader("Cache-Control", "s-maxage=300"); return res.status(200).json({ items: await r.json() }); }
  if (req.method !== "POST") return res.status(405).end();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= 20) return res.status(429).end(); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const row = { city: String(b.city || "").replace(/[^a-z]/g, "").slice(0, 20), kind: TYPES.includes(b.kind) ? b.kind : "trend", niche: String(b.niche || "").replace(/[^a-z]/g, "").slice(0, 20), note: String(b.note || "").slice(0, 400), strength: Math.max(1, Math.min(5, +b.strength || 3)) };
  if (!row.city || row.note.length < 8) return res.status(400).end();
  const r = await fetch(`${url}/rest/v1/deocoach_signals`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(row) }); res.status(r.ok ? 204 : 502).end();
};
