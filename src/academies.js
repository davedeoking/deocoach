// ===== Coaching Academies & Training Organisations across Africa =====
// Researched from public sources, 22 Nov 2026. ok:"v" = details confirmed on the provider's own site or national press.
// This is a guide, not a ranking: academies are grouped by region with the evidence for each. Featured: OLCA, Lagos.
const ACADEMIES=[
 {id:"olca",feat:1,name:"OLCA Coaching Ltd — Olusola Lanre Coaching Academy",city:"Lagos",area:"Victoria Island",ctry:"Nigeria",reg:"West Africa",
  lead:"Founder & Chief Catalyst: Dr Lanre Olusola, \"The Catalyst\"",
  what:"Integrative coaching certification: life coaching, workplace psychology, health coaching, and coaching for HR and leaders. University diplomas, degrees and master's pathways through a five-year MoU with Myles Leadership University (2024).",
  acc:["LCAN Level 3 Coach Training Institution","Integrative & Transformative Catalysis (ITC) method"],
  focus:["life","integrative","corporate","academic"],lvl:"Certification → diploma, degree, master's",lang:"English",
  why:"West Africa's first wholly integrative coaching academy, and Lagos's best-known home for new coaches. Its LCAN Level 3 accreditation was presented during Africa Coaching Week.",
  src:"https://guardian.ng/?p=2497251",ok:"v"},
 {id:"core",name:"Centre for CoRE Coaching (TBA Consults)",city:"Lagos",area:"Lekki Phase 1",ctry:"Nigeria",reg:"West Africa",
  lead:"Founding director: Ajibola Ponnle, founding president of ICF Nigeria",
  what:"Certified Professional Coach programme built on the ICF core competencies and code of ethics; internal-coach and culture-change programmes for organisations.",
  acc:["ICF-competency based","First Nigerian-owned programme to follow ICF standards"],
  focus:["exec","corporate"],lvl:"Professional certification",lang:"English",
  why:"A pioneer of ICF-standard coach training in Nigeria, with deep links to HR and the public service.",
  src:"https://www.thisdaylive.com/2019/03/08/tba-grooms-coaches-to-maximise-personal-professional-potentials",ok:"v"},
 {id:"ez37",name:"EZ37 Solutions",city:"Lagos",ctry:"Nigeria",reg:"West Africa",
  lead:"Lagos and London",
  what:"ICF-accredited Level 1 coach certification, delivered virtually in modules (self-awareness, the being and doing of a coach, core competencies, essentials of coaching).",
  acc:["ICF Level 1 accredited"],focus:["exec","online"],lvl:"ICF Level 1",lang:"English",
  why:"A Nigerian-run route to the ICF ACC credential without travelling.",
  src:"https://www.growlearnconnect.org/node/1266",ok:"v"},
 {id:"lbs",name:"Lagos Business School — The Manager as Coach",city:"Lagos",area:"Lekki-Epe",ctry:"Nigeria",reg:"West Africa",
  lead:"Pan-Atlantic University business school",
  what:"Three-day programme on coaching leadership: the science of coaching, the coaching process, tools and a live demonstration. ₦850,000 excl. VAT (2026). LBS also offers executive coaching to its Executive MBA and executive education participants.",
  acc:["Business-school certificate"],focus:["leader","corporate"],lvl:"Short course",lang:"English",
  why:"Where Nigerian corporate buyers send managers to learn coaching. Its alumni are your future clients and sponsors.",
  src:"https://www.lbs.edu.ng/executive-education/open-seminars/the-manager-as-coach/",ok:"v"},
 {id:"strath",name:"Strathmore Business School — Executive Coaching",city:"Nairobi",ctry:"Kenya",reg:"East Africa",
  lead:"Strathmore University",
  what:"Executive Coaching for Managers, an ICF Level 1 programme with the training and mentor coaching needed for the ACC credential. Also a credentialing accelerator and mentoring programme, and a bench of ICF-accredited executive coaches from Kenya, Uganda, Rwanda and Tanzania.",
  acc:["ICF Level 1 accredited"],focus:["exec","leader","corporate"],lvl:"ICF Level 1 + credentialing support",lang:"English",
  why:"East Africa's leading business-school route into executive coaching.",
  src:"https://sbs.strathmore.edu/programme/executive-coaching-for-managers-programme/",ok:"v"},
 {id:"uct",name:"UCT Graduate School of Business — Centre for Coaching",city:"Cape Town",ctry:"South Africa",reg:"Southern Africa",
  lead:"University of Cape Town, with New Ventures West",
  what:"Coaching for Development: a six-month ICF Level 1 apprenticeship (90 hours). Professional Coaching Course: a one-year ICF Level 2 programme. Integral coaching approach; Leader-as-Coach and Leadership Conversations short courses.",
  acc:["ICF Level 1","ICF Level 2"],focus:["exec","integrative","academic"],lvl:"Six-month and one-year programmes",lang:"English",
  why:"One of the continent's most respected homes of executive-coaching theory and practice.",
  src:"https://gsb.uct.ac.za/centre-coaching",ok:"v"},
 {id:"usb",name:"Stellenbosch Business School — MPhil in Leadership Coaching",city:"Cape Town",area:"Bellville Park",ctry:"South Africa",reg:"Southern Africa",
  lead:"Programme head: Prof Nicky Terblanche",
  what:"Master's degree in leadership coaching (blended), with research into African coaching practice and AI in coaching.",
  acc:["EMCC Global Master Practitioner (EQA)","AACSB · EQUIS · AMBA school"],focus:["exec","academic"],lvl:"Master's",lang:"English",
  why:"The research-led route for coaches who want academic authority and to publish.",
  src:"https://emccglobal.org/master-practitioner-eqa-for-leading-south-african-stellenbosch-business-school/",ok:"v"},
 {id:"sacap",name:"SACAP — South African College of Applied Psychology",city:"Cape Town · Johannesburg · Durban · Pretoria",ctry:"South Africa",reg:"Southern Africa",
  lead:"Four campuses plus online",
  what:"Postgraduate Diploma in Coaching (ICF ACTP, 235 hours, with a six-month supervised internship); Coach Practitioner Programme; short online Coaching in the Workplace course.",
  acc:["ICF Level 2 / ACTP","COMENSA Gold & Silver approved"],focus:["life","exec","academic","online"],lvl:"Short course → postgraduate diploma",lang:"English",
  why:"A psychology-grounded, fully accredited ladder from first course to postgraduate qualification.",
  src:"https://www.sacap.edu.za/courses/postgraduate-diploma",ok:"v"},
 {id:"henley",name:"Henley Business School Africa — Lead with Coaching",city:"Johannesburg",area:"Paulshof",ctry:"South Africa",reg:"Southern Africa",
  lead:"Henley Africa (quadruple-accredited business school)",
  what:"Three-day leader-as-coach course (R14,999 incl. VAT); personal coaching built into its executive programmes and MBA.",
  acc:["AMBA · EQUIS · AACSB · AABS school"],focus:["leader","corporate"],lvl:"Short course",lang:"English",
  why:"Henley is where many Southern African corporates develop leaders, which makes its network a buyer network for coaches.",
  src:"https://www.henleysa.ac.za/short-courses/lead-with-coaching",ok:"v"},
 {id:"think",name:"Think Coaching Academy",ctry:"South Africa",city:"South Africa",reg:"Southern Africa",
  lead:"Life and advanced coaching certification",
  what:"Life coaching and advanced coaching certifications.",
  acc:["SSETA accredited","COMENSA endorsed"],focus:["life"],lvl:"Certification",lang:"English",
  why:"A practical entry route for new life coaches in South Africa.",
  src:"https://coursetakers.com/course/life-coaching-course-by-think-coaching-academy",ok:"v"},
 {id:"cways",name:"CoachingWays Côte d'Ivoire",city:"Abidjan",area:"Marcory",ctry:"Côte d'Ivoire",reg:"West Africa (Francophone)",
  lead:"Led by Stephan Coridon and Kadé Ba",
  what:"Professional coach training in French, with a pathway to ICF certification. Graduates become CoachingWays ambassadors.",
  acc:["ICF certification pathway"],focus:["exec","francophone"],lvl:"Professional certification",lang:"Français",
  why:"Described in national press as Côte d'Ivoire's first professional coach-training school.",
  src:"https://www.aip.ci/?p=42727",ok:"v"},
 {id:"focus",name:"FOCUS TL × Erickson Coaching International",city:"Abidjan",ctry:"Côte d'Ivoire",reg:"West Africa (Francophone)",
  lead:"Also active in Benin and Cameroon",
  what:"Erickson's internationally recognised coach education, delivered on site in French, alongside leadership, execution and workplace-wellbeing programmes.",
  acc:["Erickson programme (ICF standards)"],focus:["exec","francophone"],lvl:"Professional certification",lang:"Français",
  why:"Brings a global coaching school to Francophone Africa, so coaches no longer have to fly to Europe or America to train.",
  src:"https://www.erickson.edu/resources/expanding-professional-coaching-in-africa",ok:"v"},
 {id:"nfak",name:"NF Akademy × Coaching Academy (Tunisia)",city:"Abidjan",ctry:"Côte d'Ivoire",reg:"West Africa (Francophone)",
  lead:"Director: Nabou Fall",
  what:"Triple certification in coaching, NLP and hypnosis, with an ICF pathway, for leaders and HR professionals.",
  acc:["ICF pathway"],focus:["life","francophone"],lvl:"Triple certification",lang:"Français",
  why:"Designed by two African master-coach trainers to make Abidjan a coach-training hub.",
  src:"https://www.aip.ci/?p=77780",ok:"v"},
 {id:"rice",name:"École de Coaching Éthique d'Abidjan (RICE network)",city:"Abidjan",ctry:"Côte d'Ivoire",reg:"West Africa (Francophone)",
  lead:"Réseau international des coaches éthiques",
  what:"Six-month ethical-coaching programme, with graduation at the network's Olympiades du coaching éthique.",
  acc:["Network certification"],focus:["life","francophone"],lvl:"Six-month programme",lang:"Français",
  why:"Part of the community behind SICEMA, Abidjan's continental coaching fair.",
  src:"https://www.fratmat.info/article/240996/societe/2e-edition-des-olympiades-du-coaching-ethique-9-nouveaux-coachs-certifies-prets-pour-laccompagnement",ok:"v"},
 {id:"cta",name:"Coach Transformation Academy",city:"Online (serves Nigeria, Kenya, Egypt and others)",ctry:"Online / Pan-African",reg:"Online",
  lead:"Global provider with African cohorts",
  what:"ICF Level 1 (60 hours + 10 hours mentor coaching) and Level 2 (125 hours) programmes, with specialisations in executive, business, career and team coaching.",
  acc:["ICF Level 1 & 2","EMCC","CCE"],focus:["exec","online"],lvl:"ICF Level 1 → Level 2",lang:"English",
  why:"A flexible online route for coaches outside the big hubs, including Egypt.",
  src:"https://coachtransformation.com/nigeria/icf-accredited-coach-training-programs",ok:"v"}
];
const ACAD_FOCUS={life:"Life coaching",exec:"Executive & professional",leader:"Leader-as-coach",integrative:"Integrative / behavioural",corporate:"Corporate & HR",academic:"Degree & research",francophone:"Francophone",online:"Online"};
// Founding Circle — the coaches who supported David's journey. Filled only with names David confirms and each person's consent.
const HONOUR=[];
function acadToggle(id){S.acad=S.acad||{list:[]};const l=S.acad.list,i=l.indexOf(id);i<0?l.push(id):l.splice(i,1);save();render();}
function acadSet(k,v){S.acad=S.acad||{list:[]};S.acad[k]=v;save();render();}
function acadCard(a,big){const on=(S.acad&&S.acad.list||[]).includes(a.id);
 return `<div class="acad${a.feat?" acadfeat":""}">${a.feat?`<div class="afeat">★ Featured · ${a.city}</div>`:""}
  <h3>${a.name}</h3><div class="aloc">${a.area?a.area+", ":""}${a.city}${a.ctry&&!a.city.includes(a.ctry)?" · "+a.ctry:""} · ${a.lang}</div>
  <div class="small" style="margin:.2rem 0 .5rem">${a.lead}</div><p>${a.what}</p>
  <div class="aacc">${a.acc.map(x=>`<span>${x}</span>`).join("")}</div>
  <p class="awhy"><b>Why it matters:</b> ${a.why}</p>
  <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center"><button class="btn ${on?"":"ghost"}" onclick="acadToggle('${a.id}')">${on?"✓ On my shortlist":"＋ Shortlist"}</button>
  <a class="small" href="${a.src}" target="_blank" rel="noopener">Source ↗</a><span class="small muted">${a.lvl}</span></div></div>`;}
V.academies=()=>{const A=S.acad||{list:[]},f=A.f||"",r=A.r||"";const regs=[...new Set(ACADEMIES.map(a=>a.reg))];
 const list=ACADEMIES.filter(a=>!a.feat&&(!f||a.focus.includes(f))&&(!r||a.reg===r));const feat=ACADEMIES.filter(a=>a.feat);
 const short=ACADEMIES.filter(a=>A.list.includes(a.id));
 return `<div class="card hero-acad"><div class="kicker">GROW · WHERE AFRICA TRAINS ITS COACHES</div><h1>Coaching Academies & Training Organisations</h1>
 <p>Where coaches across Africa train, certify and keep growing, from Lagos to Nairobi, Cape Town and Abidjan, with the evidence for each. This is a guide, not a ranking: check accreditation, mentor-coaching hours and observed sessions before you enrol.</p></div>
 ${feat.map(a=>acadCard(a,1)).join("")}
 ${HONOUR.length?`<div class="card"><h2>The Founding Circle</h2><div class="honour">${HONOUR.map(h=>`<div class="hon">${h.img?`<img src="${h.img}" alt="${h.name}">`:""}<b>${h.name}</b><span>${h.role}</span><p>${h.note}</p></div>`).join("")}</div></div>`:""}
 <div class="card"><div class="row" style="gap:8px;flex-wrap:wrap"><b style="margin-right:6px">Focus</b><button class="chip ${!f?"on":""}" onclick="acadSet('f','')">All</button>${Object.entries(ACAD_FOCUS).map(([k,v])=>`<button class="chip ${f===k?"on":""}" onclick="acadSet('f','${k}')">${v}</button>`).join("")}</div>
 <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px"><b style="margin-right:6px">Region</b><button class="chip ${!r?"on":""}" onclick="acadSet('r','')">All</button>${regs.map(x=>`<button class="chip ${r===x?"on":""}" onclick="acadSet('r','${x}')">${x}</button>`).join("")}</div></div>
 <div class="acadgrid">${list.map(a=>acadCard(a)).join("")||`<div class="card">No academies match these filters yet.</div>`}</div>
 <div class="card"><h2>How to choose an academy</h2><ol class="small" style="line-height:1.7">
 <li><b>Check the level, not just the logo.</b> ICF Level 1 leads to ACC, Level 2 to PCC. COMENSA (South Africa), EMCC and LCAN levels (Nigeria) each mean something different, so ask which credential you can apply for at the end.</li>
 <li><b>Count the practice.</b> Mentor-coaching hours, observed sessions with feedback and supervised client hours matter more than classroom hours.</li>
 <li><b>Match it to your niche.</b> Executive coaches gain from business-school networks. Life and wellbeing coaches gain from psychology-grounded programmes. Faith and community coaches gain from integrative ones.</li>
 <li><b>Look at the alumni.</b> Who hires its graduates? An academy's network is often worth as much as its certificate.</li>
 <li><b>Ask about money.</b> Total cost, payment plans, and whether the fee includes the credential application and the exam.</li></ol>
 <p class="small muted">Missing an academy you trust? Tell us and we'll check it and add it. Ghana, Egypt, Uganda, Rwanda and Morocco are next.</p></div>
 ${short.length?`<div class="card"><h2>My shortlist</h2>${short.map(a=>`<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:8px 0"><span><b>${a.name}</b> <span class="small muted">· ${a.city}</span></span><span class="small">${a.lvl}</span></div>`).join("")}
  <p class="small" style="margin-top:10px">Next: ask each one for the credential you'll qualify for, mentor-coaching hours, cohort dates and the total cost. Then take your shortlist to <a href="#mentor">DeoMentor</a> to decide.</p></div>`:""}`;};
