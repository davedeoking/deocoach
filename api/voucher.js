// LCAN membership vouchers: DeoCoach is free for LCAN members, and LCAN sends voucher codes to potential subscribers.
// POST {action:"redeem", code, name, email, consent}  → activates free DeoCoach Pro membership (one code, one person)
// POST {action:"lcan", name, email, lcanId, phone, consent} → LCAN member without a code: recorded for verification
// GET ?code=…  → {valid:bool}   ·   GET with x-admin-key → {stats, rows} (batches, redeemed, verification requests)
const { mail, esc, wrap } = require("../lib/mail");
const clip = (s, n) => String(s || "").trim().slice(0, n);
const norm = (c) => clip(c, 30).toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^LCAN/, "").replace(/^(.{4})(.{4})$/, "LCAN-$1-$2");
module.exports = async (req, res) => {
  const e = process.env, { SUPABASE_URL: url, SUPABASE_SERVICE_KEY: key } = e;
  res.setHeader("Cache-Control", "no-store");
  if (!url || !key) return res.status(503).json({ error: "not configured" });
  const H = { apikey: key, Authorization: `Bearer ${key}` }, J = { ...H, "Content-Type": "application/json" };
  try {
    if (req.method === "GET") {
      if (e.CRON_SECRET && req.headers["x-admin-key"] === e.CRON_SECRET) {
        const v = await (await fetch(`${url}/rest/v1/deocoach_vouchers?select=code,batch,redeemed_at,name,email&order=redeemed_at.desc.nullslast&limit=5000`, { headers: H })).json();
        const s = await (await fetch(`${url}/rest/v1/deocoach_signups?select=*&kind=eq.lcan&order=id.desc&limit=500`, { headers: H })).json();
        return res.json({ total: v.length, redeemed: v.filter((x) => x.redeemed_at).length, rows: v.filter((x) => x.redeemed_at).slice(0, 300), requests: s });
      }
      const code = norm(req.query.code);
      const r = await fetch(`${url}/rest/v1/deocoach_vouchers?select=redeemed_at&code=eq.${encodeURIComponent(code)}`, { headers: H }); const j = r.ok ? await r.json() : [];
      return res.json({ valid: !!j.length && !j[0].redeemed_at, used: !!(j.length && j[0].redeemed_at) });
    }
    if (req.method !== "POST") return res.status(405).end();
    let b = req.body || {}; if (typeof b === "string") { try { b = JSON.parse(b); } catch (x) { b = {}; } }
    const email = clip(b.email, 200).toLowerCase(), name = clip(b.name, 80);
    if (!name || !/^[^@\s]{1,64}@[^@\s]{1,190}\.[a-z]{2,}$/.test(email) || b.consent !== true) return res.status(400).json({ error: "Please give your name, a valid email and your consent." });
    const first = esc(name.split(" ")[0]);
    if (b.action === "lcan") {
      const row = { kind: "lcan", name, email, phone: clip(b.phone, 30) || null, ref: clip(b.lcanId, 60) || null, org: "LCAN", plan: "pro", status: "verify" };
      await fetch(`${url}/rest/v1/deocoach_signups`, { method: "POST", headers: { ...J, Prefer: "return=minimal" }, body: JSON.stringify(row) });
      await mail(e, email, "Your free DeoCoach membership as an LCAN member", wrap(`<p>Dear ${first},</p><p>Thank you. As an LCAN member, DeoCoach is free for you. We're confirming your membership with LCAN${row.ref ? ` (membership no. ${esc(row.ref)})` : ""}, and your free DeoCoach Pro access will be switched on within one working day.</p><p>You can use everything free on <a href="https://www.deocoach.com">deocoach.com</a> straight away, and the <a href="https://www.deocoach.com/founding50">Founding 100</a> is open to you too.</p>`));
      if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `LCAN member to verify: ${name}`, `<p>${esc(name)} · ${esc(email)} · LCAN no. ${esc(row.ref || "—")} ${row.phone ? "· " + esc(row.phone) : ""}</p><p>Listed on your Footfall page.</p>`);
      return res.json({ ok: true, status: "verify" });
    }
    const code = norm(b.code);
    if (!/^LCAN-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return res.status(400).json({ error: "That doesn't look like a voucher code. It should look like LCAN-AB12-CD34." });
    const upd = await fetch(`${url}/rest/v1/deocoach_vouchers?code=eq.${code}&redeemed_at=is.null`, { method: "PATCH", headers: { ...J, Prefer: "return=representation" }, body: JSON.stringify({ redeemed_at: new Date().toISOString(), name, email }) });
    const got = upd.ok ? await upd.json() : [];
    if (!got.length) {
      const chk = await (await fetch(`${url}/rest/v1/deocoach_vouchers?select=email,redeemed_at&code=eq.${code}`, { headers: H })).json();
      if (chk.length && chk[0].email === email) return res.json({ ok: true, plan: "pro", via: "LCAN", code, again: true });
      return res.status(409).json({ error: chk.length ? "This voucher has already been used. Each code works once — ask LCAN for another, or apply as an LCAN member below." : "We couldn't find that voucher code. Check it and try again." });
    }
    await fetch(`${url}/rest/v1/deocoach_signups`, { method: "POST", headers: { ...J, Prefer: "return=minimal" }, body: JSON.stringify({ kind: "voucher", name, email, plan: "pro", ref: code, org: "LCAN", status: "active" }) });
    try { await fetch(`${url}/rest/v1/deocoach_alerts?on_conflict=email`, { method: "POST", headers: { ...J, Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ email, countries: [], kw: "coaching leadership training", cadence: "weekly", token: require("crypto").randomBytes(16).toString("hex"), updated_at: new Date().toISOString() }) }); } catch (x) {}
    await mail(e, email, "Welcome to DeoCoach Pro — your LCAN voucher is active", wrap(`<p>Dear ${first},</p><p>Your LCAN voucher <b>${code}</b> is active. <b>DeoCoach Pro is now free for you</b>, courtesy of LCAN.</p><p>Start here: <a href="https://www.deocoach.com/#start">deocoach.com</a> — set your city and niche, then open your Horizon Atlas and Opportunity Desk. The free <a href="https://www.deocoach.com/free">Toolkit</a> and the <a href="https://www.deocoach.com/founding50">Founding 100</a> are open to you too.</p>`));
    if (e.DIGEST_REPLY_TO) await mail(e, e.DIGEST_REPLY_TO, `LCAN voucher redeemed: ${name}`, `<p>${esc(name)} · ${esc(email)} redeemed ${code}.</p>`);
    return res.json({ ok: true, plan: "pro", via: "LCAN", code });
  } catch (x) { return res.status(502).json({ error: "upstream" }); }
};
