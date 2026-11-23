// ===== DeoCoach v0.2 app =====
const KEY="deocoach-africa-v1";
let S={profile:{cur:"NGN"},sig:{},comp:{},yr:1,offer:{},deals:[],stage:null,fun:{},ch:{},per:{self:{},oth:{}},hrs:{},pm:3,sub:{niches:[],cities:[],cad:"daily"},sonar:{yr:3,niche:"all",city:null},plan:{}};
try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);S=Object.assign(S,o);if(typeof S.yr!=="number"||S.yr<1)S.yr=1;}}catch(e){}
S.sub=Object.assign({niches:[],cities:[],cad:"daily"},S.sub);S.sonar=Object.assign({yr:3,niche:"all",city:null,power:true},S.sonar);S.plan=S.plan||{};if(S.lookAuto){const ks=["indaba","royal","constellation","savannah","kente","adire","emerald","couture","ivory","aurora"];S.look=ks[(ks.indexOf(S.look)+1)%ks.length];}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function num(v){const n=parseFloat(String(v??"").replace(/,/g,""));return isNaN(n)?0:n;}
function money(n,c){c=c||S.profile.cur||"NGN";return (CUR[c]||"")+Math.round(n).toLocaleString("en-GB");}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800);}
function setv(path,val,rerender){const p=path.split(".");let o=S;for(let i=0;i<p.length-1;i++){o[p[i]]=o[p[i]]||{};o=o[p[i]];}o[p[p.length-1]]=val;save();if(rerender)render();else updateChrome();}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast("Copied");}catch(e){toast("Copy not allowed here — select and copy manually");}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const nicheById=id=>NICHES.find(n=>n.id===id);
const cityById=id=>CITIES.find(c=>c.id===id);

const LOOKS={"indaba": {"name": "Indaba", "tag": "Firelight, ochre and beadwork — the gathering", "bg": "rgb(26,15,9)", "acc": "rgb(232,146,54)", "head": "Gather. Listen. See where coaching is going."}, "royal": {"name": "Royal Horizon", "tag": "Navy night and old gold", "bg": "rgb(7,13,36)", "acc": "rgb(201,168,76)", "head": "See where coaching is going \u2014 and get there first."}, "constellation": {"name": "Constellation", "tag": "Gold light on a violet sky", "bg": "rgb(5,6,17)", "acc": "rgb(236,219,170)", "head": "Every coach has a star map. Find yours."}, "savannah": {"name": "Savannah Gold", "tag": "Dusk over the savannah", "bg": "rgb(24,13,8)", "acc": "rgb(232,164,64)", "head": "The future belongs to coaches who move early."}, "kente": {"name": "Kente Royale", "tag": "Bold gold, emerald and crimson", "bg": "rgb(8,8,8)", "acc": "rgb(245,192,32)", "head": "Bold coaches build Africa's future."}, "adire": {"name": "Adire Indigo", "tag": "Indigo cloth and silver", "bg": "rgb(9,15,46)", "acc": "rgb(204,218,255)", "head": "Read the patterns. Weave your future."}, "emerald": {"name": "Emerald Boardroom", "tag": "Private-bank calm", "bg": "rgb(10,30,25)", "acc": "rgb(216,192,134)", "head": "Coaching, examined with care."}, "couture": {"name": "Couture", "tag": "Fashion-magazine luxury", "bg": "rgb(10,10,10)", "acc": "rgb(234,100,30)", "head": "The art of the coaching business."}, "ivory": {"name": "Ivory Gallery", "tag": "Light, airy and gilded", "bg": "rgb(250,246,236)", "acc": "rgb(146,108,26)", "head": "Your gift, made visible and valuable."}, "aurora": {"name": "Aurora", "tag": "Northern lights and glass", "bg": "rgb(5,11,18)", "acc": "rgb(128,244,220)", "head": "Find the coach you were made to be."}};
function applyLook(){const k=LOOKS[S.look]?S.look:"indaba";document.documentElement.setAttribute("data-look",k);
 const m=document.getElementById("lookmenu");if(m)m.innerHTML=`<div class="small" style="padding:4px 8px 8px">Choose your experience</div>`+Object.entries(LOOKS).map(([id,l])=>`<button class="${id===k?"on":""}" onclick="S.look='${id}';save();applyLook();render();document.getElementById('lookmenu').classList.remove('open')"><span class="sw" style="background:radial-gradient(circle at 35% 35%,${l.acc},${l.bg} 70%)"></span><span><b>${l.name}</b><span class="small">${l.tag}</span></span></button>`).join("")+`<button onclick="cycleLooks()"><span class="sw" style="background:conic-gradient(${Object.values(LOOKS).map(l=>l.acc).join(",")})"></span><span><b>Surprise me</b><span class="small">A new experience every visit</span></span></button>`;}
function cycleLooks(){const ks=Object.keys(LOOKS);S.look=ks[(ks.indexOf(S.look)+1)%ks.length];S.lookAuto=true;save();applyLook();render();}
/* ---------- engines ---------- */
function signature(){const a=S.sig;if(Object.keys(a).length<SIG_ITEMS.length)return null;const sc={cat:0,str:0,lis:0,tea:0};SIG_ITEMS.forEach((it,i)=>sc[it[1]]+=a[i]||0);const o=Object.keys(sc).sort((x,y)=>sc[y]-sc[x]);return{sc,p:o[0],s:o[1]};}
function compAvg(ids){const v=(ids||COMPS.map(c=>c[0])).map(i=>S.comp[i]||0).filter(x=>x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0;}
// outlook of a niche in year t (1–10), interpolated from years 1,2,5,10
function curve(n,t){const X=[1,2,5,10],Y=n.y;if(t<=1)return Y[0];for(let i=1;i<4;i++)if(t<=X[i])return Y[i-1]+(Y[i]-Y[i-1])*(t-X[i-1])/(X[i]-X[i-1]);return Y[3];}
function nicheScores(t){const sg=signature();return NICHES.map(n=>{let s=curve(n,t)*7;if(sg){if(n.st[0]===sg.p||n.st[1]===sg.p)s+=15;else if(n.st.includes(sg.s))s+=8;}const ca=compAvg(n.need);s+=ca?ca*3:7;return Object.assign({},n,{score:Math.min(100,Math.round(s))});}).sort((a,b)=>b.score-a.score);}
// Horizon Atlas: opportunity for a niche in a city in year t
function cityScore(c,nid,t){
  if(nid==="all"){const v=c.top.slice(0,4).map(id=>cityScore(c,id,t));return Math.round(v.reduce((a,b)=>a+b,0)/v.length);}
  const n=nicheById(nid);const rank=c.top.indexOf(nid);const fit=rank<0?3:Math.max(8,22-rank*3);
  return Math.max(5,Math.min(100,Math.round(curve(n,t)*5+fit+c.m*(1+t*0.55)+(typeof learnBonus==='function'?learnBonus(c,nid):0))));}
function cityRank(t,nid){return CITIES.map(c=>({c,s:cityScore(c,nid,t),g:cityScore(c,nid,t)-cityScore(c,nid,1)})).sort((a,b)=>b.s-a.s);}
function funnel(){const v=FUN.map(f=>num(S.fun[f[0]]));if(!v[0])return null;
  const h=FUN.map((f,i)=>{if(i===0)return Math.min(1,v[0]/1000);const prev=i===9?v[7]:v[i-1];if(!prev)return 0;return Math.min(1,(v[i]/prev)/f[3]);});
  const ratio=FUN.map((f,i)=>{if(i===0)return null;const prev=i===9?v[7]:v[i-1];return prev?v[i]/prev:0;});
  let lvl=0;for(const g of BRAND_REQ){if(g.every(i=>h[i]>=.7))lvl++;else break;}
  let leak=null;if(lvl<BRAND_REQ.length){const g=BRAND_REQ[lvl];leak=g.reduce((a,b)=>h[b]<h[a]?b:a,g[0]);}
  return{v,h,ratio,lvl,leak};}
function channels(){const rows=CHANNELS.map(c=>{const d=S.ch[c]||{};return{c,r:num(d.r),e:num(d.e),k:num(d.k)};});
  const rs=rows.filter(x=>x.r>0).map(x=>x.r).sort((a,b)=>a-b);const med=rs.length?rs[Math.floor(rs.length/2)]:0;
  rows.forEach(x=>{if(!x.r&&!x.k){x.s="absent";x.t="Not active here";}else if(x.k>0&&x.r<med){x.s="hidden";x.t="Hidden gem — converting with little reach. Grow it.";}else if(x.k>0){x.s="selling";x.t="Selling — visible and converting";}else if(x.e>0){x.s="leaking";x.t="Leaking at conversion — enquiries but no clients";}else{x.s="leaking";x.t="Leaking at enquiry — seen but nobody asks";}});return rows;}
function deals(){const by={};S.deals.forEach(d=>{const c=d.cur||S.profile.cur;by[c]=by[c]||{paid:0,pipe:0,fc:0};const a=num(d.amt);const i=DSTAGES.indexOf(d.st);if(d.st==="Paid")by[c].paid+=a;else by[c].pipe+=a;by[c].fc+=a*(DPROB[i]??0);});return by;}
function traps(){const f=funnel(),hp=num(S.hrs.paid),ht=num(S.hrs.total),rate=num(S.offer.rate);
  const pd=S.deals.filter(d=>d.st==="Paid"&&(d.cur||S.profile.cur)===S.profile.cur);const tot=pd.reduce((a,d)=>a+num(d.amt),0);const big=pd.reduce((a,d)=>Math.max(a,num(d.amt)),0);
  return[
   {n:"Generalist trap",why:"\"I coach everyone.\" Buyers cannot see who you are for.",fix:"Pick one niche from Niche Radar and rewrite your bio, offer and content for that group only.",hit:!S.profile.niche||S.profile.niche==="general"},
   {n:"Free-coaching trap",why:"Lots of coaching hours, little income.",fix:"Turn free sessions into a paid pilot offer and use the Price Ladder.",hit:ht>0&&hp/ht<.5},
   {n:"Certificate trap",why:"Strong coaching skills, weak selling and visibility.",fix:"Pause new courses for 90 days. Run a proof sprint: 5 paid pilots, 5 case studies.",hit:compAvg(["lis","q","pres"])>=4&&compAvg(["biz","brand"])>0&&compAvg(["biz","brand"])<=2.5},
   {n:"Visibility without conversion",why:"People see and like you, but don't pay.",fix:"Add one clear offer, a price and a call to action to every channel.",hit:!!f&&f.leak!==null&&f.leak>=4&&f.leak<=6},
   {n:"Invisible expert",why:"Good coach, but the market does not see you.",fix:"Publish three times a week in one channel, and speak at one event a month.",hit:!!f&&f.leak!==null&&f.leak<=2},
   {n:"One-client dependency",why:"Most of your income comes from one client.",fix:"Build a pipeline of 10 leads across two payer types before that contract ends.",hit:(tot>0&&pd.length>1&&big/tot>.5)||pd.length===1},
   {n:"Price ceiling",why:"Stuck at the same fee level for years.",fix:"Fill your Proof Vault, then launch a premium tier at 3× your current package.",hit:num(S.profile.years)>=3&&rate>0&&!S.deals.some(d=>num(d.amt)>=rate*18)},
   {n:"Founder bottleneck",why:"You cannot grow beyond your own hours.",fix:"Move to group programmes, associate coaches and licensing.",hit:hp>=80}];}
function myNiches(){const s=S.sub.niches.length?S.sub.niches:(S.profile.niche&&S.profile.niche!=="general"?[S.profile.niche]:[nicheScores(1)[0].id]);return s;}
function myCities(){const s=S.sub.cities.length?S.sub.cities:(S.profile.cityId?[S.profile.cityId]:["lagos"]);return s;}

/* ---------- briefings ---------- */
const DAY=Math.floor(Date.now()/864e5);
function dateStr(d=new Date()){return d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});}
function briefing(mode){
  const ns=myNiches(),cs=myCities();const seed=hashStr(DAY+"|"+ns.join()+"|"+cs.join());
  const n=nicheById(ns[DAY%ns.length])||NICHES[0];const city=cityById(cs[DAY%cs.length])||CITIES[0];
  const sig=SIGNALS[n.id][(DAY+seed)%SIGNALS[n.id].length];const ev=EVIDENCE[(DAY+seed)%EVIDENCE.length];
  const feed=FEEDS.filter(f=>f.for.includes(n.id)||f.for.includes("all"))[(DAY)%FEEDS.filter(f=>f.for.includes(n.id)||f.for.includes("all")).length];
  const s1=cityScore(city,n.id,1),s5=cityScore(city,n.id,5),s10=cityScore(city,n.id,10);
  const rising=cityRank(5,n.id).sort((a,b)=>b.g-a.g).slice(0,3);
  if(mode==="daily")return{n,city,html:`
   <div class="brief"><h3>Signal of the day · ${esc(n.n)}</h3><p><b>${sig[0]}.</b> ${sig[1]}.</p><p>→ <b>Today's move:</b> ${sig[2]}.</p></div>
   <div class="brief"><h3>City pulse · ${city.n}</h3><p>On people's minds: <b>${city.mind}</b>. Opportunity for ${n.n.toLowerCase()} here: ${s1} now → ${s5} in Year 5 → ${s10} in Year 10.</p><p>→ <b>Say it like this:</b> ${city.say}.</p></div>
   <div class="brief"><h3>Evidence</h3><p>${ev.s} <span class="small">— <a href="${ev.url}" target="_blank" rel="noopener">${ev.src}</a></span></p></div>
   <div class="brief"><h3>Data to watch</h3><p><a href="${feed.u}" target="_blank" rel="noopener">${feed.n}</a> — ${feed.w}.</p></div>`,
   text:`DeoCoach daily briefing — ${dateStr()}\nSignal (${n.n}): ${sig[0]}. ${sig[1]}. Today's move: ${sig[2]}.\nCity pulse (${city.n}): ${city.mind}. Say: ${city.say}.\nEvidence: ${ev.s} (${ev.src})`};
  const acts=[`Monday: ${SIGNALS[n.id][0][2]}.`,`Tuesday: publish one proof post aimed at ${n.payer.split(",")[0].toLowerCase()}.`,`Wednesday: ${city.prep.split(";")[0]}.`,`Thursday: book three discovery calls; log them in Income Tracker.`,`Friday: enter this week's funnel numbers and check your leak.`];
  return{n,city,html:`
   <div class="brief"><h3>This week in ${esc(n.n)}</h3>${SIGNALS[n.id].map(s=>`<p><b>${s[0]}.</b> ${s[1]}. <span class="small">→ ${s[2]}.</span></p>`).join("")}</div>
   <div class="brief"><h3>Where it's rising fastest (to Year 5)</h3>${rising.map(r=>`<p><b>${r.c.n}, ${r.c.c}</b> — score ${cityScore(r.c,n.id,1)} → ${cityScore(r.c,n.id,5)}. Mind: ${r.c.mind}.</p>`).join("")}</div>
   <div class="brief"><h3>${city.n} outlook</h3><p>${city.issues.join(" · ")}</p><p>→ <b>Prepare now:</b> ${city.prep}.</p></div>
   <div class="brief"><h3>Your week</h3><ul>${acts.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></div>
   <div class="brief"><h3>Evidence</h3><p>${ev.s} <span class="small">— <a href="${ev.url}" target="_blank" rel="noopener">${ev.src}</a></span></p></div>`,
   text:`DeoCoach weekly briefing — week of ${dateStr()}\n`+SIGNALS[n.id].map(s=>`• ${s[0]} → ${s[2]}`).join("\n")+`\nRising: ${rising.map(r=>r.c.n).join(", ")}\nYour week:\n${acts.join("\n")}`};
}
async function askAI(prompt,outId){
  const el=document.getElementById(outId);el.style.display="block";el.textContent="Thinking…";
  try{const r=await fetch("/api/ai",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});
    const j=await r.json();if(!r.ok)throw new Error(j.error||"x");el.textContent=j.text;}
  catch(e){el.textContent="Live AI switches on when DeoCoach runs on its own site with an AI key. Until then, the briefing above is generated on your device.";}}
function aiBriefPrompt(){const ns=myNiches().map(id=>nicheById(id).n).join(", ");const cs=myCities().map(id=>{const c=cityById(id);return c.n+", "+c.c;}).join("; ");
 return `I am an African coach. My niche(s): ${ns}. My cities: ${cs}. My career stage: ${S.stage!==null?CAREER[S.stage][0]:"not set"}. Give me a ${S.sub.cad} briefing: 1) the 3 most important shifts in my niche and cities right now, 2) what is top of mind for people there and how to speak to it, 3) one opportunity likely in 1-3 years and how to prepare now, 4) three concrete actions. Do not invent statistics: only quote figures you are confident of and name the source, otherwise describe trends qualitatively.`;}

/* ---------- plans: 3 months to 5 years ---------- */
const PLAN_OPTS=[];for(let m=3;m<=60;m+=3)PLAN_OPTS.push(m);
function planLabel(m){if(m===3)return"90 days";if(m%12===0)return(m/12)+(m===12?" year":" years");return m+" months";}
function plan(months){
  const f=funnel(),T=traps().filter(t=>t.hit),cur=S.profile.cur;const nn=nicheById(S.profile.niche)||nicheScores(1)[0];
  const ch=channels();const best=(ch.find(c=>c.s==="hidden")||ch.find(c=>c.s==="selling")||ch.find(c=>c.s==="leaking")||{c:"one channel you enjoy"}).c;
  const leakOrder=f?FUN.map((x,i)=>i).filter(i=>i>0).sort((a,b)=>f.h[a]-f.h[b]):[1,3,4,6,8,9];
  const base=S.stage??2;const tgt=num(S.plan.target),g=num(S.plan.growth||20)/100;
  const themes=["Focus","Sell","Proof","Scale"];const Q=[];
  for(let q=1;q<=months/3;q++){
    const yr=Math.ceil(q/4),th=themes[(q-1)%4],st=Math.min(7,base+Math.floor((q-1)/4));const leak=FUN[leakOrder[(q-1)%leakOrder.length]];
    const topY=nicheScores(Math.min(10,yr+1))[0];const a=[];
    if(th==="Focus"){a.push(q===1?`Commit to ${nn.n}.`:`Review: is ${nn.n} still your best niche for Year ${yr}?`);if(q===1&&T[0])a.push(`Break the ${T[0].n.toLowerCase()}: ${T[0].fix}`);a.push(`Fix funnel stage "${leak[1]}": ${leak[4]}.`);}
    if(th==="Sell"){a.push(`Go deep in ${best}: three posts a week, one clear offer.`);a.push(`Pitch your core programme to ${nn.payer.split(",")[0].toLowerCase()}.`);a.push("Hold 12 discovery calls; log every deal in Income Tracker.");}
    if(th==="Proof"){a.push("Add five client results to your Proof Vault.");a.push("Run the 360° perception check with clients and peers.");a.push("Publish two case studies with numbers.");}
    if(th==="Scale"){a.push(`Test a ${CAREER[Math.min(7,st+1)][0]}-stage offer: ${CAREER[Math.min(7,st+1)][2]}.`);a.push("Launch or grow a group cohort.");a.push("Raise your entry price by 10–20% for new clients.");}
    if(topY.id!==nn.id&&q%4===0)a.push(`Futures watch: ${topY.n} rises in Year ${Math.min(10,yr+1)} — test a pilot offer.`);
    Q.push({q,yr,th,st,a,t:tgt?tgt/4*Math.pow(1+g,yr-1):0,from:(q-1)*3+1,to:q*3});}
  return{Q,cur};}

/* ---------- navigation ---------- */
const VIEWS=[
 ["start","✧","Start here",""],["home","✦","Command Centre",""],
 ["atlas","◉","Horizon Atlas","Futures & opportunities"],["industry","⬡","Industry Intelligence","Futures & opportunities"],["events","✷","Events & Happenings Radar","Futures & opportunities"],["bodies","⌘","Professional Bodies Map","Futures & opportunities"],["bizdev","⟁","Budget & Pipeline Engine","Futures & opportunities"],["briefing","☼","Daily & weekly briefing","Futures & opportunities"],["minds","❖","City Minds & Culture","Futures & opportunities"],["opps","✉","Opportunity Desk","Futures & opportunities"],["evidence","▤","Evidence & insight feeds","Futures & opportunities"],
 ["fas","❂","Future Activation hub","Future Activation"],["clients","♢","Client workspaces","Future Activation"],["backcast","⟲","Coach Backcasting","Future Activation"],["power","⚑","Power Moves","Future Activation"],["scenarios","⌬","Scenario Engine","Future Activation"],["game","♞","Strategic Interaction","Future Activation"],["cocreate","✺","CoachCoCreation","Future Activation"],["caplib","▦","320 Capabilities","Future Activation"],["methods","❦","Methodology Atlas","Future Activation"],["templates","✎","Working Templates","Future Activation"],["governance","⚖","Measurement & Governance","Future Activation"],
 ["profile","☺","My profile","Me"],["signature","✧","Coach Signature","Me"],["ladder","▲","Competency Ladder","Me"],
 ["niches","⌁","Niche Radar · 10 years","Money"],["income","₦","Capability to Income","Money"],
 ["brand","◈","Brand Compass","Brand"],["funnel","▽","Brand Funnel","Brand"],["stuck","➚","Stuck & growth plan","Brand"],
 ["toolkit","⚙","Client Toolkit","Grow"],["mentor","☯","Supervisor Desk","Grow"],["academies","✦","Coaching Academies","Grow"]];
const NEW=["academies","industry","events","bodies","bizdev","fas","clients","backcast","power","scenarios","game","cocreate","caplib","methods","templates","governance","start","atlas","briefing","minds","evidence","opps"];
function doneMap(){return{profile:!!S.profile.name,signature:!!signature(),ladder:compAvg()>0,niches:!!S.profile.niche,income:S.deals.length>0,brand:S.stage!==null,funnel:!!funnel(),stuck:num(S.hrs.total)>0};}
function updateChrome(){const d=doneMap();const cur=(location.hash||"#home").slice(1);let h="",grp="";
  VIEWS.forEach(v=>{if(v[3]&&v[3]!==grp){grp=v[3];h+=`<div class="grp">${grp}</div>`;}h+=`<button class="${cur===v[0]?"on":""}" onclick="location.hash='${v[0]}'"><span class="ic">${v[1]}</span>${typeof pwT==="function"?pwT(v[2]):v[2]}${d[v[0]]?'<span class="ok">✓</span>':NEW.includes(v[0])?'<span class="new">NEW</span>':""}</button>`;});
  document.getElementById("nav").innerHTML=h;document.getElementById("who").textContent=S.profile.name?`${S.profile.name}${S.profile.cityId&&cityById(S.profile.cityId)?" · "+cityById(S.profile.cityId).n:""}`:"";}
function render(){stopGlobes();if(typeof whoLabel==="function")whoLabel();{const b2=document.getElementById("brand2");if(b2&&typeof ED==="function")b2.textContent=S.ed==="africa"?"Edition for African Coaches · Capability to income · Horizon foresight · Cultural intelligence":"Global Edition · for Coaches, Trainers, Facilitators, Mentors & Speakers";}applyLook();langMenu();const cur=(location.hash||"#home").slice(1);const fn=V[cur]||V[{sonar:"atlas",cheques:"income"}[cur]]||V.home;const mn=document.getElementById("main");mn.innerHTML=fn();mn.querySelectorAll("svg *").forEach(el=>["fill","stroke"].forEach(a=>{const v=el.getAttribute(a);if(v&&v.includes("var("))el.style[a]=v;}));updateChrome();if(AFTER[cur])AFTER[cur]();if(window.POLISH_READY)polishAfter();translatePage();}
window.addEventListener("hashchange",()=>{render();window.scrollTo(0,0);});
const V={},AFTER={};

/* ---------- Command Centre ---------- */
V.home=()=>{const sg=signature(),f=funnel(),top=nicheScores(S.yr)[0],by=deals(),c=S.profile.cur,T=traps().filter(t=>t.hit);const d=doneMap();
 const pct=Math.round(Object.values(d).filter(Boolean).length/Object.keys(d).length*100);const m=by[c]||{paid:0,pipe:0,fc:0};const b=briefing("daily");
 const lead=cityRank(5,"all")[0];
 return `<div class="card"><div class="hero"><div><div class="tag">${ED().tag}</div>
 <h1>${S.profile.name?"Welcome, "+esc(S.profile.name.split(" ")[0])+".":(LOOKS[S.look]||LOOKS.royal).head}</h1>
 <p class="lead">For ${esc(proLine())}: sense where opportunities are rising across ${ED().cities}, know what people there care about, read the culture, find live tenders, conferences and jobs, and turn your capabilities into income with a plan from 90 days to 5 years.</p>
 <div class="flex"><a class="btn" href="#start">Where do I start?</a><a class="btn ghost" href="#atlas">Horizon Atlas</a><a class="btn ghost" href="#opps">Opportunities</a><a class="btn ghost" href="#briefing">Today's briefing</a><a class="btn ghost" href="#${!d.profile?"profile":!d.signature?"signature":!d.funnel?"funnel":"stuck"}">${pct<100?"Continue setup ("+pct+"%)":"My growth plan"}</a></div>
 <p class="small" style="margin-top:12px">Strongest signal by Year 5: <b style="color:var(--teal)">${lead.c.n}</b> (${lead.s}/100 across its top niches).</p></div>
 <div class="globe-wrap"><div class="globe-hud">◉ Horizon · Year 5 · all niches</div><canvas id="heroGlobe" height="420"></canvas></div></div></div>
 <div class="grid g3">
  <div class="stat"><div class="k">Activation Index</div><div class="v">${activation().idx}/100</div><div class="s"><a href="#start">See all 14 dimensions</a></div></div>
  <div class="stat"><div class="k">Coach signature</div><div class="v">${sg?STYLES[sg.p].name:"—"}</div><div class="s">${sg?"Secondary: "+STYLES[sg.s].name:'<a href="#signature">Take the 2-minute scan</a>'}</div></div>
  <div class="stat"><div class="k">Top niche · Year ${S.yr}</div><div class="v" style="font-size:1rem">${top.n}</div><div class="s">Fit ${top.score}/100</div></div>
  <div class="stat"><div class="k">Income (${c})</div><div class="v">${money(m.paid)}</div><div class="s">Pipeline ${money(m.pipe)} · forecast ${money(m.fc)}</div></div>
  <div class="stat"><div class="k">Brand level</div><div class="v">${f?BRAND[f.lvl]:"—"}</div><div class="s">${f?(f.leak!==null?"Stuck at: "+FUN[f.leak][1]:"Funnel healthy"):'<a href="#funnel">Enter funnel numbers</a>'}</div></div>
  <div class="stat"><div class="k">Career stage</div><div class="v">${S.stage!==null?CAREER[S.stage][0]:"—"}</div><div class="s">${S.stage!==null?"Sell: "+CAREER[S.stage][2]:'<a href="#brand">Choose your stage</a>'}</div></div>
  <div class="stat"><div class="k">Main sticking point</div><div class="v" style="font-size:1rem">${T[0]?T[0].n:"—"}</div><div class="s">${T[0]?T[0].fix:"Complete your data for a diagnosis"}</div></div>
 </div>
 <div class="card" style="margin-top:18px"><div class="flex"><h2 style="margin:0">Today · ${dateStr()}</h2><a class="btn sm ghost right" href="#briefing">Full briefing</a></div>${b.html}</div>`;};
AFTER.home=()=>startGlobe("heroGlobe",{yr:5,niche:"all",labels:6});


/* ---------- Horizon Atlas ---------- */
V.atlas=()=>{const s=S.sonar;const R=cityRank(s.yr,s.niche);const sel=s.city?cityById(s.city):null;const nsel=s.niche==="all"?null:nicheById(s.niche);
 return `<div class="card"><h1>Horizon Atlas</h1><p class="lead">A panoramic view of where opportunity for ${esc(PRO().many)} is likely to rise across ${ED().region} over 10 years. Drag to turn the globe, scroll or use + and − to zoom, and tap a city: the engine flies in and deploys a plan for you.</p>
 <div class="grid g2"><div><label>Year ahead</label><div class="yearbar"><span class="yv">Year ${s.yr}</span><input type="range" min="1" max="10" value="${s.yr}" oninput="S.sonar.yr=+this.value;save();render()"></div></div>
 <div><label>Niche</label><select onchange="S.sonar.niche=this.value;save();render()"><option value="all">All niches (each city's strongest)</option>${NICHES.map(n=>`<option value="${n.id}" ${s.niche===n.id?"selected":""}>${n.n}</option>`).join("")}</select></div></div></div>
 <div class="sonar-layout"><div class="card" style="padding:10px"><div class="globe-wrap"><div class="globe-hud">◉ Horizon · Year ${s.yr} · ${nsel?esc(nsel.n):"all niches"}${sel?" · "+sel.n:""}</div>
  <div class="zoombar"><button onclick="S.sonar.power=!S.sonar.power;save();render()" title="Power Centres on/off" style="${s.power?"background:var(--quakeC);color:var(--onacc)":""}">⚡</button><button onclick="playYears()" title="Play years 1–10">▶</button><button onclick="zoomAtlas(1.4)" title="Zoom in">+</button><button onclick="zoomAtlas(1/1.4)" title="Zoom out">−</button><button onclick="zoomAtlas(0);S.sonar.city=null;save();render()" title="Whole continent">⟲</button></div>
  <canvas id="atlasGlobe" height="580"></canvas></div>
  <p class="small" style="padding:0 10px">${s.power?"⚡ Power Centres on: red shockwaves mark clusters where <b>your</b> capabilities are worth most; magnitude grows with power. ":""}Ring size = opportunity score. Gold = strongest; teal = fastest rising. Scores are DeoCoach scenario estimates, sharpened by your field intelligence.</p></div>
 <div class="card"><h2>Opportunity ranking · Year ${s.yr}</h2><input placeholder="Find a city…" oninput="filterRank(this.value)" style="margin-bottom:8px">${R.map((r,i)=>`<div class="rank ${sel&&sel.id===r.c.id?"on":""}" data-n="${r.c.n.toLowerCase()} ${r.c.c.toLowerCase()}" onclick="pickCity('${r.c.id}')"><span class="small">${i+1}</span><span><b>${r.c.n}</b> <span class="small">${r.c.c}</span></span><div class="bar ${r.g>=Math.max(...R.map(x=>x.g))*0.75?"teal":""}"><i style="width:${r.s}%"></i></div><span class="small">${r.s}${r.g>0?" ↑"+r.g:""}</span></div>`).join("")}</div></div>
 ${s.power?powerView(s.yr):""}
 ${sel?deployView(sel,s.yr)+cityPanel(sel,s.yr)+cultureView(sel)+fieldView(sel):`<div class="card"><h2>Choose a city</h2><p class="lead">Tap a city on the globe or in the ranking. The engine will scan its signals, match them to your profile, read the culture and deploy a 90-day plan.</p></div>`}`;};
let PLAY=null;function playYears(){if(PLAY){clearInterval(PLAY);PLAY=null;toast("Paused");return;}S.sonar.power=true;S.sonar.yr=1;save();render();PLAY=setInterval(()=>{if((location.hash||"").slice(1)!=="atlas"||S.sonar.yr>=10){clearInterval(PLAY);PLAY=null;return;}S.sonar.yr++;save();render();},1600);}
function pickCity(id){S.sonar.city=id;S.sonar.fly=true;save();render();setTimeout(()=>{const d=document.querySelector(".deploy");if(d)d.scrollIntoView({behavior:"smooth",block:"start"});},1300);}
function filterRank(q){q=q.toLowerCase();document.querySelectorAll(".rank").forEach(e=>e.style.display=e.dataset.n.includes(q)?"":"none");}
AFTER.atlas=()=>{const fly=S.sonar.fly&&S.sonar.city;S.sonar.fly=false;save();startGlobe("atlasGlobe",{interactive:true,power:!!S.sonar.power,yr:S.sonar.yr,niche:S.sonar.niche,labels:10,traces:true,sel:S.sonar.city,flyTo:fly?S.sonar.city:null,flyK:3.6,click:id=>pickCity(id)});if(S.sonar.city)loadCommunity(S.sonar.city);};
function cityPanel(c,yr){const ns=NICHES.map(n=>({n,s:cityScore(c,n.id,yr),s1:cityScore(c,n.id,1),s10:cityScore(c,n.id,10)})).sort((a,b)=>b.s-a.s).slice(0,6);
 const inSub=S.sub.cities.includes(c.id);
 return `<div class="card"><div class="flex"><h2 style="margin:0">${c.n}, ${c.c}</h2><span class="pill teal">${c.hub}</span><button class="btn sm ${inSub?"":"ghost"} right" onclick="toggleSub('cities','${c.id}')">${inSub?"✓ In my briefing":"+ Add to my briefing"}</button></div>
 <div class="grid g2" style="margin-top:12px"><div>
  <div class="mind"><b>Most important factor on people's minds</b><br>${c.mind}</div>
  <div class="mind"><b>Issues running the landscape</b><br>${c.issues.join(" · ")}</div>
  <div class="mind"><b>Speak to their minds</b><br>${c.say}</div>
  <div class="mind"><b>Start developing now</b><br>${c.prep}</div></div>
 <div><h3>Strongest niches here · Year ${yr}</h3>${ns.map(x=>`<div style="margin:8px 0"><div class="flex small"><span style="color:var(--ink)">${x.n.n}</span><span class="right">${x.s1} → <b style="color:var(--gold2)">${x.s}</b> → ${x.s10} (Y10)</span></div><div class="bar"><i style="width:${x.s}%"></i></div></div>`).join("")}
 <p class="small">Who pays: ${ns[0].n.payer}.</p></div></div></div>`;}
function toggleSub(k,id){const a=S.sub[k];const i=a.indexOf(id);if(i>=0)a.splice(i,1);else{if(a.length>=3){toast("Up to 3 — remove one first");return;}a.push(id);}save();render();}

/* ---------- Briefing ---------- */
V.briefing=()=>{const b=briefing(S.sub.cad);
 return `<div class="card"><div class="flex"><h1 style="margin:0">${S.sub.cad==="daily"?"Daily":"Weekly"} briefing</h1><div class="seg right">${["daily","weekly"].map(c=>`<button class="${S.sub.cad===c?"on":""}" onclick="S.sub.cad='${c}';save();render()">${c[0].toUpperCase()+c.slice(1)}</button>`).join("")}</div></div>
 <p class="small">${dateStr()} · for ${myNiches().map(id=>nicheById(id).n).join(", ")} · ${myCities().map(id=>cityById(id).n).join(", ")}</p>${b.html}
 <div class="flex"><button class="btn" onclick="copyText(briefing(S.sub.cad).text)">Copy briefing</button><button class="btn ghost" onclick="askAI(aiBriefPrompt(),'aiOut')">✦ Deepen with live AI</button></div><div id="aiOut" class="ai-out" style="display:none"></div></div>
 <div class="card"><h2>My subscriptions</h2><p class="small">Choose up to 3 niches and 3 cities. Your briefing rotates through them.</p>
 <h3>Niches</h3><div class="flex">${NICHES.map(n=>`<button class="btn sm ${S.sub.niches.includes(n.id)?"":"ghost"}" onclick="toggleSub('niches','${n.id}')">${n.n}</button>`).join("")}</div>
 <h3 style="margin-top:14px">Cities</h3><div class="flex">${CITIES.map(c=>`<button class="btn sm ${S.sub.cities.includes(c.id)?"":"ghost"}" onclick="toggleSub('cities','${c.id}')">${c.n}</button>`).join("")}</div>
 <h3 style="margin-top:14px">Insight feeds for your niches</h3><table><tr><th>Source</th><th>What it tracks</th></tr>${FEEDS.filter(f=>f.for.includes("all")||myNiches().some(id=>f.for.includes(id))).map(f=>`<tr><td><a href="${f.u}" target="_blank" rel="noopener">${f.n}</a></td><td class="small">${f.w}</td></tr>`).join("")}</table>
 <div class="note">Email and WhatsApp delivery of briefings comes with Deo Cloud accounts. For now, open DeoCoach each morning or copy the briefing.</div></div>`;};

/* ---------- City Minds ---------- */
V.minds=()=>{const fc=S.mindC||"";const countries=[...new Set(CITIES.map(c=>c.c))].sort();const L=CITIES.filter(c=>!fc||c.c===fc);const n=S.sonar.niche!=="all"?S.sonar.niche:null;
 return `<div class="card"><h1>City Minds & Culture</h1><p class="lead">What will run the coaching landscape city by city — and how to work with its culture: the issues, the one factor most on people's minds, how to speak to it, and how to prepare now.</p>
 <div style="max-width:320px"><label>Country</label><select onchange="S.mindC=this.value;save();render()"><option value="">All countries</option>${countries.map(c=>`<option ${fc===c?"selected":""}>${c}</option>`).join("")}</select></div></div>
 <div class="grid g2">${L.map(c=>`<div class="citycard"><div class="flex"><h3 style="margin:0">${c.n}</h3><span class="small">${c.c}</span><span class="pill right">Y5 ${cityScore(c,"all",5)}</span></div><p class="small">${c.hub}</p>
 <div class="mind"><b>On their minds:</b> ${c.mind}</div><p class="small"><b style="color:var(--ink)">Issues:</b> ${c.issues.join(" · ")}</p><p class="small"><b style="color:var(--ink)">Say:</b> ${c.say}</p><p class="small"><b style="color:var(--ink)">Prepare now:</b> ${c.prep}</p>
 <p class="small"><b style="color:var(--ink)">Culture:</b> ${esc((CULTURE[c.c]||{}).trust||"")} <i>Avoid:</i> ${esc((CULTURE[c.c]||{}).avoid||"")}</p>
 <p class="small"><b style="color:var(--ink)">Strong niches:</b> ${c.top.map(id=>nicheById(id).n).join(", ")}</p>
 <div class="flex"><button class="btn sm ghost" onclick="S.sonar.city='${c.id}';S.sonar.fly=true;save();location.hash='atlas'">View on Horizon Atlas</button><button class="btn sm ${S.sub.cities.includes(c.id)?"":"ghost"}" onclick="toggleSub('cities','${c.id}')">${S.sub.cities.includes(c.id)?"✓ In briefing":"+ Briefing"}</button></div></div>`).join("")}</div>`;};

/* ---------- Evidence ---------- */
V.evidence=()=>`<div class="card"><h1>Evidence & insight feeds</h1><p class="lead">Verified numbers you can quote, with their sources — and the official data feeds to follow for your niche.</p>
 ${EVIDENCE.map(e=>`<div class="mind"><b>${e.s}</b><br><span class="small">Source: <a href="${e.url}" target="_blank" rel="noopener">${e.src}</a></span></div>`).join("")}
 <h2 style="margin-top:18px">Insight feeds</h2><table><tr><th>Source</th><th>Tracks</th><th>Best for</th></tr>${FEEDS.map(f=>`<tr><td><a href="${f.u}" target="_blank" rel="noopener">${f.n}</a></td><td class="small">${f.w}</td><td class="small">${f.for.map(x=>x==="all"?"Everyone":nicheById(x).n).join(", ")}</td></tr>`).join("")}</table>
 <div class="note">Always check the latest release before quoting a figure in public.</div></div>`;

/* ---------- Me ---------- */
V.profile=()=>{const p=S.profile;
 return `<div class="card"><h1>My profile</h1><p class="lead">Tell DeoCoach who you are. Everything stays on this device.</p></div>${proCard()}<div class="card"><div class="grid g2">
 <div><label>Full name</label><input value="${esc(p.name)}" oninput="setv('profile.name',this.value)"></div>
 <div><label>My city (for the Atlas and briefings)</label><select onchange="setv('profile.cityId',this.value,true)"><option value="">— choose —</option>${CITIES.map(c=>`<option value="${c.id}" ${p.cityId===c.id?"selected":""}>${c.n}, ${c.c}</option>`).join("")}<option value="other" ${p.cityId==="other"?"selected":""}>${S.ed==="africa"?"Other / outside Africa":"Other city"}</option></select></div>
 <div><label>I am a</label><select onchange="setv('profile.role',this.value,true)">${["Coach","Leader","Mentor","Trainer / facilitator","Organisation"].map(o=>`<option ${(p.role||"Coach")===o?"selected":""}>${o}</option>`).join("")}</select></div>
 <div><label>Main currency</label><select onchange="setv('profile.cur',this.value,true)">${Object.keys(CUR).map(k=>`<option ${p.cur===k?"selected":""} value="${k}">${CUR[k]} ${k}</option>`).join("")}</select></div>
 <div><label>Years coaching</label><input type="number" min="0" value="${esc(p.years)}" oninput="setv('profile.years',this.value)"></div>
 <div><label>Credential</label><select onchange="setv('profile.cred',this.value)">${["None yet","In training","Certified / accredited","Advanced / master level"].map(o=>`<option ${p.cred===o?"selected":""}>${o}</option>`).join("")}</select></div>
 <div><label>My niche right now</label><select onchange="setv('profile.niche',this.value,true)"><option value="">— choose —</option><option value="general" ${p.niche==="general"?"selected":""}>General — I coach everyone</option>${NICHES.map(n=>`<option value="${n.id}" ${p.niche===n.id?"selected":""}>${n.n}</option>`).join("")}</select></div>
 </div><div class="flex" style="margin-top:16px"><a class="btn" href="#signature">Next: Coach Signature →</a></div></div>`;};
V.signature=()=>{const sg=signature();
 return `<div class="card"><h1>Coach Signature</h1><p class="lead">12 statements, 2 minutes. 1 = not me, 5 = very me.</p>
 ${SIG_ITEMS.map((it,i)=>`<div class="q"><div style="flex:1;min-width:220px">${i+1}. ${it[0]}</div><div class="likert">${[1,2,3,4,5].map(v=>`<button class="${S.sig[i]===v?"on":""}" onclick="S.sig[${i}]=${v};save();render()">${v}</button>`).join("")}</div></div>`).join("")}</div>
 ${sg?`<div class="card"><h2>You are ${STYLES[sg.p].name}</h2><p>with a strong second note of <b>${STYLES[sg.s].name}</b>.</p><div class="grid g3"><div><h3>Best-fit clients</h3><p class="small">${STYLES[sg.p].fit}</p></div><div><h3>What sells for you</h3><p class="small">${STYLES[sg.p].sell}</p></div><div><h3>Watch out</h3><p class="small">${STYLES[sg.p].blind}</p></div></div>
 ${Object.entries(sg.sc).map(([k,v])=>`<div class="flex small" style="margin-top:6px"><span style="width:150px">${STYLES[k].name}</span><div class="bar" style="flex:1"><i style="width:${v/15*100}%"></i></div><span>${v}/15</span></div>`).join("")}
 <div class="flex" style="margin-top:14px"><a class="btn" href="#ladder">Next: Competency Ladder →</a></div></div>`:`<p class="small">Answer all 12 to see your signature (${Object.keys(S.sig).length}/12).</p>`}`;};
V.ladder=()=>{const set=COMPS.filter(c=>S.comp[c[0]]);const gaps=[...set].sort((a,b)=>S.comp[a[0]]-S.comp[b[0]]).slice(0,3);const str=[...set].sort((a,b)=>S.comp[b[0]]-S.comp[a[0]]).slice(0,3);
 return `<div class="card"><h1>Competency Ladder</h1><p class="lead">L1 Aware · L2 Practising · L3 Competent · L4 Advanced · L5 Master.</p>
 ${COMPS.map(c=>`<div class="q"><div style="flex:1;min-width:200px"><b>${c[1]}</b><div class="small">${LEVELS[S.comp[c[0]]||0]}</div></div><div class="likert">${[1,2,3,4,5].map(v=>`<button class="${S.comp[c[0]]===v?"on":""}" onclick="S.comp['${c[0]}']=${v};save();render()">L${v}</button>`).join("")}</div></div>`).join("")}</div>
 ${set.length>=5?`<div class="grid g2"><div class="card"><h2>Strengths to sell</h2>${str.map(c=>`<p><b>${c[1]}</b> — ${LEVELS[S.comp[c[0]]]}</p>`).join("")}</div><div class="card"><h2>Next 3 to develop</h2>${gaps.map(c=>`<p><b>${c[1]}</b> — ${LEVELS[S.comp[c[0]]]} → L${Math.min(5,S.comp[c[0]]+1)}</p>`).join("")}<p class="small">One level up per competency every 3–6 months.</p></div></div>`:""}`;};

/* ---------- Niche Radar: 10-year panorama ---------- */
V.niches=()=>{const t=S.yr;const L=nicheScores(t);const top6=L.slice(0,6);
 const W=760,H=260,px=x=>40+(x-1)*(W-60)/9,py=v=>H-28-(v/10)*(H-50);const cols=["var(--gold2)","var(--teal)","var(--blue)","var(--amber)","var(--green)","var(--pink)"];
 const svg=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">${[0,2.5,5,7.5,10].map(v=>`<line x1="40" x2="${W-20}" y1="${py(v)}" y2="${py(v)}" stroke="rgba(var(--tint),.08)"/><text x="30" y="${py(v)+4}" fill="var(--mute)" font-size="10" text-anchor="end">${v}</text>`).join("")}
  ${[1,2,3,4,5,6,7,8,9,10].map(x=>`<text x="${px(x)}" y="${H-8}" fill="${x===t?"var(--gold2)":"var(--mute)"}" font-size="11" text-anchor="middle" font-weight="${x===t?700:400}">Y${x}</text>`).join("")}
  <line x1="${px(t)}" x2="${px(t)}" y1="12" y2="${H-26}" stroke="var(--gold)" stroke-dasharray="4 4"/>
  ${top6.map((n,i)=>`<polyline fill="none" stroke="${cols[i]}" stroke-width="2.5" points="${[1,2,3,4,5,6,7,8,9,10].map(x=>px(x)+","+py(curve(n,x))).join(" ")}"/><circle cx="${px(t)}" cy="${py(curve(n,t))}" r="4.5" fill="${cols[i]}"/>`).join("")}</svg>`;
 const heat=v=>`rgba(var(--acc),${(0.08+v/10*0.8).toFixed(2)})`;
 return `<div class="card"><h1>Niche Radar · 10-year panorama</h1><p class="lead">Which coaching niches pay, who pays, and how that changes from Year 1 to Year 10. Fit blends the market outlook with your signature and competencies.</p>
 <div class="yearbar"><span class="yv">Year ${t}</span><input type="range" min="1" max="10" value="${t}" oninput="S.yr=+this.value;save();render()" style="flex:1"></div>
 <div class="flex" style="margin-top:6px">${top6.map((n,i)=>`<span class="small"><span style="color:${cols[i]}">●</span> ${n.n}</span>`).join("")}</div>${svg}
 <div class="note">Year 1–2 is mostly paid by individuals, Years 3–5 increasingly by institutions, Years 6–10 by systems: national programmes, platforms and multi-country contracts. Outlooks are DeoCoach planning estimates.</div></div>
 <div class="card"><h2>Panorama heat map — market outlook by year</h2><div style="overflow-x:auto"><table class="heat"><tr><th style="min-width:220px">Niche</th>${[1,2,3,4,5,6,7,8,9,10].map(x=>`<th style="text-align:center;${x===t?"color:#fff":""}">Y${x}</th>`).join("")}</tr>
 ${NICHES.map(n=>`<tr><td style="padding:4px 6px;font-size:.8rem;text-align:left">${n.n}</td>${[1,2,3,4,5,6,7,8,9,10].map(x=>{const v=curve(n,x);return `<td style="background:${heat(v)};${x===t?"outline:2px solid var(--gold2)":""}">${v.toFixed(0)}</td>`}).join("")}</tr>`).join("")}</table></div></div>
 <div class="card"><h2>Your fit · Year ${t}</h2><table><tr><th>#</th><th>Niche</th><th>Fit</th><th>Who pays</th><th>Fee</th><th></th></tr>
 ${L.map((n,i)=>`<tr><td>${i+1}</td><td><b>${n.n}</b></td><td style="width:120px"><div class="bar"><i style="width:${n.score}%"></i></div><span class="small">${n.score}/100</span></td><td class="small">${n.payer}</td><td>${"●".repeat(n.fee)}${"○".repeat(3-n.fee)}</td><td><button class="btn sm ${S.profile.niche===n.id?"":"ghost"}" onclick="setv('profile.niche','${n.id}',true)">${S.profile.niche===n.id?"My niche":"Choose"}</button></td></tr>`).join("")}</table></div>`;};

/* ---------- Capability to Income ---------- */
V.income=()=>{const o=S.offer,c=S.profile.cur,R=num(o.rate);const n=nicheById(o.niche||S.profile.niche)||NICHES[0];const comp=COMPS.find(x=>x[0]===o.comp);const by=deals();
 const offers=R?[["Entry","Clarity Session (single session)",R,"The person being coached","Lowers the risk of a first yes"],["Core","6-week Signature Programme",R*6*.9,"Individuals, parents, small business owners","Your main income engine"],["Group","Cohort of 8–12 (per seat)",R*2,"Groups, associations, churches","~10 seats = "+money(R*20,c)],["Corporate",n.n+" programme for a team",R*24,n.payer,"Invoice the budget holder, not the participant"],["Premium","3-month 1:1 retainer",R*12*1.2,"Senior leaders, founders","Needs proof in your Proof Vault"]]:[];
 return `<div class="card"><h1>Capability to Income</h1><div class="ladder">${["Capability","Proof","Offer","Buyer","Channel","Price","Income","Repeat"].map(x=>`<span>${x}</span>`).join("")}</div>
 <h2 style="margin-top:14px">1 · Offer Forge</h2><div class="grid g3"><div><label>Lead competency</label><select onchange="setv('offer.comp',this.value,true)"><option value="">— choose —</option>${COMPS.map(x=>`<option value="${x[0]}" ${o.comp===x[0]?"selected":""}>${x[1]}</option>`).join("")}</select></div>
 <div><label>Niche</label><select onchange="setv('offer.niche',this.value,true)">${NICHES.map(x=>`<option value="${x.id}" ${n.id===x.id?"selected":""}>${x.n}</option>`).join("")}</select></div>
 <div><label>My fee per session (${CUR[c]})</label><input type="number" value="${esc(o.rate)}" onchange="setv('offer.rate',this.value,true)"></div></div>
 ${R?`<table style="margin-top:14px"><tr><th>Tier</th><th>Offer</th><th>Price</th><th>Who pays</th><th>Note</th></tr>${offers.map(x=>`<tr><td><span class="pill">${x[0]}</span></td><td><b>${esc(x[1])}</b>${comp?`<div class="small">Built on your ${comp[1].toLowerCase()}</div>`:""}</td><td><b>${money(x[2],c)}</b></td><td class="small">${esc(x[3])}</td><td class="small">${x[4]}</td></tr>`).join("")}</table><div class="note">Core = 6 sessions less 10% · group seat = 2× session · corporate = 24× session · premium = 12 sessions + 20%. Adjust to your market.</div>`:'<p class="small">Enter your fee to generate your offers and price ladder.</p>'}</div>
 <div class="card"><h2>2 · Proof Vault</h2><textarea rows="4" placeholder="e.g. Ada — promoted to manager in 4 months; confidence 4→8/10" oninput="setv('proof',this.value)">${esc(S.proof)}</textarea></div>
 <div class="card"><h2>3 · Income Tracker</h2><div class="grid g4">${Object.keys(by).length?Object.entries(by).map(([k,m])=>`<div class="stat"><div class="k">${k}</div><div class="v">${money(m.paid,k)}</div><div class="s">Pipeline ${money(m.pipe,k)}<br>Forecast ${money(m.fc,k)}</div></div>`).join(""):'<p class="small">No deals yet.</p>'}</div>
 <table style="margin-top:12px"><tr><th>Client / buyer</th><th>Offer</th><th>Payer</th><th>Amount</th><th>Cur.</th><th>Stage</th><th></th></tr>
 ${S.deals.map((d,i)=>`<tr><td><input value="${esc(d.cl)}" onchange="S.deals[${i}].cl=this.value;save()"></td><td><input value="${esc(d.of)}" onchange="S.deals[${i}].of=this.value;save()"></td><td><select onchange="S.deals[${i}].py=this.value;save()">${["Individual","Parent","HR / L&D","CEO / founder","Church","Government","Donor / foundation","Diaspora"].map(x=>`<option ${d.py===x?"selected":""}>${x}</option>`).join("")}</select></td><td><input type="number" value="${esc(d.amt)}" onchange="S.deals[${i}].amt=this.value;save();render()"></td><td><select onchange="S.deals[${i}].cur=this.value;save();render()">${Object.keys(CUR).map(k=>`<option ${(d.cur||c)===k?"selected":""}>${k}</option>`).join("")}</select></td><td><select onchange="S.deals[${i}].st=this.value;save();render()">${DSTAGES.map(x=>`<option ${d.st===x?"selected":""}>${x}</option>`).join("")}</select></td><td><button class="btn sm ghost" onclick="S.deals.splice(${i},1);save();render()">✕</button></td></tr>`).join("")}</table>
 <button class="btn sm" style="margin-top:10px" onclick="S.deals.push({cl:'',of:'',py:'Individual',amt:'',cur:S.profile.cur,st:'Lead'});save();render()">+ Add a deal</button><p class="small">Forecast weights: Lead 10% · Proposal 30% · Agreed 60% · Invoiced 85% · Paid 100%.</p></div>`;};

/* ---------- Brand ---------- */
V.brand=()=>{const rows=channels(),per=S.per;const q=s=>s.replace(/'/g,"\\'");
 return `<div class="card"><h1>Brand Compass</h1><p class="lead">Where you are in your coaching career, where you are and aren't selling, and how the market sees you.</p>
 <h2>1 · Coaching career stage</h2><div class="grid g4">${CAREER.map((c,i)=>`<div class="stagecard ${S.stage===i?"on":""}" onclick="S.stage=${i};save();render()"><b>${i+1}. ${c[0]}</b><div class="small">${c[1]}</div></div>`).join("")}</div>
 ${S.stage!==null?`<div class="note"><b>Sell at this stage:</b> ${CAREER[S.stage][2]}<br><b>Main buyer:</b> ${CAREER[S.stage][3]}${S.stage<7?`<br><b>To reach ${CAREER[S.stage+1][0]}:</b> start testing "${CAREER[S.stage+1][2]}".`:""}</div>`:""}</div>
 <div class="card"><h2>2 · Selling heat map</h2><p class="small">Per channel, last 3 months: monthly reach, total enquiries, paying clients.</p><table><tr><th>Channel</th><th>Reach / month</th><th>Enquiries</th><th>Clients</th><th>Status</th></tr>
 ${rows.map(x=>`<tr><td><b>${x.c}</b></td>${["r","e","k"].map(k=>`<td><input type="number" min="0" value="${esc((S.ch[x.c]||{})[k])}" onchange="S.ch['${q(x.c)}']=Object.assign(S.ch['${q(x.c)}']||{},{${k}:this.value});save();render()"></td>`).join("")}<td><span class="tile st-${x.s}" style="display:inline-block;padding:3px 8px">${x.s}</span></td></tr>`).join("")}</table>
 <div class="grid g4" style="margin-top:14px">${["selling","leaking","hidden","absent"].map(s=>{const L=rows.filter(r=>r.s===s);return `<div class="tile st-${s}"><b>${{selling:"🟢 Selling",leaking:"🟠 Leaking",hidden:"🔵 Hidden gems",absent:"⚪ Absent"}[s]} (${L.length})</b>${L.map(r=>esc(r.c)).join(", ")||"—"}</div>`}).join("")}</div>
 ${rows.filter(r=>r.s==="hidden"||r.s==="leaking").map(r=>`<p class="small">• <b>${r.c}:</b> ${r.t}</p>`).join("")}</div>
 <div class="card"><h2>3 · 360° perception check</h2><table><tr><th>Attribute</th><th>Me (1–10)</th><th>Others (avg)</th><th>Gap</th></tr>
 ${PERCEP.map((a,i)=>{const s=num(per.self[i]),o=num(per.oth[i]);const g=s&&o?o-s:null;return `<tr><td>${a}</td><td><input type="number" min="1" max="10" value="${esc(per.self[i])}" onchange="S.per.self[${i}]=this.value;save();render()"></td><td><input type="number" min="1" max="10" value="${esc(per.oth[i])}" onchange="S.per.oth[${i}]=this.value;save();render()"></td><td style="color:${g===null?"inherit":g<-1?"var(--red)":g>1?"var(--green)":"inherit"}"><b>${g===null?"—":(g>0?"+":"")+g}</b></td></tr>`}).join("")}</table>
 <button class="btn sm ghost" style="margin-top:10px" onclick="copyText(perMsg())">Copy a feedback request for clients</button></div>`;};
function perMsg(){return `Hello! I'm improving my coaching practice and would value 2 minutes of honest feedback. On a scale of 1–10, how would you rate me on:\n${PERCEP.map((a,i)=>`${i+1}. ${a}`).join("\n")}\nAnd in one sentence: what do you think I'm best known for? Thank you — ${S.profile.name||""}`;}
V.funnel=()=>{const f=funnel();const max=f?Math.max(...f.v,1):1;
 return `<div class="card"><h1>Brand Funnel</h1><p class="lead">Enter last month's numbers. DeoCoach finds where people drop off and which brand level you're stuck at.</p>
 <div class="funnel">${FUN.map((s,i)=>{const leak=f&&f.leak===i;const v=f?f.v[i]:num(S.fun[s[0]]);return `<div class="row ${leak?"leak":""}"><span class="dot">${i+1}</span><div><b>${s[1]}</b><div class="small">${s[2]}</div></div><div class="fbw"><div class="fb" style="width:${f?Math.max(1,Math.sqrt(v/max)*100):0}%"></div></div><input type="number" min="0" value="${esc(S.fun[s[0]])}" onchange="setv('fun.${s[0]}',this.value,true)"><div class="hl small">${f&&i>0?Math.round(f.ratio[i]*100)+"%<br>"+(f.h[i]>=.7?"✓ healthy":"⚠ weak"):""}</div></div>`}).join("")}</div>
 <p class="small">Retention and advocacy are measured against clients who got results. Reference ratios are DeoCoach starting defaults; peer benchmarks by niche and country come as more coaches join.</p></div>
 ${f?`<div class="card"><h2>Your brand journey</h2><div class="ladder">${BRAND.map((b,i)=>`<span class="${i<f.lvl?"done":i===f.lvl?"here":""}">${b}</span>`).join("")}</div>
 ${f.leak!==null?`<div class="note warn"><b>You're at ${BRAND[f.lvl]} and stuck before ${BRAND[f.lvl+1]}.</b> Biggest leak: <b>Stage ${f.leak+1}: ${FUN[f.leak][1]}</b>${f.leak>0?` — only ${Math.round(f.ratio[f.leak]*100)}% get through.`:" — not enough people see you yet."}<br><b>Fix:</b> ${FUN[f.leak][4]}.</div>`:'<div class="note">Every stage is healthy. Protect retention and advocacy, and raise prices.</div>'}
 <table><tr><th>To move from…</th><th>Fix these stages</th><th>Status</th></tr>${BRAND_REQ.map((g,i)=>`<tr><td>${BRAND[i]} → ${BRAND[i+1]}</td><td>${g.map(x=>FUN[x][1]).join(", ")}</td><td>${g.every(x=>f.h[x]>=.7)?"✓":"⚠"}</td></tr>`).join("")}</table></div>`:""}`;};

/* ---------- Stuck & growth plan (90 days → 5 years) ---------- */
let planCopy="";
V.stuck=()=>{const T=traps();const P=plan(S.pm);const c=P.cur;
 planCopy=`DeoCoach ${planLabel(S.pm)} plan — ${S.profile.name||""}\n`+P.Q.map(q=>`Q${q.q} (months ${q.from}–${q.to}) · ${q.th}${q.t?" · target "+money(q.t,c):""}\n`+q.a.map(a=>"• "+a).join("\n")).join("\n\n");
 return `<div class="card"><h1>Stuck & growth plan</h1><p class="lead">DeoCoach checks your data against 8 traps, then builds a quarter-by-quarter plan for the horizon you choose.</p>
 <div class="grid g4"><div><label>Coaching hours / month (all)</label><input type="number" value="${esc(S.hrs.total)}" onchange="setv('hrs.total',this.value,true)"></div><div><label>Paid hours / month</label><input type="number" value="${esc(S.hrs.paid)}" onchange="setv('hrs.paid',this.value,true)"></div>
 <div><label>12-month income target (${CUR[c]})</label><input type="number" value="${esc(S.plan.target)}" onchange="setv('plan.target',this.value,true)"></div><div><label>Growth per year %</label><input type="number" value="${esc(S.plan.growth??20)}" onchange="setv('plan.growth',this.value,true)"></div></div></div>
 <div class="card"><div class="flex"><h2 style="margin:0">My ${planLabel(S.pm)} plan</h2><button class="btn sm right" onclick="copyText(planCopy)">Copy plan</button></div>
 <div class="yearbar" style="margin:12px 0"><span class="yv" style="min-width:120px">${planLabel(S.pm)}</span><input type="range" min="0" max="${PLAN_OPTS.length-1}" value="${PLAN_OPTS.indexOf(S.pm)}" oninput="S.pm=PLAN_OPTS[+this.value];save();render()" style="flex:1"></div>
 <div class="flex small" style="justify-content:space-between"><span>90 days</span><span>1 year</span><span>2 years</span><span>3 years</span><span>4 years</span><span>5 years</span></div>
 <div class="timeline" style="margin-top:12px">${P.Q.map(q=>`<div class="qcard"><div class="qh"><span class="theme">Q${q.q} · ${q.th}</span><span class="pill teal">Year ${q.yr}</span></div><div class="small">Months ${q.from}–${q.to} · Stage target: ${CAREER[q.st][0]}${q.t?` · Target ${money(q.t,c)}`:""}</div><ul>${q.a.map(a=>`<li>${esc(a)}</li>`).join("")}</ul></div>`).join("")}</div>
 <p class="small">Each year cycles Focus → Sell → Proof → Scale. Every fourth quarter checks the Niche Radar for what's rising next.</p></div>
 <div class="card"><h2>Diagnosis</h2>${T.map(t=>`<div class="trap ${t.hit?"hit":""}"><div class="flex"><b>${t.hit?"⚠":"✓"} ${t.n}</b><span class="pill right">${t.hit?"Detected":"Clear"}</span></div>${t.hit?`<p class="small">${t.why}</p><p><b>Way out:</b> ${t.fix}</p>`:""}</div>`).join("")}</div>`;};

/* ---------- Grow ---------- */
V.toolkit=()=>{const apps=[["DeoLens — The Atlas of Self","Self-awareness, strengths and identity for any client","https://deolenss.vercel.app",["all"]],["DeoCareers","Career discovery, development and opportunity search","https://deocareers-app.vercel.app",["career","global","youth","women"]],["DeoEngineers","Career intelligence for young African engineers","https://deoengineers-app.vercel.app",["career","youth","ai","green"]],["DeoWealth — Wealth Mind Suite","Money psychology and financial behaviour","https://deowealthss.vercel.app",["money","sme","family"]],["DeoProphetics","Prophetic archetype assessment for faith and ministry coaching","https://deoprophetss.vercel.app",["faith"]],["DeoSales — The Selling Mind","Sales psychology and performance (coming soon)","",["sales","sme"]],["DeoCreative","Creativity profile for creative professionals (coming soon)","",["creative"]]];const nn=S.profile.niche;
 return `<div class="card"><h1>Client Toolkit</h1><p class="lead">Add data to your coaching with Deo assessments. ★ marks tools for your niche.</p><div class="grid g2">${apps.map(a=>`<div class="citycard"><div class="flex"><h3 style="margin:0">${a[0]}</h3>${a[3].includes("all")||a[3].includes(nn)?'<span class="pill right">★ Your niche</span>':""}</div><p class="small">${a[1]}</p>${a[2]?`<a href="${a[2]}" target="_blank" rel="noopener">Open ${a[2].replace("https://","")}</a>`:'<span class="small">Coming soon</span>'}</div>`).join("")}</div>
 <div class="note">Get your client's consent first, and explain that results support development — they are not a diagnosis or a selection decision.</div></div>`;};
V.opps=()=>{const ctry=S.oppC||(cityById(S.profile.cityId)||{}).c||"Nigeria";const countries=Object.keys(CULTURE).sort();const P=[...(PORTALS[ctry]||[]),...PORTALS._multi];const al=S.alerts||{};
 const ev=[["23 Nov 2026","Africa Coaching Week 2026 — opening press conference & media parley","Alliance Française, Ikoyi, Lagos · 4pm"],["29 Nov 2026","Africa Coaching Week 2026 — closing gala","Radisson Blu VI, Lagos · 5pm · live-stream tickets available"]];
 return `<div class="card"><h1>Opportunity Desk</h1><p class="lead">${esc(PRO().act[0].toUpperCase()+PRO().act.slice(1))} jobs, calls for speakers, government bids, invitations to tender, expressions of interest, consultancies and projects — gathered for you by country and keyword.</p>
 <div class="grid g3"><div><label>Country</label><select onchange="S.oppC=this.value;save();render()">${countries.map(c=>`<option ${c===ctry?"selected":""}>${c}</option>`).join("")}</select></div>
 <div><label>Keywords</label><input id="okw" value="${esc(S.oppKw||({coach:"coaching leadership training",trainer:"training workshop capacity building",facilitator:"facilitation workshop strategy retreat",mentor:"mentoring programme accelerator",speaker:"keynote speaker conference",consultant:"consultancy advisory leadership"})[PRO().k])}" onchange="S.oppKw=this.value;save()"></div>
 <div style="align-self:end"><button class="btn" onclick="loadOpps()">⟳ Search live opportunities</button></div></div>
 <div id="oppList" style="margin-top:14px"><p class="small">Press search to pull the latest notices.</p></div></div>
 <div class="grid g2"><div class="card"><h2>Daily opportunity alerts</h2><p class="small">Get new tenders, EOIs and jobs that match you, by email.</p>
 <label>Email</label><input id="aem" type="email" value="${esc(al.email||"")}"><div class="grid g2" style="margin-top:8px"><div><label>Countries (up to 5)</label><select id="acs" multiple size="5">${countries.map(c=>`<option ${(al.countries||[ctry]).includes(c)?"selected":""}>${c}</option>`).join("")}</select></div>
 <div><label>Keywords</label><input id="akw" value="${esc(al.kw||"coaching leadership training")}"><label style="margin-top:8px">How often</label><select id="acd"><option value="daily" ${al.cadence!=="weekly"?"selected":""}>Daily</option><option value="weekly" ${al.cadence==="weekly"?"selected":""}>Weekly (Mondays)</option></select></div></div>
 <label class="flex small" style="text-transform:none;margin-top:10px"><input type="checkbox" id="aok"> I agree to receive opportunity emails from DeoCoach and can unsubscribe at any time.</label>
 <button class="btn" style="margin-top:8px" onclick="subscribeAlerts()">Switch on alerts</button><div id="amsg" class="small" style="margin-top:8px"></div></div>
 <div class="card"><h2>Where to look in ${esc(ctry)}</h2><table><tr><th>Portal</th><th>What you'll find</th></tr>${P.map(x=>`<tr><td><a href="${x[1]}" target="_blank" rel="noopener">${x[0]}</a></td><td class="small">${x[2]}</td></tr>`).join("")}</table>
 <h2 style="margin-top:16px">Coming up</h2>${ev.map(e=>`<div class="trap"><b>${e[0]}</b> — ${e[1]}<div class="small">${e[2]}</div></div>`).join("")}</div></div>`;};
async function loadOpps(){const el=document.getElementById("oppList");const c=S.oppC||(cityById(S.profile.cityId)||{}).c||"Nigeria";const kw=document.getElementById("okw").value;S.oppKw=kw;save();el.innerHTML='<div class="engine-steps"><span>Searching World Bank, ReliefWeb and job sources…</span></div>';
 try{const r=await fetch(`/api/opps?country=${encodeURIComponent(c)}&kw=${encodeURIComponent(kw)}`);const j=await r.json();if(!r.ok)throw 0;
  el.innerHTML=(j.items||[]).length?`<table><tr><th>Opportunity</th><th>Type</th><th>Deadline</th><th>Source</th></tr>${j.items.map(x=>`<tr><td><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title)}</a><div class="small">${esc(x.org)} · ${esc(x.country)}</div></td><td><span class="pill">${esc(x.type)}</span></td><td class="small">${esc(String(x.deadline||"").slice(0,10))||"—"}</td><td class="small">${esc(x.src)}</td></tr>`).join("")}</table><p class="small">Always confirm details and deadlines on the original notice.</p>`:'<p class="small">No matching notices right now. Try broader keywords, or check the portals on this page.</p>';}
 catch(e){el.innerHTML='<div class="note">Live opportunity search switches on when DeoCoach runs on its own site. Meanwhile, use the portals listed on this page — they are the official sources.</div>';}}
async function subscribeAlerts(){const em=document.getElementById("aem").value.trim(),cs=[...document.getElementById("acs").selectedOptions].map(o=>o.value).slice(0,5),kw=document.getElementById("akw").value,cad=document.getElementById("acd").value,ok=document.getElementById("aok").checked,m=document.getElementById("amsg");
 if(!ok){m.textContent="Please tick the consent box.";return;}S.alerts={email:em,countries:cs,kw,cadence:cad};save();
 try{const r=await fetch("/api/subscribe",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:em,countries:cs,kw,cadence:cad,consent:true})});if(!r.ok)throw 0;S.subbed=em;save();if(typeof track==="function")track("sub");m.textContent="✓ Alerts switched on. Look out for your first email.";}
 catch(e){m.textContent="Couldn't switch on email just now — please try again in a minute.";}}
V.mentor=()=>`<div class="card"><div class="flex"><h1 style="margin:0">Supervisor Desk</h1><span class="right">${dmBtn({chair:"deomentor",council:"client-case",frame:"30d",q:"Supervision: help me reflect on a coaching situation (no client names)",summary:coachSummary()},"Open a DeoMentor council")}</span></div><p class="lead">Reflective practice for coaches. Ask the live AI supervisor, or use the prompts after a difficult session.</p>
 <textarea id="supQ" rows="3" placeholder="Describe a coaching situation (no client names)…"></textarea><div class="flex" style="margin-top:8px"><button class="btn" onclick="askAI('Act as a coaching supervisor for an African coach. Help me reflect; do not diagnose; flag if referral to a health professional may be needed. Situation: '+document.getElementById('supQ').value,'supOut')">✦ Ask the Supervisor</button></div><div id="supOut" class="ai-out" style="display:none"></div>
 <h2 style="margin-top:16px">Reflection prompts</h2><ol>${["What did the client actually want today — and did I serve that or my own agenda?","Where did I talk when I should have asked?","What pattern am I seeing across this client's sessions?","What am I avoiding saying to this client, and why?","What evidence will show this coaching worked?"].map(x=>`<li>${x}</li>`).join("")}</ol>
 <textarea rows="4" placeholder="My reflection (stays on this device)" oninput="setv('refl',this.value)">${esc(S.refl)}</textarea></div>
 <div class="card"><h2>Referral boundary — "refer, don't coach"</h2><p>Coaching is not therapy. Pause coaching and refer the client to a qualified health professional when you notice:</p><ul><li>Risk of harm to themselves or others — seek urgent help immediately</li><li>Signs of a mental-health condition (persistent low mood, anxiety that stops daily life, confused thinking)</li><li>Unresolved trauma coming up repeatedly</li><li>Alcohol or drug dependence</li><li>Problems getting worse despite coaching</li></ul><div class="note">Agree your referral process in your coaching contract before you need it.</div></div>`;
