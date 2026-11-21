// One-click unsubscribe from opportunity alerts: GET /api/unsubscribe?t=TOKEN
module.exports = async (req, res) => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = process.env; const t = String(req.query.t || "");
  if (!url || !key || !/^[a-f0-9]{32}$/.test(t)) return res.status(400).send("Invalid link.");
  await fetch(`${url}/rest/v1/deocoach_alerts?token=eq.${t}`, { method: "DELETE", headers: { apikey: key, Authorization: `Bearer ${key}` } });
  res.setHeader("content-type", "text/html"); res.status(200).send("<p style='font-family:sans-serif'>You have been unsubscribed from DeoCoach opportunity alerts.</p>");
};
