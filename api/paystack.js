// Paystack webhook: on a successful charge, records the paid membership in deocoach_signups and emails the member and David.
// Set the webhook URL in Paystack → Settings → API Keys & Webhooks to https://www.deocoach.com/api/paystack
const crypto = require("crypto");
const { mail, esc, wrap } = require("../lib/mail");
const { PLANS } = require("../lib/plans");
module.exports.config = { api: { bodyParser: false } };
const raw = (req) => new Promise((ok) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => ok(d)); });
module.exports = Object.assign(async (req, res) => {
  const e = process.env;
  if (req.method !== "POST" || !e.PAYSTACK_SECRET_KEY) return res.status(405).end();
  const body = await raw(req);
  const sig = crypto.createHmac("sha512", e.PAYSTACK_SECRET_KEY).update(body).digest("hex");
  if (sig !== req.headers["x-paystack-signature"]) return res.status(401).end();
  let ev = {}; try { ev = JSON.parse(body); } catch (x) {}
  res.status(200).end();
  if (ev.event !== "charge.success") return;
  const d = ev.data || {}, m = d.metadata || {}, p = PLANS[m.plan];
  const row = { kind: "paid", name: String(m.name || d.customer && d.customer.first_name || "").slice(0, 80) || null, email: (d.customer && d.customer.email || "").toLowerCase(),
    plan: p ? m.plan : null, cycle: m.cycle || null, currency: d.currency, amount: Math.round((d.amount || 0) / 100), ref: String(d.reference || "").slice(0, 80), status: "paid" };
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  if (url && key) { try { await fetch(`${url}/rest/v1/deocoach_signups`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) }); } catch (x) {} }
  const nm = p ? p.name : "DeoCoach membership", money = `${row.currency === "USD" ? "$" : "₦"}${row.amount.toLocaleString("en-GB")}`;
  await mail(e, row.email, `Welcome to ${nm}`, wrap(`<p>Dear ${esc((row.name || "friend").split(" ")[0])},</p><p>Thank you — your payment of <b>${money}</b> for <b>${esc(nm)}</b> (${esc(row.cycle || "")}ly) is confirmed, reference ${esc(row.ref)}. Welcome as a Founding Member.</p><p>Everything is ready for you at <a href="https://www.deocoach.com">deocoach.com</a>.</p>`));
  if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `PAID: ${nm} · ${money} · ${row.email}`, `<p>${esc(row.name || "")} · ${esc(row.email)} paid ${money} for ${esc(nm)} (${esc(row.cycle || "")}ly). Ref ${esc(row.ref)}.</p>`);
}, { config: { api: { bodyParser: false } } });
