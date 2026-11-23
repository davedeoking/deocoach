// Private footfall report for the founder. Protected by CRON_SECRET (sent as the x-admin-key header).
// GET /api/footfall?days=7 → totals, daily series, and top cities, countries, sources, pages, professions, editions, devices.
const COUNTRY = { NG: "Nigeria", GH: "Ghana", KE: "Kenya", ZA: "South Africa", RW: "Rwanda", UG: "Uganda", TZ: "Tanzania", ET: "Ethiopia", EG: "Egypt", MA: "Morocco", CI: "Côte d'Ivoire", SN: "Senegal", CM: "Cameroon", ZM: "Zambia", ZW: "Zimbabwe", BW: "Botswana", NA: "Namibia", AO: "Angola", MZ: "Mozambique", SL: "Sierra Leone", LR: "Liberia", GM: "Gambia", BJ: "Benin", TG: "Togo", MW: "Malawi", GB: "United Kingdom", IE: "Ireland", US: "United States", CA: "Canada", FR: "France", DE: "Germany", NL: "Netherlands", ES: "Spain", IT: "Italy", AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar", IN: "India", SG: "Singapore", AU: "Australia", BR: "Brazil", CN: "China", JP: "Japan" };
const top = (m, n = 15) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ k, v }));
module.exports = async (req, res) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key, CRON_SECRET: admin } = process.env;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key || !admin) return res.status(503).json({ error: "not configured" });
  if (String(req.headers["x-admin-key"] || "") !== admin) return res.status(401).json({ error: "wrong key" });
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
  const since = new Date(Date.now() - days * 864e5); since.setUTCHours(0, 0, 0, 0);
  const H = { apikey: key, Authorization: `Bearer ${key}` };
  let rows = [];
  try {
    for (let off = 0; off < 100000; off += 1000) {
      const r = await fetch(`${url}/rest/v1/deocoach_hits?select=at,kind,city,region,country,path,src,pro,ed,dev&at=gte.${since.toISOString()}&order=at.asc&limit=1000&offset=${off}`, { headers: H });
      if (!r.ok) return res.status(502).json({ error: "table missing or unreachable", status: r.status });
      const b = await r.json(); rows = rows.concat(b); if (b.length < 1000) break;
    }
  } catch (e) { return res.status(502).json({ error: "upstream" }); }
  const t = { visit: 0, view: 0, gate: 0, sub: 0, install: 0 }, day = {}, city = {}, ctry = {}, src = {}, page = {}, pro = {}, ed = {}, dev = {}, subAt = {};
  for (let i = 0; i < days; i++) { const d = new Date(since.getTime() + i * 864e5); day[d.toISOString().slice(0, 10)] = 0; }
  const inc = (m, k) => { if (k) m[k] = (m[k] || 0) + 1; };
  for (const h of rows) {
    t[h.kind] = (t[h.kind] || 0) + 1;
    if (h.kind === "visit") {
      const d = h.at.slice(0, 10); if (d in day) day[d]++;
      const cn = COUNTRY[h.country] || h.country || "Unknown";
      inc(city, h.city ? `${h.city}, ${cn}` : `Unknown city, ${cn}`); inc(ctry, cn); inc(src, h.src || "direct"); inc(dev, h.dev); inc(ed, h.ed);
    }
    if (h.kind === "visit" || h.kind === "view") inc(page, h.path);
    if (h.kind === "gate") inc(pro, h.pro);
    if (h.kind === "sub") inc(subAt, h.path);
  }
  res.json({ days, since: since.toISOString(), totals: t, cities: Object.keys(city).length, countries: Object.keys(ctry).length,
    daily: Object.entries(day).map(([d, v]) => ({ d, v })), byCity: top(city, 20), byCountry: top(ctry), bySource: top(src), byPage: top(page), byPro: top(pro, 6), byEdition: top(ed, 2), byDevice: top(dev, 3), bySubAt: top(subAt, 6) });
};
