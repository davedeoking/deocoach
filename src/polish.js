// ===== v0.7 Look & feel: cinematic opening, presenter mode, share cards, install, textile layer, phone-first, city colour, motion, welcome =====
const RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function lookRGB(){const g=n=>getComputedStyle(document.documentElement).getPropertyValue("--"+n).trim().replace(/\s+/g,",");return{void:g("void"),deep:g("deep"),acc:g("acc"),acc2:g("acc2"),hi:g("hi"),warm:g("warm"),ink:g("inkR"),mute:g("muteR")};}

/* ---------- 1. Adinkra-inspired section icons (own drawings of traditional Akan symbols) ---------- */
const ADK={
 adinkrahene:["Adinkrahene","Greatness and leadership",'<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2.6"/>'],
 nsoromma:["Nsoromma","Guardianship — a child of the heavens",'<path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z"/><circle cx="12" cy="11" r="1.6"/>'],
 sankofa:["Sankofa","Go back and fetch it — learn from the past to build the future",'<path d="M12 20.5C6 15.6 3.2 12.4 3.2 8.9a4.4 4.4 0 0 1 8.8-.6 4.4 4.4 0 0 1 8.8.6c0 3.5-2.8 6.7-8.8 11.6z"/><path d="M7.4 8.6a1.7 1.7 0 1 1 1.9 1.7M16.6 8.6a1.7 1.7 0 1 0-1.9 1.7"/>'],
 nkyinkyim:["Nkyinkyim","Initiative, dynamism and versatility — life's twisting road",'<path d="M5 3l8 3.6-8 3.6 8 3.6-8 3.6 8 3.6"/><path d="M11 3l8 3.6-8 3.6 8 3.6-8 3.6 8 3.6"/>'],
 dwennimmen:["Dwennimmen","Strength with humility — the ram's horns",'<path d="M12 12c0-4.5-3-7-5.6-7a2.6 2.6 0 0 0 0 5.2c1.4 0 2-1 2-1.8M12 12c0-4.5 3-7 5.6-7a2.6 2.6 0 0 1 0 5.2c-1.4 0-2-1-2-1.8M12 12c0 4.5-3 7-5.6 7a2.6 2.6 0 0 1 0-5.2c1.4 0 2 1 2 1.8M12 12c0 4.5 3 7 5.6 7a2.6 2.6 0 0 0 0-5.2c-1.4 0-2 1-2 1.8"/>'],
 akoma:["Akoma","Patience and endurance — the heart",'<path d="M12 20.5C6 15.6 3.2 12.4 3.2 8.9a4.4 4.4 0 0 1 8.8-.6 4.4 4.4 0 0 1 8.8.6c0 3.5-2.8 6.7-8.8 11.6z"/>'],
 eban:["Eban","Safety and security — the fence",'<rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="8" y="8" width="8" height="8"/><path d="M3 12h5M16 12h5M12 3v5M12 16v5"/>'],
 matemasie:["Mate Masie","Wisdom and knowledge — what I hear, I keep",'<path d="M5 9.5a3.2 3.2 0 1 1 4.5-4.5M19 9.5a3.2 3.2 0 1 0-4.5-4.5M5 14.5a3.2 3.2 0 1 0 4.5 4.5M19 14.5a3.2 3.2 0 1 1-4.5 4.5"/>'],
 mpatapo:["Mpatapo","Reconciliation and peace — the knot",'<path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/>'],
 nkonsonkonson:["Nkonsonkonson","Unity and human relations — the chain",'<rect x="2.5" y="8" width="11" height="8" rx="4"/><rect x="10.5" y="8" width="11" height="8" rx="4"/>'],
 aya:["Aya","Endurance and resourcefulness — the fern",'<path d="M12 2.5v19"/><path d="M12 6l-4-2.5M12 6l4-2.5M12 10l-5.5-3M12 10l5.5-3M12 14l-6.5-3.5M12 14l6.5-3.5M12 18l-7-3.8M12 18l7-3.8"/>']};
const ADK_VIEW={events:"nkonsonkonson",home:"adinkrahene",start:"nsoromma",backcast:"sankofa",scenarios:"nkyinkyim",power:"dwennimmen",clients:"akoma",governance:"eban",caplib:"matemasie",methods:"matemasie",cocreate:"mpatapo",game:"nkonsonkonson",fas:"aya"};
function adk(k,sz){const a=ADK[k];return a?`<svg class="adk" viewBox="0 0 24 24" width="${sz||18}" height="${sz||18}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a[2]}</svg>`:"";}
function adkNav(){document.querySelectorAll("#nav button").forEach(b=>{const m=(b.getAttribute("onclick")||"").match(/location\.hash='(\w+)'/);if(!m)return;const k=ADK_VIEW[m[1]];if(!k)return;const ic=b.querySelector(".ic");if(ic&&!ic.dataset.adk){ic.dataset.adk=k;ic.innerHTML=adk(k,18);ic.title=ADK[k][0]+" — "+ADK[k][1];}});
 const cur=(location.hash||"#home").slice(1),k=ADK_VIEW[cur],h=document.querySelector("main h1, main h2");
 if(k&&h&&!h.querySelector(".adkh")){const s=document.createElement("span");s.className="adkh";s.title=ADK[k][0]+" — "+ADK[k][1];s.innerHTML=adk(k,30);s.setAttribute("data-notr","");h.prepend(s);}}

/* ---------- 2. Textile bands (kente, bogolan mud cloth, Ndebele, adire) drawn from each Experience's own colours ---------- */
const LOOK_CLOTH={indaba:"beads",royal:"kente",constellation:"adire",savannah:"bogolan",kente:"kente",adire:"adire",emerald:"ndebele",couture:"ndebele",ivory:"bogolan",aurora:"adire"};
const CLOTH_NAME={beads:"Beadwork-inspired band",kente:"Kente-inspired band",bogolan:"Bogolan mud-cloth-inspired band",ndebele:"Ndebele-inspired band",adire:"Adire-inspired band"};
function rgbs(t){return `rgb(${t})`;}
function clothSVG(kind,C){const k=S.look==="kente";const a=rgbs(C.acc),b=k?"rgb(18,140,84)":rgbs(C.hi),c=k?"rgb(196,30,48)":rgbs(C.warm),v=rgbs(C.void),i=rgbs(C.acc2);let w=48,s="";
 if(kind==="beads"){w=64;const B=["rgb(252,243,228)","rgb(204,74,46)","rgb(44,178,168)","rgb(248,204,128)","rgb(26,15,9)","rgb(36,120,70)","rgb(232,146,54)"];const row=[0,0,1,1,2,3,4,3,2,1,1,0,5,6,4,6];let b=`<rect width="64" height="12" fill="rgb(26,15,9)"/>`;row.forEach((c,j)=>{b+=`<circle cx="${2+j*4}" cy="3" r="1.8" fill="${B[c]}"/><circle cx="${2+j*4}" cy="9" r="1.8" fill="${B[row[(j+8)%16]]}"/>`;});s=b;}
 else if(kind==="kente"){s=`<rect width="48" height="12" fill="${v}"/><rect x="0" width="14" height="12" fill="${a}"/><rect x="2" y="2" width="10" height="2" fill="${v}"/><rect x="2" y="8" width="10" height="2" fill="${v}"/><rect x="14" width="2" height="12" fill="${c}"/><rect x="16" width="12" height="12" fill="${b}"/><path d="M16 6h12" stroke="${a}" stroke-width="2"/><rect x="28" width="2" height="12" fill="${c}"/><rect x="30" width="14" height="12" fill="${a}"/><path d="M33 0v12M37 0v12M41 0v12" stroke="${v}" stroke-width="1.2"/><rect x="44" width="4" height="12" fill="${c}"/>`;}
 else if(kind==="bogolan"){w=36;s=`<rect width="36" height="12" fill="${v}"/><path d="M0 6l3-3 3 3 3-3 3 3" fill="none" stroke="${i}" stroke-width="1.2"/><circle cx="17" cy="3" r="1" fill="${i}"/><circle cx="17" cy="9" r="1" fill="${i}"/><circle cx="21" cy="6" r="1" fill="${i}"/><path d="M25 2v8M23 4h4M23 8h4" stroke="${a}" stroke-width="1.2"/><path d="M30 2l4 8M34 2l-4 8" stroke="${i}" stroke-width="1"/>`;}
 else if(kind==="ndebele"){w=40;s=`<rect width="40" height="12" fill="${i}"/><path d="M0 0h40v12H0z" fill="none" stroke="${v}" stroke-width="2"/><path d="M1 11L7 1l6 10z" fill="${a}" stroke="${v}" stroke-width="1.2"/><rect x="15" y="2" width="9" height="8" fill="${b}" stroke="${v}" stroke-width="1.2"/><rect x="18" y="5" width="3" height="2" fill="${i}"/><path d="M26 1h12v4h-8v6h-4z" fill="${c}" stroke="${v}" stroke-width="1.2"/>`;}
 else{w=24;s=`<rect width="24" height="12" fill="${v}"/><circle cx="6" cy="6" r="4" fill="none" stroke="${i}" stroke-width="1.1"/><circle cx="6" cy="6" r="1.4" fill="${i}"/><circle cx="16" cy="3" r="1" fill="${a}"/><circle cx="16" cy="9" r="1" fill="${a}"/><circle cx="20" cy="6" r="1" fill="${a}"/><path d="M12 0v12" stroke="${i}" stroke-width=".6" stroke-dasharray="1.5 1.5"/>`;}
 return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="12">${s}</svg>`)}")`;}
function applyCloth(){const C=lookRGB(),kind=LOOK_CLOTH[S.look]||"kente";document.documentElement.style.setProperty("--band",clothSVG(kind,C));let b=document.getElementById("clothnote");const f=document.querySelector("footer");if(f){if(!b){b=document.createElement("div");b.id="clothnote";b.className="clothnote";f.prepend(b);}b.innerHTML=`<span class="bandchip"></span> ${CLOTH_NAME[kind]} · Section symbols drawn from Adinkra, the Akan symbols of Ghana. Patterns are original drawings inspired by African textile traditions.`;}}


function applyWeave(){const r=document.documentElement.style;if(S.look!=="indaba"){r.removeProperty("--weave");return;}const sv=`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" stroke="rgb(248,204,128)" stroke-width="1.2"><path d="M0 28L14 14l14 14-14 14zM28 28L42 14l14 14-14 14z"/><path d="M14 0l14 14L42 0M14 56l14-14 14 14"/><circle cx="28" cy="28" r="2.2" fill="rgb(248,204,128)"/></svg>`;r.setProperty("--weave",`url("data:image/svg+xml,${encodeURIComponent(sv)}")`);}
/* ---------- 3. Colour that follows the city ---------- */
const CITY_HUE={"Nigeria":"0,186,104","Ghana":"252,206,40","Kenya":"226,62,62","Egypt":"240,188,92","South Africa":"0,176,110","Rwanda":"58,176,230","Ethiopia":"64,190,96","Morocco":"226,72,72","Senegal":"0,170,90","Côte d'Ivoire":"255,145,30","Tanzania":"30,180,230","Uganda":"252,214,40","Cameroon":"235,70,70","DR Congo":"40,150,255","Angola":"235,60,80","Zambia":"240,140,30","Zimbabwe":"255,206,40","Botswana":"110,180,235","Namibia":"80,140,235","Mozambique":"0,170,90","Tunisia":"240,60,60","Sierra Leone":"50,150,230"};
function applyCityColour(){const cur=(location.hash||"#home").slice(1);const r=document.documentElement.style;let c=null;
 if(cur==="atlas"&&S.sonar&&S.sonar.city)c=cityById(S.sonar.city);let hue=c&&CITY_HUE[c.c];if(cur==="minds"&&S.mindC)hue=CITY_HUE[S.mindC];if(hue){r.setProperty("--hi",hue);r.setProperty("--cityglow",hue);document.body.classList.add("citylit");}else{r.removeProperty("--hi");r.removeProperty("--cityglow");document.body.classList.remove("citylit");}}

/* ---------- 4. Motion: count-ups and staggered entrances ---------- */
function countUps(){if(RM)return;document.querySelectorAll("main .big").forEach(el=>{const t=el.textContent.trim();if(!/^\d{1,4}$/.test(t))return;const to=+t;if(!to)return;el.setAttribute("data-notr","");const t0=performance.now(),d=1100;
  const step=n=>{const p=Math.min(1,(n-t0)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(step);};el.textContent="0";requestAnimationFrame(step);});}

/* ---------- 5. Personal welcome with local time in the coach's city ---------- */
const CTZ={"Nigeria":"Africa/Lagos","Ghana":"Africa/Accra","Kenya":"Africa/Nairobi","Egypt":"Africa/Cairo","South Africa":"Africa/Johannesburg","Rwanda":"Africa/Kigali","Ethiopia":"Africa/Addis_Ababa","Morocco":"Africa/Casablanca","Senegal":"Africa/Dakar","Côte d'Ivoire":"Africa/Abidjan","Tanzania":"Africa/Dar_es_Salaam","Uganda":"Africa/Kampala","Cameroon":"Africa/Douala","DR Congo":"Africa/Kinshasa","Angola":"Africa/Luanda","Zambia":"Africa/Lusaka","Zimbabwe":"Africa/Harare","Botswana":"Africa/Gaborone","Namibia":"Africa/Windhoek","Mozambique":"Africa/Maputo","Tunisia":"Africa/Tunis","Sierra Leone":"Africa/Freetown"};
function welcomeStrip(){const c=cityById(S.profile.cityId)||null;const tz=c&&CTZ[c.c];let hh=new Date().getHours(),tm="";
 try{const o={hour:"numeric",minute:"2-digit",hour12:true};if(tz)o.timeZone=tz;tm=new Intl.DateTimeFormat("en-GB",o).format(new Date()).replace(" ","").toLowerCase();if(tz)hh=+new Intl.DateTimeFormat("en-GB",{hour:"numeric",hour12:false,timeZone:tz}).format(new Date());}catch(e){}
 const part=hh<5?"Good night":hh<12?"Good morning":hh<17?"Good afternoon":"Good evening";const _t=(typeof PRO==="function"&&PRO().k!=="coach")?"":"Coach ";const nm=S.profile.name?_t+esc(S.profile.name.split(" ")[0]):(_t.trim()||"friend");
 const A=typeof activation==="function"?activation():null;const low=A?A.D.slice().sort((a,b)=>a[1]-b[1])[0]:null;
 return `<div class="welcome"><span class="wsym">${adk("nsoromma",22)}</span><div><div class="wgreet">${part}, ${nm}${c?` <span class="wtime">— ${tm} in ${esc(c.n)}</span>`:""}</div>${low?`<div class="small">Today's one move: <a href="#${low[2]}">${esc(low[3])}</a> <span class="pill">${esc(low[0])} · ${low[1]}</span></div>`:""}</div>${c?"":`<a class="btn sm ghost right" href="#profile">Set your city</a>`}</div>`;}
(function(){const H=V.home,St=V.start;V.home=()=>welcomeStrip()+H();V.start=()=>welcomeStrip()+St();})();

/* ---------- 6. Phone-first bottom tabs ---------- */
function tabbar(){let t=document.getElementById("tabbar");if(!t){t=document.createElement("div");t.id="tabbar";document.body.appendChild(t);}const cur=(location.hash||"#home").slice(1);
 const T=[["start","Start",adk("nsoromma",20)],["atlas","Atlas","<span class='tg'>◉</span>"],["opps","Bids & jobs","<span class='tg'>✉</span>"],["fas","Future",adk("aya",20)]];
 t.innerHTML=T.map(x=>`<a href="#${x[0]}" class="${cur===x[0]?"on":""}" onclick="document.body.classList.remove('navopen')">${x[2]}<span>${x[1]}</span></a>`).join("")+`<button onclick="document.body.classList.toggle('navopen')" class="${document.body.classList.contains("navopen")?"on":""}"><span class="tg">☰</span><span>More</span></button>`;}

/* ---------- 7. Install to home screen + works on a weak connection ---------- */
let DEFER_INSTALL=null;const IS_IOS=/iphone|ipad|ipod/i.test(navigator.userAgent),STANDALONE=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();DEFER_INSTALL=e;showInstall();});
window.addEventListener("appinstalled",()=>{DEFER_INSTALL=null;toast("DeoCoach is on your home screen");showInstall();});
function showInstall(){const b=document.getElementById("installbtn");if(b)b.style.display=(!STANDALONE&&(DEFER_INSTALL||IS_IOS))?"":"none";}
async function doInstall(){if(DEFER_INSTALL){DEFER_INSTALL.prompt();try{await DEFER_INSTALL.userChoice;}catch(e){}DEFER_INSTALL=null;showInstall();}else if(IS_IOS)toast("On iPhone: tap Share ⇪, then 'Add to Home Screen'");}
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));

/* ---------- 8. Cinematic opening ---------- */
function playIntro(force){if(!force&&(RM||sessionStorage.getItem("dc-intro")||/[?&]nointro/.test(location.search)||navigator.webdriver))return;try{sessionStorage.setItem("dc-intro","1");}catch(e){}
 const o=document.createElement("div");o.id="intro";o.innerHTML=`<canvas id="introc"></canvas><div class="ititle"><img src="brand/crest.png" alt=""><div class="i1">DEOCOACH</div><div class="i2">${S.ed==="africa"?"Edition for African Coaches":"Global Edition · with the Edition for African Coaches"}</div><div class="i3">Activating the Future</div></div><div class="gwrap" data-intro="1"></div><button class="iskip">Skip ›</button>`;document.body.appendChild(o);
 const cv=o.querySelector("canvas"),dpr=window.devicePixelRatio||1,W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;const ctx=cv.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);const C=lookRGB();
 const proj=d3g.geoOrthographic().translate([W/2,H*.40]).clipAngle(90),path=d3g.geoPath(proj,ctx),grat=d3g.geoGraticule10();const R0=Math.min(W,H*.82)*.34;
 const home=cityById(S.profile.cityId)||cityById("lagos");const order=CITIES.slice().sort((a,b)=>km(home,a)-km(home,b));const stars=Array.from({length:160},()=>[Math.random()*W,Math.random()*H,Math.random()*1.3+.2,Math.random()]);
 let done=false,gated=false;const t0=performance.now(),T=60000;const end=()=>{if(done)return;done=true;window._introEnd=null;o.classList.add("out");setTimeout(()=>o.remove(),700);};window._introEnd=end;
 o.querySelector(".iskip").onclick=end;o.onclick=e=>{if(e.target===cv)end();};
 function fr(n){if(done)return;const t=n-t0,p=Math.min(1,t/2600),e=1-Math.pow(1-p,3);ctx.clearRect(0,0,W,H);
  stars.forEach(s=>{ctx.globalAlpha=.35+.65*Math.abs(Math.sin(n/900+s[3]*6));ctx.fillStyle=`rgb(${C.acc2})`;ctx.fillRect(s[0],s[1],s[2],s[2]);});ctx.globalAlpha=1;
  proj.rotate([-110+92*e,-28+26*e]).scale(R0*(.55+.45*e));
  const g=ctx.createRadialGradient(W/2,H*.40,8,W/2,H*.40,proj.scale());g.addColorStop(0,`rgb(${C.deep})`);g.addColorStop(1,`rgb(${C.void})`);ctx.beginPath();path({type:"Sphere"});ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();path(grat);ctx.strokeStyle=`rgba(${C.acc2},.07)`;ctx.lineWidth=.6;ctx.stroke();
  const lit=Math.max(0,Math.min(1,(t-1200)/2600));
  WORLD.features.forEach(f=>{const af=AFRICA.has(f.properties.n);ctx.beginPath();path(f);ctx.fillStyle=af?`rgba(${C.acc},${.06+.14*lit})`:`rgba(${C.ink},.03)`;ctx.fill();ctx.strokeStyle=af?`rgba(${C.acc2},${.25+.4*lit})`:`rgba(${C.ink},.07)`;ctx.lineWidth=af?.8:.5;ctx.stroke();});
  ctx.beginPath();path({type:"Sphere"});ctx.strokeStyle=`rgba(${C.acc},.5)`;ctx.lineWidth=1.4;ctx.stroke();
  const centre=proj.invert([W/2,H*.40]);const nOn=Math.floor(lit*order.length);
  order.slice(0,nOn).forEach((c,i)=>{if(d3g.geoDistance([c.lon,c.lat],centre)>1.5)return;const p=proj([c.lon,c.lat]);if(!p)return;const age=(t-1200)/2600*order.length-i;
   if(i>0&&i<14){ctx.beginPath();path({type:"LineString",coordinates:[[home.lon,home.lat],[c.lon,c.lat]]});ctx.strokeStyle=`rgba(${C.acc},${Math.min(.5,age*.08)})`;ctx.lineWidth=1;ctx.stroke();}
   const fl=Math.max(0,1-age/3);ctx.beginPath();ctx.arc(p[0],p[1],3+fl*16,0,7);ctx.strokeStyle=`rgba(${C.acc2},${fl*.8})`;ctx.lineWidth=1.4;ctx.stroke();
   const gg=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],9);gg.addColorStop(0,`rgba(${C.acc2},.95)`);gg.addColorStop(1,`rgba(${C.acc},0)`);ctx.beginPath();ctx.arc(p[0],p[1],9,0,7);ctx.fillStyle=gg;ctx.fill();});
  if(t>3500)o.classList.add("titled");if(t>5200&&!gated){gated=true;gateRefresh();o.classList.add("gated");}if(t>T)return end();requestAnimationFrame(fr);}
 requestAnimationFrame(fr);}

/* ---------- 9. Presenter mode for the press parley and gala ---------- */
const TOUR=[["start","Where do you want to begin?","Eight questions every African coach asks — answered from the coach's own numbers."],
 ["industry","Industry Intelligence","Pick your clients' industries: see where their power brokers gather across Africa and the world — ranked by a model that learns you."],
 ["industry","The Council Room","Bring any industry happening into the room. The council turns it into coaching products — who buys, the pitch, and the dates to pitch, pilot and launch.","#room"],
 ["industry","Event Prep Copilot","Ask at depth before any room: the power brokers, your talk abstract, your 30-second introduction, the etiquette, the follow-up.","#pc"],
 ["events","Events & Happenings Radar","A seismograph of the year ahead: the rooms to be in, your best role, how long to stay — and the elections and budget cycles that move money."],
 ["bodies","Professional Bodies — Africa & Global","59 professional bodies and flagship conferences, from CIPM, ICAN and the NBA to ICF Converge and SHRM — with your conference year planned."],
 ["academies","Coaching Academies","Where Africa trains its coaches: from OLCA in Lagos to Strathmore in Nairobi, UCT and Stellenbosch in Cape Town and the schools of Abidjan, with accreditation and evidence for each."],
 ["bizdev","Budget & Pipeline Engine","Work backwards from the income you want to the conversations you need this week — and spend only where your buyers gather."],
 ["atlas","Horizon Atlas","Where coaching opportunity is rising across 30 African cities, from Year 1 to Year 10."],
 ["opps","Opportunity Desk","Live tenders, bids and jobs, gathered daily from public sources."],
 ["fas","Future Activation","The Future Activation Coaching System: 320 capabilities, backcasting, power moves and scenarios."],
 ["home","Command Centre","Your briefing, your plan and your next move — in 25 languages, learning every day."]];

/* ---------- Presenter soundtrack: an original, generative Afro-ambient score built live with the Web Audio API (no recordings) ---------- */
const PSND={ctx:null,master:null,timer:null,step:0,muted:false,next:0,
 /* Original cinematic action score, synthesised live (Web Audio, no recordings): 128 BPM, D minor, i–VI–III–VII.
    16-bar cycle: bars 1–4 string ostinato + pulse; 5–8 full taiko; 9–16 brass stabs, snares, hats; bar 16 riser → impact. */
 init(){if(this.ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=this.ctx=new C();
  this.master=c.createGain();this.master.gain.value=0;const comp=c.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=8;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.2;
  const out=c.createGain();out.gain.value=1.05;this.master.connect(comp);comp.connect(out);out.connect(c.destination);
  // hall reverb from a generated impulse
  const len=c.sampleRate*3,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);}
  this.rev=c.createConvolver();this.rev.buffer=ir;const rg=c.createGain();rg.gain.value=.32;this.rev.connect(rg);rg.connect(this.master);
  this.bus=c.createGain();this.bus.connect(this.master);this.send=c.createGain();this.send.gain.value=1;this.bus.connect(this.send);this.send.connect(this.rev);
  this.noise=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const n=this.noise.getChannelData(0);for(let i=0;i<n.length;i++)n[i]=Math.random()*2-1;},
 hz(n){return 73.42*Math.pow(2,(n+((this.v&&this.v.k)||0))/12);},// D2 + variant key
 env(g,t,a,peak,dur){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);},
 nz(t,dur,type,f,q,v,dst){const c=this.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;this.env(g,t,.002,v,dur);s.connect(fl);fl.connect(g);g.connect(dst||this.bus);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);return fl;},
 str(t,n,v,dur){const c=this.ctx,f=c.createBiquadFilter(),g=c.createGain();f.type="lowpass";f.Q.value=4;f.frequency.setValueAtTime(2600,t);f.frequency.exponentialRampToValueAtTime(500,t+dur);this.env(g,t,.006,v,dur);f.connect(g);g.connect(this.bus);
  [-9,9].forEach(det=>{const o=c.createOscillator();o.type="sawtooth";o.frequency.value=this.hz(n);o.detune.value=det;o.connect(f);o.start(t);o.stop(t+dur+.05);});},
 taiko(t,v){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(42,t+.35);this.env(g,t,.003,v,.6);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+.65);this.nz(t,.12,"lowpass",900,1,v*.5);},
 snare(t,v){this.nz(t,.22,"bandpass",1900,.8,v);const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.setValueAtTime(210,t);o.frequency.exponentialRampToValueAtTime(150,t+.08);this.env(g,t,.002,v*.6,.12);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+.15);},
 hat(t,v){this.nz(t,.04,"highpass",8000,1,v);},
 brass(t,notes,v,dur){const c=this.ctx,f=c.createBiquadFilter(),g=c.createGain();f.type="lowpass";f.Q.value=2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(2800,t+.06);f.frequency.exponentialRampToValueAtTime(700,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.03);g.gain.setValueAtTime(v,t+dur*.6);g.gain.exponentialRampToValueAtTime(.0001,t+dur);f.connect(g);g.connect(this.bus);
  notes.forEach(n=>[-7,0,7].forEach(det=>{const o=c.createOscillator();o.type="sawtooth";o.frequency.value=this.hz(n+12);o.detune.value=det;o.connect(f);o.start(t);o.stop(t+dur+.05);}));},
 sub(t,n,dur){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=this.hz(n-12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.05);g.gain.setValueAtTime(.22,t+dur*.8);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+dur+.05);},
 riser(t,dur){const c=this.ctx;// noise sweep + rising saw
  const s=c.createBufferSource(),f=c.createBiquadFilter(),gg=c.createGain();s.buffer=this.noise;f.type="bandpass";f.Q.value=2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(7000,t+dur);gg.gain.setValueAtTime(.0001,t);gg.gain.exponentialRampToValueAtTime(.35,t+dur);gg.gain.linearRampToValueAtTime(0,t+dur+.02);s.connect(f);f.connect(gg);gg.connect(this.bus);s.start(t);s.stop(t+dur+.05);
  const o=c.createOscillator(),og=c.createGain();o.type="sawtooth";o.frequency.setValueAtTime(this.hz(0),t);o.frequency.exponentialRampToValueAtTime(this.hz(24),t+dur);og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(.05,t+dur);og.gain.linearRampToValueAtTime(0,t+dur+.02);o.connect(og);og.connect(this.bus);o.start(t);o.stop(t+dur+.05);},
 impact(t){if(!this.ctx)return;t=t||this.ctx.currentTime+.02;const c=this.ctx;
  // BRAAM: low brass cluster that closes down, a sub boom, a crash and a big taiko
  const f=c.createBiquadFilter(),g=c.createGain();f.type="lowpass";f.Q.value=3;f.frequency.setValueAtTime(3500,t);f.frequency.exponentialRampToValueAtTime(160,t+2.6);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+3);f.connect(g);g.connect(this.bus);
  [-12,-5,0,3].forEach(n=>[-12,0,12].forEach(det=>{const o=c.createOscillator();o.type="sawtooth";o.frequency.value=this.hz(n);o.detune.value=det;o.connect(f);o.start(t);o.stop(t+3.1);}));
  const b=c.createOscillator(),bg=c.createGain();b.type="sine";b.frequency.setValueAtTime(80,t);b.frequency.exponentialRampToValueAtTime(28,t+1.4);this.env(bg,t,.004,.9,1.8);b.connect(bg);bg.connect(this.bus);b.start(t);b.stop(t+1.9);
  this.nz(t,1.6,"highpass",3000,.7,.18);this.taiko(t,.9);},
 choir(t,notes,dur){const c=this.ctx;notes.forEach(n=>{const o=c.createOscillator(),lfo=c.createOscillator(),lg=c.createGain(),g=c.createGain();o.type="sawtooth";o.frequency.value=this.hz(n+12);lfo.frequency.value=5.2;lg.gain.value=4;lfo.connect(lg);lg.connect(o.detune);
   [[700,.9],[1150,.6],[2600,.25]].forEach(([f,a])=>{const b=c.createBiquadFilter(),bg=c.createGain();b.type="bandpass";b.frequency.value=f;b.Q.value=7;bg.gain.value=a;o.connect(b);b.connect(bg);bg.connect(g);});
   g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+.5);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(this.bus);o.start(t);lfo.start(t);o.stop(t+dur+.1);lfo.stop(t+dur+.1);});},
 anvil(t,v){const c=this.ctx;[[880,1],[2117,.6],[3341,.4],[4790,.25]].forEach(([f,a])=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;this.env(g,t,.001,v*a,1.1);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+1.2);});},
 // reverse-cymbal swell + rising tone + taiko roll that lands exactly on the slide change
 pre(lead){if(!this.ctx||this.muted)return;const c=this.ctx,t=c.currentTime+.02,e=t+lead;this.preT=e;this.cut=e+.05;
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type="highpass";f.frequency.setValueAtTime(1200,t);f.frequency.exponentialRampToValueAtTime(5000,e);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.5,e-.02);g.gain.linearRampToValueAtTime(0,e);s.connect(f);f.connect(g);g.connect(this.bus);s.start(t);s.stop(e+.05);
  const o=c.createOscillator(),og=c.createGain();o.type="sawtooth";o.frequency.setValueAtTime(this.hz(-12),t);o.frequency.exponentialRampToValueAtTime(this.hz(12),e);og.gain.setValueAtTime(.0001,t);og.gain.exponentialRampToValueAtTime(.08,e-.02);og.gain.linearRampToValueAtTime(0,e);o.connect(og);og.connect(this.bus);o.start(t);o.stop(e+.05);
  const n=Math.round(lead/.06);for(let i=0;i<n;i++){const k=i/n;if(k>.55)this.taiko(e-(n-i)*.06*(1-k*.4),.15+k*.55);}
  for(let i=0;i<8;i++)this.snare(e-.5+i*.0625,.08+i*.03);},
 chime(){if(!this.ctx||this.muted)return;const c=this.ctx,now=c.currentTime;let t=now+.02;
  if(!(this.preT&&Math.abs(this.preT-now)<.35)){this.pre(.45);t=now+.47;}// manual click: quick suck-back before the hit
  this.preT=0;this.impact(t);this.anvil(t,.12);this.choir(t+.05,[-12,-5,0,3,7],3.4);
  this.brass(t,[-12,-5,0],.07,1.6);this.taiko(t+.18,.7);this.taiko(t+.36,.55);
  // hold the score in suspense, then slam back in at full force with a drum fill
  this.duck(t,2.3);this.cut=t+2.3;this.step=8*16;this.next=t+2.3;for(let i=0;i<8;i++)this.taiko(t+1.82+i*.06,.2+i*.07);},
 // Four original scores; one is picked at random each time ▶ Present starts (never the same twice in a row).
 VARIANTS:[
  {name:"Rise of the Continent",bpm:128,k:0,prog:[0,-4,3,-2],ch:[[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],ost:[0,0,12,0,0,10,0,12,0,0,15,0,12,0,10,7]},
  {name:"Thunder over the Savannah",bpm:140,k:2,prog:[0,-4,-2,-5],ch:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-2,2]],ost:[0,12,0,7,0,12,0,10,0,12,0,7,0,15,12,10]},
  {name:"Kings of the Horizon",bpm:112,k:-2,prog:[0,3,-2,-4],ch:[[0,3,7],[3,7,10],[-2,2,5],[-4,0,3]],ost:[0,0,7,0,0,8,0,7,0,0,12,0,10,0,8,7]},
  {name:"The Pursuit",bpm:150,k:-5,prog:[0,-4,5,-2],ch:[[0,3,7],[-4,0,3],[5,8,12],[-2,2,5]],ost:[0,7,12,7,0,7,13,7,0,7,12,7,15,13,12,7]}],
 // Royalty-free MP3 tracks (e.g. from Pixabay) dropped into /music and listed here join the random rotation.
 MUSIC:[],
 TK:{0:1,3:.55,6:.7,8:.9,10:.5,11:.6,14:.75},
 schedule(){if(this.mode!=="synth")return;const c=this.ctx,V=this.v,sp=60/V.bpm/4;
  while(this.next<c.currentTime+.3){const t=this.next,st=this.step%16,bar=Math.floor(this.step/16)%16,r=V.prog[bar%4],sec=bar<4?1:bar<8?2:3,quiet=this.cut&&t<this.cut;
   if(!quiet){
    this.str(t,V.ost[st]+r,sec===1?.028:sec===2?.045:.065,sp*1.6);if(sec>1)this.str(t,V.ost[st]+r+12,.025,sp*1.2);
    if(st===0)this.sub(t,r,sp*16);
    const k=this.TK[st];if(k&&(sec>1||st===0||st===8))this.taiko(t,k*(sec===3?.85:.7));
    if(sec===3){if(st===4||st===12)this.snare(t,.28);if(st%2===0)this.hat(t,st%4?.05:.09);
     if(st===0)this.brass(t,V.ch[bar%4],.05,sp*6);if(st===10&&bar%2)this.brass(t,V.ch[bar%4],.04,sp*3);}
    if(bar===15&&st===0)this.riser(t,sp*16);
    if(bar===0&&st===0&&this.step>0)this.impact(t);}
   this.step++;this.next+=sp;}},
 pick(){const pool=[...this.VARIANTS.map((v,i)=>({t:"synth",i,name:v.name})),...this.MUSIC.map((m,i)=>({t:"mp3",i,name:m.title}))];let last="";try{last=localStorage.getItem("dc-track")||"";}catch(e){}
  let c=pool.filter(x=>x.name!==last);if(!c.length)c=pool;const ch=c[Math.floor(Math.random()*c.length)];try{localStorage.setItem("dc-track",ch.name);}catch(e){}return ch;},
 playMp3(m){const c=this.ctx;if(this.el){try{this.el.pause();}catch(e){}}const el=this.el=new Audio();el.crossOrigin="anonymous";el.src=m.src;el.loop=true;el.preload="auto";
  if(!this.tg){this.tg=c.createGain();this.tg.connect(this.master);}const src=c.createMediaElementSource(el);src.connect(this.tg);this.tg.gain.value=1;el.play().catch(()=>{});},
 duck(t,len){if(this.mode!=="mp3"||!this.tg)return;const g=this.tg.gain;g.cancelScheduledValues(t-.5);g.setValueAtTime(1,t-.5);g.linearRampToValueAtTime(.2,t);g.setValueAtTime(.2,t+len-.4);g.linearRampToValueAtTime(1,t+len);},
 start(){try{this.init();if(!this.ctx)return;this.ctx.resume();const ch=this.pick();this.name=ch.name;this.mode=ch.t;if(ch.t==="mp3"){this.v=this.VARIANTS[0];this.playMp3(this.MUSIC[ch.i]);}else this.v=this.VARIANTS[ch.i];this.step=0;this.cut=0;this.next=this.ctx.currentTime+.15;this.impact(this.ctx.currentTime+.05);this.next+=1.4;const g=this.master.gain;g.cancelScheduledValues(this.ctx.currentTime);g.setValueAtTime(this.muted?0:.75,this.ctx.currentTime);clearInterval(this.timer);this.timer=setInterval(()=>this.schedule(),90);this.schedule();}catch(e){}},
 stop(){if(!this.ctx)return;const g=this.master.gain,t=this.ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+1.5);setTimeout(()=>{clearInterval(this.timer);this.timer=null;if(this.el){try{this.el.pause();}catch(e){}this.el=null;}},1600);},
 welcome(){try{this.init();if(!this.ctx)return;this.ctx.resume();if(this.timer)return;this.v=this.v||this.VARIANTS[0];const c=this.ctx,t=c.currentTime+.06,g=this.master.gain;g.cancelScheduledValues(t);g.setValueAtTime(.8,t);
  this.riser(t,1.1);const h=t+1.1;this.impact(h);this.anvil(h,.14);this.choir(h+.05,[0,4,7,12,16],5);this.brass(h,[0,7,12],.07,2.4);this.taiko(h+.2,.6);this.taiko(h+.4,.45);
  this.brass(h+2.3,[5,9,12],.05,2.2);this.choir(h+2.3,[5,9,12,17],3.4);this.taiko(h+2.3,.4);this.brass(h+4.3,[0,4,7,12],.065,3.2);this.choir(h+4.3,[0,4,7,12,16],4.6);this.anvil(h+4.3,.09);this.taiko(h+4.3,.55);
  g.setValueAtTime(.8,h+7.2);g.linearRampToValueAtTime(0.0001,h+9.6);}catch(e){}},
 toggle(){this.muted=!this.muted;try{localStorage.setItem("dc-mute",this.muted?"1":"");}catch(e){}if(this.ctx){const g=this.master.gain,t=this.ctx.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(this.muted?0:.75,t+.3);}}};
try{PSND.muted=localStorage.getItem("dc-mute")==="1";}catch(e){}
const PR={on:false,i:0,timer:null,paused:false,dur:28000,t0:0};
function qrSVG(sz){return `<svg viewBox="-2 -2 ${QR_N+4} ${QR_N+4}" width="${sz}" height="${sz}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${QR_N+4}" height="${QR_N+4}" fill="#fff" rx="1.5"/><path d="${QR_D}" stroke="#0b1430" fill="none"/></svg>`;}
function presentStart(){if(PR.on)return;PR.on=true;PR.i=0;if(!S.ind.sel.length){S.ind.sel=['fin','energy','pub'];PR.demoInd=1;}if(!S.ind.room.topic){S.ind.room.topic='Banks across Africa must raise new capital — mergers and leadership changes are coming';PR.demoTopic=1;}PSND.start();PR.paused=false;document.body.classList.add("presenting");try{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{});}catch(e){}
 let b=document.getElementById("pbar");if(!b){b=document.createElement("div");b.id="pbar";document.body.appendChild(b);}presentGo(0);}
function presentStop(){PR.on=false;clearTimeout(PR.pre);PSND.stop();if(PR.demoInd){S.ind.sel=[];PR.demoInd=0;}if(PR.demoTopic){S.ind.room.topic='';PR.demoTopic=0;}clearTimeout(PR.timer);clearTimeout(PR.sc);document.body.classList.remove("presenting");const b=document.getElementById("pbar");if(b)b.remove();try{document.fullscreenElement&&document.exitFullscreen();}catch(e){}}
function presentGo(i){const _first=PR.lastI===undefined;PR.i=(i+TOUR.length)%TOUR.length;PR.lastI=PR.i;if(!_first)PSND.chime();const s=TOUR[PR.i];PR.dur=Math.min(36000,Math.max(26000,16000+(s[1].length+s[2].length)*110));clearTimeout(PR.timer);clearTimeout(PR.sc);location.hash=s[0];window.scrollTo(0,0);PR.t0=Date.now();
 document.getElementById("pbar").innerHTML=`<div class="pcap"><div class="pk">DEOCOACH · EDITION FOR AFRICAN COACHES · ${PR.i+1}/${TOUR.length}${PSND.name&&!PSND.muted?` · ♪ ${PSND.name}`:""}</div><div class="pt">${s[1]}</div><div class="pl">${s[2]}</div></div>
 <div class="pctl"><button onclick="presentGo(PR.i-1)" title="Back">◀</button><button onclick="presentPause()" title="Pause">${PR.paused?"▶":"❚❚"}</button><button onclick="presentGo(PR.i+1)" title="Next">▶</button><button onclick="PSND.toggle();presentGo(PR.i)" title="Sound on/off (M)">${PSND.muted?"🔇":"🔊"}</button><button onclick="presentStop()" title="Exit (Esc)">✕</button></div>
 <div class="pqr">${qrSVG(108)}<div><b>Scan to open on your phone</b><br>deocoach.vercel.app<br><span class="small">Free · 25 languages · works on a weak connection</span></div></div><div class="pprog"><i style="animation-duration:${PR.dur}ms;animation-play-state:${PR.paused?"paused":"running"}"></i></div>`;
 translatePage&&setTimeout(()=>{const r=document.getElementById("pbar");if(r&&S.lang&&S.lang!=="en")trNodes(r).forEach(n=>{const v=trLookup(n.nodeValue.trim());if(v)n.nodeValue=v;});},50);
 if(s[3])setTimeout(()=>{const el=document.querySelector(s[3]);if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-90,behavior:'smooth'});},700);if(!PR.paused){PR.sc=setTimeout(()=>{if(!s[3])window.scrollTo({top:Math.min(520,document.body.scrollHeight*.25),behavior:"smooth"});},PR.dur*.5);clearTimeout(PR.pre);PR.pre=setTimeout(()=>PSND.pre(2.4),PR.dur-2400);PR.timer=setTimeout(()=>presentGo(PR.i+1),PR.dur);}presentFX();}
const PHOTO_VIEW={home:"p-headshot",start:"p-headshot",industry:"p-point",events:"p-chair",bodies:"head-formal",bizdev:"p-call",atlas:"pointing",opps:"p-awards",fas:"p-trophies",minds:"head-casual",income:"p-call",scenarios:"p-point",mentor:"p-chair",academies:"head-formal"};
function dGhost(){let g=document.getElementById("dghost");const v=(location.hash||"#home").slice(1).split("?")[0],f=PHOTO_VIEW[v]||"head-formal";
 if(g&&g.dataset.f===f)return;if(g)g.remove();g=document.createElement("div");g.id="dghost";g.dataset.f=f;g.setAttribute("aria-hidden","true");g.style.backgroundImage=`url(david/${f}.webp)`;document.body.appendChild(g);}
function presentFX(){let fl=document.getElementById("pflash");if(!fl){fl=document.createElement("div");fl.id="pflash";document.body.appendChild(fl);}fl.classList.remove("go");void fl.offsetWidth;if(!PSND.muted||true)fl.classList.add("go");
 const pt=document.querySelector("#pbar .pt");if(pt){pt.classList.remove("in");void pt.offsetWidth;pt.classList.add("in");}dGhost();const g=document.getElementById("dghost");if(g){g.classList.remove("in");void g.offsetWidth;g.classList.add("in");}}
function presentPause(){PR.paused=!PR.paused;presentGo(PR.i);}
document.addEventListener("keydown",e=>{if(!PR.on)return;if(e.key==="Escape")presentStop();else if(e.key==="ArrowRight")presentGo(PR.i+1);else if(e.key==="ArrowLeft")presentGo(PR.i-1);else if(e.key===" "){e.preventDefault();presentPause();}else if(e.key==="m"||e.key==="M"){PSND.toggle();presentGo(PR.i);}});
document.addEventListener("fullscreenchange",()=>{if(PR.on&&!document.fullscreenElement&&PR.fsWas)presentStop();PR.fsWas=!!document.fullscreenElement;});

/* ---------- 10. Shareable result cards (1080×1350, for WhatsApp, LinkedIn and Instagram) ---------- */
let CREST=null;function crestImg(){return new Promise(r=>{if(CREST)return r(CREST);const i=new Image();i.onload=()=>{CREST=i;r(i);};i.onerror=()=>r(null);i.src="brand/crest.png";});}
function wrapText(ctx,t,x,y,w,lh,max){const ws=String(t).split(" ");let line="",n=0;for(const wd of ws){const tt=line?line+" "+wd:wd;if(ctx.measureText(tt).width>w&&line){ctx.fillText(line,x,y);y+=lh;line=wd;if(++n>=(max||9)-1){break;}}else line=tt;}if(line)ctx.fillText(line,x,y);return y+lh;}
async function makeCard(kind){try{await document.fonts.ready;}catch(e){}const C=lookRGB(),W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");const crest=await crestImg();
 const fD=getComputedStyle(document.documentElement).getPropertyValue("--fontD").trim()||"Georgia",fM="Cinzel, Georgia, serif",fS="Manrope, Inter, sans-serif";
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,`rgb(${C.void})`);g.addColorStop(1,`rgb(${C.deep})`);x.fillStyle=g;x.fillRect(0,0,W,H);
 const rg=x.createRadialGradient(W*.78,H*.42,10,W*.78,H*.42,700);rg.addColorStop(0,`rgba(${C.acc},.22)`);rg.addColorStop(1,`rgba(${C.acc},0)`);x.fillStyle=rg;x.fillRect(0,0,W,H);
 for(let i=0;i<140;i++){x.fillStyle=`rgba(${C.acc2},${Math.random()*.5})`;const s=Math.random()*2;x.fillRect(Math.random()*W,Math.random()*H,s,s);}
 // kente-style band top and bottom
 const band=(y)=>{const cols=[C.acc,C.hi,C.warm,C.acc2];for(let i=0;i<W;i+=36){x.fillStyle=`rgb(${cols[(i/36)%4|0]})`;x.fillRect(i,y,30,14);x.fillStyle=`rgb(${C.void})`;x.fillRect(i+30,y,6,14);x.fillRect(i+6,y+5,18,4);}};band(0);band(H-14);
 if(crest)x.drawImage(crest,70,64,150,127);x.fillStyle=`rgb(${C.acc2})`;x.font=`700 52px ${fM}`;x.fillText("DEOCOACH",246,124);x.fillStyle=`rgb(${C.mute})`;x.font=`500 26px ${fS}`;x.fillText("Edition for African Coaches",248,166);
 const nm=S.profile.name||"",city=cityById(S.profile.cityId);let score,label,title,sub,segs,foot;
 if(kind==="xray"){const X=xray();segs=X.rows.map(r=>[r.l[1],r.sc||0]);score=Math.round(avgN(segs.map(s=>s[1])));title="COACH X-RAY";label="Business health";sub=X.bott?`Bottleneck to fix first: ${X.bott.l[1]} — ${X.bott.l[2]}`:"";foot="Eight layers of a coaching business, scored 0–100.";}
 else{const A=activation();segs=A.D.map(d=>[d[0],d[1]]);score=A.idx;title="ACTIVATION INDEX";label="Future activation";const low=A.D.slice().sort((a,b)=>a[1]-b[1]).slice(0,2);sub="Lifting next: "+low.map(l=>l[0]).join(" and ");foot="Fourteen dimensions of activating the future as a coach.";}
 x.fillStyle=`rgb(${C.acc})`;x.font=`700 30px ${fM}`;x.fillText(title,70,270);x.fillStyle=`rgb(${C.ink})`;x.font=`600 58px ${fD}`;x.fillText(nm?nm:"An African coach",70,338);
 if(city){x.fillStyle=`rgb(${C.mute})`;x.font=`500 28px ${fS}`;x.fillText(city.n+", "+city.c,70,382);}
 // radial bar ring
 const n=segs.length,cx=W/2,cy=n>10?738:760,r0=150,r1=n>10?296:330,da=Math.PI*2/n;
 x.strokeStyle=`rgba(${C.acc2},.12)`;x.lineWidth=1;[0.25,.5,.75,1].forEach(f=>{x.beginPath();x.arc(cx,cy,r0+(r1-r0)*f,0,7);x.stroke();});
 segs.forEach((s,i)=>{const a0=-Math.PI/2+i*da+.035,a1=a0+da-.07,rr=r0+(r1-r0)*Math.max(.04,s[1]/100);const col=s[1]>=67?C.hi:s[1]>=40?C.acc:C.warm;
  x.beginPath();x.arc(cx,cy,rr,a0,a1);x.arc(cx,cy,r0,a1,a0,true);x.closePath();const gg=x.createRadialGradient(cx,cy,r0,cx,cy,r1);gg.addColorStop(0,`rgba(${col},.35)`);gg.addColorStop(1,`rgba(${col},.95)`);x.fillStyle=gg;x.fill();
  const am=(a0+a1)/2,lx=cx+Math.cos(am)*(r1+28),ly=cy+Math.sin(am)*(r1+28);x.font=`600 ${n>10?19:23}px ${fS}`;x.fillStyle=`rgb(${C.ink})`;x.textAlign=Math.cos(am)>.2?"left":Math.cos(am)<-.2?"right":"center";x.textBaseline="middle";
  const lbl=s[0].length>18?s[0].split(" ")[0]:s[0];x.fillText(lbl,lx,ly);x.fillStyle=`rgb(${C.mute})`;x.font=`500 ${n>10?17:20}px ${fS}`;x.fillText(String(s[1]),lx,ly+(n>10?20:24));});
 x.textAlign="center";x.textBaseline="alphabetic";x.beginPath();x.arc(cx,cy,r0-14,0,7);x.fillStyle=`rgba(${C.void},.85)`;x.fill();x.strokeStyle=`rgba(${C.acc},.7)`;x.lineWidth=2;x.stroke();
 x.fillStyle=`rgb(${C.acc2})`;x.font=`700 118px ${fD}`;x.fillText(String(score),cx,cy+30);x.fillStyle=`rgb(${C.mute})`;x.font=`600 22px ${fS}`;x.fillText(label.toUpperCase(),cx,cy+72);
 x.textAlign="left";x.fillStyle=`rgb(${C.ink})`;x.font=`600 30px ${fS}`;let y=wrapText(x,sub,70,1170,740,40,2);x.fillStyle=`rgb(${C.mute})`;x.font=`500 22px ${fS}`;x.fillText(foot,70,y+2);
 x.fillStyle=`rgb(${C.acc2})`;x.font=`700 26px ${fS}`;x.fillText("Take yours free: deocoach.vercel.app",70,1290);
 const q=170,qx=W-70-q,qy=1120;x.fillStyle="#fff";x.beginPath();x.roundRect?x.roundRect(qx-10,qy-10,q+20,q+20,12):x.rect(qx-10,qy-10,q+20,q+20);x.fill();x.save();x.translate(qx,qy);x.scale(q/QR_N,q/QR_N);x.strokeStyle="#0b1430";x.lineWidth=1;x.stroke(new Path2D(QR_D));x.restore();
 return cv;}
async function shareCard(kind){const cv=await makeCard(kind);const url=cv.toDataURL("image/png");const m=document.createElement("div");m.className="sharem";m.innerHTML=`<div class="sharebox"><img src="${url}" alt="Your ${kind==="xray"?"Coach X-Ray":"Activation Index"} card"><div class="flex" style="justify-content:center;margin-top:12px"><button class="btn" id="shgo">⇪ Share</button><a class="btn ghost" download="DeoCoach-${kind==="xray"?"X-Ray":"Activation-Index"}.png" href="${url}">Download</a><a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent("My DeoCoach "+(kind==="xray"?"Coach X-Ray":"Activation Index")+" — take yours free: https://deocoach.vercel.app")}">WhatsApp</a><button class="btn ghost" onclick="this.closest('.sharem').remove()">Close</button></div><p class="small center">Card made on your device. Nothing is uploaded unless you share it.</p></div>`;document.body.appendChild(m);m.onclick=e=>{if(e.target===m)m.remove();};translatePage();
 m.querySelector("#shgo").onclick=()=>cv.toBlob(async b=>{const f=new File([b],`DeoCoach-${kind}.png`,{type:"image/png"});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"DeoCoach",text:"Take yours free: https://deocoach.vercel.app"});return;}}catch(e){if(e&&e.name==="AbortError")return;}const a=document.createElement("a");a.href=url;a.download=f.name;a.click();toast("Card downloaded — post it anywhere");});}

/* ---------- header buttons and render hook ---------- */
(function(){const top=document.querySelector(".top");if(top){const w=document.createElement("div");w.className="topx";w.innerHTML=`<button class="lookbtn" id="installbtn" style="display:none" onclick="doInstall()">⤓ Install app</button><button class="lookbtn pbtn" onclick="presentStart()">▶ Present</button>`;const l=top.querySelector(".looks");top.insertBefore(w,l);}
 const f=document.querySelector("footer .credit");if(f){const a=document.createElement("div");a.className="small";a.style.marginTop="8px";a.innerHTML=`<a href="javascript:void 0" onclick="playIntro(true)">Replay the opening</a> · <a href="javascript:void 0" onclick="presentStart()">Presenter mode</a>`;f.after(a);}
 showInstall();})();
function polishAfter(){try{dGhost();}catch(e){}applyCloth();applyWeave();applyCityColour();adkNav();tabbar();countUps();if(PR.on&&document.getElementById("main"))document.getElementById("main").classList.add("pmain");}
window.POLISH_READY=true;render();
if(location.hash==="#present")setTimeout(()=>{presentStart();},400);
setTimeout(()=>playIntro(false),60);
