// Live AI event scout: Claude with web search finds upcoming events in a city for a coaching niche, with source links.
// Needs ANTHROPIC_API_KEY (web search must be allowed for the key's organisation in the Claude Console).
// Optional: EVENTS_MODEL (default ANTHROPIC_MODEL or claude-sonnet-5-5), EVENTS_HOURLY_LIMIT (default 8 per visitor).
const hits = new Map();
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f]/g, " ").slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return res.status(503).json({ error: "AI not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const limit = +(process.env.EVENTS_HOURLY_LIMIT || 8);
  const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= limit) return res.status(429).json({ error: "rate_limited" }); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const city = clean(b.city, 60), country = clean(b.country, 60), niche = clean(b.niche, 120); const months = Math.max(1, Math.min(12, +b.months || 6));
  if (!city || !niche) return res.status(400).json({ error: "city and niche required" });
  const today = new Date().toISOString().slice(0, 10);
  const prompt = `Today is ${today}. Use web search to find real, upcoming events (conferences, summits, expos, festivals, professional or industry gatherings, major church or community conventions) taking place in or near ${city}, ${country} between today and ${months} months from now, where a coach serving "${niche}" could meet clients, buyers or partners.
Rules: include only events you found on a web page that states the dates; never invent events, dates or venues; prefer the organiser's own page as the url; skip events that have already ended; at most 8 events.
Reply with ONLY a JSON array, no prose, each item: {"name":"","start":"YYYY-MM-DD","end":"YYYY-MM-DD","venue":"","url":"","audience":"who attends, in a few words","why":"one sentence on why it fits this niche","confidence":"confirmed|announced"}. If you find nothing reliable, reply [].`;
  try {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 55000);
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ctl.signal,
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.EVENTS_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 2500,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
        messages: [{ role: "user", content: prompt }] }) });
    clearTimeout(tm);
    const j = await r.json(); if (!r.ok) return res.status(502).json({ error: "upstream", detail: j.error && (j.error.type + ": " + String(j.error.message || "").slice(0, 160)) });
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    const m = text.match(/\[[\s\S]*\]/); let events = [];
    try { events = m ? JSON.parse(m[0]) : []; } catch (e) { events = []; }
    events = (Array.isArray(events) ? events : []).filter((e) => e && e.name && /^\d{4}-\d{2}(-\d{2})?$/.test(String(e.start || "")) && String(e.end || e.start) >= today.slice(0, String(e.end || e.start).length))
      .slice(0, 8).map((e) => ({ name: clean(e.name, 140), start: clean(e.start, 10), end: clean(e.end || e.start, 10), venue: clean(e.venue, 140), url: /^https?:\/\//.test(e.url || "") ? clean(e.url, 400) : "", audience: clean(e.audience, 160), why: clean(e.why, 240), confidence: e.confidence === "confirmed" ? "confirmed" : "announced" }));
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ events, at: today });
  } catch (e) { res.status(502).json({ error: e.name === "AbortError" ? "timeout" : "upstream" }); }
};
