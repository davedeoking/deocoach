// Event Prep Copilot + industry happenings, powered by Claude with optional live web search (sources returned).
// POST {mode:"chat", messages:[{role,content}], context:"...", web:true|false}  → {text, sources:[{title,url}]}
// POST {mode:"brief", industry:"Banking & financial services"}                 → {items:[{title,date,what,so,url}], sources}
// Needs ANTHROPIC_API_KEY. Optional PREP_MODEL, PREP_HOURLY_LIMIT (default 30 per visitor).
const hits = new Map();
const GUARD = "You are the Event Prep Copilot inside DeoCoach (Edition for African Coaches), created by Coach David Adeoye Abodunrin. You help coaches across Africa prepare to win business at conferences, summits and industry gatherings in Africa and worldwide: who the power brokers are (describe roles and organisations; name individuals only if a cited source names them as attending or speaking), how to get in front of them ethically, what role to play (speaker, panellist, side-event host, delegate), preparation plans, talk abstracts, introductions, one-page offers, etiquette and follow-up. Be concrete, practical, Africa-aware and globally fluent. Never invent statistics, attendance figures, dates, fees, visa rules or speakers: state them only if a source you found says so, and otherwise tell the coach to check the official page. Coaching is not therapy; refer risk to qualified professionals. Use short headings and bullet points.";
// mode "council": {topic, seats[], context, web} → {voices, products[{…pitch_by,pilot_by,launch_by}], first_moves, risks}
const clean = (s, n) => String(s || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return res.status(503).json({ error: "AI not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const limit = +(process.env.PREP_HOURLY_LIMIT || 30);
  const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= limit) return res.status(429).json({ error: "rate_limited" }); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const today = new Date().toISOString().slice(0, 10);
  let system = GUARD + ` Today is ${today}.`, messages, web = !!b.web, max = 2200;
  if (b.mode === "brief") {
    const ind = clean(b.industry, 80); if (!ind) return res.status(400).json({ error: "industry required" });
    web = true; max = 2500;
    messages = [{ role: "user", content: `Use web search to find the 6 most important developments of the past 14 days in the ${ind} industry that matter for coaches who sell leadership, executive, team, career or business coaching in Africa: leadership changes, mergers and deals, big investments or layoffs, regulation and policy, major upcoming events and calls for speakers, skills shortages. Prefer African developments; include global ones that affect Africa. Open the pages you rely on. Reply with ONLY a JSON array: [{"title":"short headline","date":"YYYY-MM-DD or empty","what":"one sentence on what happened","so":"one sentence on the coaching opportunity it creates","url":"source page"}].` }];
  } else if (b.mode === "council") {
    const seats = (Array.isArray(b.seats) ? b.seats : []).slice(0, 8).map((x) => clean(x, 80)).filter(Boolean); const topic = clean(b.topic, 1500);
    if (!topic || !seats.length) return res.status(400).json({ error: "topic and seats required" });
    max = 4000; system += " You are now convening a council room. Each seat speaks in its own distinct voice, briefly and concretely, then the chair synthesises. Context about this coach: " + clean(b.context, 1800);
    messages = [{ role: "user", content: `Industry happening to think through: "${topic}".
Council seats present: ${seats.join("; ")}. ${web ? "Use web search to ground the discussion in what is actually happening; cite only what you found." : ""}
Turn this happening into coaching products and services this coach can sell. Time the pitches to real budget cycles and decision windows (e.g. January-year budgets set Sep–Nov; July fiscal years in East Africa and Egypt; April in South Africa) and to the happening itself. Pricing: give guidance relative to the coach's own average engagement value if provided — never quote market prices you have not found.
Reply with ONLY JSON: {"voices":[{"seat":"","says":"2–4 sentences"}],"products":[{"name":"","what":"one sentence","format":"e.g. 90-day executive cohort, board retreat, 1:1 transition coaching","buyer":"job title and organisation type","why_now":"","pitch":"a 30-second pitch in the coach's voice","channels":"how to reach the buyer","price_hint":"","pitch_by":"YYYY-MM-DD","pilot_by":"YYYY-MM-DD","launch_by":"YYYY-MM-DD"}],"first_moves":["three concrete actions for this week"],"risks":["what could go wrong and how to guard against it"]}. 2–4 products. Dates must be after ${today}.` }];
  } else {
    const ctx = clean(b.context, 1500);
    messages = (Array.isArray(b.messages) ? b.messages : []).slice(-12).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: clean(m.content, 6000) })).filter((m) => m.content);
    while (messages.length && messages[0].role !== "user") messages.shift(); if (!messages.length) return res.status(400).json({ error: "messages required" });
    if (ctx) system += " Context about this coach and the event in focus: " + ctx;
  }
  try {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 55000);
    const body = { model: process.env.PREP_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: max, system, messages };
    if (web) body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: b.mode === "brief" ? 5 : 3 }];
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ctl.signal, headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify(body) });
    clearTimeout(tm); const j = await r.json(); if (!r.ok) return res.status(502).json({ error: "upstream", detail: j.error && j.error.type });
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("").trim();
    const seen = new Set(), sources = [];
    (j.content || []).forEach((c) => { (c.citations || []).forEach((ci) => { if (ci.url && !seen.has(ci.url)) { seen.add(ci.url); sources.push({ title: clean(ci.title, 120), url: ci.url }); } }); });
    (j.content || []).filter((c) => c.type === "web_search_tool_result" && Array.isArray(c.content)).forEach((c) => c.content.forEach((s) => { if (s.url && !seen.has(s.url) && sources.length < 8) { seen.add(s.url); sources.push({ title: clean(s.title, 120), url: s.url }); } }));
    res.setHeader("Cache-Control", "no-store");
    if (b.mode === "council") { const m = text.match(/\{[\s\S]*\}/); let out = null; try { out = m ? JSON.parse(m[0]) : null; } catch (e) { try { out = JSON.parse(m[0].replace(/\n/g, " ")); } catch (e2) {} }
      if (!out) return res.status(200).json({ text, sources });
      const D = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || "")) && x > today ? x : "";
      return res.status(200).json({ sources, voices: (out.voices || []).slice(0, 8).map((v) => ({ seat: clean(v.seat, 80), says: clean(v.says, 900) })),
        products: (out.products || []).slice(0, 4).map((p) => ({ name: clean(p.name, 120), what: clean(p.what, 300), format: clean(p.format, 160), buyer: clean(p.buyer, 200), why_now: clean(p.why_now, 300), pitch: clean(p.pitch, 700), channels: clean(p.channels, 300), price_hint: clean(p.price_hint, 300), pitch_by: D(p.pitch_by), pilot_by: D(p.pilot_by), launch_by: D(p.launch_by) })),
        first_moves: (out.first_moves || []).slice(0, 5).map((x) => clean(x, 300)), risks: (out.risks || []).slice(0, 4).map((x) => clean(x, 300)) }); }
    if (b.mode === "brief") { const m = text.match(/\[[\s\S]*\]/); let items = []; try { items = m ? JSON.parse(m[0]) : []; } catch (e) { try { items = JSON.parse(m[0].replace(/\n/g, " ")); } catch (e2) {} }
      items = (Array.isArray(items) ? items : []).filter((x) => x && x.title).slice(0, 8).map((x) => ({ title: clean(x.title, 160), date: /^\d{4}-\d{2}-\d{2}$/.test(String(x.date || "")) ? x.date : "", what: clean(x.what, 300), so: clean(x.so, 300), url: /^https?:\/\//.test(x.url || "") ? clean(x.url, 400) : "" }));
      return res.status(200).json({ items, sources }); }
    res.status(200).json({ text, sources });
  } catch (e) { res.status(502).json({ error: e.name === "AbortError" ? "timeout" : "upstream" }); }
};
