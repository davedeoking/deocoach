// ===== DeoCoach data: niches, cities, signals, evidence =====
const CUR={NGN:"₦",GBP:"£",USD:"$",GHS:"GH₵",KES:"KSh",ZAR:"R"};
const SIG_ITEMS=[
 ["I love helping people break through to a bold new level, fast","cat"],
 ["Clients leave my sessions fired up and ready to act","cat"],
 ["I bring challenge when someone is playing small","cat"],
 ["I turn messy goals into clear plans and milestones","str"],
 ["I track client progress with numbers and evidence","str"],
 ["I think naturally in systems, strategy and results","str"],
 ["People tell me things they have never told anyone","lis"],
 ["I notice what is not being said","lis"],
 ["I am comfortable with silence and let clients find their own answers","lis"],
 ["I enjoy teaching tools, frameworks and skills","tea"],
 ["I draw on my own journey to show people the way","tea"],
 ["I like building people step by step over a long season","tea"]];
const STYLES={
 cat:{name:"The Catalyst",fit:"Founders, sales teams, people at a turning point",sell:"Breakthrough intensives, sales and performance coaching, keynotes",blind:"You can push before the client is ready. Pair your energy with deep listening."},
 str:{name:"The Strategist",fit:"Managers, executives, SMEs, career changers",sell:"Leadership programmes, career strategy, business growth coaching",blind:"You can over-plan. Leave room for meaning, emotion and identity."},
 lis:{name:"The Mirror",fit:"Leaders in transition, executives, faith and life coaching",sell:"Executive 1:1, transition coaching, retreats and reflective programmes",blind:"You can under-sell your results. Make outcomes visible and measurable."},
 tea:{name:"The Mentor-Builder",fit:"Graduates, young professionals, emerging leaders, teams",sell:"Cohort programmes, employability, manager development, academies",blind:"You can drift into telling. Keep the client doing the thinking."}};
const COMPS=[["eth","Ethics & boundaries"],["pres","Coaching presence"],["lis","Deep listening"],["q","Powerful questioning"],["goal","Agreements & goal setting"],["acc","Accountability & progress"],["data","Evidence & measurement"],["biz","Selling & business"],["brand","Brand & visibility"],["ai","Digital & AI tools"]];
const LEVELS=["Not set","L1 Aware","L2 Practising","L3 Competent","L4 Advanced","L5 Master"];
// y = outlook at years 1, 2, 5 and 10 (DeoCoach planning estimates, 0–10)
const NICHES=[
 {id:"career",n:"Career transition & graduate employability",y:[9,8,7,7],payer:"Individuals, parents, universities, donor youth programmes",fee:1,st:["tea","str"],need:["goal","acc"]},
 {id:"global",n:"Global careers & relocation",y:[8,8,6,5],payer:"Individuals, diaspora families (paid in £/$)",fee:2,st:["str","tea"],need:["goal","data"]},
 {id:"mgr",n:"Manager & leadership development",y:[8,9,9,9],payer:"HR / L&D in banks, telcos, fintech, energy",fee:2,st:["str","tea"],need:["goal","data","biz"]},
 {id:"exec",n:"Executive & C-suite coaching",y:[7,8,9,9],payer:"CEOs, boards, HR directors",fee:3,st:["lis","str"],need:["pres","q","eth"]},
 {id:"sales",n:"Sales & business development",y:[8,8,8,8],payer:"Sales leaders, SMEs, distributors",fee:2,st:["cat","str"],need:["acc","biz","data"]},
 {id:"money",n:"Money & financial behaviour",y:[7,8,8,9],payer:"Individuals, banks and fintechs (staff wellness)",fee:1,st:["str","tea"],need:["acc","data"]},
 {id:"sme",n:"SME founders & business growth",y:[8,8,8,9],payer:"Founders, accelerators, banks' SME desks",fee:2,st:["cat","str"],need:["biz","goal"]},
 {id:"faith",n:"Faith & ministry leadership",y:[7,7,7,7],payer:"Churches, ministries, faith networks",fee:1,st:["lis","tea"],need:["pres","eth"]},
 {id:"youth",n:"Youth & student coaching",y:[6,7,8,9],payer:"Parents, schools, foundations",fee:1,st:["tea","cat"],need:["eth","goal"]},
 {id:"ai",n:"AI-readiness & future of work",y:[5,8,10,10],payer:"Corporates, government, professional bodies",fee:3,st:["str","cat"],need:["ai","data"]},
 {id:"gov",n:"Public-sector & government leadership",y:[4,7,9,9],payer:"State governments, agencies, development partners",fee:3,st:["str","lis"],need:["data","eth","biz"]},
 {id:"family",n:"Family business & succession",y:[5,7,9,10],payer:"Family business owners, boards",fee:3,st:["lis","str"],need:["q","eth"]},
 {id:"women",n:"Women in leadership",y:[7,8,8,8],payer:"Corporates, women's networks, donors",fee:2,st:["tea","lis"],need:["pres","goal"]},
 {id:"coach",n:"Coach-the-coach (supervision, mentor coaching)",y:[5,7,9,9],payer:"Coaches, coaching academies, associations",fee:2,st:["lis","tea"],need:["eth","pres","q"]},
 {id:"well",n:"Wellbeing & performance (non-clinical)",y:[7,7,8,9],payer:"Corporates, insurers, individuals",fee:2,st:["lis","cat"],need:["eth","pres"]},
 {id:"green",n:"Green-transition & energy leadership",y:[3,5,8,10],payer:"Energy firms, governments, development finance",fee:3,st:["str","cat"],need:["data","goal"]},
 {id:"creative",n:"Creators & the creative economy",y:[6,7,8,9],payer:"Creators, agencies, brands, film and music businesses",fee:1,st:["cat","tea"],need:["brand","biz"]}];
const CAREER=[
 ["Calling","Exploring coaching","Nothing yet — build proof with pilot clients","—"],
 ["Training","Getting certified","Low-cost pilots, group sessions","Friends of your network"],
 ["First clients","Your first paying clients","1:1 packages, one signature programme","Individuals, parents"],
 ["Niche & positioning","Choosing who you serve","Niche programmes and cohorts","Defined groups (graduates, founders, pastors)"],
 ["Practice building","A steady practice","Retainers, corporate pilots, workshops","HR / L&D, SMEs, churches"],
 ["Authority","Known for something","Keynotes, books, masterminds, premium 1:1","Corporates, conferences, high-net-worth clients"],
 ["Institution","Beyond your own hours","Associate-delivered programmes, government & donor contracts","Institutions, governments"],
 ["Legacy","Your method outlives you","Licensing your method, training coaches","Coaches, academies"]];
const FUN=[
 ["aw","Awareness","People who saw you this month (reach)",null,"Content rhythm, events, podcasts, collaborations"],
 ["at","Attention","People who stopped: profile visits, clicks",0.05,"Clearer message, stronger hook, niche language"],
 ["en","Engagement","Likes, comments, replies, shares",0.2,"Ask questions, tell stories, go live"],
 ["tr","Trust","New followers, subscribers, return visitors",0.2,"Proof posts, testimonials, before/after results"],
 ["eq","Enquiry","DMs, forms, 'how do I work with you?'",0.1,"A clear offer and a clear call to action"],
 ["ca","Discovery call","Enquiries that booked a call",0.5,"Reply fast, booking link, follow-up rhythm"],
 ["cv","Conversion","Calls that became paying clients",0.3,"Sales conversation skills, pricing, guarantees"],
 ["rs","Results","Clients who reached their goal",0.7,"Stronger method, Deo assessments, check-ins"],
 ["rt","Retention","Clients who renewed or upgraded",0.4,"Follow-on programme, retainers, offer ladder"],
 ["ad","Advocacy","Referrals, testimonials, invitations",0.3,"Referral system, case studies, alumni community"]];
const BRAND=["Invisible","Visible","Known","Trusted","Preferred","Premium","Iconic"];
const BRAND_REQ=[[0,1],[2],[3],[4,5,6],[7],[8,9]];
const CHANNELS=["LinkedIn","Instagram","Facebook","WhatsApp","X (Twitter)","TikTok","YouTube / Podcast","Church & faith network","Corporate HR contacts","Associations & events","Referrals","Diaspora network"];
const PERCEP=["Clarity of what I do","Credibility","Expertise","Visible client results","Visibility","Premium feel"];
const DSTAGES=["Lead","Proposal","Agreed","Invoiced","Paid"],DPROB=[.1,.3,.6,.85,1];

// ---- Cities: momentum m (1–3), strongest niches, what's on people's minds ----
const CITIES=[
 {id:"lagos",n:"Lagos",c:"Nigeria",lon:3.38,lat:6.52,m:3,top:["career","sales","money","global","creative","mgr"],hub:"West Africa's commercial engine: finance, tech, media, ports",
  issues:["Cost of living and currency pressure","Jobs, side-hustles and the pull to relocate","Time lost to traffic and logistics"],mind:"Making money work — growing income faster than prices",say:"Show how coaching turns into income, promotion or a business — in months, not years",prep:"Package outcomes in naira and time saved; publish client money and career wins; build a weekend cohort format"},
 {id:"abuja",n:"Abuja",c:"Nigeria",lon:7.49,lat:9.06,m:2,top:["gov","exec","mgr","faith"],hub:"Federal capital: government, agencies, embassies, development partners",
  issues:["Public-service reform and performance","Security and stability","Access to decision-makers"],mind:"Delivering results inside the system and being seen to deliver",sayi:"",say:"Frame coaching as delivery capability: leaders who execute policy and lead teams through reform",prep:"Learn public-sector language (KPIs, MDAs, procurement); build a short executive programme for directors; get on vendor lists"},
 {id:"ph",n:"Port Harcourt",c:"Nigeria",lon:7.01,lat:4.82,m:2,top:["green","mgr","sme","career"],hub:"Oil and gas capital in transition",
  issues:["Energy transition and local content","Security","Jobs beyond oil"],mind:"What comes after oil — for my career and my business",say:"Position coaching as transition readiness for engineers, managers and suppliers",prep:"Build a transition-leadership offer; partner with energy services firms and their HR teams"},
 {id:"ibadan",n:"Ibadan",c:"Nigeria",lon:3.9,lat:7.38,m:1,top:["youth","career","sme","faith"],hub:"Education and SME city",
  issues:["Graduate unemployment","Small-business survival","Brain drain to Lagos and abroad"],mind:"A future for young graduates without leaving home",say:"Make employability and enterprise coaching practical, affordable and local",prep:"Partner with universities and churches; run low-cost group cohorts; track placement outcomes"},
 {id:"kano",n:"Kano",c:"Nigeria",lon:8.52,lat:12.0,m:2,top:["sme","youth","faith","sales"],hub:"Northern trade and agribusiness hub",
  issues:["Youth jobs and skills","Trade and agribusiness growth","Faith and community values"],mind:"Respectful growth — prosperity that honours family and faith",say:"Use community and faith-aligned language; lead with enterprise and family wellbeing",prep:"Work through trade associations and religious leaders; offer Hausa-language content where you can"},
 {id:"accra",n:"Accra",c:"Ghana",lon:-0.19,lat:5.6,m:3,top:["sme","career","global","women","creative"],hub:"Stable gateway for founders, diaspora returnees and HQs",
  issues:["Cost of living and the cedi","Youth jobs and entrepreneurship","Diaspora return and investment"],mind:"Building something lasting at home",say:"Speak to founders, returnees and young professionals building in Ghana",prep:"Build a founder and returnee programme; partner with hubs and diaspora networks"},
 {id:"kumasi",n:"Kumasi",c:"Ghana",lon:-1.62,lat:6.69,m:1,top:["sme","family","faith"],hub:"Ashanti trade and family-business heartland",
  issues:["Family business continuity","Trade margins","Youth skills"],mind:"Keeping the family business strong for the next generation",say:"Lead with succession, family harmony and growth",prep:"Develop a family-business succession offer with accountants and bankers as referrers"},
 {id:"nairobi",n:"Nairobi",c:"Kenya",lon:36.82,lat:-1.29,m:3,top:["ai","mgr","sme","exec","creative"],hub:"East Africa's tech, NGO and regional-HQ capital",
  issues:["Tech and startup cycles","Graduate jobs and cost of living","Regional and multinational leadership"],mind:"Staying relevant in a fast tech economy",say:"Position coaching as future-proofing: AI-ready leaders and founders who scale",prep:"Build AI-readiness and scale-up programmes; partner with hubs, NGOs and regional HQs"},
 {id:"mombasa",n:"Mombasa",c:"Kenya",lon:39.67,lat:-4.04,m:1,top:["sme","youth","sales"],hub:"Port, logistics and tourism",
  issues:["Logistics and port jobs","Tourism seasonality","Youth opportunity"],mind:"Steady income through the seasons",say:"Coach small firms and young people on resilient, year-round income",prep:"Run SME cohorts with logistics and hospitality associations"},
 {id:"kigali",n:"Kigali",c:"Rwanda",lon:30.06,lat:-1.94,m:3,top:["gov","exec","ai","women"],hub:"Conference and services hub with a reform-minded government",
  issues:["Service excellence and skills","Ambition for a knowledge economy","Regional conference and investment flows"],mind:"Excellence and discipline — being world-class",say:"Lead with standards, measurable results and leadership excellence",prep:"Bring evidence-based programmes; partner with conference organisers and public institutions"},
 {id:"kampala",n:"Kampala",c:"Uganda",lon:32.58,lat:0.35,m:2,top:["youth","sme","career","faith"],hub:"One of the youngest, most entrepreneurial cities",
  issues:["Youth jobs","Micro and small business survival","Access to finance"],mind:"Turning hustle into a stable business",say:"Make enterprise coaching practical: cash flow, customers, consistency",prep:"Partner with microfinance, SACCOs and churches for group programmes"},
 {id:"dar",n:"Dar es Salaam",c:"Tanzania",lon:39.28,lat:-6.79,m:2,top:["sme","mgr","sales"],hub:"Port and trade gateway for the interior",
  issues:["Trade and logistics growth","Management skills","Youth jobs"],mind:"Growing with the region's trade",say:"Coach managers and traders to scale with trade corridors",prep:"Offer manager development to logistics and trading firms; use Swahili content"},
 {id:"addis",n:"Addis Ababa",c:"Ethiopia",lon:38.75,lat:9.03,m:2,top:["gov","mgr","exec","youth"],hub:"Diplomatic capital: AU, UN agencies, aviation",
  issues:["Prices and the economy","Public-sector and institutional leadership","Youth jobs"],mind:"Stability and progress for families",say:"Speak to institutional leaders and the international community",prep:"Partner with international organisations and training institutes"},
 {id:"jhb",n:"Johannesburg",c:"South Africa",lon:28.05,lat:-26.2,m:2,top:["exec","mgr","well","money","family"],hub:"Africa's corporate and financial headquarters city",
  issues:["Unemployment and inequality","Energy reliability and business resilience","Leadership burnout"],mind:"Resilience — keeping business and people going under pressure",say:"Lead with resilience, performance and wellbeing outcomes",prep:"Bring measurable ROI; partner with corporate L&D and benefits providers"},
 {id:"cpt",n:"Cape Town",c:"South Africa",lon:18.42,lat:-33.92,m:2,top:["creative","ai","sme","well"],hub:"Tech, creative, tourism and remote-work hub",
  issues:["Youth unemployment","Tech and creative industries","Remote and global work"],mind:"Quality of life and meaningful, global work",say:"Coach creators, tech teams and remote professionals to grow globally",prep:"Build global-ready offers; price in two currencies"},
 {id:"durban",n:"Durban",c:"South Africa",lon:31.03,lat:-29.86,m:1,top:["mgr","sme","family"],hub:"Port, manufacturing and family business",
  issues:["Industrial jobs","Logistics recovery","Family business succession"],mind:"Rebuilding and stability",say:"Coach managers and family firms on recovery and continuity",prep:"Partner with manufacturing associations and family offices"},
 {id:"cairo",n:"Cairo",c:"Egypt",lon:31.24,lat:30.04,m:2,top:["career","mgr","money","exec"],hub:"North Africa's largest city: government, corporates, education",
  issues:["Cost of living","Graduate jobs","Large-organisation leadership"],mind:"Security for the family amid rising prices",say:"Frame coaching as career security and leadership growth",prep:"Arabic-language content; partner with universities and corporate HR"},
 {id:"casa",n:"Casablanca",c:"Morocco",lon:-7.59,lat:33.57,m:2,top:["exec","mgr","sales","green"],hub:"Finance hub and gateway for Africa expansion",
  issues:["Expansion into Africa","Industrial and green growth","Youth jobs"],mind:"Growth into new African markets",say:"Coach leaders on cross-cultural, pan-African expansion",prep:"French/Arabic offers; pan-African leadership programmes for expanding firms"},
 {id:"tunis",n:"Tunis",c:"Tunisia",lon:10.18,lat:36.81,m:1,top:["career","global","ai"],hub:"Highly educated talent pool",
  issues:["Graduate jobs","Emigration of skilled talent","Digital services"],mind:"Opportunity — at home or abroad",say:"Coach graduates on global and remote careers",prep:"Build remote-work and global-career programmes; French content"},
 {id:"dakar",n:"Dakar",c:"Senegal",lon:-17.47,lat:14.72,m:2,top:["youth","sme","green","creative"],hub:"Francophone digital and culture hub; new energy economy",
  issues:["Youth jobs","New oil and gas economy","Digital and creative entrepreneurship"],mind:"Making sure growth reaches young people",say:"Coach youth and founders to ride the new economy",prep:"French-language cohorts; partner with hubs and energy-sector suppliers"},
 {id:"abidjan",n:"Abidjan",c:"Côte d'Ivoire",lon:-4.01,lat:5.36,m:3,top:["exec","mgr","sme","women"],hub:"Fast-growing francophone economic capital and HQ city",
  issues:["Rapid growth and talent shortages","Regional HQ leadership","SME formalisation"],mind:"Keeping up with growth — finding and growing talent",say:"Offer leadership and manager development for growing firms",prep:"French programmes; partner with business schools and chambers of commerce"},
 {id:"douala",n:"Douala",c:"Cameroon",lon:9.7,lat:4.05,m:1,top:["sme","sales","youth"],hub:"Central Africa's port and trading city",
  issues:["Trade and logistics","Youth jobs","Business environment"],mind:"Making business work despite obstacles",say:"Coach traders and SMEs on resilience and growth",prep:"Bilingual (French/English) SME programmes"},
 {id:"kinshasa",n:"Kinshasa",c:"DR Congo",lon:15.27,lat:-4.44,m:2,top:["youth","gov","sme"],hub:"One of Africa's largest and fastest-growing cities",
  issues:["Youth jobs","Governance and services","Mining wealth reaching people"],mind:"A fair chance to build a life",say:"Coach youth and public leaders on opportunity and integrity",prep:"French cohorts with churches, NGOs and development partners"},
 {id:"luanda",n:"Luanda",c:"Angola",lon:13.23,lat:-8.84,m:1,top:["green","mgr","sme"],hub:"Oil economy diversifying",
  issues:["Diversifying beyond oil","Cost of living","Management skills"],mind:"New income beyond oil",say:"Coach managers and SMEs for diversification",prep:"Portuguese-language offers; partner with diversification programmes"},
 {id:"lusaka",n:"Lusaka",c:"Zambia",lon:28.32,lat:-15.39,m:1,top:["green","sme","mgr"],hub:"Copper and critical-minerals economy",
  issues:["Mining-driven growth","Debt and prices","Youth jobs"],mind:"Making mining wealth create local jobs",say:"Coach suppliers and managers to grow with the minerals economy",prep:"Partner with mining suppliers and local-content programmes"},
 {id:"harare",n:"Harare",c:"Zimbabwe",lon:31.05,lat:-17.83,m:1,top:["sme","money","global","faith"],hub:"Resilient, highly educated entrepreneurs",
  issues:["Currency and economic uncertainty","Diaspora links","Entrepreneurship"],mind:"Protecting value and building income",say:"Coach on money resilience and building businesses that last",prep:"Price in USD; partner with diaspora networks and churches"},
 {id:"gaborone",n:"Gaborone",c:"Botswana",lon:25.91,lat:-24.65,m:1,top:["gov","mgr","career"],hub:"Stable governance; diversifying beyond diamonds",
  issues:["Diversification beyond diamonds","Youth jobs","Public-sector performance"],mind:"What's next for the economy and young people",say:"Coach public and private leaders on diversification",prep:"Partner with government programmes and the private sector"},
 {id:"windhoek",n:"Windhoek",c:"Namibia",lon:17.08,lat:-22.56,m:1,top:["green","youth","mgr"],hub:"Emerging green-hydrogen and energy ambitions",
  issues:["Green energy projects","Youth jobs","Skills for new industries"],mind:"Being ready for the new energy jobs",say:"Coach young professionals and managers for green industries",prep:"Partner with energy projects' skills programmes"},
 {id:"maputo",n:"Maputo",c:"Mozambique",lon:32.57,lat:-25.97,m:1,top:["green","sme","youth"],hub:"Gas-led growth potential",
  issues:["Gas projects and local content","Security in the north","Youth jobs"],mind:"Getting a share of new growth",say:"Coach suppliers and youth for local-content opportunities",prep:"Portuguese programmes with business associations"},
 {id:"freetown",n:"Freetown",c:"Sierra Leone",lon:-13.23,lat:8.48,m:1,top:["youth","gov","faith"],hub:"Young population rebuilding institutions",
  issues:["Youth jobs","Public services","Skills"],mind:"Opportunity and dignity for young people",say:"Coach youth and public leaders on purpose and practical skills",prep:"Partner with churches, mosques and NGOs on youth programmes"}];

// ---- Signals by niche: trend → what it means → what to do ----
const SIGNALS={
 career:[["Graduates are entering a crowded job market every year","Employability coaching moves from nice-to-have to necessary","Build a 6-week job-ready cohort with measurable placement outcomes"],["Employers increasingly test skills, not just degrees","Coaching on portfolios and assessments sells","Add mock assessments and portfolio reviews to your offer"],["Parents invest heavily in their children's futures","Parents are a key payer","Create a parent-facing version of your offer"]],
 global:[["Relocation remains a strong aspiration for young professionals","Global-career coaching keeps demand high in the short term","Offer a relocation-readiness programme priced in £/$ for diaspora sponsors"],["Remote work lets people earn globally without moving","'Global from home' becomes a niche","Coach remote-work readiness and personal branding for global clients"],["Some host countries tighten migration rules","Demand may shift from moving to working remotely","Prepare a remote-career track alongside relocation"]],
 mgr:[["New managers are promoted without training","HR teams need manager-development programmes","Pitch a 90-day new-manager programme to HR/L&D"],["Organisations want measurable training results","Data-driven coaching wins contracts","Use pre and post assessments in every programme"],["Hybrid teams need new leadership habits","Leading distributed teams is a growing need","Add a hybrid-leadership module"]],
 exec:[["Succession gaps are opening at the top","Boards look for leadership-transition support","Offer first-100-days and succession coaching"],["Executives face faster strategy cycles","Coaching on decision-making under uncertainty sells","Build a scenario-thinking module into executive work"],["Confidentiality and credentials matter more at this level","Credentials and supervision raise trust","Get accredited and use supervision"]],
 sales:[["Sales teams must sell in tougher economies","Sales coaching tied to revenue sells easily","Price sales coaching against revenue targets"],["Buyers research online before talking to sales","Social selling skills are in demand","Add WhatsApp and LinkedIn selling to your programme"],["SMEs need sales systems, not just motivation","Systems coaching beats hype","Teach pipelines, scripts and weekly reviews"]],
 money:[["Rising prices squeeze household budgets","Money-behaviour coaching becomes urgent","Run a 4-week money-reset group programme"],["Banks and fintechs want financially healthy customers and staff","Institutional partners can pay","Pitch financial-wellness coaching to banks and fintechs"],["Digital savings and investment apps are spreading","People need coaching on decisions, not apps","Coach on habits and decisions; avoid product advice"]],
 sme:[["Small businesses are the main source of jobs","SME coaching has a huge market","Build a growth-accelerator cohort with banks or hubs"],["Continental trade agreements open regional markets","Export-readiness coaching grows","Add a cross-border growth module"],["Access to finance depends on good records","Coaching on systems improves fundability","Coach founders on records, reporting and investor readiness"]],
 faith:[["Churches and ministries are growing institutions","Leadership and governance coaching for ministries grows","Offer leadership pipelines for pastors and workers"],["Congregations face money and family pressure","Faith-aligned life and money coaching resonates","Create faith-aligned programmes with church partners"],["Ministries go digital","Digital ministry leadership is a new niche","Coach ministries on digital engagement and teams"]],
 youth:[["Africa has the world's youngest population","Youth coaching is a long-term growth market","Build scalable youth cohorts with schools and foundations"],["Schools and parents want future-ready skills","Career and life-skills coaching for teens grows","Package a school-term programme"],["Foundations fund youth programmes","Donors are a payer","Learn donor reporting and partner with NGOs"]],
 ai:[["AI tools are spreading across workplaces","Workers and leaders need AI-readiness","Run AI-readiness workshops for teams"],["Organisations redesign roles around AI","Leaders need coaching on change and reskilling","Build an AI-transition leadership programme"],["Coaches who use AI tools serve more clients","Your own AI skills become a competitive edge","Use AI for preparation and follow-up; keep the human core"]],
 gov:[["Governments push public-service reform","Public leaders need delivery coaching","Pitch delivery-leadership programmes to ministries and agencies"],["Development partners fund capacity building","Donor-funded contracts open up","Learn tender processes and partner with consultancies"],["Citizens expect better services","Service-excellence coaching grows","Coach front-line leaders on service standards"]],
 family:[["Founders who built businesses are reaching retirement","Succession planning is urgent for many family firms","Build a succession programme with lawyers and accountants"],["Next-generation heirs often work abroad first","Bridging generations is a coaching need","Offer next-generation leadership coaching"],["Family conflicts threaten business value","Family-governance coaching protects wealth","Create family-charter facilitation"]],
 women:[["More women are moving into leadership roles","Women's leadership programmes are funded","Pitch cohorts to corporates and women's networks"],["Women founders face finance gaps","Coaching plus networks adds value","Pair coaching with investor-readiness"],["Organisations set diversity goals","HR budgets support women's development","Show measurable promotion and retention outcomes"]],
 coach:[["More people are training as coaches","New coaches need supervision and mentor coaching","Offer supervision groups and credential preparation"],["Clients expect credentialed coaches","Credential-prep coaching sells","Build a mentor-coaching pathway"],["Coaching bodies grow across Africa","Associations need trainers and supervisors","Partner with associations on CPD"]],
 well:[["Burnout is a growing workplace concern","Corporates fund non-clinical wellbeing coaching","Offer resilience and performance programmes with clear referral boundaries"],["Insurers and benefits providers add wellness","Institutional payers emerge","Partner with benefits providers"],["People want performance, not just relief","Combine wellbeing with performance outcomes","Measure energy, focus and performance before and after"]],
 green:[["Energy and climate investment is rising","Leaders of new green projects need coaching","Build an energy-transition leadership offer"],["Oil and gas workers need transition paths","Transition coaching grows","Offer career-transition programmes for energy professionals"],["Development finance funds green skills","Donor and government contracts grow","Partner with green-skills programmes"]],
 creative:[["Creators earn from global platforms","Creators need business and brand coaching","Coach creators on income streams and contracts"],["Film, music and fashion are growing exports","Creative business leadership grows","Offer creative-business accelerators"],["Brands pay creators for reach","Creator-brand deal coaching sells","Teach pricing, pitching and negotiation"]]};

// ---- Evidence bank: verified statistics with sources ----
const EVIDENCE=[
 {s:"Global coaching revenue reached an estimated $5.34bn, up 17% since 2023.",src:"ICF Global Coaching Study 2025 (with PwC)",url:"https://coachingfederation.org/research/global-coaching-study"},
 {s:"71% of coaches in the Middle East and Africa expected their revenue to rise in the next 12 months — the highest of any region.",src:"ICF Global Coaching Study 2025",url:"https://coachingfederation.org/research/global-coaching-study"},
 {s:"73% of coaches say clients and organisations expect them to hold a coaching credential.",src:"ICF Global Coaching Study 2025",url:"https://coachingfederation.org/research/global-coaching-study"},
 {s:"Africa's median age is about 19.5 years, against a world median of about 31.",src:"UN World Population Prospects 2024",url:"https://population.un.org/wpp/"},
 {s:"28% of all people under 25 in the world live in Africa.",src:"Pew Research Center analysis of UN data (May 2026)",url:"https://www.pewresearch.org/short-reads/2026/05/19/5-facts-about-africas-population-growth/"},
 {s:"Africa's urban population is projected to double from 700 million to 1.4 billion by 2050; two in three Africans will live in cities.",src:"OECD/SWAC, AfDB, UCLG Africa, Cities Alliance — Africa's Urbanisation Dynamics 2025",url:"https://www.oecd.org/en/publications/africa-s-urbanisation-dynamics-2025_2a47845c-en.html"},
 {s:"Nigeria is projected to have about 250 million urban residents by 2050, the fourth largest urban population in the world.",src:"Africa's Urbanisation Dynamics 2025",url:"https://www.oecd.org/en/publications/africa-s-urbanisation-dynamics-2025_2a47845c-en.html"},
 {s:"Research for FSD Africa described Nigeria's executive coaching market as nascent, with few credible accredited executive coaches.",src:"FSD Africa — Building the Market for Executive Coaching in Nigeria",url:"https://fsdafrica.org/getting-ready-for-take-off/"}];

// ---- Insight feeds coaches can subscribe to (official data sources) ----
const FEEDS=[
 {n:"ICF Global Coaching Study",u:"https://coachingfederation.org/research/global-coaching-study",for:["all"],w:"Coaching market size, fees, credentials"},
 {n:"UN World Population Prospects",u:"https://population.un.org/wpp/",for:["all","youth"],w:"Population and age by country"},
 {n:"Africapolis (OECD/SWAC)",u:"https://africapolis.org",for:["all","gov"],w:"City growth across Africa"},
 {n:"AfDB African Economic Outlook",u:"https://www.afdb.org/en/knowledge/publications/african-economic-outlook",for:["all","sme","gov","green"],w:"Growth outlook by country"},
 {n:"World Bank Open Data",u:"https://data.worldbank.org",for:["all","money"],w:"Inflation, income, jobs by country"},
 {n:"ILOSTAT",u:"https://ilostat.ilo.org",for:["career","youth","mgr"],w:"Employment and youth unemployment"},
 {n:"World Bank Global Findex",u:"https://www.worldbank.org/en/publication/globalfindex",for:["money","sme"],w:"Savings, borrowing, digital payments"},
 {n:"AfCFTA Secretariat",u:"https://au-afcfta.org",for:["sme","sales"],w:"Continental trade rules and markets"},
 {n:"WEF Future of Jobs",u:"https://www.weforum.org/publications/",for:["ai","mgr","career"],w:"Skills and roles rising and falling"},
 {n:"Mo Ibrahim Index of African Governance",u:"https://mo.ibrahim.foundation/iiag",for:["gov"],w:"Governance trends by country"},
 {n:"National Bureau of Statistics (Nigeria)",u:"https://www.nigerianstat.gov.ng",for:["all"],w:"Nigeria inflation, jobs, GDP"},
 {n:"Ghana Statistical Service",u:"https://statsghana.gov.gh",for:["all"],w:"Ghana prices and labour data"},
 {n:"Kenya National Bureau of Statistics",u:"https://www.knbs.or.ke",for:["all"],w:"Kenya prices and labour data"},
 {n:"Statistics South Africa",u:"https://www.statssa.gov.za",for:["all"],w:"South Africa jobs and prices"},
 {n:"Pew Research — Religion",u:"https://www.pewresearch.org/religion/",for:["faith"],w:"Faith trends"}];
