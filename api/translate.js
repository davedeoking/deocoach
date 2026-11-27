// AI translation of interface text into the pan-African languages. Needs ANTHROPIC_API_KEY. Results are cached on each visitor's device.
const crypto = require("crypto");
const hits = new Map();
// Shared cache (Supabase table deocoach_translations): each string is translated once for every visitor. Optional: skipped if the table or keys are missing.
const hsh = (lang, s) => crypto.createHash("sha1").update(lang + "\u0000" + s).digest("hex");
function sb() { const { SUPABASE_URL: u, SUPABASE_SERVICE_KEY: k } = process.env; if (!u || !k) return null;
  return (path, o = {}) => fetch(`${u}/rest/v1/${path}`, { ...o, headers: { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json", ...(o.headers || {}) } }); }
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return res.status(503).json({ error: "translation not configured" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon"; const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= +(process.env.TRANSLATE_HOURLY_LIMIT || 120)) return res.status(429).json({ error: "rate_limited" }); h.push(now); hits.set(ip, h);
  const b = req.body || {}; const lang = String(b.name || b.lang || "").slice(0, 40); const strings = (Array.isArray(b.strings) ? b.strings : []).slice(0, 90).map((s) => String(s).slice(0, 500));
  if (!lang || !strings.length) return res.status(400).json({ error: "lang and strings required" });
  const code = String(b.lang || lang).slice(0, 12); const D = sb(); const known = {};
  if (D) { try { const hs = strings.map((x) => hsh(code, x)); const r = await D(`deocoach_translations?select=h,out&h=in.(${hs.join(",")})`); if (r.ok) (await r.json()).forEach((x) => { known[x.h] = x.out; }); } catch (e) { /* no cache */ } }
  const missing = strings.filter((x) => !known[hsh(code, x)]);
  if (!missing.length) return res.status(200).json({ out: strings.map((x) => known[hsh(code, x)]), cached: true });
  const full = strings; const strings2 = missing;
  const prompt = `Translate each item of this JSON array of website interface text from English into ${lang}, for coaches across Africa. Keep the same order and number of items. Keep brand and product names unchanged (DeoCoach, DeoMentor, CoachCoCreation, David Adeoye Abodunrin), keep numbers, currency symbols, emoji and punctuation marks like · → ✦. Use natural, respectful, plain wording a professional in that language community would use. Return ONLY the JSON array of strings.\n\n${JSON.stringify(strings2)}`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.TRANSLATE_MODEL || process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 8000, messages: [{ role: "user", content: prompt }] }) });
    const j = await r.json(); if (!r.ok) return res.status(502).json({ error: "upstream" });
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join(""); const m = text.match(/\[[\s\S]*\]/);
    const out = m ? JSON.parse(m[0]) : []; if (!Array.isArray(out) || out.length !== strings2.length) return res.status(502).json({ error: "bad_shape" });
    strings2.forEach((x, i) => { known[hsh(code, x)] = String(out[i]); });
    if (D) { try { await D("deocoach_translations?on_conflict=h", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(strings2.map((x, i) => ({ h: hsh(code, x), lang: code, src: x, out: String(out[i]) }))) }); } catch (e) { /* cache is optional */ } }
    res.status(200).json({ out: full.map((x) => known[hsh(code, x)] || x) });
  } catch (e) { res.status(502).json({ error: "upstream" }); }
};
