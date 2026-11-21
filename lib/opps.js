// Opportunity aggregator: World Bank procurement notices (public API), ReliefWeb jobs (needs RELIEFWEB_APPNAME), Adzuna South Africa jobs (needs ADZUNA keys).
const KW = "training OR coaching OR leadership OR \"capacity building\" OR mentoring OR consultant";
const firstArray = (j) => { if (Array.isArray(j)) return j; for (const v of Object.values(j || {})) { if (Array.isArray(v)) return v; if (v && typeof v === "object") { const a = Object.values(v); if (a.length && a.every((x) => x && typeof x === "object" && !Array.isArray(x))) return a; } } return []; };
const clean = (s, n = 220) => String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
async function worldBank(country, kw) {
  const q = encodeURIComponent(`${kw || "training"} ${country || ""}`.trim());
  const r = await fetch(`https://search.worldbank.org/api/v2/procnotices?format=json&rows=60&qterm=${q}`); const j = await r.json();
  return firstArray(j.procnotices || j).map((x) => ({ src: "World Bank", type: /expression/i.test(x.notice_type || "") ? "EOI" : /award/i.test(x.notice_type || "") ? "Award" : "Tender",
    title: clean(x.bid_description || x.project_name || x.notice_type, 160), country: x.project_ctry_name || "", org: clean(x.contact_organization || x.project_name, 80),
    deadline: x.submission_deadline_date || x.submission_date || "", date: x.noticedate || "", url: x.id ? `https://projects.worldbank.org/en/projects-operations/procurement-detail/${x.id}` : "https://projects.worldbank.org/en/projects-operations/procurement" }))
    .filter((x) => x.type !== "Award" && (!country || (x.country || "").toLowerCase().includes(country.toLowerCase())));
}
async function reliefWeb(country, kw) {
  const app = process.env.RELIEFWEB_APPNAME; if (!app) return [];
  const body = { profile: "list", limit: 15, sort: ["date.created:desc"], query: { value: kw || KW }, ...(country ? { filter: { field: "country.name", value: country } } : {}) };
  const r = await fetch(`https://api.reliefweb.int/v2/jobs?appname=${encodeURIComponent(app)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json();
  return (j.data || []).map((d) => { const f = d.fields || {}; return { src: "ReliefWeb", type: "Job", title: clean(f.title, 160), country: ((f.country || [])[0] || {}).name || country || "", org: ((f.source || [])[0] || {}).name || "", deadline: (f.date || {}).closing || "", date: (f.date || {}).created || "", url: f.url_alias || f.url || `https://reliefweb.int/job/${d.id}` }; });
}
async function adzuna(country, kw) {
  const { ADZUNA_APP_ID: id, ADZUNA_APP_KEY: key } = process.env; if (!id || !key || country !== "South Africa") return [];
  const r = await fetch(`https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=${encodeURIComponent(id)}&app_key=${encodeURIComponent(key)}&results_per_page=10&what=${encodeURIComponent(kw || "coach")}`); const j = await r.json();
  return (j.results || []).map((x) => ({ src: "Adzuna", type: "Job", title: clean(x.title, 160), country, org: (x.company || {}).display_name || "", deadline: "", date: x.created || "", url: x.redirect_url }));
}
async function aggregate(country, kw) {
  const parts = await Promise.allSettled([worldBank(country, kw), reliefWeb(country, kw), adzuna(country, kw)]);
  const all = parts.flatMap((p) => (p.status === "fulfilled" ? p.value : []));
  const seen = new Set(); return all.filter((x) => x.title && !seen.has(x.url) && seen.add(x.url)).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 40);
}
module.exports = { aggregate };
