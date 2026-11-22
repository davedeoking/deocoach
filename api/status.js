// Which live services are switched on (no secrets are returned).
module.exports = (req, res) => {
  const e = process.env; res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ai: !!e.ANTHROPIC_API_KEY, opps: true, reliefweb: !!e.RELIEFWEB_APPNAME, alerts: !!(e.SUPABASE_URL && e.SUPABASE_SERVICE_KEY), email: !!(e.RESEND_API_KEY && e.DIGEST_FROM), signals: !!(e.SUPABASE_URL && e.SUPABASE_SERVICE_KEY), intel: !!(e.SUPABASE_URL && e.SUPABASE_SERVICE_KEY && e.ANTHROPIC_API_KEY) });
};
