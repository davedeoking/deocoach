// DeoCoach plans and programme settings. Prices are left null until David sets them:
// while a price is null the site shows "reserve your place" instead of a checkout.
// Amounts are in the main currency unit (naira / dollars); Paystack is charged in kobo/cents.
const PLANS = {
  pro: { name: "DeoCoach Pro", blurb: "The full intelligence engine: every city, alert and planner, unlimited.", price: { NGN: { month: null, year: null }, USD: { month: null, year: null } } },
  premium: { name: "DeoCoach Premium", blurb: "Everything in Pro, plus a monthly live group coaching call with Coach David.", price: { NGN: { month: null, year: null }, USD: { month: null, year: null } } },
};
// The Founding 100: 12 live Zoom sessions, Thursdays 7pm WAT (18:00 UTC), starting the week of Mon 7 Dec 2026, with a break over Christmas and New Year.
const F50_SESSIONS = ["2026-12-10", "2026-12-17", "2027-01-07", "2027-01-14", "2027-01-21", "2027-01-28", "2027-02-04", "2027-02-11", "2027-02-18", "2027-02-25", "2027-03-04", "2027-03-11"];
const F50_TOPICS = ["Map: where your time really goes", "Map: your client journey, end to end", "Map: choosing your first five automations", "Automate: booking, reminders and follow-ups", "Automate: notes, summaries and session records with AI", "Automate: content and LinkedIn on autopilot", "Govern: client data, consent and AI safety", "Govern: your AI policy and quality checks", "Govern: measuring what the automations save", "Monetise: packages and pricing that scale", "Monetise: proposals and corporate offers", "Monetise: your 90-day growth plan and graduation"];
const ACW = { title: "Activating the Future: From Coach to Catalyst in the Age of AI", date: "2026-11-25", day: "Wednesday 25 November 2026" };
module.exports = { PLANS, F50_SESSIONS, F50_TOPICS, ACW };
