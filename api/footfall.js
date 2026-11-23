// Private footfall report for the founder. Protected by CRON_SECRET (sent as the x-admin-key header).
// GET /api/footfall?days=7 → people vs bots, engagement, daily series, cities, sources, browsers, languages, Lagos-time hours,
// a recent-visitor log (anonymous), the bots by name, and the opportunity-email subscribers.
const COUNTRY = { NG: "Nigeria", GH: "Ghana", KE: "Kenya", ZA: "South Africa", RW: "Rwanda", UG: "Uganda", TZ: "Tanzania", ET: "Ethiopia", EG: "Egypt", MA: "Morocco", CI: "Côte d'Ivoire", SN: "Senegal", CM: "Cameroon", ZM: "Zambia", ZW: "Zimbabwe", BW: "Botswana", NA: "Namibia", AO: "Angola", MZ: "Mozambique", SL: "Sierra Leone", LR: "Liberia", GM: "Gambia", BJ: "Benin", TG: "Togo", MW: "Malawi", GB: "United Kingdom", IE: "Ireland", US: "United States", CA: "Canada", FR: "France", DE: "Germany", NL: "Netherlands", ES: "Spain", IT: "Italy", AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar", IN: "India", SG: "Singapore", AU: "Australia", BR: "Brazil", CN: "China", JP: "Japan", FI: "Finland", BE: "Belgium", SE: "Sweden", NO: "Norway", CH: "Switzerland", PT: "Portugal", PL: "Poland" };
const DC = /^(ashburn|boardman|secaucus|council bluffs|the dalles|prineville|quincy|forest city|lenoir|moncks corner|pryor|altoona|eemshaven|middenmeer|hamina|st\.? ghislain|saint-ghislain|clonee|vint hill)$/i;
const LANG = { en: "English", fr: "French", pt: "Portuguese", ar: "Arabic", sw: "Swahili", yo: "Yoruba", ha: "Hausa", ig: "Igbo", am: "Amharic", zu: "Zulu", af: "Afrikaans", es: "Spanish", de: "German", nl: "Dutch", it: "Italian", zh: "Chinese", hi: "Hindi" };
const top = (m, n = 15) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ k, v }));
async function pull(url, H, since, cols) {
  let rows = [];
  for (let off = 0; off < 100000; off += 1000) {
    const r = await fetch(`${url}/rest/v1/deocoach_hits?select=${cols}&at=gte.${since.toISOString()}&order=at.asc&limit=1000&offset=${off}`, { headers: H });
    if (!r.ok) return { err: r.status };
    const b = await r.json(); rows = rows.concat(b); if (b.length < 1000) break;
  }
  return { rows };
}
module.exports = async (req, res) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key, CRON_SECRET: admin } = process.env;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key || !admin) return res.status(503).json({ error: "not configured" });
  if (String(req.headers["x-admin-key"] || "") !== admin) return res.status(401).json({ error: "wrong key" });
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 90);
  const since = new Date(Date.now() - days * 864e5); since.setUTCHours(0, 0, 0, 0);
  const H = { apikey: key, Authorization: `Bearer ${key}` };
  let rich = true, got;
  try {
    got = await pull(url, H, since, "at,kind,city,region,country,path,src,pro,ed,dev,lang,vid,bot,browser,os,tz,scr,secs,depth,pages,eng");
    if (got.err) { rich = false; got = await pull(url, H, since, "at,kind,city,region,country,path,src,pro,ed,dev,lang"); }
    if (got.err) return res.status(502).json({ error: "table missing or unreachable", status: got.err });
  } catch (e) { return res.status(502).json({ error: "upstream" }); }
  const rows = got.rows;
  const cn = (c) => COUNTRY[c] || c || "Unknown";
  const isBot = (h) => h.bot || (h.city && DC.test(h.city)) ? (h.bot || `Cloud server (${h.city})`) : null;
  // Group every row by page-load id so a visit knows its pages, engagement, time on site and whether it subscribed.
  const V = {}, loose = [];
  for (const h of rows) { if (h.vid) (V[h.vid] = V[h.vid] || []).push(h); else loose.push(h); }
  const visits = [];
  for (const id in V) {
    const g = V[id], v = g.find((x) => x.kind === "visit") || g[0];
    const ends = g.filter((x) => x.kind === "end");
    visits.push({ at: v.at, h: v, bot: isBot(v), eng: g.some((x) => x.kind === "eng" || x.eng || x.kind === "gate" || x.kind === "sub"),
      secs: Math.max(0, ...ends.map((x) => x.secs || 0), ...g.filter((x) => x.kind === "eng").map((x) => x.secs || 0)),
      depth: Math.max(0, ...ends.map((x) => x.depth || 0)), pages: Math.max(1, g.filter((x) => x.kind === "view").length + 1, ...ends.map((x) => x.pages || 0)),
      paths: [...new Set(g.filter((x) => x.kind === "visit" || x.kind === "view").map((x) => x.path))],
      pro: (g.find((x) => x.kind === "gate") || {}).pro || null, sub: g.some((x) => x.kind === "sub"), install: g.some((x) => x.kind === "install") });
  }
  for (const h of loose) if (h.kind === "visit") visits.push({ at: h.at, h, bot: isBot(h), eng: false, secs: 0, depth: 0, pages: 1, paths: [h.path], pro: null, sub: false, install: false, old: true });
  const people = visits.filter((v) => !v.bot), bots = visits.filter((v) => v.bot);
  const day = {}, dayB = {}, city = {}, ctry = {}, src = {}, page = {}, pro = {}, ed = {}, dev = {}, subAt = {}, brw = {}, sys = {}, lang = {}, hour = {}, botN = {};
  for (let i = 0; i < days; i++) { const d = new Date(since.getTime() + i * 864e5).toISOString().slice(0, 10); day[d] = 0; dayB[d] = 0; }
  const inc = (m, k) => { if (k) m[k] = (m[k] || 0) + 1; };
  for (const v of people) {
    const h = v.h, d = v.at.slice(0, 10); if (d in day) day[d]++;
    inc(city, h.city ? `${h.city}, ${cn(h.country)}` : `Unknown city, ${cn(h.country)}`); inc(ctry, cn(h.country)); inc(src, h.src || "direct"); inc(dev, h.dev); inc(ed, h.ed);
    if (h.browser) inc(brw, `${h.browser} on ${h.os || "?"}`);
    if (h.lang) inc(lang, LANG[h.lang.slice(0, 2).toLowerCase()] || h.lang);
    inc(hour, String((new Date(v.at).getUTCHours() + 1) % 24).padStart(2, "0")); // Lagos = UTC+1
    v.paths.forEach((p) => inc(page, p)); if (v.pro) inc(pro, v.pro);
  }
  for (const v of bots) { inc(botN, v.bot); const d = v.at.slice(0, 10); if (d in dayB) dayB[d]++; }
  for (const h of rows) if (h.kind === "sub" && !isBot(h)) inc(subAt, h.path);
  const eng = people.filter((v) => v.eng), timed = people.filter((v) => v.secs > 0);
  const avgSecs = timed.length ? Math.round(timed.reduce((a, v) => a + v.secs, 0) / timed.length) : 0;
  const t = { visit: people.length, view: people.reduce((a, v) => a + v.pages, 0), gate: people.filter((v) => v.pro).length, sub: rows.filter((h) => h.kind === "sub" && !isBot(h)).length, install: people.filter((v) => v.install).length, eng: eng.length, bots: bots.length, avgSecs };
  const recent = people.slice().sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 40).map((v) => ({ at: v.at, city: v.h.city, region: v.h.region, country: cn(v.h.country), src: v.h.src, dev: v.h.dev, browser: v.h.browser ? `${v.h.browser} · ${v.h.os}` : null, lang: v.h.lang, tz: v.h.tz, pages: v.pages, paths: v.paths, secs: v.secs, depth: v.depth, eng: v.eng, pro: v.pro, sub: v.sub, old: !!v.old }));
  let subs = [];
  try { const r = await fetch(`${url}/rest/v1/deocoach_alerts?select=email,countries,kw,cadence,updated_at&order=updated_at.desc&limit=200`, { headers: H }); if (r.ok) subs = await r.json(); } catch (e) {}
  res.json({ days, since: since.toISOString(), rich, totals: t, cities: Object.keys(city).length, countries: Object.keys(ctry).length,
    daily: Object.keys(day).map((d) => ({ d, v: day[d], b: dayB[d] })), byCity: top(city, 20), byCountry: top(ctry), bySource: top(src), byPage: top(page), byPro: top(pro, 6), byEdition: top(ed, 2), byDevice: top(dev, 3), bySubAt: top(subAt, 6),
    byBrowser: top(brw, 8), byLang: top(lang, 8), byHour: Object.keys(hour).sort().map((k) => ({ k, v: hour[k] })), byBot: top(botN, 20), recent, subs: subs.map((s) => ({ email: s.email, where: (s.countries || []).join(", "), kw: s.kw, cadence: s.cadence, at: s.updated_at })) });
};
