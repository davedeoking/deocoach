// Sign-ups beyond the Founding 100: ACW session registration, executive coaching & consulting enquiries, membership reservations,
// and bank-transfer payment notices. Stored in deocoach_signups; the person gets a confirmation and David a notification.
// POST {kind:"acw"|"exec"|"member"|"bank", name, email, phone?, org?, role?, segment?, plan?, cycle?, currency?, ref?, note?, consent:true}
// GET with x-admin-key (CRON_SECRET) → {rows:[…]} for the Footfall dashboard.
const { mail, esc, wrap } = require("../lib/mail");
const { PLANS, ACW } = require("../lib/plans");
const clip = (s, n) => String(s || "").trim().slice(0, n);
const KINDS = ["acw", "exec", "member", "bank"];
const SEG = { nation: "Nation or government", board: "Board or executive team", leader: "Leader or founder", coach: "Coach, trainer or advisor", consultant: "Consultant or consulting firm", consulting: "Client seeking consulting services", org: "Organisation" };
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` };
  try {
    if (req.method === "GET") {
      if (!e.CRON_SECRET || req.headers["x-admin-key"] !== e.CRON_SECRET) return res.status(401).json({ error: "wrong key" });
      const r = await fetch(`${url}/rest/v1/deocoach_signups?select=*&order=id.desc&limit=500`, { headers: H });
      return res.json({ rows: r.ok ? await r.json() : [] });
    }
    if (req.method !== "POST") return res.status(405).end();
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    const kind = KINDS.includes(b.kind) ? b.kind : null;
    const email = clip(b.email, 200).toLowerCase(), name = clip(b.name, 80);
    if (!kind || !name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email) || b.consent !== true) return res.status(400).json({ error: "Please give your name, a valid email and your consent." });
    const plan = PLANS[b.plan] ? b.plan : null;
    const row = { kind, name, email, phone: clip(b.phone, 30) || null, org: clip(b.org, 120) || null, role: clip(b.role, 120) || null,
      segment: SEG[b.segment] ? b.segment : null, plan, cycle: b.cycle === "year" ? "year" : b.cycle === "month" ? "month" : null,
      currency: b.currency === "USD" ? "USD" : b.currency === "NGN" ? "NGN" : null, amount: Number.isFinite(+b.amount) && +b.amount > 0 ? Math.round(+b.amount) : null,
      ref: clip(b.ref, 80) || null, note: clip(b.note, 1200) || null, country: clip(b.country, 60) || null, src: clip(b.src, 30) || null,
      status: kind === "bank" ? "pending" : kind === "member" ? "reserved" : "new" };
    if (kind === "acw") {
      const dup = await fetch(`${url}/rest/v1/deocoach_signups?select=id&kind=eq.acw&email=eq.${encodeURIComponent(email)}`, { headers: H });
      if (dup.ok && (await dup.json()).length) return res.json({ ok: true, already: true });
    }
    const r = await fetch(`${url}/rest/v1/deocoach_signups`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify(row) });
    if (!r.ok) return res.status(502).json({ error: "Couldn't save that just now. Please try again." });
    const saved = (await r.json())[0] || {};
    // everyone who signs on also gets the weekly opportunities (they consented to DeoCoach emails)
    try { await fetch(`${url}/rest/v1/deocoach_alerts?on_conflict=email`, { method: "POST", headers: { ...H, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email, countries: row.country ? [row.country] : [], kw: "coaching leadership training", cadence: "weekly", token: require("crypto").randomBytes(16).toString("hex"), updated_at: new Date().toISOString() }) }); } catch (x) {}
    const first = esc(name.split(" ")[0]), zoom = e.ACW_ZOOM_LINK, when = e.ACW_TIME || "", book = e.CALENDLY_URL || "https://calendly.com/adeoyedavid/30min";
    const planName = plan ? PLANS[plan].name : "DeoCoach membership";
    const msg = {
      acw: [`You're registered: ${ACW.title}`, `<p>Dear ${first},</p><p>You're registered for my ACW 2026 AI session, <b>${esc(ACW.title)}</b>, on <b>${ACW.day}${when ? " at " + esc(when) : ""}</b> on Zoom.</p>
        <p>${zoom ? `<b>Join on Zoom:</b> <a href="${esc(zoom)}">${esc(zoom)}</a>` : "I'll email you the Zoom link before the session."} You'll also get a reminder the day before and on the morning of the session.</p>
        <p>To get the most from it, pick one part of your practice you'd love to hand to AI, and bring it with you. If you'd like a head start, the free <a href="https://www.deocoach.com/free/ai-automation-starter-kit.html">AI &amp; Automation Starter Kit</a> is ready for you.</p>`],
      exec: ["Thank you — your enquiry has reached Coach David", `<p>Dear ${first},</p><p>Thank you for reaching out about coaching, consulting or advisory work together${row.org ? " with " + esc(row.org) : ""}. I read every enquiry personally and will reply within two working days.</p>
        <p>If you'd like to talk sooner, choose a time for a discovery call here: <a href="${esc(book)}">${esc(book)}</a>.</p><p>Before we speak, it helps to note the one decision or shift that matters most to you right now, and the future you are working towards.</p>`],
      member: [`Your place for ${planName} is reserved`, `<p>Dear ${first},</p><p>Your place for <b>${esc(planName)}</b> is reserved. Founding Member pricing opens shortly, and you'll be the first to hear, with the founding price locked in for as long as you stay a member.</p>
        <p>Until then, everything free on DeoCoach is yours to use: <a href="https://www.deocoach.com">deocoach.com</a>.</p>`],
      bank: ["We've received your payment notice", `<p>Dear ${first},</p><p>Thank you. We've received your bank-transfer notice for <b>${esc(planName)}</b>${row.amount ? ` (${row.currency === "USD" ? "$" : "₦"}${row.amount.toLocaleString("en-GB")})` : ""}${row.ref ? `, reference <b>${esc(row.ref)}</b>` : ""}.</p>
        <p>As soon as the payment is confirmed (usually within one working day) your membership is switched on and you'll get a confirmation email.</p>`],
    }[kind];
    await mail(e, email, msg[0], wrap(msg[1]));
    if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `${{ acw: "ACW registration", exec: "COACHING / CONSULTING ENQUIRY", member: "Membership reservation", bank: "BANK TRANSFER to confirm" }[kind]}: ${name}${row.org ? " · " + row.org : ""}`,
      `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><b>${esc(name)}</b> · <a href="mailto:${esc(email)}">${esc(email)}</a>${row.phone ? " · " + esc(row.phone) : ""}</p>
      ${row.org || row.role ? `<p>${esc(row.role || "")}${row.role && row.org ? ", " : ""}${esc(row.org || "")}</p>` : ""}${row.segment ? `<p><b>Who:</b> ${esc(SEG[row.segment])}</p>` : ""}
      ${plan ? `<p><b>Plan:</b> ${esc(planName)} ${row.cycle ? "(" + row.cycle + "ly)" : ""} ${row.amount ? (row.currency === "USD" ? "$" : "₦") + row.amount : ""} ${row.ref ? "· ref " + esc(row.ref) : ""}</p>` : ""}
      ${row.note ? `<p><b>Note:</b> ${esc(row.note)}</p>` : ""}<p>All sign-ups are on <a href="https://www.deocoach.com/footfall.html">your Footfall page</a>.</p></div>`);
    return res.json({ ok: true, id: saved.id, status: row.status });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
