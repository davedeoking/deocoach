// ===== Find a Coach: a clean directory of African coaches =====
const CO_NICHES=["Executive & leadership","Career","Business & entrepreneurs","Life & personal growth","Team & organisational","Sales & performance","Women in leadership","Youth & education","Wellbeing & resilience","Relationships & family","Faith-based","AI & digital transformation","Public sector & governance","Health & medical professionals"];
const CO_LANGS=["English","French","Portuguese","Arabic","Swahili","Yoruba","Hausa","Igbo","Amharic","Zulu","Afrikaans","Twi","Pidgin"];
const CO_FORMATS=["Online","In person","Group"];
const CO_AUD=["Individuals","Executives","Teams","Organisations","Governments"];
const CO_AF=["Nigeria","Ghana","Kenya","South Africa","Rwanda","Uganda","Tanzania","Ethiopia","Egypt","Morocco","Côte d'Ivoire","Senegal","Cameroon","Zambia","Zimbabwe","Botswana","Namibia","Angola","Mozambique","Sierra Leone","Liberia","Gambia","Benin","Togo","Malawi","Tunisia","Algeria","DR Congo","Mauritius","United Kingdom","United States","Canada","United Arab Emirates"];
let CO={list:null,q:"",country:"",niche:"",lang:"",format:"",pro:"",open:null,contact:null,msg:"",sent:{},applied:false,amsg:""};
async function coLoad(){try{const r=await fetch("/api/coaches");const j=await r.json();CO.list=j.coaches||[];}catch(e){CO.list=[];}if(/^#(coaches|listme)/.test(location.hash))render();}
coLoad();
function coInit(n){return esc(String(n||"?").split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase());}
function coAvatar(c,big){return c.photo?`<img class="coav ${big?"big":""}" src="${esc(c.photo)}" alt="${esc(c.name)}" loading="lazy" onerror="this.outerHTML='<div class=&quot;coav ini ${big?"big":""}&quot;>${coInit(c.name)}</div>'">`:`<div class="coav ini ${big?"big":""}">${coInit(c.name)}</div>`;}
function coMatch(c){const t=CO.q.toLowerCase(),hay=[c.name,c.title,c.city,c.country,c.bio,(c.niches||[]).join(" "),(c.langs||[]).join(" ")].join(" ").toLowerCase();
 return (!t||hay.includes(t))&&(!CO.country||c.country===CO.country)&&(!CO.niche||(c.niches||[]).includes(CO.niche))&&(!CO.lang||(c.langs||[]).includes(CO.lang))&&(!CO.format||(c.formats||[]).includes(CO.format))&&(!CO.pro||c.pro===CO.pro);}
function coSel(id,label,opts,val,key){return `<label class="cosel"><span class="small muted">${label}</span><select id="${id}" onchange="CO.${key}=this.value;coRefresh()"><option value="">Any</option>${opts.map(o=>`<option ${o===val?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`;}
function coCard(c){return `<article class="card cocard" tabindex="0" onclick="CO.open=${c.id};render()" onkeydown="if(event.key==='Enter'){CO.open=${c.id};render()}">
  <div class="cohead">${coAvatar(c)}<div><h3>${esc(c.name)}</h3><div class="small muted">${esc(c.title||PRO_N(c.pro))}</div><div class="small">📍 ${esc([c.city,c.country].filter(Boolean).join(", ")||"—")}</div></div></div>
  ${(c.badges||[]).length?`<div class="cobadges">${c.badges.map(b=>`<span class="cobadge">★ ${esc(b)}</span>`).join("")}</div>`:""}
  <div class="cotags">${(c.niches||[]).slice(0,3).map(n=>`<span>${esc(n)}</span>`).join("")}</div>
  <div class="small muted">${esc((c.formats||[]).join(" · "))}${c.langs&&c.langs.length?" · "+esc(c.langs.join(", ")):""}</div>
  <div class="cofoot"><span class="small">${c.years?esc(c.years)+" yrs":""}${c.rate?(c.years?" · ":"")+esc(c.rate):""}</span><span class="btn sm">View &amp; contact ▸</span></div></article>`;}
function PRO_N(k){const p=(typeof PROS!=="undefined"&&PROS.find(x=>x.k===k));return p?p.n:"Coach";}
function coRefresh(){const el=document.getElementById("cogrid");if(!el)return render();const L=(CO.list||[]).filter(coMatch);document.getElementById("cocount").textContent=`${L.length} ${L.length===1?"coach":"coaches"}`;el.innerHTML=L.length?L.map(coCard).join(""):coEmpty();}
function coEmpty(){return (CO.list||[]).length?`<div class="card coempty"><h3>No coaches match those filters yet.</h3><p class="muted">Try fewer filters, or check back soon: new coaches are being approved every week.</p><button class="btn ghost" onclick="Object.assign(CO,{q:'',country:'',niche:'',lang:'',format:'',pro:''});render()">Clear filters</button></div>`
 :`<div class="card coempty"><h3>The directory is opening now.</h3><p class="muted">African coaches are joining and being verified. Are you a coach? Be among the first listed.</p><a class="btn" href="#listme">List yourself free ▸</a></div>`;}
async function coSend(ev){ev.preventDefault();const f=ev.target,g=n=>f.querySelector(`[name="${n}"]`).value;
 if(!f.querySelector('[name="ok"]').checked){CO.msg="Please tick the consent box.";render();return;}CO.msg="Sending…";render();
 try{const r=await fetch("/api/coaches",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"contact",id:CO.open,name:g("name"),email:g("email"),phone:g("phone"),message:g("message"),consent:true})});const j=await r.json();
  if(!r.ok)CO.msg=j.error||"Something went wrong.";else{CO.msg="";CO.sent[CO.open]=1;track("sub",{p:"coachlead"});}}catch(e){CO.msg="Couldn't reach the server — please try again.";}render();}
function coModal(){const c=(CO.list||[]).find(x=>x.id===CO.open);if(!c)return "";
 return `<div class="whoov coov" onclick="CO.open=null;CO.msg='';render()"><div class="gwrap"><div class="gcard coprof" onclick="event.stopPropagation()" role="dialog" aria-label="${esc(c.name)}">
  <button class="cox" aria-label="Close" onclick="CO.open=null;CO.msg='';render()">✕</button>
  <div class="cohead">${coAvatar(c,true)}<div><h2 style="margin:0">${esc(c.name)}</h2><div class="muted">${esc(c.title||PRO_N(c.pro))}</div><div>📍 ${esc([c.city,c.country].filter(Boolean).join(", "))}</div>
   ${(c.badges||[]).length?`<div class="cobadges">${c.badges.map(b=>`<span class="cobadge">★ ${esc(b)}</span>`).join("")}</div>`:""}</div></div>
  ${c.bio?`<p style="margin:14px 0">${esc(c.bio)}</p>`:""}
  <div class="codl"><div><b>Specialities</b><span>${esc((c.niches||[]).join(" · ")||"—")}</span></div><div><b>Works with</b><span>${esc((c.audience||[]).join(" · ")||"—")}</span></div><div><b>Languages</b><span>${esc((c.langs||[]).join(" · ")||"—")}</span></div><div><b>Format</b><span>${esc((c.formats||[]).join(" · ")||"—")}</span></div>${c.years?`<div><b>Experience</b><span>${esc(c.years)} years</span></div>`:""}${c.rate?`<div><b>Fees</b><span>${esc(c.rate)}</span></div>`:""}</div>
  <div class="flex" style="gap:10px;margin:10px 0">${c.linkedin?`<a class="btn ghost sm" href="${esc(c.linkedin)}" target="_blank" rel="noopener nofollow">LinkedIn ↗</a>`:""}${c.website?`<a class="btn ghost sm" href="${esc(c.website)}" target="_blank" rel="noopener nofollow">Website ↗</a>`:""}</div>
  <h3 style="margin:16px 0 8px">Contact ${esc(c.name.split(" ")[0])}</h3>
  ${CO.sent[c.id]?`<p><b>Message sent.</b> ${esc(c.name.split(" ")[0])} will reply to you directly by email. A copy of the confirmation is in your inbox.</p>`
  :`<form class="grid g2" style="gap:10px" onsubmit="coSend(event)">${jcF("name","Your name","text",{req:1,val:(S.profile||{}).name})}${jcF("email","Your email","email",{req:1,val:S.subbed})}${jcF("phone","Phone or WhatsApp (optional)","tel")}<div></div>${jcF("message","What would you like help with?","textarea",{wide:1,ph:"A few lines about your goal, your organisation and your timing."})}
   <label class="flex small" style="grid-column:1/-1;gap:8px;align-items:flex-start;text-transform:none;flex-wrap:nowrap"><input type="checkbox" name="ok" style="flex:none;margin-top:3px"> I agree that DeoCoach may pass my message and contact details to this coach so they can reply.</label>
   <div style="grid-column:1/-1"><button class="btn" type="submit">Send message ▸</button></div>${CO.msg?`<p class="note" style="grid-column:1/-1">${esc(CO.msg)}</p>`:""}</form>`}
  <p class="small muted" style="margin-top:12px">Coaches are reviewed before listing. Always agree scope and fees directly with your coach.</p></div></div></div>`;}
V.coaches=()=>{const L=CO.list==null?null:CO.list.filter(coMatch);
 return `<div class="card cohero"><div class="kicker">FIND A COACH · AFRICA</div><h1 style="margin:.3rem 0 .4rem">Find the right African coach, quickly.</h1>
  <p class="lead">Search verified coaches, trainers, facilitators and mentors across Africa by country, speciality, language and format. Contact them directly, free.</p>
  <div class="cosearch"><input type="search" placeholder="Search by name, city or speciality — e.g. executive Lagos, career Nairobi" value="${esc(CO.q)}" oninput="CO.q=this.value;coRefresh()" aria-label="Search coaches"></div>
  <div class="cofilters">${coSel("cof1","Country",CO_AF,CO.country,"country")}${coSel("cof2","Speciality",CO_NICHES,CO.niche,"niche")}${coSel("cof3","Language",CO_LANGS,CO.lang,"lang")}${coSel("cof4","Format",CO_FORMATS,CO.format,"format")}
   <label class="cosel"><span class="small muted">Professional</span><select onchange="CO.pro=this.value;coRefresh()"><option value="">Any</option>${(typeof PROS!=="undefined"?PROS:[]).map(p=>`<option value="${p.k}" ${CO.pro===p.k?"selected":""}>${esc(p.n)}</option>`).join("")}</select></label></div></div>
 <div class="flex" style="justify-content:space-between;align-items:center;margin:4px 2px 10px"><b id="cocount">${L==null?"Loading…":`${L.length} ${L.length===1?"coach":"coaches"}`}</b><a class="btn ghost sm" href="#listme">Are you a coach? List yourself free ▸</a></div>
 <div class="cogrid" id="cogrid">${L==null?`<div class="card"><p>Loading coaches…</p></div>`:L.length?L.map(coCard).join(""):coEmpty()}</div>
 ${CO.open?coModal():""}`;};

// ---- list yourself ----
async function coApply(ev){ev.preventDefault();const f=ev.target,g=n=>{const x=f.querySelector(`[name="${n}"]`);return x?x.value:"";},chk=n=>[...f.querySelectorAll(`[name="${n}"]:checked`)].map(x=>x.value);
 if(!f.querySelector('[name="ok"]').checked){CO.amsg="Please tick the consent box.";render();return;}
 if(!chk("niches").length){CO.amsg="Please choose at least one speciality.";render();return;}CO.amsg="Sending…";render();
 const body={action:"list",name:g("name"),email:g("email"),phone:g("phone"),title:g("title"),pro:g("pro"),city:g("city"),country:g("country"),niches:chk("niches"),langs:chk("langs"),formats:chk("formats"),audience:chk("audience"),bio:g("bio"),years:g("years"),rate:g("rate"),photo:g("photo"),linkedin:g("linkedin"),website:g("website"),accred:g("accred"),consent:true};
 try{const r=await fetch("/api/coaches",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});const j=await r.json();
  if(!r.ok)CO.amsg=j.error||"Something went wrong.";else{CO.amsg="";CO.applied=true;S.subbed=S.subbed||body.email;save();track("sub",{p:"listme"});}}catch(e){CO.amsg="Couldn't reach the server — please try again.";}render();}
const coChecks=(name,opts,max)=>`<div class="cochecks">${opts.map(o=>`<label><input type="checkbox" name="${name}" value="${esc(o)}"> ${esc(o)}</label>`).join("")}</div>${max?`<div class="small muted">Choose up to ${max}.</div>`:""}`;
V.listme=()=>`<div class="card cohero"><div class="kicker">FIND A COACH · FOR COACHES</div><h1 style="margin:.3rem 0 .4rem">List yourself in Find a Coach — free</h1>
 <p class="lead">Be found by clients, organisations and governments looking for African coaches. Every profile is reviewed before it goes live. Your email is never shown: client messages come straight to your inbox.</p></div>
 <div class="card">${CO.applied?`<h2>Thank you — your profile is with us.</h2><p>We review every profile, usually within two working days, and will email you the moment yours is live.</p><a class="btn" href="#coaches">See the directory ▸</a>`
 :`<form class="grid g2" style="gap:12px" onsubmit="coApply(event)">
  ${jcF("name","Full name","text",{req:1,val:(S.profile||{}).name})}${jcF("email","Email (private — for client messages)","email",{req:1,val:S.subbed})}
  ${jcF("title","Headline","text",{ph:"e.g. Executive & Leadership Coach"})}<div><label>I am a…</label><select name="pro">${(typeof PROS!=="undefined"?PROS:[]).map(p=>`<option value="${p.k}" ${PRO().k===p.k?"selected":""}>${esc(p.n)}</option>`).join("")}</select></div>
  ${jcF("city","City","text")}<div><label>Country</label><input name="country" list="coaf" required><datalist id="coaf">${CO_AF.map(c=>`<option value="${esc(c)}">`).join("")}</datalist></div>
  <div style="grid-column:1/-1"><label>Specialities</label>${coChecks("niches",CO_NICHES,6)}</div>
  <div style="grid-column:1/-1"><label>Languages you coach in</label>${coChecks("langs",CO_LANGS)}</div>
  <div><label>Format</label>${coChecks("formats",CO_FORMATS)}</div><div><label>You work with</label>${coChecks("audience",CO_AUD)}</div>
  ${jcF("bio","About you and the results you help clients achieve (up to 700 characters)","textarea",{wide:1})}
  ${jcF("years","Years of experience","number")}${jcF("rate","Fees (optional)","text",{ph:"e.g. From ₦150,000 per session"})}
  ${jcF("accred","Accreditations (optional, for our review)","text",{ph:"e.g. ICF PCC, EMCC"})}${jcF("phone","Phone (private, optional)","tel")}
  ${jcF("photo","Photo link (optional, must start with https://)","url",{ph:"https://…"})}${jcF("linkedin","LinkedIn profile (optional)","url",{ph:"https://www.linkedin.com/in/…"})}
  ${jcF("website","Website (optional)","url",{ph:"https://…"})}<div></div>
  <label class="flex small" style="grid-column:1/-1;gap:8px;align-items:flex-start;text-transform:none;flex-wrap:nowrap"><input type="checkbox" name="ok" style="flex:none;margin-top:3px"> I confirm these details are accurate, agree that DeoCoach may publish my profile (not my email or phone) once approved, and may email me client enquiries and updates.</label>
  <div style="grid-column:1/-1"><button class="btn" type="submit">Submit my profile ▸</button></div>${CO.amsg?`<p class="note" style="grid-column:1/-1">${esc(CO.amsg)}</p>`:""}</form>`}</div>`;
