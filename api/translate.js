// AI translation of interface text into the pan-African languages. Needs ANTHROPIC_API_KEY. Results are cached on each visitor's device.
const hits = new Map();
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return res.status(503).json({ error: "translation not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= +(process.env.TRANSLATE_HOURLY_LIMIT || 120)) return res.status(429).json({ error: "rate_limited" }); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const lang = String(b.name || b.lang || "").slice(0, 40); const strings = (Array.isArray(b.strings) ? b.strings : []).slice(0, 90).map((s) => String(s).slice(0, 500));
  if (!lang || !strings.length) return res.status(400).json({ error: "lang and strings required" });
  const prompt = `Translate each item of this JSON array of website interface text from English into ${lang}, for coaches across Africa. Keep the same order and number of items. Keep brand and product names unchanged (DeoCoach, DeoMentor, CoachCoCreation, David Adeoye Abodunrin), keep numbers, currency symbols, emoji and punctuation marks like · → ✦. Use natural, respectful, plain wording a professional in that language community would use. Return ONLY the JSON array of strings.\n\n${JSON.stringify(strings)}`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.TRANSLATE_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 8000, messages: [{ role: "user", content: prompt }] }) });
    const j = await r.json(); if (!r.ok) return res.status(502).json({ error: "upstream" });
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join(""); const m = text.match(/\[[\s\S]*\]/);
    const out = m ? JSON.parse(m[0]) : []; if (!Array.isArray(out) || out.length !== strings.length) return res.status(502).json({ error: "bad_shape" });
    res.status(200).json({ out: out.map((x) => String(x)) });
  } catch (e) { res.status(502).json({ error: "upstream" }); }
};
