// ===== Deployment engine, field intelligence (learning) and the City Analyst =====
// Field notes a coach logs about a city feed back into that city's scores, briefings and plans.
function notesFor(cid){return (S.notes&&S.notes[cid])||[];}
function learnBonus(c,nid){const N=notesFor(c.id);let b=0;N.forEach(n=>{if(nid!=="all"&&n.niche&&n.niche!==nid)return;b+=(n.kind==="opportunity"?1.4:n.kind==="trend"?1:n.kind==="issue"?.6:.3)*n.strength;});return Math.min(12,Math.round(b));}
function addNote(cid){const k=document.getElementById("nk").value,ni=document.getElementById("nn").value,tx=document.getElementById("nt").value.trim(),s=+document.getElementById("ns").value;
  if(tx.length<8){toast("Write a little more");return;}S.notes=S.notes||{};(S.notes[cid]=S.notes[cid]||[]).unshift({kind:k,niche:ni,note:tx,strength:s,d:new Date().toISOString().slice(0,10)});save();
  if(document.getElementById("nshare")&&document.getElementById("nshare").checked)fetch("/api/signals",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({city:cid,kind:k,niche:ni,note:tx,strength:s})}).catch(()=>{});
  toast("Learned — scores updated");render();}
function delNote(cid,i){S.notes[cid].splice(i,1);save();render();}
async function loadCommunity(cid){const el=document.getElementById("comm");if(!el)return;try{const r=await fetch("/api/signals?city="+cid);const j=await r.json();if(!r.ok)throw 0;
  el.innerHTML=(j.items||[]).length?j.items.map(x=>`<div class="note"><span class="pill">${esc(x.kind)}</span> ${esc(x.note)} <span class="small">· ${String(x.created_at).slice(0,10)}</span></div>`).join(""):'<p class="small">No shared notes for this city yet. Be the first.</p>';}
  catch(e){el.innerHTML='<p class="small">Shared field notes from other coaches appear here once DeoCoach runs on its own site.</p>';}}

// ---- the deployment engine ----
function deploy(c,yr){
  const fitMap=Object.fromEntries(nicheScores(yr).map(n=>[n.id,n.score]));
  const nich=NICHES.map(n=>({n,city:cityScore(c,n.id,yr),fit:fitMap[n.id],y10:cityScore(c,n.id,10)})).map(x=>({...x,total:Math.round(x.city*.6+x.fit*.4)})).sort((a,b)=>b.total-a.total).slice(0,3);
  const cu=CULTURE[c.c]||{};const R=num(S.offer.rate),cur=S.profile.cur;const lead=nich[0].n;
  const myCh=channels().filter(x=>x.s==="selling"||x.s==="hidden").map(x=>x.c);const chans=[...new Set([...(cu.ch||"WhatsApp, LinkedIn").split(",").map(s=>s.trim()),...myCh])].slice(0,5);
  const offers=[[`${lead.n} — clarity session`,R||null,"Individuals"],[`${lead.n} — 6-week cohort`,R?R*2*10:null,lead.payer.split(",")[0]],[`${nich[1].n.n} — organisational programme`,R?R*24:null,nich[1].n.payer.split(",")[0]]];
  const role=S.profile.role||"Coach";const lens=role==="Leader"?"your team and organisation":role==="Organisation"?"your organisation's coaches":"your practice";
  return{nich,cu,chans,offers,cur,lens,
   partners:[...new Set([c.prep.split(";")[0],"Professional associations and chambers of commerce","Faith and community networks",lead.payer.split(",")[0]])],
   msg:`${c.say}. For ${lead.n.toLowerCase()}, lead with "${c.mind.toLowerCase()}" and show one measurable result.`,
   plan:[["Days 1–30 · Listen & map",[`Meet 10 people in ${c.n} who buy or influence ${lead.n.toLowerCase()}.`,`Log what you hear in Field Intelligence (trend, culture, opportunity, issue).`,`Learn the local etiquette: ${cu.hier||"respect seniority and titles"}.`]],
         ["Days 31–60 · Offer & partner",[`Launch "${offers[0][0]}" in ${chans[0]||"your strongest channel"}.`,`Next partner move: ${c.prep.split(";")[1]?c.prep.split(";")[1].trim():"approach a local association"}.`,`Use this message: ${c.say}.`]],
         ["Days 61–90 · Deliver & prove",[`Run your first ${lead.n.toLowerCase()} cohort and measure results.`,`Turn two results into case studies for ${lead.payer.split(",")[0]}.`,`Check the Opportunity Desk for ${c.c} tenders and EOIs weekly.`]]]};
}
function deployView(c,yr){const D=deploy(c,yr);const steps=["Scanning city signals","Matching your signature and competencies","Reading culture and context","Deploying your plan"];
 return `<div class="card deploy"><div class="flex"><h2 style="margin:0">⚡ Deployment engine · ${c.n}</h2><span class="pill teal right">Year ${yr} · for ${esc(D.lens)}</span></div>
 <div class="engine-steps">${steps.map((s,i)=>`<span style="animation-delay:${i*.35}s">✓ ${s}</span>`).join("")}</div>
 <div class="grid g3 reveal" style="animation-delay:1.4s">${D.nich.map((x,i)=>`<div class="stat"><div class="k">Best bet #${i+1}</div><div class="v" style="font-size:1rem">${x.n.n}</div><div class="s">Match ${x.total}/100 · city ${x.city} · your fit ${x.fit} · Y10 ${x.y10}</div><div class="s">Who pays: ${x.n.payer}</div></div>`).join("")}</div>
 <div class="grid g2 reveal" style="animation-delay:1.7s;margin-top:14px"><div>
  <h3>Offers to deploy</h3>${D.offers.map(o=>`<p>• <b>${esc(o[0])}</b>${o[1]?` — ${money(o[1],D.cur)}`:""} <span class="small">(${esc(o[2])})</span></p>`).join("")}${S.offer.rate?"":'<p class="small">Set your session fee in Capability to Income to see prices.</p>'}
  <h3>Channels</h3><p>${D.chans.map(c=>`<span class="pill">${esc(c)}</span>`).join(" ")}</p>
  <h3>Partners to approach</h3><ul class="small">${D.partners.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>
 <div><h3>Your message</h3><div class="mind">${esc(D.msg)}</div>
  <h3>90-day city entry plan</h3>${D.plan.map(p=>`<div class="phase"><b>${p[0]}</b><ul class="small">${p[1].map(a=>`<li>${esc(a)}</li>`).join("")}</ul></div>`).join("")}</div></div>
 <div class="flex reveal" style="animation-delay:2s;margin-top:8px"><button class="btn sm" onclick="copyText(deployText('${c.id}',${yr}))">Copy deployment</button><button class="btn sm ghost" onclick="S.oppC='${c.c}';save();location.hash='opps'">Opportunities in ${c.c}</button><button class="btn sm ghost" onclick="document.getElementById('cq').focus()">Ask the City Analyst</button></div></div>`;}
function deployText(cid,yr){const c=cityById(cid),D=deploy(c,yr);return `DeoCoach deployment — ${c.n}, Year ${yr}\nBest bets: ${D.nich.map(x=>x.n.n).join("; ")}\nChannels: ${D.chans.join(", ")}\nMessage: ${D.msg}\n`+D.plan.map(p=>p[0]+"\n"+p[1].map(a=>"• "+a).join("\n")).join("\n");}

// ---- culture panel ----
function cultureView(c){const cu=CULTURE[c.c];if(!cu)return"";const rows=[["Languages",cu.lang],["How people communicate",cu.comm],["What builds trust",cu.trust],["Respect & hierarchy",cu.hier],["Time",cu.time],["Faith & values",cu.faith],["Channels",cu.ch],["Formats that work",cu.fmt],["Talking about money",cu.money],["Avoid",cu.avoid]];
 return `<div class="card"><h2>Cultural intelligence · ${c.n}, ${c.c}</h2><p class="small">A starting guide to test with local people — every city, community and person is different.</p><div class="grid g2">${rows.map(r=>`<div class="mind"><b>${r[0]}</b><br>${esc(r[1])}</div>`).join("")}</div></div>`;}

// ---- field intelligence + city analyst ----
function fieldView(c){const N=notesFor(c.id);const lb=learnBonus(c,"all");
 return `<div class="grid g2"><div class="card"><h2>Field intelligence · teach the engine</h2><p class="small">Log what you see on the ground. Each note adjusts ${c.n}'s scores, your briefings and your deployment.${lb?` Your notes currently add <b style="color:var(--teal)">+${lb}</b> here.`:""}</p>
 <div class="grid g2"><div><label>Type</label><select id="nk"><option value="trend">Trend</option><option value="culture">Culture</option><option value="opportunity">Opportunity</option><option value="issue">Issue</option></select></div><div><label>Niche (optional)</label><select id="nn"><option value="">Any</option>${NICHES.map(n=>`<option value="${n.id}">${n.n}</option>`).join("")}</select></div></div>
 <label style="margin-top:8px">What did you notice?</label><textarea id="nt" rows="2" placeholder="e.g. Banks here are cutting external training budgets but funding internal coaching"></textarea>
 <div class="flex" style="margin-top:8px"><label style="margin:0">Strength</label><input id="ns" type="range" min="1" max="5" value="3" style="width:120px"><label class="flex small" style="margin:0;text-transform:none"><input type="checkbox" id="nshare"> Share anonymously with other coaches</label><button class="btn sm right" onclick="addNote('${c.id}')">Teach the engine</button></div>
 ${N.map((n,i)=>`<div class="note"><span class="pill">${n.kind}</span> ${esc(n.note)} <span class="small">· ${n.d} · strength ${n.strength}</span> <a href="javascript:delNote('${c.id}',${i})" class="small">remove</a></div>`).join("")}
 <h3 style="margin-top:14px">From other coaches</h3><div id="comm" class="small">Loading…</div></div>
 <div class="card"><h2>City Analyst</h2><p class="small">Ask anything about coaching in ${c.n}: trends, culture, opportunities, issues, how to pitch.</p>
 <div class="chat" id="chatbox">${(S.chat&&S.chat[c.id]||[]).map(m=>`<div class="msg ${m.role}">${esc(m.content)}</div>`).join("")||`<div class="msg assistant">Ask me, for example: "What do HR directors in ${c.n} care about next year?"</div>`}</div>
 <div class="flex" style="margin-top:8px"><input id="cq" placeholder="Ask the City Analyst…" onkeydown="if(event.key==='Enter')cityAsk('${c.id}')"><button class="btn sm" onclick="cityAsk('${c.id}')">Ask</button></div></div></div>`;}
async function cityAsk(cid){const c=cityById(cid),q=document.getElementById("cq").value.trim();if(!q)return;S.chat=S.chat||{};const h=(S.chat[cid]=S.chat[cid]||[]);h.push({role:"user",content:q});save();render();
 const ctx=`Context for ${c.n}, ${c.c}: role ${c.hub}; issues ${c.issues.join("; ")}; top of mind: ${c.mind}; culture: ${JSON.stringify(CULTURE[c.c]||{})}; coach's field notes: ${notesFor(cid).map(n=>n.kind+": "+n.note).join(" | ")||"none"}; coach niche: ${(nicheById(S.profile.niche)||{}).n||"not set"}; role: ${S.profile.role||"Coach"}.`;
 let ans;try{const r=await fetch("/api/ai",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:ctx+"\n\nAnswer as DeoCoach's City Analyst. Be specific and practical; describe trends qualitatively unless you can name a source; label forecasts as scenarios."},{role:"assistant",content:"Understood."},...h.slice(-8)]})});const j=await r.json();if(!r.ok)throw 0;ans=j.text;}
 catch(e){const cu=CULTURE[c.c]||{};ans=`(Offline answer — live AI switches on when DeoCoach runs on its own site.)\nIn ${c.n}, the top factor on people's minds is: ${c.mind}. The issues shaping the landscape: ${c.issues.join("; ")}. Speak to it like this: ${c.say}. Trust is built through ${(cu.trust||"relationships and results").toLowerCase()}. Start now: ${c.prep}.`;}
 h.push({role:"assistant",content:ans});save();if((location.hash||"").includes("atlas"))render();}

// ===== Power Centres: where the coach's own capabilities are most valuable, year by year =====
function capWeights(){const sg=signature();const has=!!sg||compAvg()>0;
  const w=NICHES.map(n=>{let f=0;if(sg){f+=n.st[0]===sg.p?3:n.st[1]===sg.p?2:n.st.includes(sg.s)?1:0;}const ca=compAvg(n.need);f+=ca?ca:2.5;return{n,f};}).sort((a,b)=>b.f-a.f).slice(0,5);
  const tot=w.reduce((a,b)=>a+b.f,0);return{has,w:w.map(x=>({n:x.n,w:x.f/tot}))};}
function powerScore(c,t,CW){CW=CW||capWeights();return Math.round(CW.w.reduce((a,x)=>a+x.w*cityScore(c,x.n.id,t),0));}
function powerClusters(t){
  const CW=capWeights();const P=CITIES.map(c=>({c,p:powerScore(c,t,CW)})).sort((a,b)=>b.p-a.p);
  const cut=P[Math.floor(P.length*.35)].p;const hot=P.filter(x=>x.p>=cut);const km=(a,b)=>d3g.geoDistance([a.lon,a.lat],[b.lon,b.lat])*6371;
  const groups=[];hot.forEach(h=>{const g=groups.find(G=>G.some(m=>km(m.c,h.c)<1300));if(g)g.push(h);else groups.push([h]);});
  // merge groups that touch
  for(let i=0;i<groups.length;i++)for(let j=groups.length-1;j>i;j--)if(groups[i].some(a=>groups[j].some(b=>km(a.c,b.c)<1300))){groups[i]=groups[i].concat(groups[j]);groups.splice(j,1);}
  return{CW,all:P,clusters:groups.map(g=>{const mag=g.reduce((a,b)=>a+b.p,0)/g.length;const lon=g.reduce((a,b)=>a+b.c.lon,0)/g.length,lat=g.reduce((a,b)=>a+b.c.lat,0)/g.length;
    const name=g.length>1?g.slice().sort((a,b)=>b.p-a.p).slice(0,3).map(x=>x.c.n).join("–")+" corridor":g[0].c.n+" hub";return{name,members:g.sort((a,b)=>b.p-a.p),mag:+(mag/10).toFixed(1),lon,lat,size:g.length};}).sort((a,b)=>b.mag*Math.sqrt(b.size)-a.mag*Math.sqrt(a.size))};}
const MEANP={};function meanPower(t,CW){const k=t+"|"+CW.w.map(x=>x.n.id).join();if(MEANP[k]==null)MEANP[k]=CITIES.reduce((a,c)=>a+powerScore(c,t,CW),0)/CITIES.length;return MEANP[k];}
// peak = the year a city stands furthest above the rest of Africa for this coach
function peakYear(c,CW){let best=1,bv=-1e9;for(let t=1;t<=10;t++){const v=powerScore(c,t,CW)-meanPower(t,CW);if(v>bv+0.25){bv=v;best=t;}}return{t:best,v:Math.round(bv)};}
function powerView(t){const PC=powerClusters(t);const CW=PC.CW;const top=PC.clusters[0];
  const drivers=[...new Set(CW.w.flatMap(x=>x.n.need))].slice(0,4).map(id=>(COMPS.find(c=>c[0]===id)||[,id])[1]);
  const strip=[1,2,3,4,5,6,7,8,9,10].map(y=>{const c=powerClusters(y).clusters[0];return{y,c};});
  const peaks=PC.all.slice(0,12).map(x=>({...x,pk:peakYear(x.c,CW)}));
  return `<div class="card power"><div class="flex"><h2 style="margin:0">⚡ Power Centres · Year ${t}</h2><span class="pill teal right">Built from your capabilities</span></div>
  ${CW.has?"":'<div class="note">Complete Coach Signature and the Competency Ladder to make this personal. Until then it uses a balanced default profile.</div>'}
  <p class="small">Where your capabilities are worth most, grouped into clusters of nearby cities. Magnitude (M) is the cluster's average power ÷ 10. Your strongest drivers: <b style="color:var(--gold2)">${drivers.join(", ")}</b>, through ${CW.w.slice(0,3).map(x=>x.n.n).join(", ")}.</p>
  <h3>Seismic timeline — the strongest cluster each year</h3><div class="quake">${strip.map(s=>`<div class="qk ${s.y===t?"on":""}" onclick="S.sonar.yr=${s.y};save();render()" title="${esc(s.c.name)}"><i style="height:${Math.max(8,(s.c.mag-4)*22)}px"></i><span>Y${s.y}</span><b>M${s.c.mag}</b></div>`).join("")}</div>
  <div class="grid g2" style="margin-top:12px"><div><h3>Clusters in Year ${t}</h3><p class="small">Ranked by magnitude and reach (how many cities the cluster spans).</p>${PC.clusters.slice(0,6).map((k,i)=>`<div class="cluster ${i===0?"lead1":""}"><div class="flex"><b>${esc(k.name)}</b><span class="pill right">M${k.mag}</span></div><div class="small">${k.members.map(m=>`<a href="javascript:pickCity('${m.c.id}')">${m.c.n}</a> ${m.p}`).join(" · ")}</div></div>`).join("")}</div>
  <div><h3>When each city peaks for you</h3><p class="small">Peak = the year a city stands furthest above the rest of Africa for your capabilities.</p><table><tr><th>City</th><th>Power (Y${t})</th><th>Peak year · edge</th></tr>${peaks.map(x=>`<tr><td><a href="javascript:pickCity('${x.c.id}')">${x.c.n}</a></td><td>${x.p}</td><td><span class="pill ${x.pk.t<=3?"":"teal"}">Y${x.pk.t} · +${x.pk.v}</span></td></tr>`).join("")}</table></div></div>
  ${top?`<div class="note"><b>Year ${t} read-out:</b> your capabilities carry the most weight in the <b>${esc(top.name)}</b> (M${top.mag}). Build presence there now${top.members[0]?`, starting with ${top.members[0].c.n}`:""}.</div>`:""}</div>`;}
