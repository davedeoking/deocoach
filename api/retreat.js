// DeoRetreat · Kairos Israel Formation Journey 2027 server (runs on DeoCoach: same DeoSuites database and Resend sender).
// Called cross-origin from the DeoRetreat site. Tables: deoretreat_registrations, deoretreat_payments, deoretreat_letters.
//  POST                         → apply (pilgrims, event divine-encounter) or join (event family-covenant)
//  GET  ?a=me&t=TOKEN           → the pilgrim's portal data      POST ?a=me&t=TOKEN → save readiness / progress / assessments
//  GET  ?a=unsub&t=TOKEN        → stop the letters (one click from any letter)
//  Host (header x-admin-key = RETREAT_ADMIN_KEY, else CRON_SECRET):
//  GET  ?a=list&event=…  (also the old GET ?event=…)   POST ?a=accept {ref, plan}   POST ?a=pay {ref, amount, paid_on, method, txref, note}
//  POST ?a=status {ref, status, notes}   GET ?a=letters   POST ?a=approve {key, approved} | {all:true}
//  GET  ?a=cron (Authorization: Bearer CRON_SECRET; daily 07:00 UTC) → sends today's approved letters
const crypto = require("crypto");
const { LETTERS, subjectOf, render } = require("../lib/retreat_letters");
const SITE = "https://www.deoretreat.com";
const API = "https://www.deocoach.com/api/retreat";
const FEE = 2500, FINAL = "2027-02-15";
// Experience tiers: only the Heritage Journey (US$2,500) is priced. Covenant, Founders Circle and the SAP Immersion
// are "register your interest" for now; set priced:true and a price when David confirms them.
const TIERS = { heritage: { name: "Heritage Journey", price: 2500, priced: true }, covenant: { name: "Covenant Journey", price: 0, priced: false }, founders: { name: "Founders Circle", price: 0, priced: false, cap: 12 } };
const SAP_ADD = 0, SAP_PRICED = false;
const tierOf = (row) => TIERS[(row.data && row.data.tier)] ? row.data.tier : "heritage";
const sapOf = (row) => !!(row.data && (row.data.sap === true || row.data.sap === "yes"));
const feeOf = (row) => (TIERS[tierOf(row)].priced ? TIERS[tierOf(row)].price : TIERS.heritage.price) + (sapOf(row) && SAP_PRICED ? SAP_ADD : 0);
const offerOf = (row) => { const t = TIERS[tierOf(row)], got = t.priced ? t.name : "Heritage Journey", wish = [];
  if (!t.priced) wish.push(t.name); if (sapOf(row)) wish.push("School of Apostles & Prophets Immersion");
  return got + (sapOf(row) && SAP_PRICED ? " + School of Apostles & Prophets Immersion" : "") + (wish.length ? " (interest registered: " + wish.join(", ") + ")" : ""); };
const EVENTS = { "divine-encounter": { title: "A Summons to Divine Encounter", when: "4–11 April 2027 (Israel)", pre: "DR27" }, "family-covenant": { title: "Family Prayer Covenant", when: "Israel, April 2027", pre: "FPC27" } };
const ROOMS = { "share-named": "Sharing (named)", "share-pair": "Happy to be paired", single: "Single room" };
const PLANS = { full: "Pay in full", monthly: "Monthly to 15 February", weekly: "Weekly to 15 February" };
const ALLOW = /^https:\/\/((www\.)?deoretreat\.com|deoretreat-app\.vercel\.app|deoretreat[a-z0-9-]*\.vercel\.app)$/;
const clip = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return ymd(d); };
const addMonths = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCMonth(d.getUTCMonth() + n); return ymd(d); };
const usd = (n) => "US$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
const hits = new Map();

// ---------- the payment plan: equal instalments from 7 days after acceptance to 15 February ----------
function planOf(row, pays) {
  const FEE = feeOf(row);
  const paid = (pays || []).reduce((s, p) => s + Number(p.amount || 0), 0);
  if (!row.accepted_at) return { kind: row.plan || (row.data && row.data.payment) || "monthly", instalments: [], paid, balance: FEE - paid, due: 0, overdue: 0, next: null, fee: FEE };
  const kind = PLANS[row.plan] ? row.plan : "monthly"; const first = addDays(ymd(row.accepted_at), 7); const dates = [];
  if (kind === "full" || first >= FINAL) dates.push(first > FINAL ? first : first);
  else { let d = first; while (d < FINAL) { dates.push(d); d = kind === "weekly" ? addDays(d, 7) : addMonths(d, 1); } const gap = (Date.parse(FINAL) - Date.parse(dates[dates.length - 1])) / 864e5; if (dates.length > 1 && gap < (kind === "weekly" ? 4 : 18)) dates[dates.length - 1] = FINAL; else dates.push(FINAL); }
  const n = dates.length, base = Math.floor(FEE / n);
  const instalments = dates.map((due, i) => ({ due, amount: i === n - 1 ? FEE - base * (n - 1) : base }));
  const today = ymd(Date.now()); let cum = 0, due = 0, oldest = null;
  instalments.forEach((x) => { if (x.due <= today) { due += x.amount; } });
  instalments.forEach((x) => { cum += x.amount; if (x.due <= today && cum > paid && !oldest) oldest = x.due; });
  const overdue = Math.max(0, due - paid); let left = paid, next = null;
  for (const x of instalments) { if (left >= x.amount) { left -= x.amount; continue; } next = { due: x.due, amount: x.amount - left }; break; }
  return { kind, instalments, paid, balance: Math.max(0, FEE - paid), due, overdue, oldestOverdue: overdue ? oldest : null, next, fee: FEE };
}
// ---------- readiness, engagement and the green / amber / red flag ----------
function metrics(row, plan) {
  const r = row.readiness || {}, pr = row.progress || {}, a = row.assessments || {};
  const items = { passport: r.passport === "valid", entry: !!(r.eta || r.visa), insurance: !!r.insurance, flights: !!r.flights, payment: plan.paid >= plan.fee };
  const readiness = Math.round((Object.values(items).filter(Boolean).length / 5) * 100);
  const mods = [1, 2, 3, 4].filter((m) => pr["m" + m]).length, assessed = Object.keys(a).length;
  const engagement = Math.round(((mods / 4) * 0.6 + (Math.min(assessed, 4) / 4) * 0.4) * 100);
  const today = ymd(Date.now()); const seenDays = row.last_seen ? Math.round((Date.now() - new Date(row.last_seen)) / 864e5) : null;
  let flag = "green", why = [];
  if (!row.accepted_at) { flag = "amber"; why.push("awaiting acceptance"); }
  if (plan.overdue > 0) { const late = plan.oldestOverdue && addDays(plan.oldestOverdue, 14) < today; if (late) { flag = "red"; why.push("payment over 14 days late"); } else { if (flag === "green") flag = "amber"; why.push("payment due"); } }
  if (today >= "2027-03-05" && !items.passport) { flag = "red"; why.push("passport not confirmed"); }
  if (today >= "2027-03-21" && !(items.entry && items.insurance)) { flag = "red"; why.push("entry or insurance missing"); }
  if (row.accepted_at && (seenDays == null || seenDays > 21)) { if (flag === "green") flag = "amber"; why.push("not seen in 3 weeks"); }
  return { items, readiness, engagement, modules: mods, assessed, seenDays, flag, why };
}
async function mail(e, to, subject, html, replyTo) {
  if (!e.RESEND_API_KEY || !(e.RETREAT_FROM || e.DIGEST_FROM) || !to) return false;
  try { const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: e.RETREAT_FROM || e.DIGEST_FROM, reply_to: replyTo || e.RETREAT_REPLY_TO || "deoking@gmail.com", to, subject, html }) }); return r.ok; } catch (x) { return false; }
}
const wrap = (b) => `<div style="font-family:Georgia,serif;max-width:600px;color:#203A30;line-height:1.6">${b}<p>With every blessing,<br><b>Apostle David Adeoye Abodunrin</b><br>Kairos Israel Formation Journey 2027 · <a href="${SITE}/#/kairos">DeoRetreat</a></p></div>`;
const portalOf = (t) => `${SITE}/#/kairos/pilgrim/${t}`;
const planTable = (p) => `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${p.instalments.map((x) => `<tr><td style="padding:4px 14px 4px 0">${new Date(x.due + "T12:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td><td style="padding:4px 0"><b>${usd(x.amount)}</b></td></tr>`).join("")}</table>`;
const SAFE = ["ref", "event", "status", "name", "email", "at", "accepted_at", "plan", "readiness", "progress", "assessments", "referred_by", "country", "travel_from", "room", "id"];

module.exports = async (req, res) => {
  const o = String(req.headers.origin || ""); if (ALLOW.test(o)) { res.setHeader("Access-Control-Allow-Origin", o); res.setHeader("Vary", "Origin"); res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "content-type, x-admin-key"); res.setHeader("Access-Control-Max-Age", "86400"); }
  if (req.method === "OPTIONS") return res.status(204).end();
  const e = process.env, url = e.SUPABASE_URL, key = e.SUPABASE_SERVICE_KEY; res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  const D = (path, o2 = {}) => fetch(`${url}/rest/v1/${path}`, { ...o2, headers: { ...H, ...(o2.headers || {}) } });
  const q = req.query || {}, a = q.a || (req.method === "GET" && q.event ? "list" : "");
  let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
  const admin = () => { const ak = e.RETREAT_ADMIN_KEY || e.CRON_SECRET; return ak && req.headers["x-admin-key"] === ak; };
  const one = async (filter) => { const r = await D(`deoretreat_registrations?select=*&${filter}&limit=1`); const j = r.ok ? await r.json() : []; return j[0] || null; };
  const paysOf = async (ref) => { const r = await D(`deoretreat_payments?select=*&ref=eq.${encodeURIComponent(ref)}&order=paid_on.asc`); return r.ok ? await r.json() : []; };
  const patch = (ref, body) => D(`deoretreat_registrations?ref=eq.${encodeURIComponent(ref)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(body) });
  try {
    // ---------------- public: tiers and places left ----------------
    if (a === "tiers") {
      const r = await D(`deoretreat_registrations?select=data,status&event=eq.divine-encounter`); const rows = r.ok ? await r.json() : [];
      const live = rows.filter((x) => !["withdrawn", "test"].includes(x.status)); const taken = (k) => live.filter((x) => x.data && x.data.tier === k).length;
      return res.json({ tiers: Object.keys(TIERS).map((k) => ({ key: k, name: TIERS[k].name, priced: TIERS[k].priced, price: TIERS[k].priced ? TIERS[k].price : null, cap: TIERS[k].cap || null, interest: taken(k), left: TIERS[k].cap ? Math.max(0, TIERS[k].cap - taken(k)) : null })), sap: { priced: SAP_PRICED, price: SAP_PRICED ? SAP_ADD : null, interest: live.filter((x) => x.data && (x.data.sap === true || x.data.sap === "yes")).length } });
    }
    // ---------------- public: re-send a pilgrim their portal link (always answers ok, so emails can't be probed) ----------------
    if (a === "resend" && req.method === "POST") {
      const email = clip(b.email, 160).toLowerCase();
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { const row = await one(`event=eq.divine-encounter&email=eq.${encodeURIComponent(email)}`);
        if (row && row.token) await mail(e, row.email, "Your pilgrim portal link", wrap(`<p>Dear ${esc(String(row.name).split(" ")[0])},</p><p>Here is your private pilgrim portal for A Summons to Divine Encounter (${esc(row.ref)}):</p><p><a href="${portalOf(row.token)}">Open my pilgrim portal</a></p><p>Keep this link private: it opens your own portal.</p>`)); }
      return res.json({ ok: true });
    }
    // ---------------- the pilgrim's own portal ----------------
    if (a === "me" || a === "unsub") {
      const t = clip(q.t, 64); if (t.length < 20) return res.status(404).json({ error: "Not found" });
      const row = await one(`token=eq.${encodeURIComponent(t)}`); if (!row) return res.status(404).json({ error: "Not found" });
      if (a === "unsub") { await patch(row.ref, { data: { ...(row.data || {}), c_letters: false } }); res.setHeader("content-type", "text/html"); return res.status(200).send("<p style='font-family:Georgia;padding:40px'>You will no longer receive the Friday and Sunday letters. Your portal stays open, and you can switch them back on there.</p>"); }
      if (req.method === "POST") {
        const up = { last_seen: new Date().toISOString() };
        const merge = (cur, inc, keys) => { const out = { ...(cur || {}) }; keys.forEach((k) => { if (inc && inc[k] !== undefined) out[k] = typeof inc[k] === "string" ? clip(inc[k], 4000) : inc[k]; }); return out; };
        if (b.readiness) up.readiness = merge(row.readiness, b.readiness, ["passport", "eta", "visa", "insurance", "flights", "flight_details", "packing"]);
        if (b.progress) up.progress = merge(row.progress, b.progress, ["m1", "m2", "m3", "m4", "journal", "consecration", "prayer_partner"]);
        if (b.assessments) up.assessments = merge(row.assessments, b.assessments, ["prayer", "disciplines", "calling", "gifts"]);
        if (b.letters !== undefined) up.data = { ...(row.data || {}), c_letters: !!b.letters };
        await patch(row.ref, up); return res.json({ ok: true });
      }
      await patch(row.ref, { last_seen: new Date().toISOString() });
      const pays = row.event === "divine-encounter" ? await paysOf(row.ref) : []; const plan = planOf(row, pays);
      const refs = await D(`deoretreat_registrations?select=ref&referred_by=eq.${encodeURIComponent(row.ref)}`); const referrals = refs.ok ? (await refs.json()).length : 0;
      const me = {}; SAFE.forEach((k) => { me[k] = row[k]; }); me.letters_on = !(row.data && row.data.c_letters === false); me.first = String(row.name || "").split(" ")[0]; me.tier = tierOf(row); me.sap = sapOf(row); me.offer = offerOf(row);
      const today = ymd(Date.now());
      const letters = LETTERS.filter((L) => L.date <= today).slice(-6).reverse().map((L) => ({ date: L.date, kind: L.kind, subject: subjectOf(L), html: render(L, { first: me.first, portal: portalOf(row.token), unsub: `${API}?a=unsub&t=${row.token}` }) }));
      return res.json({ me, plan, payments: pays.map((p) => ({ paid_on: p.paid_on, amount: p.amount, method: p.method })), metrics: metrics(row, plan), referrals, letters });
    }
    // ---------------- the daily letters run ----------------
    if (a === "cron") {
      if (!e.CRON_SECRET || req.headers.authorization !== `Bearer ${e.CRON_SECRET}`) return res.status(401).end();
      const today = ymd(Date.now()); const due = LETTERS.filter((L) => L.date === today); if (!due.length) return res.json({ ok: true, today, due: 0 });
      const ap = await (await D(`deoretreat_letters?select=*&key=in.(${due.map((L) => L.key).join(",")})`)).json(); const okKeys = new Set((ap || []).filter((x) => x.approved && !x.sent_at).map((x) => x.key));
      const people = await (await D("deoretreat_registrations?select=*&event=eq.divine-encounter&accepted_at=not.is.null")).json(); let sent = 0;
      for (const L of due.filter((x) => okKeys.has(x.key))) {
        let n = 0;
        for (const p of people || []) { if (p.data && p.data.c_letters === false) continue; if (["withdrawn", "test"].includes(p.status)) continue;
          const plan = planOf(p, await paysOf(p.ref)); const note = L.kind !== "integration" && plan.next ? `A gentle note: your next commitment step is ${usd(plan.next.amount)} by ${new Date(plan.next.due + "T12:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long" })}. Thank you for walking this journey with us.` : "";
          if (await mail(e, p.email, subjectOf(L), render(L, { first: String(p.name).split(" ")[0], balanceNote: note, portal: portalOf(p.token), unsub: `${API}?a=unsub&t=${p.token}` }))) n++; }
        await D(`deoretreat_letters?key=eq.${L.key}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ sent_at: new Date().toISOString(), sent_count: n }) }); sent += n;
      }
      return res.json({ ok: true, today, due: due.length, sent });
    }
    // ---------------- host actions ----------------
    if (["list", "accept", "pay", "status", "letters", "approve"].includes(a)) {
      if (!admin()) return res.status(401).json({ error: "Wrong key" });
      if (a === "list") {
        const ev = EVENTS[q.event] ? q.event : "divine-encounter";
        const rows = await (await D(`deoretreat_registrations?select=*&event=eq.${ev}&order=at.desc&limit=1000`)).json();
        const pays = await (await D("deoretreat_payments?select=*&order=paid_on.asc&limit=5000")).json(); const by = {}; (pays || []).forEach((p) => { (by[p.ref] = by[p.ref] || []).push(p); });
        const refCount = {}; (rows || []).forEach((r) => { if (r.referred_by) refCount[r.referred_by] = (refCount[r.referred_by] || 0) + 1; });
        return res.json({ rows: (rows || []).map((r) => { const plan = planOf(r, by[r.ref]); const { token, ...rest } = r; return { ...rest, plan_detail: plan, payments: by[r.ref] || [], metrics: ev === "divine-encounter" ? metrics(r, plan) : null, referrals: refCount[r.ref] || 0 }; }) });
      }
      if (a === "letters") {
        const ap = await (await D("deoretreat_letters?select=*")).json(); const m = {}; (ap || []).forEach((x) => { m[x.key] = x; });
        return res.json({ letters: LETTERS.map((L) => ({ key: L.key, date: L.date, kind: L.kind, subject: subjectOf(L), approved: !!(m[L.key] && m[L.key].approved), sent_at: m[L.key] && m[L.key].sent_at, sent_count: m[L.key] ? m[L.key].sent_count : 0, html: render(L, { first: "Grace", portal: SITE, unsub: "#" }) })) });
      }
      if (a === "approve") {
        const keys = b.all ? LETTERS.map((L) => L.key) : [clip(b.key, 40)].filter((k) => LETTERS.some((L) => L.key === k));
        const rows = keys.map((k) => ({ key: k, approved: b.approved !== false, approved_at: new Date().toISOString() }));
        const r = await D("deoretreat_letters?on_conflict=key", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(rows) });
        return r.ok ? res.json({ ok: true, n: rows.length }) : res.status(502).json({ error: "Couldn't save" });
      }
      const row = await one(`ref=eq.${encodeURIComponent(clip(b.ref, 30))}`); if (!row) return res.status(404).json({ error: "Not found" });
      const first = esc(String(row.name).split(" ")[0]);
      if (a === "accept") {
        const plan = PLANS[b.plan] ? b.plan : (PLANS[row.data && row.data.payment] ? row.data.payment : "monthly");
        const acc = { status: "accepted", accepted_at: new Date().toISOString(), plan }; await patch(row.ref, acc);
        const P = planOf({ ...row, ...acc }, await paysOf(row.ref));
        await mail(e, row.email, "Welcome, pilgrim: your place on A Summons to Divine Encounter", wrap(`<p>Dear ${first},</p>
          <p>With great joy we welcome you to <b>A Summons to Divine Encounter</b>, our Israel pilgrimage from 4 to 11 April 2027. You are pilgrim <b>${esc(row.ref)}</b>.</p>
          <p>You have not simply joined a trip. You have accepted an invitation to become someone new. The journey begins now: 17 weeks of preparation, eight days in the land, and 90 days of integration at home.</p>
          <p><b>Your commitment steps</b> (${esc(PLANS[plan])}, ${esc(offerOf(row))}, ${usd(P.fee)} in total):</p>${planTable(P)}
          <p>Every step is a step of faith, and we will celebrate each one with you. We will send the payment details separately.</p>
          <p><b>Your first step:</b> open your pilgrim portal, complete your first reflections and assessments, and meet your prayer partner.</p>
          <p style="text-align:center;margin:22px 0"><a href="${portalOf(row.token)}" style="background:#214C3B;color:#F5F4EB;padding:12px 22px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif">Open my pilgrim portal</a></p>
          <p>A first prayer for you: <i>Lord, You have called ${first} by name. Begin Your good work now, and carry it to completion.</i></p>`));
        return res.json({ ok: true });
      }
      if (a === "pay") {
        const amount = Number(b.amount); if (!(amount > 0) || amount > 20000) return res.status(400).json({ error: "Check the amount" });
        const paid_on = /^\d{4}-\d{2}-\d{2}$/.test(String(b.paid_on || "")) ? b.paid_on : ymd(Date.now());
        const r = await D("deoretreat_payments", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ref: row.ref, paid_on, amount, method: clip(b.method, 40), txref: clip(b.txref, 80), note: clip(b.note, 300) }) });
        if (!r.ok) return res.status(502).json({ error: "Couldn't save" });
        const P = planOf(row, await paysOf(row.ref)); await patch(row.ref, { status: P.balance <= 0 ? "paid" : "committed" });
        await mail(e, row.email, P.balance <= 0 ? "Fully committed: thank you" : "A step of commitment, received with thanks", wrap(`<p>Dear ${first},</p>
          <p>Thank you. We have received <b>${usd(amount)}</b> on ${new Date(paid_on + "T12:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Every step you take is a step of faith towards what God is preparing in you.</p>
          <p>${P.balance <= 0 ? "Your journey is now fully committed. Thank you for your faithfulness." : `So far you have committed <b>${usd(P.paid)}</b> of ${usd(P.fee)}.${P.next ? ` Your next step is ${usd(P.next.amount)} by ${new Date(P.next.due + "T12:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.` : ""}`}</p>
          <p><a href="${portalOf(row.token)}">Open your pilgrim portal</a></p>`));
        return res.json({ ok: true, balance: P.balance });
      }
      if (a === "status") { const st = clip(b.status, 20); await patch(row.ref, { status: st || row.status, notes: clip(b.notes, 2000) }); return res.json({ ok: true }); }
    }
    // ---------------- apply / join ----------------
    if (req.method !== "POST") return res.status(405).end();
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "x"; const now = Date.now();
    const h = (hits.get(ip) || []).filter((t) => now - t < 3600e3); if (h.length >= 20) return res.status(429).json({ error: "Too many attempts. Please try again later." }); h.push(now); hits.set(ip, h);
    if (b.website) return res.json({ ok: true, ref: "DR-OK" });
    const ev = EVENTS[b.event] ? b.event : null; const email = clip(b.email, 200).toLowerCase(); const name = clip(b.name, 120);
    if (!ev || !name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/i.test(email) || b.consent !== true || b.provisional !== true) return res.status(400).json({ error: "Please give your name, a valid email and the agreements." });
    const dup = await one(`event=eq.${ev}&email=eq.${encodeURIComponent(email)}`);
    if (dup) { if (dup.token) await mail(e, email, "Your pilgrim portal link", wrap(`<p>Dear ${esc(String(dup.name).split(" ")[0])},</p><p>You are already registered (${esc(dup.ref)}). Here is your private portal link:</p><p><a href="${portalOf(dup.token)}">Open my pilgrim portal</a></p>`)); return res.json({ ok: true, ref: dup.ref, already: true }); }
    const ref = EVENTS[ev].pre + "-" + crypto.randomBytes(4).toString("hex").slice(0, 5).toUpperCase();
    const token = crypto.randomBytes(18).toString("base64url");
    const D_KEYS = ["tier", "sap", "gender", "dob", "city", "whatsapp", "occupation", "pastor", "passport_expiry", "visa_needed", "prior_israel", "airport", "emergency_name", "emergency_relation", "emergency_phone", "emergency_email", "medical", "dietary", "payment", "why", "praying", "growth", "hopes", "ambassador", "c_email", "c_whatsapp", "c_letters", "c_assess", "family", "address"];
    const data = {}; D_KEYS.forEach((k) => { if (b[k] !== undefined && b[k] !== "") data[k] = typeof b[k] === "boolean" ? b[k] : clip(b[k], 1500); });
    if (data.c_letters === undefined) data.c_letters = true;
    const referred = clip(b.referred_by, 30).toUpperCase();
    const row = { ref, token, event: ev, status: "new", name, email, phone: clip(b.phone, 40), country: clip(b.country, 80), nationality: clip(b.nationality, 80), church: clip(b.church, 160),
      travel_from: clip(b.from, 60), flights: clip(b.flights, 20), passport: clip(b.passport, 20), room: ROOMS[b.room] || clip(b.room, 40), roommate: clip(b.roommate, 120), party: clip(b.party, 600),
      care: clip(b.care, 1200), hope: clip(b.hope, 1500), heard: clip(b.heard, 60), data, referred_by: /^(DR27|FPC27)-[A-Z0-9]{5}$/.test(referred) ? referred : null, plan: PLANS[data.payment] ? data.payment : null };
    const r = await D("deoretreat_registrations", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
    if (!r.ok) return res.status(502).json({ error: "Couldn't save that just now. Please try again." });
    const E = EVENTS[ev], first = esc(name.split(" ")[0]), fam = ev === "family-covenant";
    await mail(e, email, fam ? `Welcome to the Family Prayer Covenant · ${ref}` : "Your application has been received · A Summons to Divine Encounter", fam
      ? wrap(`<p>Dear ${first},</p><p>Thank you for joining the <b>Family Prayer Covenant</b>. Your family will be carried by name to Israel in April 2027, written on the covenant scroll and prayed for at Mount Carmel, the Sea of Galilee, the Jordan, Gethsemane and the Western Wall. Your reference is <b>${ref}</b>.</p><p>We will send you the payment details for the US$500 covenant gift, and your 40-day home prayer guide follows. This is a covenant of prayer and partnership; no outcome is promised in return for a gift.</p>`)
      : wrap(`<p>Dear ${first},</p><p>Thank you for applying for <b>A Summons to Divine Encounter</b>, our pilgrimage to Israel from 4 to 11 April 2027. Your reference is <b>${ref}</b>.</p><p>Your application is a first step of reflection. We will read it prayerfully and write to you personally with your acceptance letter and your commitment steps.</p><p>Meanwhile, your private pilgrim portal is open. Keep this link safe:</p><p style="text-align:center;margin:22px 0"><a href="${portalOf(token)}" style="background:#214C3B;color:#F5F4EB;padding:12px 22px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif">Open my pilgrim portal</a></p><p>Please check now that your passport will be valid until at least October 2027.</p>`));
    await mail(e, e.RETREAT_NOTIFY || "deoking@gmail.com", fam ? `FAMILY PRAYER COVENANT: ${name} (${ref})` : `ISRAEL 2027 APPLICATION: ${name} (${ref})`, `<div style="font-family:Arial,sans-serif;line-height:1.5">
      <p><b>${esc(name)}</b> · <a href="mailto:${esc(email)}">${esc(email)}</a> · ${esc(row.phone)}</p><p>${esc(row.country)}${row.nationality ? " · nationality " + esc(row.nationality) : ""}${row.church ? " · " + esc(row.church) : ""}</p>
      ${fam ? `<p><b>Family:</b> ${esc(row.party)}</p>${row.hope ? `<p><b>Requests:</b> ${esc(row.hope)}</p>` : ""}` : `<p><b>From:</b> ${esc(row.travel_from)} · <b>Flights:</b> ${esc(row.flights)} · <b>Passport OK:</b> ${esc(row.passport)} · <b>Room:</b> ${esc(row.room)} · <b>Plan:</b> ${esc(PLANS[data.payment] || "-")}</p><p><b>Experience:</b> ${esc(offerOf(row))} · ${usd(feeOf(row))}</p>${data.why ? `<p><b>Why this journey:</b> ${esc(data.why)}</p>` : ""}${row.referred_by ? `<p><b>Referred by:</b> ${esc(row.referred_by)}</p>` : ""}`}
      <p>Accept and manage: <a href="${SITE}/host">${SITE.replace("https://", "")}/#/registrations</a></p></div>`, email);
    return res.json({ ok: true, ref, token });
  } catch (x) { return res.status(502).json({ error: "Couldn't complete that just now. Please try again." }); }
};
