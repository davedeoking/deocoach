// Live opportunities for coaches and consultants: tenders, EOIs, consultancies and jobs. Closed notices are filtered out (lib/opps.js). GET /api/opps?country=Kenya&kw=leadership
const { aggregate } = require("../lib/opps");
module.exports = async (req, res) => {
  const country = String(req.query.country || "").slice(0, 60); const kw = String(req.query.kw || "").slice(0, 80);
  try { const items = await aggregate(country, kw); res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200"); res.status(200).json({ items, sources: { worldbank: true, reliefweb: !!process.env.RELIEFWEB_APPNAME, adzuna: !!process.env.ADZUNA_APP_ID } }); }
  catch (e) { res.status(502).json({ error: "upstream" }); }
};
