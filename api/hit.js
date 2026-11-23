// Footfall: one anonymous row per page load, page view, gate entry or subscription.
// Stores only city/region/country (from Vercel's edge geo headers), page, traffic source, profession, edition, device type and language.
// No IP address, no cookies, no identifiers; visitors with Do Not Track are skipped on the client. Needs SUPABASE_URL + SUPABASE_SERVICE_KEY.
const KINDS = ["visit", "view", "gate", "sub", "install"];
const dec = (s) => { try { return decodeURIComponent(String(s || "")).slice(0, 80); } catch (e) { return String(s || "").slice(0, 80); } };
function source(ref, utm) {
  if (utm) return String(utm).toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30) || "campaign";
  if (!ref) return "direct";
  let h = ""; try { h = new URL(ref).hostname.replace(/^www\./, ""); } catch (e) { return "other"; }
  if (/deocoach\./.test(h)) return "internal";
  const map = [[/whatsapp|wa\.me/, "whatsapp"], [/linkedin|lnkd\.in/, "linkedin"], [/facebook|fb\.com|fb\.me/, "facebook"], [/instagram/, "instagram"], [/(^|\.)t\.co$|twitter|x\.com/, "x"], [/google\./, "google"], [/bing\./, "bing"], [/youtube|youtu\.be/, "youtube"], [/tiktok/, "tiktok"], [/mail\.|outlook|gmail/, "email"], [/zoom\./, "zoom"], [/claude\.ai/, "claude"], [/chatgpt|openai/, "chatgpt"]];
  for (const [re, n] of map) if (re.test(h)) return n;
  return h.slice(0, 40);
}
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; if (!url || !key) return res.status(204).end();
  const ua = String(req.headers["user-agent"] || "");
  if (/bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp\//i.test(ua)) return res.status(204).end();
  let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const k = KINDS.includes(b.k) ? b.k : "view";
  const row = {
    kind: k,
    city: dec(req.headers["x-vercel-ip-city"]) || null,
    region: dec(req.headers["x-vercel-ip-country-region"]) || null,
    country: String(req.headers["x-vercel-ip-country"] || "").slice(0, 2) || null,
    path: String(b.p || "home").replace(/[^a-z0-9_-]/gi, "").slice(0, 30) || "home",
    src: source(b.r, b.u),
    pro: /^[a-z]{3,12}$/.test(b.pro || "") ? b.pro : null,
    ed: b.ed === "africa" || b.ed === "global" ? b.ed : null,
    dev: /Mobi|Android|iPhone/i.test(ua) ? (/iPad|Tablet/i.test(ua) ? "tablet" : "mobile") : "desktop",
    lang: String(b.l || "").slice(0, 8) || null,
  };
  try { await fetch(`${url}/rest/v1/deocoach_hits`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) }); } catch (e) {}
  res.status(204).end();
};
