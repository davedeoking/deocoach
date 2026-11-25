// Alert keywords by profession, so new members get the right opportunities from day one (matches subKw() in src/global.js).
const PRO_KW = { coach: "coaching leadership training", trainer: "training workshop capacity building", facilitator: "facilitation workshop strategy",
  mentor: "mentoring programme", speaker: "keynote speaker conference", consultant: "consultancy consulting advisory" };
const proKw = (pro) => PRO_KW[String(pro || "").toLowerCase()] || PRO_KW.coach;
module.exports = { PRO_KW, proKw };
