// Live AI for the mentor, councils, gap reading, decoder and route explainer.
// Needs ANTHROPIC_API_KEY. Optional: ANTHROPIC_MODEL (default claude-sonnet-5-5), AI_HOURLY_LIMIT (default 40 per visitor).
const hits = new Map();
const GUARD = "You are the AI supervisor and futures analyst inside DeoCoach (Edition for African Coaches), created by Coach David Adeoye Abodunrin. Give practical, honest, Africa-aware guidance to coaches. Never invent statistics, fees or market sizes: quote a figure only if you are confident of it and name its source, otherwise describe trends qualitatively and label forecasts as scenarios. Coaching is not therapy: if a situation suggests risk of harm or a mental-health condition, advise referral to a qualified professional. Do not claim to speak for any coaching association or federation.";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return res.status(503).json({ error: "AI not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now(); const limit = +(process.env.AI_HOURLY_LIMIT || 40);
  const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= limit) return res.status(429).json({ error: "rate_limited" }); h.push(now); hits.set(ip, h);
  let { messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: "messages required" });
  messages = messages.slice(-16).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 14000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 1600, system: GUARD, messages }) });
    const j = await r.json(); if (!r.ok) return res.status(502).json({ error: "upstream", detail: j.error && j.error.type });
    res.status(200).json({ text: (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n") });
  } catch (e) { res.status(502).json({ error: "upstream" }); }
};
