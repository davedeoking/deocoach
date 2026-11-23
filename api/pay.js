// Membership payments.
// GET              → {plans, paystack:bool, bank:string|null}  — prices (null = not set yet), whether Paystack is live, and the bank-transfer details
//                    (David sets BANK_DETAILS himself in Vercel; the code never holds account numbers).
// POST {plan,cycle,currency,email,name} → {url} Paystack checkout link (needs PAYSTACK_SECRET_KEY and a price).
const { PLANS } = require("../lib/plans");
module.exports = async (req, res) => {
  const e = process.env; res.setHeader("Cache-Control", "no-store");
  const paystack = !!e.PAYSTACK_SECRET_KEY;
  if (req.method === "GET") return res.json({ plans: PLANS, paystack, bank: e.BANK_DETAILS || null, book: e.CALENDLY_URL || "https://calendly.com/adeoyedavid/30min", acwTime: e.ACW_TIME || null, acwZoom: !!e.ACW_ZOOM_LINK });
  if (req.method !== "POST") return res.status(405).end();
  let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
  const p = PLANS[b.plan], cur = b.currency === "USD" ? "USD" : "NGN", cyc = b.cycle === "year" ? "year" : "month";
  const email = String(b.email || "").trim().toLowerCase();
  if (!p || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email)) return res.status(400).json({ error: "Please choose a plan and give a valid email." });
  const amt = p.price[cur][cyc];
  if (!amt) return res.status(409).json({ error: "Pricing for this plan opens soon — reserve your place instead." });
  if (!paystack) return res.status(503).json({ error: "Card payments are switching on soon — please use bank transfer for now." });
  try {
    const r = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${e.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount: Math.round(amt * 100), currency: cur, callback_url: "https://www.deocoach.com/?paid=1#member",
        metadata: { plan: b.plan, cycle: cyc, name: String(b.name || "").slice(0, 80), custom_fields: [{ display_name: "Plan", variable_name: "plan", value: `${p.name} (${cyc}ly)` }] } }) });
    const j = await r.json();
    if (!r.ok || !j.status) return res.status(502).json({ error: "Couldn't start the payment just now. Please try again or use bank transfer." });
    return res.json({ url: j.data.authorization_url, ref: j.data.reference });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
