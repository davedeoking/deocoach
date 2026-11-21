// ===== Ask DeoMentor: the council of advisers that works with a coach on their most nascent questions =====
// Deep link: https://deomentor.vercel.app/council?from=DeoCoach&chair=&council=&frame=#q=&summary=  (text after # never reaches a server)
const DM="https://deomentor.vercel.app/council";
function dmUrl(o){const p=new URLSearchParams({from:"DeoCoach"});if(o.chair)p.set("chair",o.chair);if(o.council)p.set("council",o.council);if(o.frame)p.set("frame",o.frame);
 const h=new URLSearchParams();if(o.q)h.set("q",o.q.slice(0,400));if(o.summary)h.set("summary",o.summary.slice(0,900));return DM+"?"+p.toString()+(h.toString()?"#"+h.toString():"");}
function dmBtn(o,label){return `<a class="btn sm dmb" href="${esc(dmUrl(o))}" target="_blank" rel="noopener">✦ ${label||"Ask the DeoMentor council"}</a>`;}
function frameFor(m){return m<=1?"30d":m<=2?"60d":m<=3?"90d":m<=4?"120d":m<=6?"180d":m<=12?"1y":m<=24?"2y":"5y";}
function coachSummary(){const sg=signature(),X=xray(),f=funnel();const nn=nicheById(S.profile.niche);const bits=[`Role: ${S.profile.role||"Coach"}`];
 if(S.profile.cityId&&cityById(S.profile.cityId))bits.push(`City: ${cityById(S.profile.cityId).n}`);if(nn)bits.push(`Niche: ${nn.n}`);if(S.stage!==null)bits.push(`Career stage: ${CAREER[S.stage][0]}`);
 if(sg)bits.push(`Signature: ${STYLES[sg.p].name}`);if(X.done)bits.push(`X-Ray bottleneck: ${X.bott.l[1]} (${X.bott.sc}/100)`);if(f)bits.push(`Brand level: ${BRAND[f.lvl]}${f.leak!==null?`, stuck at ${FUN[f.leak][1]}`:""}`);
 bits.push(`Activation Index: ${activation().idx}/100`);return bits.join(" · ");}
// which existing council fits each DeoCoach question
const DM_Q={begin:["deomentor","open","90d"],money:["appraiser","price-it-right","1y"],move:["deomentor","open","1y"],sell:["rainmaker","sales-turnaround","90d"],price:["appraiser","price-it-right","90d"],contracts:["rainmaker","big-deal","180d"],brand:["appraiser","prove-value","180d"],future:["deomentor","open","5y"]};
const DM_LEVEL={"Individual":["sage","personal-renewal"],"Friends and peer groups":["deomentor","open"],"Couple and family":["sage","personal-renewal"],"Subteam and project team":["steward","team-productivity"],"Whole team":["steward","team-productivity"],"Department and subdivision":["steward","change-merger"],"Division or business unit":["steward","leadership-transition"],"Organisation":["steward","culture-reset"],"Community and ecosystem":["deomentor","open"],"Coach and practice":["deomentor","open"]};
function dmForQuestion(q){const m=DM_Q[q]||DM_Q.begin;const head=QUESTIONS.find(x=>x[0]===q);return dmBtn({chair:m[0],council:m[1],frame:m[2],q:head?head[2]:"",summary:coachSummary()},"Take this question to the council");}
function dmForClient(c){const m=DM_LEVEL[c.level]||["deomentor","open"];const st=FA.cj[S.fa.stage||0];
 const shared=Object.keys(c.data).filter(k=>c.data[k]&&typeof c.data[k]==="string").map(k=>c.data[k].slice(0,160)).join(" | ");
 return dmBtn({chair:m[0],council:m[1],frame:"90d",q:`${st[0]} stage: ${st[1]}`,summary:`Client level: ${c.level}. Coaching stage: ${st[0]} → ${st[2]}. ${shared?"Notes: "+shared:""} (No names or private client details are included.)`},"Convene a council on this stage");}
// floating button on every page
(function(){const b=document.createElement("a");b.className="dmfloat";b.target="_blank";b.rel="noopener";b.textContent="✦ Ask DeoMentor";document.body.appendChild(b);
 const upd=()=>{const v=(location.hash||"#home").slice(1);const m=v==="clients"&&faClient()?(DM_LEVEL[faClient().level]||["deomentor","open"]):v==="income"?["appraiser","price-it-right"]:v==="brand"||v==="funnel"?["appraiser","prove-value"]:v==="stuck"?["rainmaker","sales-turnaround"]:v==="power"?["deomentor","open"]:v==="game"?["rainmaker","big-deal"]:v==="niches"||v==="atlas"?["navigator","career-change"]:["deomentor","open"];
  b.href=dmUrl({chair:m[0],council:m[1],frame:"90d",summary:coachSummary()});};upd();window.addEventListener("hashchange",upd);setInterval(upd,4000);})();
