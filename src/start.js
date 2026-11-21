// ===== Start Here: the Coach X-Ray, guided answers, Why am I not selling?, Where is my money?, Which city?, Activation Index =====
const XL=[ // 8 layers × 3 questions (1 = not true, 5 = very true)
 ["S","Self","Purpose & identity",["I can say in one sentence why I coach","I know which clients I am best for","I feel confident calling myself a professional coach"],"signature"],
 ["K","Craft","Coaching skill",["Clients get clear, measurable results with me","I use a structured method or framework","I have regular supervision or mentoring"],"ladder"],
 ["O","Offer","Packages & price",["I have named packages with clear prices","I can explain my offer in under 30 seconds","My prices reflect the value I deliver"],"income"],
 ["M","Market","Niche & payer",["I know exactly who pays me — person or budget holder","My niche is narrow enough to be known for it","I know which sectors are growing in my area"],"niches"],
 ["P","Place","City & culture",["I know which cities or markets want what I do","I adapt my language and style to local culture","I serve clients beyond my own city"],"atlas"],
 ["B","Brand","Visibility & trust",["People who need me can find me easily","I share proof of results publicly","People recommend me without being asked"],"brand"],
 ["L","Selling","Conversations to clients",["I ask for the business clearly in conversations","I follow up every enquiry within 48 hours","I enjoy talking about money with clients"],"stuck"],
 ["F","Future","Foresight & AI",["I use digital and AI tools in my practice","I track where my niche is heading in 3–5 years","I have a plan for the next 12 months"],"briefing"]];
function xray(){const a=S.xr||{};const rows=XL.map((l,i)=>{const v=[0,1,2].map(j=>a[i*3+j]).filter(Boolean);const sc=v.length===3?Math.round((v.reduce((x,y)=>x+y,0)-3)/12*100):null;return{l,sc,v:sc===null?null:sc>=67?"Sound":sc>=40?"Strained":"Blocked"};});
  const done=rows.every(r=>r.sc!==null);const bott=done?rows.slice().sort((a,b)=>a.sc-b.sc)[0]:null;return{rows,done,bott};}
function rings(rows,size){const n=rows.length,R=size/2,cx=R,cy=R;let s=`<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:${size}px;height:auto">`;
  rows.forEach((r,i)=>{const a0=(i/n)*Math.PI*2-Math.PI/2+.03,a1=((i+1)/n)*Math.PI*2-Math.PI/2-.03;const v=r.sc??0;
   for(let k=0;k<4;k++){const r0=R*.22+k*R*.18,r1=r0+R*.15,on=v>=k*25+1;const p=(rr,a)=>[cx+Math.cos(a)*rr,cy+Math.sin(a)*rr];const[x0,y0]=p(r0,a0),[x1,y1]=p(r1,a0),[x2,y2]=p(r1,a1),[x3,y3]=p(r0,a1);
    const col=r.v==="Blocked"?"var(--red)":r.v==="Strained"?"var(--amber)":"var(--gold)";s+=`<path d="M${x0},${y0} L${x1},${y1} A${r1},${r1} 0 0 1 ${x2},${y2} L${x3},${y3} A${r0},${r0} 0 0 0 ${x0},${y0}Z" fill="${on?col:"rgba(var(--tint),.07)"}" opacity="${on?.35+k*.18:1}"/>`;}
   const[lx,ly]=[cx+Math.cos((a0+a1)/2)*R*.96,cy+Math.sin((a0+a1)/2)*R*.96];s+=`<text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="${size/26}" fill="var(--ink)" font-weight="700">${r.l[1]}</text>`;});
  return s+`<circle cx="${cx}" cy="${cy}" r="${R*.18}" fill="rgba(var(--acc),.15)" stroke="var(--gold)"/><text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="${size/16}" fill="var(--gold2)" font-family="var(--fontD)">X-Ray</text></svg>`;}

// ---- why am I not selling? (borrows DeoSales' selling dimensions) ----
const SELLQ=[["belief","I believe my coaching is worth what I charge","Belief","Rewrite your value in money and time saved; collect 3 testimonials that prove it."],
 ["ask","I clearly invite people to work with me","Asking","End every conversation and post with one clear invitation and next step."],
 ["follow","I follow up within 48 hours, at least three times","Follow-up","Set a follow-up rhythm: day 1, day 3, day 7. Most sales close after the third touch."],
 ["listen","I find out what the buyer really wants before I pitch","Attunement","Ask three questions about their problem before you describe your offer."],
 ["niche","My message speaks to one clear group","Focus","Name one group and one problem in your bio, offer and content."],
 ["offer","My offer has a name, a result and a price","Offer clarity","Package one signature programme with a named result and a fixed price."],
 ["price","I state my price calmly without discounting","Price confidence","Practise saying your price aloud ten times; offer instalments, not discounts."],
 ["proof","I can show results from past clients","Proof","Add five results to your Proof Vault and publish two case studies."],
 ["visible","The right buyers see me every week","Visibility","Show up three times a week in the channel your buyers use most."],
 ["payer","I sell to the person who controls the budget","Right buyer","Map who signs the cheque: HR, CEO, parent, church, donor — and pitch them."],
 ["energy","I have time and energy set aside for selling","Discipline","Block two selling hours a day, four days a week, before coaching hours."],
 ["network","Partners and past clients refer people to me","Referrals","Ask every happy client for two introductions; reward referrers."]];
function sellDiag(){const a=S.sell||{};const done=SELLQ.every(q=>a[q[0]]);const f=funnel();const T=traps().filter(t=>t.hit);
  const blk=SELLQ.filter(q=>a[q[0]]).map(q=>({q,v:a[q[0]]})).sort((x,y)=>x.v-y.v).filter(x=>x.v<=3).slice(0,5);return{done,blk,f,T};}

// ---- where is my money? ----
function moneyMap(yr){const CW=capWeights();const out=[];CITIES.forEach(c=>CW.w.forEach(x=>{const s=cityScore(c,x.n.id,yr);out.push({c,n:x.n,s:Math.round(s*(.5+x.w))});}));
  out.sort((a,b)=>b.s-a.s);const seen=new Set();return out.filter(o=>{const k=o.n.id;if(seen.has(k+o.c.id))return false;seen.add(k+o.c.id);return true;}).slice(0,8);}

// ---- which city should I move to? ----
function km(a,b){return Math.round(d3g.geoDistance([a.lon,a.lat],[b.lon,b.lat])*6371);}
function moveCompass(){const m=S.move||{};const home=cityById(m.from||S.profile.cityId)||cityById("lagos");const langs=(m.langs||"English").toLowerCase().split(/[,;/]+/).map(s=>s.trim()).filter(Boolean);
  const w={opp:+(m.wo??5),grow:+(m.wg??4),fit:+(m.wf??4),near:+(m.wn??2)};const CW=capWeights();const tot=w.opp+w.grow+w.fit+w.near||1;
  return{home,list:CITIES.filter(c=>c.id!==home.id).map(c=>{const opp=powerScore(c,3,CW),grow=Math.max(0,powerScore(c,5,CW)-powerScore(c,1,CW));const L=((CULTURE[c.c]||{}).lang||"").toLowerCase();const fit=langs.some(l=>L.includes(l))?100:35;const d=km(home,c);const near=Math.max(0,100-d/60);
   const s=Math.round((w.opp*opp+w.grow*Math.min(100,grow*3)+w.fit*fit+w.near*near)/tot);return{c,s,opp,grow,fit,d};}).sort((a,b)=>b.s-a.s)};}

// ---- Activation Index: every dimension of activating the future ----
function activation(){const X=xray(),f=funnel(),sg=signature(),bd=deals(),cur=S.profile.cur,paid=(bd[cur]||{}).paid||0;const xs=k=>{const r=X.rows.find(r=>r.l[0]===k);return r&&r.sc!==null?r.sc:null;};
  const sd=S.sell||{};const sellAvg=SELLQ.filter(q=>sd[q[0]]).length?SELLQ.reduce((a,q)=>a+(sd[q[0]]||0),0)/SELLQ.filter(q=>sd[q[0]]).length:0;
  const D=[
   ["Identity & purpose",avgN([sg?80:0,xs("S")]),"signature","Take Coach Signature and the X-Ray"],
   ["Craft & competence",avgN([compAvg()*20,xs("K")]),"ladder","Place yourself on the Competency Ladder"],
   ["Credentials",({"None yet":10,"In training":40,"Certified / accredited":75,"Advanced / master level":95})[S.profile.cred]||0,"profile","Plan your next credential"],
   ["Niche clarity",avgN([S.profile.niche&&S.profile.niche!=="general"?85:S.profile.niche?20:0,xs("M")]),"niches","Choose one niche in Niche Radar"],
   ["Offer & price",avgN([num(S.offer.rate)?70:0,xs("O")]),"income","Build your offers in Capability to Income"],
   ["Income & money",Math.min(100,S.deals.length*10+(paid?30:0)),"income","Log deals in the Income Tracker"],
   ["Place & power",avgN([S.profile.cityId?60:0,S.sonar.city?20:0,xs("P")]),"atlas","Find your Power Centres in Horizon Atlas"],
   ["Cultural fluency",avgN([Math.min(100,Object.values(S.notes||{}).flat().filter(n=>n.kind==="culture").length*25),xs("P")]),"minds","Log culture notes for your cities"],
   ["Brand & visibility",avgN([f?f.lvl/6*100:0,xs("B")]),"funnel","Enter your Brand Funnel numbers"],
   ["Selling & conversion",avgN([sellAvg?(sellAvg-1)/4*100:null,xs("L")]),"start","Run 'Why am I not selling?'"],
   ["Proof & evidence",avgN([Math.min(100,String(S.proof||"").split("\n").filter(Boolean).length*20),Object.keys(S.per.oth||{}).length?60:0]),"income","Fill your Proof Vault"],
   ["Network & opportunity",avgN([S.alerts?60:0,Object.values(S.net||{}).some(Boolean)?50:0,S.sub.cities.length?40:0]),"opps","Switch on opportunity alerts"],
   ["Future readiness",avgN([(S.comp.ai||0)*20,xs("F"),S.sub.niches.length?50:0]),"briefing","Subscribe to briefings for your niche"],
   ["Sustainability",num(S.hrs.total)?Math.round(Math.min(1,num(S.hrs.paid)/num(S.hrs.total))*100):0,"stuck","Enter your coaching hours"]];
  const idx=Math.round(D.reduce((a,d)=>a+(d[1]||0),0)/D.length);return{D:D.map(d=>[d[0],Math.round(d[1]||0),d[2],d[3]]),idx};}
function avgN(a){const v=a.filter(x=>x!==null&&x!==undefined&&!isNaN(x));return v.length?v.reduce((x,y)=>x+y,0)/v.length:0;}
function wheel(D,size){const n=D.length,R=size/2,c=R;let s=`<svg viewBox="-90 -14 ${size+180} ${size+28}" style="width:100%;max-width:${size}px;height:auto">`;
  [25,50,75,100].forEach(v=>s+=`<circle cx="${c}" cy="${c}" r="${R*.78*v/100}" fill="none" stroke="rgba(var(--tint),.08)"/>`);
  const pt=(i,v)=>{const a=i/n*Math.PI*2-Math.PI/2;return[c+Math.cos(a)*R*.78*v/100,c+Math.sin(a)*R*.78*v/100];};
  s+=`<polygon points="${D.map((d,i)=>pt(i,Math.max(4,d[1])).join(",")).join(" ")}" fill="rgba(var(--acc),.22)" stroke="var(--gold)" stroke-width="2"/>`;
  D.forEach((d,i)=>{const[x,y]=pt(i,104);const[px,py]=pt(i,Math.max(4,d[1]));s+=`<circle cx="${px}" cy="${py}" r="3.5" fill="var(--gold2)"/><text x="${x}" y="${y}" font-size="${size/48}" fill="var(--mute)" text-anchor="${x<c-5?"end":x>c+5?"start":"middle"}">${d[0]}</text>`;});
  return s+"</svg>";}

// ---- views ----
const QUESTIONS=[
 ["begin","✦","Where do I start as a coach?","Your first 90 days, from where you are now"],
 ["money","₦","Where is my money — in which market?","The cities, niches and payers that fit you"],
 ["move","➶","Which city should I move to — or serve from?","A compass for your next base"],
 ["sell","⚡","Why am I not selling?","Find the real blockers in 2 minutes"],
 ["price","◈","What should I charge?","Your price ladder from your session fee"],
 ["contracts","▤","How do I win corporate and government contracts?","Tenders, EOIs and who pays"],
 ["brand","◉","How do I stand out?","Where your brand is stuck and why"],
 ["future","☼","How do I future-proof my coaching?","The next 10 years for your niche"]];
V.start=()=>{const X=xray(),A=activation();const q=S.q||"";
 return `<div class="card hero-start fashero" style="background-image:linear-gradient(100deg,rgba(var(--void),.96) 0%,rgba(var(--void),.8) 55%,rgba(var(--void),.3)),url(art/horizon.webp)"><div class="fasgrid"><div><div class="tag">START HERE · ACTIVATING THE FUTURE</div><h1 class="display" style="font-size:3rem">Where do you want to begin?</h1><p class="lead">Pick the question on your mind. DeoCoach answers it from your profile, the Horizon Atlas and your own numbers — then shows you what to do first.</p></div><figure class="portrait"><img src="david/p-chair.webp" alt="Coach David Adeoye Abodunrin"><figcaption>Coach David Adeoye Abodunrin</figcaption></figure></div>
 <div class="qgrid">${QUESTIONS.map(x=>`<button class="qcard2 ${q===x[0]?"on":""}" onclick="S.q='${x[0]}';save();render();setTimeout(()=>document.getElementById('answer').scrollIntoView({behavior:'smooth'}),60)"><span class="qi">${x[1]}</span><b>${x[2]}</b><span class="small">${x[3]}</span></button>`).join("")}</div></div>
 <div id="answer">${q?answer(q):""}</div>
 <div class="grid g2"><div class="card"><div class="flex"><h2 style="margin:0">Coach X-Ray</h2><span class="pill right">${X.done?"Complete":"24 quick questions"}</span></div><p class="small">Eight layers of your coaching business. The weakest layer is your bottleneck — fix it first.</p>
  ${X.done?`<div class="center">${rings(X.rows,360)}</div><div class="note warn"><b>Your bottleneck: ${X.bott.l[1]} — ${X.bott.l[2]}</b> (${X.bott.sc}/100). <a href="#${X.bott.l[4]}">Open the tool that fixes it →</a></div>`:""}
  <details ${X.done?"":"open"}><summary class="btn sm ghost">${X.done?"Retake the X-Ray":"Take the X-Ray"}</summary>${XL.map((l,i)=>`<h3 style="margin-top:12px">${l[1]} · <span class="small">${l[2]}</span></h3>${l[3].map((t,j)=>`<div class="q"><div style="flex:1;min-width:200px" class="small">${t}</div><div class="likert">${[1,2,3,4,5].map(v=>`<button class="${(S.xr||{})[i*3+j]===v?"on":""}" onclick="S.xr=S.xr||{};S.xr[${i*3+j}]=${v};save();render()">${v}</button>`).join("")}</div></div>`).join("")}`).join("")}</details></div>
 <div class="card"><div class="flex"><h2 style="margin:0">Activation Index</h2><span class="big right">${A.idx}</span></div><p class="small">Fourteen dimensions of activating your future as a coach. It rises as you use DeoCoach and as your numbers improve.</p><div class="center">${wheel(A.D,420)}</div>
  <h3>Lift these first</h3>${A.D.slice().sort((a,b)=>a[1]-b[1]).slice(0,4).map(d=>`<p>• <b>${d[0]}</b> (${d[1]}) — <a href="#${d[2]}">${d[3]}</a></p>`).join("")}</div></div>`;};

function answer(q){const X=xray(),A=activation();const nn=nicheById(S.profile.niche)||nicheScores(1)[0];const head=QUESTIONS.find(x=>x[0]===q);
 const wrap=b=>`<div class="card answer"><div class="tag">YOUR ANSWER</div><h2 class="display" style="font-size:1.6rem">${head[2]}</h2>${b}</div>`;
 if(q==="begin"){const st=S.stage??(S.profile.cred==="None yet"?0:2);const firsts=A.D.slice().sort((a,b)=>a[1]-b[1]).slice(0,3);
  return wrap(`<p>You are at the <b>${CAREER[st][0]}</b> stage. At this stage you sell: <b>${CAREER[st][2]}</b> to <b>${CAREER[st][3]}</b>.</p>
  <div class="grid g3">${[["Days 1–30 · Know yourself",["Take Coach Signature and the Coach X-Ray","Place yourself on the Competency Ladder",`Choose one niche — today's best fit is ${nn.n}`]],["Days 31–60 · Make an offer",["Set your session fee and build your offer ladder","Write one message for one group",`Run three paid pilots with ${nn.payer.split(",")[0]}`]],["Days 61–90 · Get seen and paid",["Log your funnel numbers weekly","Fix your biggest leak",`Pick your Power Centre city and switch on opportunity alerts`]]].map(p=>`<div class="phase"><b>${p[0]}</b><ul class="small">${p[1].map(a=>`<li>${a}</li>`).join("")}</ul></div>`).join("")}</div>
  <p><b>Your three weakest dimensions right now:</b> ${firsts.map(d=>`<a href="#${d[2]}">${d[0]}</a>`).join(" · ")}.</p>`);}
 if(q==="money"){const yr=S.sonar.yr||3;const M=moneyMap(yr);
  return wrap(`<p>Where your capabilities are likely to earn most in <b>Year ${yr}</b> (change the year in Horizon Atlas):</p><table><tr><th>Market</th><th>Niche</th><th>Who pays</th><th>Money signal</th></tr>${M.map(m=>`<tr><td><a href="javascript:pickCity('${m.c.id}')">${m.c.n}</a> <span class="small">${m.c.c}</span></td><td>${m.n.n}</td><td class="small">${m.n.payer}</td><td><div class="bar"><i style="width:${Math.min(100,m.s)}%"></i></div></td></tr>`).join("")}</table>
  <p class="small">Built from your signature, competencies and the city outlooks. Scenario estimates — test them with pilot clients before you invest.</p><div class="flex"><a class="btn sm" href="#atlas">See your Power Centres</a><a class="btn sm ghost" href="#income">Price your offers</a><a class="btn sm ghost" href="#opps">Find tenders in these markets</a></div>`);}
 if(q==="move"){const m=S.move||{};const R=moveCompass();
  return wrap(`<div class="grid g3"><div><label>I'm based in</label><select onchange="S.move=Object.assign(S.move||{},{from:this.value});save();render()">${CITIES.map(c=>`<option value="${c.id}" ${R.home.id===c.id?"selected":""}>${c.n}</option>`).join("")}</select></div><div><label>Languages I work in</label><input value="${esc(m.langs||"English")}" onchange="S.move=Object.assign(S.move||{},{langs:this.value});save();render()" placeholder="English, French"></div><div></div></div>
  <div class="grid g4" style="margin-top:10px">${[["wo","Opportunity for me",5],["wg","Growth to Year 5",4],["wf","Language & culture fit",4],["wn","Close to home",2]].map(x=>`<div><label>${x[1]}: ${m[x[0]]??x[2]}</label><input type="range" min="0" max="10" value="${m[x[0]]??x[2]}" onchange="S.move=Object.assign(S.move||{},{${x[0]}:this.value});save();render()"></div>`).join("")}</div>
  <table style="margin-top:12px"><tr><th>#</th><th>City</th><th>Match</th><th>Why</th></tr>${R.list.slice(0,6).map((r,i)=>`<tr><td>${i+1}</td><td><a href="javascript:pickCity('${r.c.id}')"><b>${r.c.n}</b></a> <span class="small">${r.c.c}</span></td><td><div class="bar"><i style="width:${r.s}%"></i></div><span class="small">${r.s}</span></td><td class="small">power ${r.opp} · growth +${r.grow} · ${r.fit===100?"language match":"new language"} · ${r.d.toLocaleString()} km</td></tr>`).join("")}</table>
  <div class="note"><b>Test before you move:</b> serve 3 paying clients in ${R.list[0].c.n} remotely for 90 days, visit once, and secure one partner there first. This compass does not include living costs, visas or safety — check official sources before deciding.</div>`);}
 if(q==="sell"){const D=sellDiag();
  return wrap(`<p class="small">Rate each statement honestly (1 = not true, 5 = very true). DeoCoach combines this with your Brand Funnel and the 8 traps.</p>${SELLQ.map(x=>`<div class="q"><div style="flex:1;min-width:220px">${x[1]}</div><div class="likert">${[1,2,3,4,5].map(v=>`<button class="${(S.sell||{})[x[0]]===v?"on":""}" onclick="S.sell=S.sell||{};S.sell['${x[0]}']=${v};save();render()">${v}</button>`).join("")}</div></div>`).join("")}
  ${D.blk.length?`<h3 style="margin-top:14px">Why you're not selling — ranked</h3>${D.blk.map((b,i)=>`<div class="trap hit"><b>${i+1}. ${b.q[2]}</b> <span class="small">(${b.v}/5)</span><p>${b.q[3]}</p></div>`).join("")}`:D.done?'<div class="note">No major blockers in your answers. Check your Brand Funnel for where buyers drop off.</div>':""}
  ${D.f&&D.f.leak!==null?`<div class="note warn"><b>Funnel leak:</b> ${FUN[D.f.leak][1]} — ${FUN[D.f.leak][4]}.</div>`:'<p class="small">Add your <a href="#funnel">Brand Funnel</a> numbers to see where buyers drop off.</p>'}
  ${D.T.length?`<p><b>Traps detected:</b> ${D.T.map(t=>t.n).join(", ")}. <a href="#stuck">See the way out →</a></p>`:""}
  <p class="small">Want the full picture? The <a href="https://deosales-app.vercel.app" target="_blank" rel="noopener">DeoSales Sales X-Ray</a> looks at eight layers of selling in depth.</p>`);}
 if(q==="price")return wrap(`<p>Your price ladder is built from your session fee: entry session, 6-week core programme, group seats, corporate programme and premium retainer.</p>${num(S.offer.rate)?`<p>With a session fee of <b>${money(num(S.offer.rate))}</b>, your corporate programme is <b>${money(num(S.offer.rate)*24)}</b> and your premium retainer is <b>${money(num(S.offer.rate)*14.4)}</b>.</p>`:"<p>Set your session fee to see your ladder.</p>"}<a class="btn sm" href="#income">Open Capability to Income</a>`);
 if(q==="contracts")return wrap(`<p>Corporate and government money comes through budget holders and formal processes: HR/L&D, procurement, development partners. Three moves:</p><ol><li>Register on the tender portals for your country and switch on daily alerts.</li><li>Prepare a capability statement, two case studies with numbers, and supplier documents.</li><li>Partner with a consultancy that already wins capacity-building contracts.</li></ol><div class="flex"><a class="btn sm" href="#opps">Open the Opportunity Desk</a><a class="btn sm ghost" href="#atlas">Find where your Power Centres are</a></div>`);
 if(q==="brand"){const f=funnel();return wrap(f?`<p>You are <b>${BRAND[f.lvl]}</b>${f.leak!==null?` and stuck at <b>${FUN[f.leak][1]}</b>: ${FUN[f.leak][4]}.`:"."}</p><a class="btn sm" href="#funnel">Open Brand Funnel</a>`:`<p>Enter last month's numbers in the Brand Funnel and DeoCoach will show exactly where your brand is stuck.</p><a class="btn sm" href="#funnel">Open Brand Funnel</a>`);}
 if(q==="future"){const t5=nicheScores(5).slice(0,3),t10=nicheScores(10).slice(0,3);return wrap(`<p>For your profile, the strongest niches in <b>Year 5</b>: ${t5.map(n=>n.n).join(", ")}. In <b>Year 10</b>: ${t10.map(n=>n.n).join(", ")}.</p><p>Future-proof by building your Digital & AI competency to L4, tracking your niche weekly, and planning 5 years ahead in quarters.</p><div class="flex"><a class="btn sm" href="#niches">10-year Niche Radar</a><a class="btn sm ghost" href="#briefing">Subscribe to briefings</a><a class="btn sm ghost" href="#stuck">5-year plan</a></div>`);}
 return"";}
