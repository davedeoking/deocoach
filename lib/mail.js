// Shared Resend sender (from coachdeo@deocoach.com via DIGEST_FROM; replies go to DIGEST_REPLY_TO).
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
async function mail(e, to, subject, html, extra) {
  if (!e.RESEND_API_KEY || !e.DIGEST_FROM || !to) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ from: e.DIGEST_FROM, reply_to: "coachdeo@deocoach.com", to, subject, html }, extra || {})) });
    return r.ok;
  } catch (x) { return false; }
}
const wrap = (body) => `<div style="font-family:Arial,sans-serif;max-width:580px;color:#1d1a14;line-height:1.55">${body}<p>Activating the future with you,<br><b>Coach David Adeoye Abodunrin</b><br>Founder, DeoCoach · <a href="https://www.deocoach.com">deocoach.com</a> · coachdeo@deocoach.com</p></div>`;
module.exports = { mail, esc, wrap };
