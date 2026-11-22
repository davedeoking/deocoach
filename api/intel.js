// Living intelligence: a self-updating event database.
//  · Cron (vercel.json, every 6h) harvests upcoming events for one city at a time with Claude + web search, in rotation,
//    and alternately re-checks the dates of one curated "check timing" event. Each re-sighting raises an item's score.
//  · Coaches confirm, correct, rate and add events (crowd learning); scores rise and fall; weak items are hidden.
//  · GET returns what the engine has learned for a city (or the latest across Africa) plus engine status.
// Needs SUPABASE_URL, SUPABASE_SERVICE_KEY (tables in SETUP.md) and ANTHROPIC_API_KEY. CRON_SECRET protects the harvester.
const CITIES = [["lagos","Lagos","Nigeria"],["abuja","Abuja","Nigeria"],["nairobi","Nairobi","Kenya"],["jhb","Johannesburg","South Africa"],["accra","Accra","Ghana"],["cpt","Cape Town","South Africa"],["kigali","Kigali","Rwanda"],["cairo","Cairo","Egypt"],["casa","Casablanca","Morocco"],["abidjan","Abidjan","Côte d'Ivoire"],["addis","Addis Ababa","Ethiopia"],["dakar","Dakar","Senegal"],["kampala","Kampala","Uganda"],["dar","Dar es Salaam","Tanzania"],["ph","Port Harcourt","Nigeria"],["mombasa","Mombasa","Kenya"],["durban","Durban","South Africa"],["lusaka","Lusaka","Zambia"],["harare","Harare","Zimbabwe"],["kumasi","Kumasi","Ghana"],["ibadan","Ibadan","Nigeria"],["kano","Kano","Nigeria"],["tunis","Tunis","Tunisia"],["douala","Douala","Cameroon"],["kinshasa","Kinshasa","DR Congo"],["luanda","Luanda","Angola"],["gaborone","Gaborone","Botswana"],["windhoek","Windhoek","Namibia"],["maputo","Maputo","Mozambique"],["freetown","Freetown","Sierra Leone"]];
const CHECK = [["pmi27","PMI Global Summit Series Africa 2027"],["ciod27","CIoD Nigeria Annual Directors Conference 2027"],["cipm27","CIPM Nigeria International Conference and Exhibition 2027"],["nes27","Nigerian Economic Summit 2027"],["wimbiz27","WIMBIZ Annual Conference 2027"],["aun27","African Union Summit February 2027"],["wef27","World Economic Forum on Africa 2027"],["ahe27","Africa Health ExCon 2027"],["lfw27","Lagos Fashion Week 2027"],["atf27","Africa Tech Festival 2027"],["cict27","Cairo ICT 2027"],["hgc26","RCCG Holy Ghost Congress December 2026"],["ican","ICAN Annual Accountants Conference 2027"],["nba","Nigerian Bar Association Annual General Conference 2027"],["ipmsa","IPM South Africa Annual Convention 2027"],["bmf","Black Management Forum annual conference 2027"],["ihrm","IHRM Kenya Annual National HR Congress 2027"],["aew","African Energy Week 2027"],["agrf","Africa Food Systems Forum 2027"],["dli","Deep Learning Indaba 2027"],["sibos","Sibos 2027"],["imfwb","IMF World Bank Spring Meetings 2027"],["adipec","ADIPEC 2027"],["ceraweek","CERAWeek 2027"],["pdac","PDAC Convention 2027"],["mwc","MWC Barcelona 2027"],["gitexg","GITEX Global 2027"],["wha","World Health Assembly 2027"],["unga","UN General Assembly high-level week 2027"],["afdbam","AfDB Annual Meetings 2027"],["cannes","Cannes Lions 2027"],["iba","IBA Annual Conference 2027"],["mipim","MIPIM 2027"],["itb","ITB Berlin 2027"],["wtm","WTM London 2027"],["travind","Africa's Travel Indaba 2027"],["cop","COP32 climate conference 2027"],["iataagm","IATA AGM 2027"]];
const INDS = [["fin","Banking & financial services"],["ins","Insurance & pensions"],["energy","Oil, gas & power"],["mining","Mining & metals"],["tech","Telecoms & technology"],["fmcg","FMCG & manufacturing"],["health","Health & pharma"],["pub","Government & public sector"],["dev","Development, DFIs & NGOs"],["edu","Education & universities"],["agri","Agriculture & food"],["creative","Creative, media & entertainment"],["legal","Legal & professional services"],["faith","Faith & ministry"],["realestate","Real estate & construction"],["logistics","Transport, logistics & aviation"],["tourism","Hospitality & tourism"],["retail","Retail & e-commerce"]];
const NICHES = ["career","global","mgr","exec","sales","money","sme","faith","youth","ai","gov","family","women","coach","well","green","creative"];
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
const keyOf = (name, start, city) => (clean(name, 140).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(20\d\d|the|annual|edition|\d+(st|nd|rd|th))\b/g, "").replace(/\s+/g, " ").trim().slice(0, 80)) + "|" + String(start || "").slice(0, 7) + "|" + city;
const hits = new Map();
async function claude(prompt) {
  const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 50000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ctl.signal, headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.EVENTS_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 3000, tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }], messages: [{ role: "user", content: prompt }] }) });
    const j = await r.json(); if (!r.ok) throw new Error("upstream");
    const t = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n"); const m = t.match(/[\[{][\s\S]*[\]}]/); return m ? JSON.parse(m[0]) : null;
  } finally { clearTimeout(tm); }
}
module.exports = async (req, res) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env;
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const db = (path, o = {}) => fetch(`${url}/rest/v1/${path}`, { ...o, headers: { ...H, ...(o.headers || {}) } });
  const today = new Date().toISOString().slice(0, 10);
  const getState = async () => { const r = await db("deocoach_intel_state?k=eq.engine&select=v"); const j = await r.json(); return (j[0] && j[0].v) || { i: 0, c: 0, runs: 0 }; };
  const setState = (v) => db("deocoach_intel_state", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ k: "engine", v }) });
  async function learn(item) { // upsert with reinforcement: every re-sighting raises seen and score
    const r = await db(`deocoach_intel?key=eq.${encodeURIComponent(item.key)}&select=id,seen,score`); const ex = (await r.json())[0];
    if (ex) return db(`deocoach_intel?id=eq.${ex.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ seen: ex.seen + 1, score: ex.score + (item.confidence === "confirmed" ? 2 : 1), last_seen: new Date().toISOString(), url: item.url || undefined, end_date: item.end_date, confidence: item.confidence }) });
    return db("deocoach_intel", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(item) });
  }
  // ---------- HARVEST (cron) ----------
  if (req.query.cron !== undefined) {
    const secret = process.env.CRON_SECRET; const auth = req.headers.authorization || "";
    if (secret && auth !== `Bearer ${secret}`) return res.status(401).end();
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "AI not configured" });
    const st = await getState(); st.runs = (st.runs || 0) + 1; let learned = 0, task = "";
    try {
      if (st.runs % 3 === 0) { // harvest an industry, Africa + worldwide
        const [iid, iname] = INDS[(st.d || 0) % INDS.length]; st.d = (st.d || 0) + 1; task = "industry " + iname;
        const ids = CITIES.map((c) => c[0] + "=" + c[1]).join(", ");
        const out = await claude(`Today is ${today}. Use web search to find the most important upcoming events in the next 12 months where the power brokers of the ${iname} industry gather — in Africa and worldwide (summits, conferences, expos, annual meetings, industry weeks). Include only events with dates stated on a web page; never invent; prefer the organiser's page; at most 10; include at least 4 in Africa if they exist.
Reply with ONLY a JSON array: [{"name":"","start":"YYYY-MM-DD","end":"YYYY-MM-DD","city":"city name","country":"","venue":"","url":"","audience":"which decision-makers attend","magnitude":1-10,"confidence":"confirmed|announced"}].`);
        for (const e of Array.isArray(out) ? out : []) {
          if (!e || !e.name || !/^\d{4}-\d{2}-\d{2}$/.test(String(e.start || "")) || String(e.end || e.start) < today) continue;
          const hit = CITIES.find((c) => c[1].toLowerCase() === String(e.city || "").toLowerCase()); const cid = hit ? hit[0] : "global";
          await learn({ key: keyOf(e.name, e.start, cid), kind: "event", city: cid, name: clean(e.name, 140), start_date: e.start, end_date: /^\d{4}-\d{2}-\d{2}$/.test(String(e.end || "")) ? e.end : e.start, venue: clean([e.venue, hit ? "" : [e.city, e.country].filter(Boolean).join(", ")].filter(Boolean).join(" · "), 160), url: /^https?:\/\//.test(e.url || "") ? clean(e.url, 400) : "", audience: clean(e.audience, 200), niches: [], industries: [iid], mag: Math.max(1, Math.min(10, Math.round(+e.magnitude || 6))), confidence: e.confidence === "confirmed" ? "confirmed" : "announced" }); learned++;
        }
      } else if (st.runs % 3 === 1) { // harvest a city
        const [cid, cn, cc] = CITIES[st.i % CITIES.length]; st.i = (st.i || 0) + 1; task = "harvest " + cn;
        const out = await claude(`Today is ${today}. Use web search to find real upcoming events in or near ${cn}, ${cc} in the next 12 months where coaches (executive, leadership, HR, career, SME, faith, youth, wellbeing, women's leadership, AI-readiness, creative-economy) could meet clients, buyers or partners: professional-body conferences, business summits, expos, HR and leadership events, major faith and community conventions, creative festivals.
Include only events with dates stated on a web page; never invent; prefer the organiser's page; at most 10.
Reply with ONLY a JSON array: [{"name":"","start":"YYYY-MM-DD","end":"YYYY-MM-DD","venue":"","url":"","audience":"","niches":["one or more of: ${NICHES.join(", ")}"],"industries":["one or more of: ${INDS.map((i) => i[0]).join(", ")}"],"magnitude":1-10,"confidence":"confirmed|announced"}]. magnitude = how much decision-making power and budget attends (10 = heads of state and CEOs in thousands).`);
        for (const e of Array.isArray(out) ? out : []) {
          if (!e || !e.name || !/^\d{4}-\d{2}-\d{2}$/.test(String(e.start || "")) || String(e.end || e.start) < today) continue;
          await learn({ key: keyOf(e.name, e.start, cid), kind: "event", city: cid, name: clean(e.name, 140), start_date: e.start, end_date: /^\d{4}-\d{2}-\d{2}$/.test(String(e.end || "")) ? e.end : e.start, venue: clean(e.venue, 140), url: /^https?:\/\//.test(e.url || "") ? clean(e.url, 400) : "", audience: clean(e.audience, 200), niches: (Array.isArray(e.niches) ? e.niches : []).filter((x) => NICHES.includes(x)).slice(0, 6), industries: (Array.isArray(e.industries) ? e.industries : []).filter((x) => INDS.some((i) => i[0] === x)).slice(0, 4), mag: Math.max(1, Math.min(10, Math.round(+e.magnitude || 5))), confidence: e.confidence === "confirmed" ? "confirmed" : "announced" }); learned++;
        }
      } else { // verify a curated "check timing" item
        const [ref, q] = CHECK[(st.c || 0) % CHECK.length]; st.c = (st.c || 0) + 1; task = "verify " + q;
        const e = await claude(`Today is ${today}. Use web search to find the officially announced dates and city of the next edition of: "${q}". Reply with ONLY JSON: {"found":true|false,"name":"","start":"YYYY-MM-DD","end":"YYYY-MM-DD","city":"","venue":"","url":"","confidence":"confirmed|announced"}. found=false if no page states the dates.`);
        if (e && e.found && /^\d{4}-\d{2}-\d{2}$/.test(String(e.start || "")) && String(e.end || e.start) >= today) {
          await learn({ key: "upd|" + ref + "|" + e.start, kind: "date_update", ref, city: clean(e.city, 60), name: clean(e.name || q, 140), start_date: e.start, end_date: /^\d{4}-\d{2}-\d{2}$/.test(String(e.end || "")) ? e.end : e.start, venue: clean(e.venue, 140), url: /^https?:\/\//.test(e.url || "") ? clean(e.url, 400) : "", confidence: e.confidence === "confirmed" ? "confirmed" : "announced", niches: [], mag: 0 }); learned++;
        }
      }
    } catch (err) { st.err = String(err.message || err).slice(0, 80); }
    // forget: hide items that have ended
    await db(`deocoach_intel?end_date=lt.${today}&status=eq.active`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "past" }) });
    st.last = new Date().toISOString(); st.task = task; st.learned = (st.learned || 0) + learned; await setState(st);
    return res.status(200).json({ ok: true, task, learned });
  }
  // ---------- READ ----------
  if (req.method === "GET") {
    const city = String(req.query.city || "").replace(/[^a-z]/g, "").slice(0, 20);
    const ind = String(req.query.ind || "").replace(/[^a-z,]/g, "").split(",").filter(Boolean).slice(0, 18);
    const q = `deocoach_intel?select=id,kind,ref,city,industries,name,start_date,end_date,venue,url,audience,niches,mag,confidence,score,seen,votes,first_seen,last_seen&status=eq.active&score=gt.-3&end_date=gte.${today}${city ? `&or=(city.eq.${city},kind.eq.date_update)` : ind.length ? `&or=(industries.ov.{${ind.join(",")}},kind.eq.date_update)` : ""}&order=score.desc,start_date.asc&limit=80`;
    const [r, st] = await Promise.all([db(q), getState()]); res.setHeader("Cache-Control", "s-maxage=600");
    return res.status(200).json({ items: await r.json(), engine: { last: st.last || null, task: st.task || "", learned: st.learned || 0, runs: st.runs || 0, cities: CITIES.length } });
  }
  // ---------- CROWD LEARNING ----------
  if (req.method !== "POST") return res.status(405).end();
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= 30) return res.status(429).end(); h.push(now); hits.set(ip, h);
  const b = req.body || {};
  if (b.action === "vote") { const W = { confirm: 2, useful: 1, attended: 2, wrong: -3 }; if (!W[b.v]) return res.status(400).end();
    const id = +b.id; if (!id) return res.status(400).end(); const r = await db(`deocoach_intel?id=eq.${id}&select=id,score,votes`); const ex = (await r.json())[0]; if (!ex) return res.status(404).end();
    const votes = Object.assign({}, ex.votes || {}); votes[b.v] = (votes[b.v] || 0) + 1; const score = ex.score + W[b.v];
    await db(`deocoach_intel?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ votes, score, status: score <= -3 ? "hidden" : "active" }) }); return res.status(204).end(); }
  if (b.action === "add") { const e = b.event || {}; const city = String(e.city || "").replace(/[^a-z]/g, "").slice(0, 20);
    if (!e.name || !/^\d{4}-\d{2}-\d{2}$/.test(String(e.start || "")) || !city) return res.status(400).end();
    await learn({ key: keyOf(e.name, e.start, city), kind: "crowd", city, name: clean(e.name, 140), start_date: e.start, end_date: /^\d{4}-\d{2}-\d{2}$/.test(String(e.end || "")) ? e.end : e.start, venue: clean(e.venue, 140), url: /^https?:\/\//.test(e.url || "") ? clean(e.url, 400) : "", audience: "", niches: NICHES.includes(e.niche) ? [e.niche] : [], mag: 4, confidence: "announced", score: 0 });
    return res.status(204).end(); }
  res.status(400).end();
};
