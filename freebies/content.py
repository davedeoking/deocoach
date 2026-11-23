# The DeoCoach free toolkit. Each entry: slug, title, sub (one line), kind (label), body (HTML).
FREEBIES = []
def add(slug, kind, title, sub, body, blurb, ic):
    FREEBIES.append(dict(slug=slug, kind=kind, title=title, sub=sub, body=body, blurb=blurb, ic=ic))

# 1 ─────────────────────────────────────────────────────────────
add("ai-automation-starter-kit", "Starter Kit", "The AI & Automation Starter Kit for Coaches",
"A 90-day method to map your practice, automate the right work, govern it safely and turn the hours you win back into income.",
"""
<div class="box"><b>The promise.</b> In 90 days you go from curious about AI to running with it: your work mapped, five automations live, your clients' data protected, and new income switched on. You do not need to be technical. You need one hour a week and the courage to start small.</div>

<h2>Why now</h2>
<p>AI will not replace the coach. It will replace the coach's admin, research and guesswork, and it will reward the coaches who use it. Clients now expect evidence, speed and follow-through. The coach who answers within the hour, arrives at every session prepared and shows progress in writing wins the work.</p>
<p>The method below has four moves. Do them in order. Each move has one output you can hold in your hand.</p>

<table><tr><th>Move</th><th>Weeks</th><th>What you do</th><th>What you end with</th></tr>
<tr><td><b>1. Map</b></td><td>1–2</td><td>Write down every task and mark each one keep, automate, delegate or drop</td><td>A one-page Automation Map</td></tr>
<tr><td><b>2. Automate</b></td><td>3–6</td><td>Build your first five automations, one a week</td><td>A working automation stack</td></tr>
<tr><td><b>3. Govern</b></td><td>7–8</td><td>Set your rules for client data, consent and AI use</td><td>A one-page AI policy for your practice</td></tr>
<tr><td><b>4. Monetise</b></td><td>9–12</td><td>Turn the hours you win back into a new offer, a cohort or a new market</td><td>A 12-month income plan</td></tr></table>

<h2>Move 1 — Map (weeks 1–2)</h2>
<p>For one week, write down everything you do for your practice, in 15-minute blocks or more. Use the <b>Automation Map</b> worksheet in this toolkit. Group tasks into six areas:</p>
<ol><li><b>Client delivery</b> — sessions, preparation, notes, homework, progress reports.</li>
<li><b>Admin</b> — scheduling, reminders, rescheduling, filing, emails.</li>
<li><b>Marketing</b> — posts, newsletters, talks, testimonials.</li>
<li><b>Sales</b> — enquiries, discovery calls, proposals, follow-ups.</li>
<li><b>Finance</b> — invoices, receipts, chasing payments.</li>
<li><b>Growth</b> — learning, supervision, partnerships.</li></ol>
<p>Then give every task one label:</p>
<ul><li><b>Keep</b> — only you can do it, and it is where clients feel your value (the session itself, hard conversations, judgement).</li>
<li><b>Automate</b> — it repeats, follows a pattern and needs no judgement in the moment.</li>
<li><b>Delegate</b> — it needs a human, but not you (a virtual assistant, a junior coach, a family member who helps with admin).</li>
<li><b>Drop</b> — nobody would miss it.</li></ul>
<div class="box"><b>The five-minute rule.</b> Any task you do more than twice a week that takes more than five minutes is a candidate for automation.</div>

<h2>Move 2 — Automate (weeks 3–6): your first five automations</h2>
<h3>1. Booking without the back-and-forth</h3>
<p>Replace "When are you free?" emails with one booking link that shows your available times, collects the client's details and sends reminders automatically. Free options exist in Google Calendar (appointment schedules), Microsoft Bookings and Calendly's free plan.</p>
<ul><li>Set reminders 24 hours and 1 hour before every session.</li><li>Add two questions to the booking form: "What would make this session valuable?" and "Anything I should know beforehand?"</li><li>Put the link in your email signature, WhatsApp Business profile and LinkedIn.</li></ul>

<h3>2. Session notes in minutes, not an hour</h3>
<p>After each session, spend three minutes speaking or typing rough bullet points. Then ask an AI assistant to turn them into a clean summary using the prompt below. If you record sessions with a transcription tool, always ask permission first and tell the client where the recording is kept and when it is deleted.</p>
<div class="prompt">You are my coaching assistant. Turn these rough notes into a session summary with four headings: What we explored, Insights the client named, Agreed actions (with dates), Questions to hold until next time. Use the client's own words where I quoted them. Do not add anything I did not write. Notes: [paste notes, with names removed]</div>

<h3>3. Follow-up within the hour</h3>
<p>Speed is a promise. Use the summary to send a short follow-up within an hour of each session. Save it as a template so it takes two minutes.</p>
<div class="prompt">Write a warm, three-paragraph follow-up email to my coaching client. Paragraph 1: thank them and name one moment of courage from today. Paragraph 2: list the actions they agreed, with dates. Paragraph 3: remind them of our next session and how to reach me. Under 150 words. British English. Summary: [paste summary]</div>

<h3>4. One idea, five pieces of content</h3>
<p>Every week, pick one idea from your sessions (never a client's story without permission) and let AI help you shape it into a LinkedIn post, a WhatsApp status, a short email to your list, three quotes for images, and a talk outline. Use the <b>30-Day LinkedIn Content Engine</b> in this toolkit for ideas.</p>
<div class="prompt">Here is one idea from my coaching work: [idea]. Write: (1) a LinkedIn post of 120–180 words that opens with a question; (2) a 40-word WhatsApp status; (3) three short quotable lines; (4) a five-point outline for a 10-minute talk. Keep my voice: warm, direct, practical. No hashtags except three at the end of the LinkedIn post.</div>

<h3>5. Proposals and invoices from templates</h3>
<p>After a discovery call, paste your notes into an AI assistant to draft the proposal, then check every word. Keep one proposal template and one invoice template. Use an invoicing tool or payment links (for example Paystack or Flutterwave in Africa, Stripe or PayPal elsewhere) so clients can pay in one click.</p>
<div class="prompt">Draft a one-page coaching proposal from these discovery-call notes. Sections: Where you are now, Where you want to be, How we will work (sessions, format, dates), Investment (three options: Essential, Growth, Premium), Next step. Use the client's words for their goals. Notes: [paste notes, no confidential details]</div>

<h2>Move 3 — Govern (weeks 7–8)</h2>
<p>Trust is the coach's only real currency. Before any client information goes near an AI tool, ask three questions:</p>
<ol><li><b>Where does my client's data go?</b> Which company, which country, and is it used to train their models?</li>
<li><b>Who can see it?</b> Only you, or the tool's staff and partners too?</li>
<li><b>Can I delete it?</b> Easily, and completely?</li></ol>
<p>If you cannot answer all three, do not use that tool with client information. Use the <b>Client Data &amp; AI Safety Checklist</b> in this toolkit to write your one-page AI policy.</p>
<div class="box"><b>Never automate:</b> judgement about a person's wellbeing, anything to do with safeguarding or crisis, the decision to take on or end a client, or the words of a difficult conversation.</div>

<h2>Move 4 — Monetise (weeks 9–12)</h2>
<p>Most coaches who automate win back four to eight hours a week. Decide now what those hours are for, or they will disappear into busyness. Choose one:</p>
<ul><li><b>A new package</b> — use the <b>3-Tier Package Builder</b> to design Essential, Growth and Premium offers.</li>
<li><b>A group programme</b> — turn your best one-to-one journey into a six-week cohort for eight to twelve people.</li>
<li><b>A new market</b> — pick one city and one sector you have never served. Use DeoCoach's Horizon Atlas and City Minds to learn what they care about.</li>
<li><b>Visibility</b> — join one professional body where your buyers gather and offer to speak.</li></ul>

<h2>Your 90-day plan</h2>
<table><tr><th>Week</th><th>Focus</th><th>Done when</th></tr>
<tr><td>1–2</td><td>Map every task; label keep / automate / delegate / drop</td><td>Your Automation Map is complete</td></tr>
<tr><td>3</td><td>Booking link with reminders</td><td>Every new booking goes through the link</td></tr>
<tr><td>4</td><td>Session notes with AI</td><td>Notes take under 10 minutes</td></tr>
<tr><td>5</td><td>Follow-up within the hour</td><td>Five follow-ups sent from your template</td></tr>
<tr><td>6</td><td>Content engine and proposal template</td><td>Four posts and one proposal made this way</td></tr>
<tr><td>7–8</td><td>Your AI policy and consent wording</td><td>Policy written; clients informed</td></tr>
<tr><td>9–10</td><td>Design your new offer</td><td>Three-tier packages priced</td></tr>
<tr><td>11–12</td><td>Launch it to ten people</td><td>First new client or cohort place sold</td></tr></table>
""",
"The 90-day Map → Automate → Govern → Monetise method, with your first five automations and the prompts to run them.", "🚀")

# 2 ─────────────────────────────────────────────────────────────
P = {
"Before the session": [
"Summarise what I know about this client from these notes in five bullet points, then suggest three powerful questions for today's session. Notes: [notes without names]",
"My client works as [role] in the [sector] sector in [city]. What pressures are people in that role likely to face this year? Give me five, with one question I could ask about each.",
"Suggest a 60-minute session structure for a client who wants to [goal], using the GROW model, with timings.",
"List five metaphors or images that might help a client who feels stuck between [option A] and [option B].",
"Draft a short pre-session check-in message asking my client what they want to focus on, under 50 words, warm tone.",
"What are the common blind spots for a first-time manager? Give me questions, not advice, for each.",
"Turn this coaching goal into a SMART goal with three milestones: [goal].",
"Suggest three reflective exercises a client can do in 10 minutes before our session about [theme].",
"I am coaching a founder on delegation. Give me ten open questions, from gentle to challenging.",
"Explain [psychometric or model, e.g. Johari Window] in plain words I could share with a client in under 100 words."],
"After the session": [
"Turn these rough notes into a session summary: What we explored, Insights, Agreed actions with dates, Questions to hold. Notes: [notes]",
"Write a warm follow-up email from these session notes in under 150 words, naming one moment of courage. Notes: [notes]",
"From these notes, draft three homework options of different effort: 10 minutes, 30 minutes, one hour.",
"Write a progress report for the client's sponsor covering themes and progress only, no confidential detail. Themes: [themes]",
"Create a one-page reflection worksheet for my client on [theme] with five prompts.",
"Suggest how I could open next session, building on these agreed actions: [actions].",
"Help me reflect on this session as a coach: what went well, what I might have missed, and one question for supervision. Notes: [my own notes]",
"Draft a gentle reminder message for a client who has not done their agreed action, without shaming them.",
"Write a short celebration message for a client who achieved [milestone].",
"Create a closing summary for the end of a 3-month engagement: journey, growth, and recommended next steps."],
"Marketing": [
"Write a LinkedIn post of 150 words about [insight from my work], opening with a question and ending with an invitation to comment.",
"Give me 10 post ideas for [my niche] coaches this month, each with a one-line hook.",
"Turn this testimonial into a short case story with challenge, approach and result: [testimonial]",
"Write my coaching bio in 50, 120 and 250 words. Facts: [facts].",
"Draft a 5-email welcome sequence for people who download my free guide on [topic].",
"Suggest 10 talk titles for a [audience] audience on [theme], each under 10 words.",
"Write a WhatsApp Business greeting message and away message for my coaching practice.",
"Rewrite this sales page paragraph to be clearer and warmer, with no hype: [paragraph]",
"Create a 4-week content calendar mixing tips, stories, questions and offers for [niche].",
"Give me five ways to repurpose this one talk into content for a month: [talk summary]."],
"Sales": [
"Turn these discovery-call notes into a one-page proposal with three package options. Notes: [notes]",
"Write a follow-up email after a discovery call where the client said they need to think about it.",
"List the five most common objections to coaching from [buyer type] and a respectful response to each.",
"Write a short message re-engaging a past client I last worked with [time] ago.",
"Draft a partnership pitch to [organisation] offering a free workshop for their members.",
"Help me price a 6-session programme for [market], explaining three pricing options and their trade-offs.",
"Write an email to an HR director introducing my leadership coaching programme in under 120 words.",
"Create a referral request message for happy clients that feels natural, not pushy.",
"Turn my services into a one-page menu with names, outcomes and prices: [services].",
"Draft a tender expression of interest for a capacity-building consultancy. Requirements: [paste]."],
"Growth and self-leadership": [
"Ask me ten questions to clarify my coaching niche, one at a time, and wait for each answer.",
"Help me design a 90-day plan to reach [income goal] from coaching, with weekly actions.",
"Review my week: here is how I spent my time [list]. What should I automate, delegate or drop?",
"Suggest five professional bodies or conferences where my buyers in [sector] gather.",
"Help me write a one-page AI policy for my coaching practice covering data, consent and tools.",
"Act as my supervisor. Ask me reflective questions about this difficult session: [anonymised summary].",
"Create a learning plan for me to master [skill] in 30 days with free resources.",
"What could the coaching market in [city] look like in five years? Give three scenarios and how I could prepare for each.",
"Help me write my personal mission statement as a coach from these values: [values].",
"Turn this big goal into a one-page plan with milestones, risks and first three actions: [goal]."]}
body = """<div class="box"><b>How to use these.</b> Copy a prompt into any AI assistant (Claude, ChatGPT, Gemini or Copilot). Replace the [brackets] with your details. <b>Never paste names, contact details or confidential stories</b> — describe the situation instead. Always read and edit what comes back: the AI drafts, you decide.</div>"""
n = 0
for sec, items in P.items():
    body += f"<h2>{sec}</h2>"
    for it in items:
        n += 1
        body += f'<p style="margin:.6em 0 .1em"><b>{n}.</b></p><div class="prompt">{it}</div>'
add("50-ai-prompts-for-coaches", "Prompt Library", "50 AI Prompts for Coaches",
"Ready-to-copy prompts for session prep, follow-up, marketing, sales and your own growth — written by a coach, for coaches.",
body, "Copy-and-paste prompts for every part of your practice, from session prep to proposals.", "✍")

# 3 ─────────────────────────────────────────────────────────────
rows = "".join("<tr class='fill'><td></td><td></td><td></td><td></td><td></td><td></td></tr>" for _ in range(14))
add("automation-map-worksheet", "Worksheet", "The Coach's Automation Map",
"A one-week task audit that shows you exactly what to keep, automate, delegate or drop.",
f"""<p>For one week, write down every task you do for your practice. At the end of the week, label each one and choose a tool. Print this page twice if you need more rows.</p>
<div class="box"><b>Labels:</b> <b>K</b> = Keep (only you, and clients feel it) · <b>A</b> = Automate (repeats, no judgement) · <b>D</b> = Delegate (needs a person, not you) · <b>X</b> = Drop (no one would miss it)</div>
<table><tr><th style="width:30%">Task</th><th>Area</th><th>Times a week</th><th>Minutes each</th><th>K / A / D / X</th><th>Tool or person</th></tr>{rows}</table>
<h2>Score your map</h2>
<ol><li>Add up the minutes for every task marked <b>A</b> and <b>D</b>. That is the time you can win back each week: ______ minutes.</li>
<li>Circle the three <b>A</b> tasks that cost you most. These are your first automations.</li>
<li>Pick one <b>D</b> task to hand over this month. Who could do it? ____________________</li>
<li>Cross out every <b>X</b> task today.</li></ol>
<h2>Areas to check</h2>
<p>Client delivery · Admin · Marketing · Sales · Finance · Growth. If an area has no tasks written down, you may be avoiding it — that is useful to know too.</p>""",
"A printable one-week task audit: keep, automate, delegate or drop.", "🗺")

# 4 ─────────────────────────────────────────────────────────────
checks = ["I know which AI tools I use with any client information, and I have listed them.",
"For each tool, I know where data is stored and whether it is used to train the provider's models.",
"I have switched off model training on my client-facing tools where the setting exists.",
"I never paste names, contact details, health information or identifiable stories into AI tools.",
"I ask clients for consent before recording or transcribing a session, and I tell them where recordings go.",
"Recordings and transcripts are deleted on a schedule I can state (for example, 30 days).",
"My devices are protected by a password or passcode and up to date.",
"I use two-step verification on email, cloud storage and payment accounts.",
"Client files are stored in one place, not scattered across WhatsApp, email and downloads.",
"I share documents by secure link with access control, not as open attachments where possible.",
"My contract or welcome pack explains how I handle data and AI, in plain words.",
"I know what I would do if a device were lost or an account hacked.",
"I never use AI to make judgements about a client's wellbeing, safety or mental health.",
"I review my tools and settings every six months.",
"I can delete a client's data completely if they ask."]
add("client-data-ai-safety-checklist", "Checklist", "Client Data & AI Safety Checklist",
"Fifteen checks, consent wording and a one-page AI policy template — so you can use AI without risking your clients' trust.",
"""<p>Written by a coach who holds four ISACA credentials in security, audit, governance and privacy. This is practical guidance, not legal advice: check the data-protection law where you practise (for example the UK GDPR, the EU GDPR, Nigeria's Data Protection Act 2023, Kenya's Data Protection Act or South Africa's POPIA).</p>
<h2>The three questions</h2><ol><li>Where does my client's data go?</li><li>Who can see it?</li><li>Can I delete it?</li></ol><p>If you cannot answer all three for a tool, do not use it with client information.</p>
<h2>Fifteen checks</h2><ul class="check">""" + "".join(f"<li><span class='tick'></span>{c}</li>" for c in checks) + """</ul>
<h2>Consent wording you can adapt</h2>
<div class="box">"With your permission, I'd like to record our session so I can focus on you rather than note-taking. The recording is transcribed by [tool], stored in [place] and deleted after [30] days. It is never shared and never used to train AI. You can say no, or ask me to stop recording at any time, and it won't affect our work together."</div>
<h2>One-page AI policy template</h2>
<table><tr><th style="width:30%">Section</th><th>Your words</th></tr>
<tr><td><b>Purpose</b></td><td>I use AI tools to save time on admin and preparation so I can give clients more attention. AI never replaces my judgement.</td></tr>
<tr><td><b>Tools I use</b></td><td>[List each tool and what it is used for]</td></tr>
<tr><td><b>What never goes into AI</b></td><td>Names, contact details, health information, identifiable stories, anything a client asks me to keep private.</td></tr>
<tr><td><b>Recordings</b></td><td>Only with consent; stored in [place]; deleted after [days].</td></tr>
<tr><td><b>Client rights</b></td><td>Clients can ask what I hold, ask me to correct it or ask me to delete it.</td></tr>
<tr><td><b>Review</b></td><td>I review this policy every six months. Last reviewed: [date].</td></tr></table>""",
"Fifteen checks, consent wording and a one-page AI policy you can adapt today.", "🛡")

# 5 ─────────────────────────────────────────────────────────────
days = [("A question your clients ask you most, and your honest answer","Question"),("The moment you knew you had to become a coach","Story"),("One myth about coaching in your city or sector","Myth-buster"),("A simple tool you use with clients, explained in five steps","Tool"),("What clients usually say in the first session, and what they really mean","Insight"),("A mistake you made early in your practice and what it taught you","Story"),("Three signs someone is ready for coaching","List"),
("The question that changes most conversations","Question"),("A book that shaped how you coach, and one line from it in your words","Recommendation"),("What leaders in your city are worried about this month","Insight"),("Before-and-after: a client transformation (with permission, no names)","Case"),("A 60-second exercise readers can do right now","Exercise"),("Why you charge what you charge","Value"),("Your weekly routine as a coach","Behind the scenes"),
("An unpopular opinion about your niche","Opinion"),("Five questions to ask yourself on a Sunday evening","List"),("How AI is changing coaching, and what will never change","Future"),("A thank-you post naming someone who coached you","Gratitude"),("The difference between coaching, mentoring and training","Explainer"),("A client win you're proud of (with permission)","Case"),("What to do when you feel stuck: three steps","How-to"),
("The best question a client ever asked you","Story"),("A trend in your sector everyone should watch","Future"),("What a first session with you looks like","Behind the scenes"),("One habit that changed your productivity","Tip"),("A poll: what's your biggest challenge this quarter?","Engagement"),("Lessons from an event or conference you attended","Insight"),("Your three non-negotiables as a coach","Values"),
("A free resource you recommend, and why","Generosity"),("An invitation: what you're offering next month, and who it's for","Offer")]
rows = "".join(f"<tr><td><b>{i+1}</b></td><td>{t}</td><td>{k}</td></tr>" for i,(t,k) in enumerate(days))
add("30-day-linkedin-content-engine", "Content Plan", "The 30-Day LinkedIn Content Engine for Coaches",
"Thirty post ideas, a simple structure for every post, and a prompt that turns each idea into a finished draft.",
f"""<h2>The post structure that works</h2><ol><li><b>Hook</b> — one line that stops the scroll: a question, a surprising truth or a short story opening.</li><li><b>Body</b> — three to five short paragraphs. One idea only.</li><li><b>Lesson</b> — what the reader can take away today.</li><li><b>Invitation</b> — a question for the comments, or a gentle call to action.</li></ol>
<div class="box"><b>Rhythm:</b> post five days a week for six weeks. Reply to every comment within the day. Twice a week, comment thoughtfully on posts by people your buyers follow.</div>
<h2>Thirty days of ideas</h2><table><tr><th>Day</th><th>Post idea</th><th>Type</th></tr>{rows}</table>
<h2>The prompt that drafts each post</h2><div class="prompt">I'm a [niche] coach in [city]. Write a LinkedIn post on this idea: [idea from the list]. Use this structure: a one-line hook, three short paragraphs, one practical lesson, and a question to invite comments. 120–180 words. Warm, direct, no hype, no emojis except one at most. End with three relevant hashtags.</div>
<p>Always add one real detail from your own experience before posting. That is what makes it yours.</p>""",
"Thirty post ideas, a structure that works and a prompt that drafts each one.", "📣")

# 6 ─────────────────────────────────────────────────────────────
add("discovery-call-script-and-follow-ups", "Script + Templates", "Discovery Call Script & 5 Follow-up Emails",
"A 30-minute discovery call that serves the client first — and five follow-up emails for every outcome.",
"""<h2>The 30-minute discovery call</h2>
<table><tr><th>Minutes</th><th>Stage</th><th>What to say or ask</th></tr>
<tr><td>0–3</td><td>Welcome</td><td>"Thank you for making time. This call is about you: I'll ask some questions, you'll get some clarity, and at the end we'll see together whether working with me makes sense. Is that okay?"</td></tr>
<tr><td>3–10</td><td>Where are you now?</td><td>"What made you reach out now?" · "What's working? What isn't?" · "What have you already tried?"</td></tr>
<tr><td>10–17</td><td>Where do you want to be?</td><td>"Imagine it's six months from now and this has gone really well. What's different?" · "How would you know?" · "Why does that matter to you?"</td></tr>
<tr><td>17–22</td><td>What's in the way?</td><td>"What's stopped you getting there so far?" · "What happens if nothing changes?"</td></tr>
<tr><td>22–27</td><td>How I can help</td><td>Reflect back their goal in their words. Describe how you work in three sentences. Share one relevant example (with permission, no names).</td></tr>
<tr><td>27–30</td><td>Next step</td><td>"Based on what you've shared, I think I can help. Would you like me to send a short proposal with options?" — then stop talking.</td></tr></table>
<div class="box"><b>Golden rule:</b> the client should talk for at least 70% of the call. Take notes in their exact words — you'll use them in the proposal.</div>
<h2>Five follow-up emails</h2>
<h3>1. Same day — the proposal</h3><div class="prompt">Subject: Your next six months — options as promised

Hi [Name],
Thank you for today. I heard that you want [their goal, in their words], and that [obstacle] has been getting in the way.
As promised, here are three ways we could work together: [link or attachment].
If one feels right, reply with its name and I'll send the booking link. If you'd like to talk it through, I'm happy to.
Warmly, [Your name]</div>
<h3>2. Day 3 — the gentle nudge</h3><div class="prompt">Subject: A quick thought on [their goal]

Hi [Name], I was thinking about what you said: "[their words]". Here's one small thing you could try this week, whatever you decide: [one practical tip].
The options I sent are still open. Any questions, just reply.
[Your name]</div>
<h3>3. "I need to think about it"</h3><div class="prompt">Subject: Taking time is wise

Hi [Name], taking time to decide is wise. To help, here are the two questions most people find useful: what would change if you achieved [goal] in the next six months, and what will it cost you if nothing changes?
I'll hold your preferred start date until [date]. After that I'll open it to others.
[Your name]</div>
<h3>4. "It's too expensive"</h3><div class="prompt">Subject: Options that fit

Hi [Name], thank you for being honest about the budget. I'd rather you start well than stretch too far. Two options: we could begin with the Essential package and upgrade later, or spread the investment over [3] monthly payments.
Would either of those work?
[Your name]</div>
<h3>5. Day 14 — the respectful close</h3><div class="prompt">Subject: Closing the loop

Hi [Name], I haven't heard back, so I'll assume now isn't the right time — that's completely fine.
I'll keep you on my list for occasional insights. Whenever you're ready, reply "ready" and we'll pick up where we left off.
Wishing you every success with [their goal].
[Your name]</div>""",
"A client-first 30-minute call structure plus five follow-up emails for every outcome.", "📞")

# 7 ─────────────────────────────────────────────────────────────
add("3-tier-package-builder", "Worksheet", "The 3-Tier Package Builder",
"Stop selling hours. Design Essential, Growth and Premium packages your clients can say yes to.",
"""<h2>Why three tiers</h2><p>When people see one price, they ask "yes or no?". When they see three, they ask "which one?". The middle option is usually chosen most, so design it as the one you most want to sell.</p>
<h2>Step 1 — Name the outcome</h2><p>Your packages sell a result, not sessions. Complete this sentence:</p>
<div class="box">I help <b>[who]</b> to <b>[achieve what]</b> in <b>[how long]</b>, without <b>[what they fear]</b>.</div>
<h2>Step 2 — Fill the tiers</h2>
<table><tr><th style="width:22%"></th><th>Essential</th><th>Growth (recommended)</th><th>Premium</th></tr>
<tr class="fill"><td><b>Who it's for</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Outcome</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Length</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Sessions</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Between sessions</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Assessments or tools</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Bonus</b></td><td></td><td></td><td></td></tr>
<tr class="fill"><td><b>Price</b></td><td></td><td></td><td></td></tr></table>
<h2>Step 3 — Price with confidence</h2><ul><li><b>Essential</b> should be easy to say yes to, but still profitable.</li><li><b>Growth</b> is roughly twice Essential and includes the support that gets results.</li><li><b>Premium</b> is three to five times Essential: more access, more depth, more speed.</li><li>Offer instalments for Growth and Premium.</li><li>In mixed markets, set a local-currency price and an international price.</li></ul>
<h2>Step 4 — Test it</h2><p>Show your three tiers to five people who match your ideal client. Ask: "Which would you choose, and why?" Adjust names, contents and prices before you publish.</p>""",
"Design Essential, Growth and Premium offers clients can say yes to.", "💎")

# 8 ─────────────────────────────────────────────────────────────
stack = [("Scheduling","Google Calendar appointment schedules · Microsoft Bookings","Calendly · Acuity","One link, automatic reminders, buffer time"),
("Video sessions","Google Meet · Zoom (free tier) · Microsoft Teams","Zoom Pro","Reliable on low bandwidth; recording only with consent"),
("Notes and transcripts","Write bullets, then summarise with an AI assistant","Otter · Fireflies · Zoom AI Companion","Where transcripts are stored; deletion"),
("AI assistant","Claude · ChatGPT · Gemini · Microsoft Copilot (free tiers)","Paid tiers of the same","Training settings; never paste identifiable data"),
("Client records","A private Google Drive or OneDrive folder per client","Notion · a coaching CRM","Access control; two-step login"),
("Email list","Brevo · MailerLite (free tiers)","Mailchimp · ConvertKit (Kit)","Consent, unsubscribe link, deliverability"),
("Messaging","WhatsApp Business (labels, quick replies, catalogue)","WhatsApp Business API via a provider","Keep client chats separate from personal"),
("Design","Canva (free)","Canva Pro","Brand colours and fonts saved once"),
("Payments","Paystack · Flutterwave payment links (Africa) · PayPal","Stripe · Paystack subscriptions","Fees, payout times, local currency"),
("Automation glue","Built-in automations in the tools above","Zapier · Make","Start with one simple workflow"),
("Forms and feedback","Google Forms · Microsoft Forms","Typeform · Tally","Short forms get answered"),
("Opportunity radar","DeoCoach (free) — cities, bodies, events, tenders","DeoCoach membership","Set your profession and city")]
rows = "".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a,b,c,d in stack)
add("ai-tool-stack-for-coaches", "Guide", "The AI Tool Stack for Coaches",
"The tools that do each job in a coaching practice, with a free option first — so you can start this week without spending.",
f"""<div class="box"><b>Start free, upgrade only when it pays.</b> Tool names and prices change often; check each provider's current plans and privacy settings before you sign up. No tool here pays to be listed.</div>
<table><tr><th>Job</th><th>Start free</th><th>When you grow</th><th>Check</th></tr>{rows}</table>
<h2>A simple starter stack</h2><ol><li>A booking link with reminders.</li><li>Video calls on the platform your clients already use.</li><li>One AI assistant, with training switched off where you can.</li><li>One folder per client, in one place.</li><li>A free email list and WhatsApp Business.</li></ol>
<p>That's enough to run a professional practice. Add the next tool only when a task is costing you more than an hour a week.</p>""",
"The tools for each job in your practice, with a free option first.", "🧰")
