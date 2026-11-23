// Footfall: one anonymous row per page load, page view, engagement, exit, gate entry or subscription.
// Stores city/region/country (Vercel edge geo headers), page, traffic source, profession, edition, device, browser, system, language,
// time zone, a screen-size bucket, time on site and scroll depth, and a bot label when the visitor is a program.
// No IP address, no cookies, no stored identifiers: "vid" is random per page load and held only in the visitor's memory.
// Visitors with Do Not Track are skipped on the client. Needs SUPABASE_URL + SUPABASE_SERVICE_KEY.
const KINDS = ["visit", "view", "gate", "sub", "install", "eng", "end"];
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
// Named programs announce themselves in the user-agent.
const BOTS = [[/googlebot|google-inspectiontool|googleother|adsbot-google/i, "Googlebot"], [/bingbot|bingpreview/i, "Bingbot"], [/linkedinbot/i, "LinkedIn preview"], [/facebookexternalhit|facebookcatalog|meta-externalagent/i, "Facebook/WhatsApp preview"], [/whatsapp\//i, "WhatsApp preview"], [/twitterbot/i, "X preview"], [/slackbot/i, "Slack preview"], [/telegrambot/i, "Telegram preview"], [/discordbot/i, "Discord preview"], [/applebot/i, "Applebot"], [/yandex/i, "Yandex"], [/baiduspider/i, "Baidu"], [/duckduckbot/i, "DuckDuckGo"], [/gptbot|chatgpt-user|oai-searchbot/i, "OpenAI"], [/claudebot|claude-user|anthropic/i, "Anthropic"], [/perplexity/i, "Perplexity"], [/ahrefs/i, "Ahrefs SEO"], [/semrush/i, "Semrush SEO"], [/mj12bot/i, "Majestic SEO"], [/dotbot|rogerbot/i, "Moz SEO"], [/petalbot/i, "PetalBot"], [/bytespider/i, "ByteDance"], [/ccbot/i, "Common Crawl"], [/uptimerobot|pingdom|statuscake|better ?uptime|site24x7/i, "Uptime monitor"], [/lighthouse|pagespeed|gtmetrix/i, "Speed test"], [/vercel/i, "Vercel check"], [/headlesschrome|phantomjs|puppeteer|playwright|selenium/i, "Headless browser"], [/python|curl|wget|go-http|java\/|okhttp|axios|node-fetch|scrapy/i, "Script"], [/bot|crawl|spider|slurp|preview|scan/i, "Other bot"]];
// Towns that are data-centre hubs rather than places where people browse from.
const DC = /^(ashburn|boardman|secaucus|council bluffs|the dalles|prineville|quincy|forest city|lenoir|moncks corner|pryor|altoona|eemshaven|middenmeer|hamina|st\.? ghislain|saint-ghislain|clonee|vint hill)$/i;
function browser(ua) { return /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /samsungbrowser/i.test(ua) ? "Samsung Internet" : /crios|chrome\//i.test(ua) ? "Chrome" : /fxios|firefox/i.test(ua) ? "Firefox" : /safari/i.test(ua) ? "Safari" : "Other"; }
function os(ua) { return /iphone|ipad|ipod/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" : /windows/i.test(ua) ? "Windows" : /mac os x|macintosh/i.test(ua) ? "macOS" : /cros/i.test(ua) ? "ChromeOS" : /linux/i.test(ua) ? "Linux" : "Other"; }
function botLabel(ua, b, city) {
  for (const [re, n] of BOTS) if (re.test(ua)) return n;
  if (!ua) return "No user-agent";
  if (b.wd) return "Automated browser";
  if (b.k === "visit") {
    if (city && DC.test(city)) return `Cloud server (${city})`;
    if (/^(utc|etc\/utc|etc\/gmt|gmt|universal)$/i.test(b.tz || "")) return "Cloud server (UTC clock)";
    if (b.nl === 0 || b.scr === "none") return "Headless browser";
    if (/linux/i.test(ua) && !/android/i.test(ua) && b.tz && /^America\//.test(b.tz) && b.sw === 800) return "Headless browser";
  }
  return null;
}
const int = (x, max) => { const n = parseInt(x, 10); return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : null; };
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; if (!url || !key) return res.status(204).end();
  const ua = String(req.headers["user-agent"] || "");
  let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const k = KINDS.includes(b.k) ? b.k : "view";
  const city = dec(req.headers["x-vercel-ip-city"]) || null;
  const base = {
    kind: k, city,
    region: dec(req.headers["x-vercel-ip-country-region"]) || null,
    country: String(req.headers["x-vercel-ip-country"] || "").slice(0, 2) || null,
    path: String(b.p || "home").replace(/[^a-z0-9_-]/gi, "").slice(0, 30) || "home",
    src: source(b.r, b.u),
    pro: /^[a-z]{3,12}$/.test(b.pro || "") ? b.pro : null,
    ed: b.ed === "africa" || b.ed === "global" ? b.ed : null,
    dev: /Mobi|Android|iPhone/i.test(ua) ? (/iPad|Tablet/i.test(ua) ? "tablet" : "mobile") : "desktop",
    lang: String(b.l || "").slice(0, 8) || null,
  };
  const row = Object.assign({}, base, {
    vid: /^[a-z0-9]{6,12}$/.test(b.v || "") ? b.v : null,
    bot: botLabel(ua, b, city),
    browser: browser(ua), os: os(ua),
    tz: String(b.tz || "").replace(/[^A-Za-z0-9_/+-]/g, "").slice(0, 40) || null,
    scr: ["phone", "tablet", "wide", "none"].includes(b.scr) ? b.scr : null,
    secs: int(b.secs, 86400), depth: int(b.dep, 100), pages: int(b.pg, 999), eng: b.k === "eng" || b.e ? true : null,
  });
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" };
  try {
    const r = await fetch(`${url}/rest/v1/deocoach_hits`, { method: "POST", headers: H, body: JSON.stringify(row) });
    if (!r.ok && (k === "visit" || k === "view" || k === "gate" || k === "sub" || k === "install") && !row.bot) await fetch(`${url}/rest/v1/deocoach_hits`, { method: "POST", headers: H, body: JSON.stringify(base) });
  } catch (e) {}
  res.status(204).end();
};
