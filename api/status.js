// Which live services are switched on (no secrets are returned).
module.exports = (req, res) => {
  const e = process.env;
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ai: !!e.ANTHROPIC_API_KEY, jobs: !!(e.ADZUNA_APP_ID && e.ADZUNA_APP_KEY), telemetry: !!(e.SUPABASE_URL && e.SUPABASE_SERVICE_KEY) });
};
