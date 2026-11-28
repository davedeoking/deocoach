// DeoRetreat registrations, served from DeoCoach (same DeoSuites database and Resend sender), so DeoRetreat needs no keys of its own.
// Called cross-origin from deoretreat-app.vercel.app. Admin key: RETREAT_ADMIN_KEY, else the DeoCoach CRON_SECRET.
//  POST {event, name, email, phone, country, nationality, church, from, flights, passport, room, roommate, party, care, hope, heard, consent:true, provisional:true}
//       → saved in Supabase (deoretreat_registrations), confirmation to the pilgrim, notification to the host. Returns {ok, ref}.
//  GET ?event=… with header x-admin-key (RETREAT_ADMIN_KEY) → {rows:[…]} for the host's list at #/registrations.
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, RETREAT_FROM (e.g. "DeoRetreat <coachdeo@deocoach.com>"), RETREAT_NOTIFY (host inbox), RETREAT_ADMIN_KEY.
const clip = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const EVENTS = { "divine-encounter": { title: "A Summons to Divine Encounter", when: "4–11 April 2027 (Israel)", pre: "DR27" }, "family-covenant": { title: "Family Prayer Covenant", when: "Israel, April 2027", pre: "FPC27" } };
const ROOMS = { "share-named": "Sharing (named)", "share-pair": "Happy to be paired", single: "Single room" };
const hits = new Map();
async function mail(e, to, subject, html, replyTo) {
  if (!e.RESEND_API_KEY || !(e.RETREAT_FROM || e.DIGEST_FROM) || !to) return false;
  try { const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: e.RETREAT_FROM || e.DIGEST_FROM, reply_to: replyTo || e.RETREAT_REPLY_TO || "deoking@gmail.com", to, subject, html }) }); return r.ok; } catch (x) { return false; }
}
const ALLOW = /^https:\/\/(deoretreat-app\.vercel\.app|deoretreat[a-z0-9-]*\.vercel\.app|www\.deoretreat\.[a-z]+)$/;
module.exports = async (req, res) => {
  const o = String(req.headers.origin || ""); if (ALLOW.test(o)) { res.setHeader("Access-Control-Allow-Origin", o); res.setHeader("Vary", "Origin"); res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "content-type, x-admin-key"); res.setHeader("Access-Control-Max-Age", "86400"); }
  if (req.method === "OPTIONS") return res.status(204).end();
  const e = process.env, url = e.SUPABASE_URL, key = e.SUPABASE_SERVICE_KEY; res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  try {
    if (req.method === "GET") {
      const ak = e.RETREAT_ADMIN_KEY || e.CRON_SECRET; if (!ak || req.headers["x-admin-key"] !== ak) return res.status(401).json({ error: "Wrong key" });
      const ev = EVENTS[req.query && req.query.event] ? req.query.event : "divine-encounter";
      const r = await fetch(`${url}/rest/v1/deoretreat_registrations?select=*&event=eq.${ev}&order=at.desc&limit=1000`, { headers: H });
      return res.json({ rows: r.ok ? await r.json() : [] });
    }
    if (req.method !== "POST") return res.status(405).end();
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "x"; const now = Date.now();
    const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= 20) return res.status(429).json({ error: "Too many attempts. Please try again later." }); h.push(now); hits.set(ip, h);
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    if (b.website) return res.json({ ok: true, ref: "DR-OK" }); // bot trap
    const ev = EVENTS[b.event] ? b.event : null; const email = clip(b.email, 200).toLowerCase(); const name = clip(b.name, 120);
    if (!ev || !name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/i.test(email) || b.consent !== true || b.provisional !== true) return res.status(400).json({ error: "Please give your name, a valid email and both agreements." });
    // one registration per email per event: a repeat updates nothing and returns the same reference
    const dup = await fetch(`${url}/rest/v1/deoretreat_registrations?select=ref&event=eq.${ev}&email=eq.${encodeURIComponent(email)}`, { headers: H });
    if (dup.ok) { const d = await dup.json(); if (d.length) return res.json({ ok: true, ref: d[0].ref, already: true }); }
    const ref = EVENTS[ev].pre + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const row = { ref, event: ev, status: "new", name, email, phone: clip(b.phone, 40), country: clip(b.country, 80), nationality: clip(b.nationality, 80), church: clip(b.church, 160),
      travel_from: clip(b.from, 60), flights: clip(b.flights, 20), passport: clip(b.passport, 20), room: ROOMS[b.room] || clip(b.room, 40), roommate: clip(b.roommate, 120), party: clip(b.party, 300),
      care: clip(b.care, 1200), hope: clip(b.hope, 1500), heard: clip(b.heard, 60) };
    const r = await fetch(`${url}/rest/v1/deoretreat_registrations`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(row) });
    if (!r.ok) return res.status(502).json({ error: "Couldn't save that just now. Please try again." });
    const E = EVENTS[ev], first = esc(name.split(" ")[0]); const fam = ev === "family-covenant";
    await mail(e, email, fam ? `Welcome to the Family Prayer Covenant · ${ref}` : `You're registered: ${E.title} · ${E.when}`, fam ? `<div style="font-family:Georgia,serif;max-width:600px;color:#203A30;line-height:1.6"><p>Dear ${first},</p><p>Thank you for joining the <b>Family Prayer Covenant</b>. Your family will be carried by name to Israel in April 2027, written on the covenant scroll and prayed for at Mount Carmel, the Sea of Galilee, the Jordan, Gethsemane and the Western Wall. Your reference is <b>${ref}</b>.</p><p>We will send you the payment details for the US$500 covenant gift, and your 40-day home prayer guide follows, so your family can pray in step with the pilgrims.</p><p>This is a covenant of prayer and partnership; no outcome is promised in return for a gift.</p><p>With every blessing,<br><b>Apostle David Adeoye Abodunrin</b><br>DeoRetreat · <a href=\"https://deoretreat-app.vercel.app/#/family\">The Family Prayer Covenant</a></p></div>` : `<div style="font-family:Georgia,serif;max-width:600px;color:#203A30;line-height:1.6">
      <p>Dear ${first},</p><p>Thank you for registering for <b>${esc(E.title)}</b>, our pilgrimage to Israel in April 2027. Your reference is <b>${ref}</b>.</p>
      <p>We will be in touch personally to confirm your place and send the payment details and schedule. Itinerary, hotels and prices are provisional until confirmed, and registering does not yet guarantee a place.</p>
      <p><b>Please check now</b> that your passport will be valid until at least October 2027, and keep it to hand.</p>
      <p>Until we travel, write down what you are trusting God for on this journey, and pray over it daily.</p>
      <p>With every blessing,<br><b>Coach David Adeoye Abodunrin</b><br>DeoRetreat · <a href="https://deoretreat-app.vercel.app/#/journey/divine-encounter">The journey, day by day</a></p></div>`);
    await mail(e, e.RETREAT_NOTIFY || "deoking@gmail.com", fam ? `FAMILY PRAYER COVENANT: ${name} (${ref})` : `ISRAEL 2027 REGISTRATION: ${name} (${ref})`, `<div style="font-family:Arial,sans-serif;line-height:1.5">
      <p><b>${esc(name)}</b> · <a href="mailto:${esc(email)}">${esc(email)}</a> · ${esc(row.phone)}</p>
      <p>${esc(row.country)} · nationality ${esc(row.nationality)}${row.church ? " · " + esc(row.church) : ""}</p>
      <p><b>From:</b> ${esc(row.travel_from)} · <b>Flights:</b> ${esc(row.flights)} · <b>Passport OK to Oct 2027:</b> ${esc(row.passport)}</p>
      <p><b>Room:</b> ${esc(row.room)}${row.roommate ? " with " + esc(row.roommate) : ""}${row.party ? " · <b>Party:</b> " + esc(row.party) : ""}</p>
      ${row.care ? `<p><b>Care:</b> ${esc(row.care)}</p>` : ""}${row.hope ? `<p><b>Trusting God for:</b> ${esc(row.hope)}</p>` : ""}${row.heard ? `<p><b>Heard via:</b> ${esc(row.heard)}</p>` : ""}
      <p>All registrations: <a href="https://deoretreat-app.vercel.app/#/registrations">deoretreat-app.vercel.app/#/registrations</a></p></div>`, email);
    return res.json({ ok: true, ref });
  } catch (x) { return res.status(502).json({ error: "Couldn't save that just now. Please try again." }); }
};
