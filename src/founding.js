// ===== The Founding 50 and the Free Toolkit =====
let F50={cap:50,taken:null,res:null,busy:false,err:""};
async function f50Load(){try{const r=await fetch("/api/founding50");if(r.ok){const j=await r.json();F50.cap=j.cap;F50.taken=j.taken;}}catch(e){}if(location.hash==="#founding50"||location.hash==="#home"||location.hash===""||location.hash==="#free")render();}
function f50Left(){return F50.taken==null?null:Math.max(0,F50.cap-F50.taken);}
function f50Meter(big){const l=f50Left();if(l==null)return `<div class="small muted">Checking places…</div>`;const pct=Math.min(100,(F50.taken/F50.cap)*100);
 return `<div class="f50m ${big?"big":""}"><div class="f50n"><b>${l}</b> of ${F50.cap} places left</div><div class="f50bar" role="img" aria-label="${F50.taken} of ${F50.cap} places taken"><div style="width:${pct}%"></div></div></div>`;}
async function f50Apply(ev){ev.preventDefault();if(F50.busy)return;const g=id=>document.getElementById(id);
 if(!g("fcok").checked){F50.err="Please tick the consent box.";render();return;}
 F50.busy=true;F50.err="";const btn=g("fcgo");if(btn)btn.textContent="Reserving your place…";
 const body={name:g("fcn").value,email:g("fce").value,phone:g("fcp").value,city:g("fcc").value,country:g("fcy").value,pro:g("fcr").value,practice:g("fcpr").value,wants:g("fcw").value,consent:true};
 try{const r=await fetch("/api/founding50",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});const j=await r.json();
  if(!r.ok){F50.err=j.error||"Something went wrong — please try again.";}else{F50.res=j;F50.taken=j.position;S.f50=j;S.subbed=S.subbed||body.email;save();track("sub",{p:"founding50"});}}
 catch(e){F50.err="Couldn't reach the server — please try again.";}F50.busy=false;render();}
V.founding50=()=>{const done=S.f50||F50.res,me=S.profile||{},c=typeof cityById==="function"&&cityById(me.cityId);
 return `<div class="card f50hero"><div class="f50grid"><div>
  <div class="kicker">THE FOUNDING 50 · FREE · LIMITED TO 50 PLACES</div>
  <h1 style="margin:.3rem 0 .6rem">I will personally help the first 50 coaches automate their practice.</h1>
  <p class="lead">Ninety days. One method: <b>Map → Automate → Govern → Monetise</b>. Free for the Founding 50 — my thank-you to the coaching community that shaped me.</p>
  ${f50Meter(true)}
  <p class="small" style="margin-top:.6rem">For coaches, trainers, facilitators, mentors, speakers and consultants — in Africa and worldwide.</p></div>
  <figure class="f50p"><img src="david/p-headshot.webp" alt="Coach David Adeoye Abodunrin"><figcaption>Coach David Adeoye Abodunrin<br><span>AI &amp; Automation Coach · Master Futurist</span></figcaption></figure></div></div>
 <div class="grid g2">
  <div class="card"><h2>What you get</h2><ul class="f50l">
   <li><b>A free place in the Founding Cohort</b> of the 90-day AI &amp; Automation Activation.</li>
   <li><b>Live group sessions with David on Zoom</b> through the four moves.</li>
   <li><b>Your Automation Map reviewed by David</b>, with your first five automations chosen for you.</li>
   <li><b>The full Free Toolkit</b>: starter kit, 50 prompts, scripts, templates and the tool stack.</li>
   <li><b>Founding Member status on DeoCoach</b>: a Founding badge, early access to new features and the founding price locked in.</li></ul></div>
  <div class="card"><h2>What I ask of you</h2><ul class="f50l">
   <li><b>One hour a week</b> for 90 days, and the courage to start small.</li>
   <li><b>Do the work</b> between sessions — five automations, one a week.</li>
   <li><b>Honest feedback</b>, and if it helped you, a short testimonial others can learn from.</li>
   <li><b>Pay it forward</b>: share one thing you learned with another coach.</li></ul>
   <p class="small">Free means free: no card, no catch. Places are reserved in the order applications arrive.</p></div></div>
 <div class="card f50form" id="apply">${done?`<div class="kicker">${done.status==="waitlist"?"YOU'RE ON THE WAITING LIST":"YOUR PLACE IS RESERVED"}</div><h2 style="margin:.3rem 0">${done.status==="waitlist"?"You're first in line for the next cohort.":`You are #${done.position} of ${done.cap}.`}</h2>
   <p>Check your inbox for a confirmation from coachdeo@deocoach.com. David will email the start date and the Zoom link.</p><p><b>Start today:</b></p>
   <div class="flex" style="gap:10px;flex-wrap:wrap"><a class="btn" href="free/ai-automation-starter-kit.html" target="_blank" rel="noopener">Open the Starter Kit ▸</a><a class="btn ghost" href="free/automation-map-worksheet.html" target="_blank" rel="noopener">Fill in your Automation Map</a><a class="btn ghost" href="#free">All free tools</a></div>`
 :`<h2 style="margin-top:0">Apply for your place</h2>${f50Left()===0?`<p class="note">All 50 places are taken — apply to join the waiting list for the next cohort.</p>`:""}
  <form onsubmit="f50Apply(event)" class="grid g2" style="gap:12px">
   <div><label for="fcn">Full name</label><input id="fcn" required autocomplete="name" value="${esc(me.name||"")}"></div>
   <div><label for="fce">Email</label><input id="fce" type="email" required autocomplete="email" value="${esc(S.subbed||"")}"></div>
   <div><label for="fcp">WhatsApp number (optional)</label><input id="fcp" type="tel" autocomplete="tel" placeholder="+234…"></div>
   <div><label for="fcr">I am a…</label><select id="fcr">${PROS.map(p=>`<option value="${p.k}" ${PRO().k===p.k?"selected":""}>${p.n}</option>`).join("")}</select></div>
   <div><label for="fcc">City</label><input id="fcc" autocomplete="address-level2" value="${esc(c?c.n:"")}"></div>
   <div><label for="fcy">Country</label><input id="fcy" autocomplete="country-name" value="${esc(c?c.c:"")}"></div>
   <div style="grid-column:1/-1"><label for="fcpr">Your practice in one line</label><input id="fcpr" maxlength="300" placeholder="e.g. Executive coach for bank managers in Lagos, 3 years"></div>
   <div style="grid-column:1/-1"><label for="fcw">What would you most like to automate or grow?</label><textarea id="fcw" rows="3" maxlength="600" placeholder="e.g. booking and reminders, session notes, LinkedIn content, proposals…"></textarea></div>
   <label class="flex small" style="grid-column:1/-1;gap:8px;align-items:flex-start;text-transform:none;flex-wrap:nowrap"><input type="checkbox" id="fcok" style="flex:none;margin-top:3px"> I agree that DeoCoach may store these details to run the Founding 50 and email me about it and about weekly opportunities. I can unsubscribe at any time.</label>
   <div style="grid-column:1/-1" class="flex"><button class="btn" id="fcgo" type="submit">Reserve my place ▸</button>${f50Meter()}</div>
   ${F50.err?`<p class="note" style="grid-column:1/-1">${esc(F50.err)}</p>`:""}</form>`}</div>
 <div class="card"><h2>Questions</h2>
  <p><b>Is it really free?</b> Yes. The Founding 50 is my thank-you to the community. No card is needed.</p>
  <p><b>When does it start?</b> The start date and Zoom link go by email to everyone with a reserved place.</p>
  <p><b>Do I need to be technical?</b> No. If you can use WhatsApp and email, you can do this.</p>
  <p><b>What if I'm not a coach?</b> Trainers, facilitators, mentors, speakers and consultants are welcome — the method is the same.</p>
  <p><b>What happens to my details?</b> They're used only to run the Founding 50 and send you DeoCoach emails you can leave at any time. They're never sold or shared.</p></div>`;};

// ---- Free Toolkit ----
let FREE_PENDING=null;
V.free=()=>`<div class="card"><div class="kicker">FREE · ${FREEBIES.length} TOOLS · BY COACH DAVID ADEOYE ABODUNRIN</div><h1 style="margin:.3rem 0">The Free Toolkit</h1>
 <p class="lead">Everything a ${esc(PRO().n.toLowerCase())} needs to start automating and growing this week. Free to download, print and share.${S.subbed?"":" Enter your email once to unlock them all."}</p>
 <div class="flex" style="gap:10px;flex-wrap:wrap"><a class="btn" href="#founding50">★ Join the Founding 50 — ${f50Left()==null?"":f50Left()+" places left"}</a></div></div>
 <div class="freegrid">${FREEBIES.map(f=>`<div class="card freecard"><div class="fic" aria-hidden="true">${f.ic}</div><div class="kicker">${esc(f.kind.toUpperCase())}</div><h3>${esc(f.title)}</h3><p class="small">${esc(f.blurb)}</p>
  <button class="btn ${S.subbed?"ghost":""}" onclick="openFree('${f.slug}')">${S.subbed?"Open ▸":"Get it free ▸"}</button></div>`).join("")}</div>`;
function openFree(slug){if(S.subbed){window.open("free/"+slug+".html","_blank","noopener");track("view",{p:"free-"+slug.slice(0,24)});return;}
 FREE_PENDING=slug;const f=FREEBIES.find(x=>x.slug===slug)||FREEBIES[0];if(document.getElementById("subov"))return;const o=document.createElement("div");o.id="subov";o.className="whoov";
 o.innerHTML=`<div class="gwrap"><div class="gcard subcard" onclick="event.stopPropagation()"><div class="gbody"><div class="gk">FREE DOWNLOAD</div><h2>${esc(f.title)}</h2><p class="gp">Enter your email to unlock all ${FREEBIES.length} free tools. You'll also get weekly opportunities for ${esc(PRO().many)} — unsubscribe in one click.</p>
 <form onsubmit="event.preventDefault();freeGo()"><label class="small" for="frem">Email</label><input id="frem" type="email" required autocomplete="email" placeholder="you@example.com" style="width:100%;margin:4px 0 10px">
 <label class="flex small" style="gap:8px;align-items:flex-start;text-transform:none;flex-wrap:nowrap"><input type="checkbox" id="frok" style="flex:none;margin-top:3px"> I agree to receive emails from DeoCoach (coachdeo@deocoach.com).</label>
 <div class="flex" style="gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn genter" type="submit" id="frgo">Unlock the toolkit ▸</button><button class="btn ghost" type="button" onclick="closeAlerts()">Not now</button></div></form><div id="frmsg" class="small" style="margin-top:8px"></div></div></div></div>`;
 o.onclick=closeAlerts;document.body.appendChild(o);setTimeout(()=>{const i=document.getElementById("frem");if(i)i.focus();},50);}
async function freeGo(){const m=document.getElementById("frmsg");if(!document.getElementById("frok").checked){m.textContent="Please tick the consent box first.";return;}
 m.textContent="Unlocking…";const e=await quickSub(document.getElementById("frem").value,"weekly","free");if(e){m.textContent=e;return;}
 const s=FREE_PENDING||FREEBIES[0].slug;m.innerHTML=`Unlocked. <a class="btn" style="margin-left:6px" href="free/${s}.html" target="_blank" rel="noopener" onclick="closeAlerts();render()">Open your download ▸</a>`;}
f50Load();
