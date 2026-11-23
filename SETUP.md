# DeoCoach: switching on the live services

The site works fully without these; each service switches on when its variables are added in **Vercel → deocoach-app → Settings → Environment Variables** and the project is redeployed.

| Service | What it powers | Variables |
|---|---|---|
| Live AI | City Analyst, Ask the Supervisor, "Deepen with live AI" briefings, and **full-page translation into the 24 pan-African languages** (menus and key questions are built in already) | `ANTHROPIC_API_KEY`. Optional: `ANTHROPIC_MODEL`, `AI_HOURLY_LIMIT` |
| Opportunity search | World Bank procurement notices (on by default, public API) | none |
| ReliefWeb jobs & consultancies | Adds NGO/UN jobs to the Opportunity Desk | `RELIEFWEB_APPNAME` (request an approved appname from ReliefWeb) |
| South Africa jobs | Adzuna jobs | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` |
| Translation suggestions from native speakers (table deocoach_translations, status pending → review) | Same Supabase keys | |
| Opportunity alerts by email + shared field notes | Daily/weekly emails (cron at 06:00 UTC), coaches teaching each other | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Deo Cloud), `RESEND_API_KEY`, `DIGEST_FROM` (e.g. `DeoCoach <alerts@yourdomain>`), `CRON_SECRET` |

## Supabase tables (run once in the Deo Cloud SQL editor)
```sql
create table if not exists public.deocoach_alerts (
  email text primary key, countries text[], kw text, cadence text, token text, updated_at timestamptz default now());
create table if not exists public.deocoach_signals (
  id bigint generated always as identity primary key, city text, kind text, niche text, note text, strength int, created_at timestamptz default now());
create table if not exists public.deocoach_translations (
  id bigint generated always as identity primary key, lang text, source text, current_text text, suggestion text, note text, status text default 'pending', created_at timestamptz default now());
create table if not exists public.deocoach_intel (
  id bigint generated always as identity primary key, key text unique, kind text, ref text, city text, niches text[], industries text[] default '{}', name text,
  start_date text, end_date text, venue text, url text, audience text, mag int default 5, confidence text,
  score int default 1, seen int default 1, votes jsonb default '{}'::jsonb, status text default 'active',
  first_seen timestamptz default now(), last_seen timestamptz default now());
create table if not exists public.deocoach_intel_state (k text primary key, v jsonb);
create table if not exists public.deocoach_hits (
  id bigint generated always as identity primary key, at timestamptz default now(), kind text, city text, region text, country text,
  path text, src text, pro text, ed text, dev text, lang text);
create index if not exists deocoach_hits_at on public.deocoach_hits (at);
-- Visitor intelligence (bots, engagement, browser, time on site):
alter table public.deocoach_hits add column if not exists vid text, add column if not exists bot text, add column if not exists browser text, add column if not exists os text, add column if not exists tz text, add column if not exists scr text, add column if not exists secs int, add column if not exists depth int, add column if not exists pages int, add column if not exists eng boolean;
create index if not exists deocoach_hits_vid on public.deocoach_hits (vid);
alter table public.deocoach_hits enable row level security;

alter table public.deocoach_intel enable row level security;
alter table public.deocoach_intel_state enable row level security;
alter table public.deocoach_translations enable row level security;
alter table public.deocoach_alerts enable row level security;
alter table public.deocoach_signals enable row level security;
-- No public policies: only the server functions (service key) read and write.
```

## Privacy
- Alerts store only email, chosen countries, keywords, cadence and an unsubscribe token; every email has a one-click unsubscribe.
- Shared field notes are anonymous (no names, emails or IPs) and opt-in per note. Moderate them before a public launch.
- Before launch: publish a privacy notice and check it against the Nigeria Data Protection Act 2023, Kenya's Data Protection Act 2019, POPIA and UK/EU GDPR as relevant.

Rebuild after editing anything in `src/`: `python3 src/build.py`


## Living intelligence (self-updating event database)
- `api/intel.js` runs every 6 hours (vercel.json cron), rotating three jobs: harvest one African city (30 in rotation), harvest one industry across Africa and the world (18 industries), and re-check the dates of one curated "check timing" event, professional body or global industry flagship (38 in rotation). All use Claude + web search.
- If you created deocoach_intel before the industries column existed: `alter table public.deocoach_intel add column if not exists industries text[] default '{}';`
- Every re-sighting raises an item's `seen` and `score`; coaches' votes (confirm +2, attended +2, useful +1, wrong −3) move the score; items at −3 or below are hidden; ended items are retired.
- Confirmed date updates automatically replace the curated "expected" dates in the Events Radar and the Professional Bodies Map.
- Needs SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY; set CRON_SECRET to protect the harvester.


## Footfall (visitor counting)
`/api/hit` records each visit anonymously (city/country from Vercel geo headers, page, source, profession, edition, device; no IP, no cookies; Do Not Track respected). The private report is at **/footfall** — unlock it with the `CRON_SECRET` phrase. Tag shared links with `?src=parley` (or any word) to name the source.

## The Founding 50 and the Free Toolkit
- Table (run once): `create table if not exists public.deocoach_founding50 (id bigint generated always as identity primary key, at timestamptz default now(), name text not null, email text not null unique, phone text, city text, country text, pro text, practice text, wants text, status text default 'reserved', notes text); alter table public.deocoach_founding50 enable row level security;`
- `/api/founding50`: GET = places left; POST = apply (first 50 reserved, then waitlist; confirmation email to the applicant and a notification to DIGEST_REPLY_TO); GET with x-admin-key = the list (shown on /footfall).
- Free Toolkit pages live in `/free/` and are generated by `python3 freebies/tpl.py` from `freebies/content.py` (which also writes `src/free_data.js`). Short links: deocoach.com/founding50, deocoach.com/free.

## Sign on (join hub, coaching, membership, ACW session)
```sql
create table if not exists public.deocoach_signups (
  id bigint generated always as identity primary key, at timestamptz default now(), kind text, name text, email text, phone text,
  org text, role text, segment text, plan text, cycle text, currency text, amount int, ref text, note text, country text, src text, status text);
create index if not exists deocoach_signups_at on public.deocoach_signups (at);
alter table public.deocoach_signups enable row level security;
```
Optional Vercel variables (David enters these himself):
- ACW_TIME (e.g. "4:00pm WAT"), ACW_ZOOM_LINK: shown in ACW confirmations and reminders (24 Nov 08:00 UTC, 25 Nov 07:00 UTC).
- F50_ZOOM_LINK, F50_WHATSAPP_LINK: Founding 50 session reminders (Thursdays 08:00 UTC on session dates) and welcome emails.
- CALENDLY_URL: discovery-call link (defaults to calendly.com/adeoyedavid/30min).
- PAYSTACK_SECRET_KEY: card checkout; set the Paystack webhook to https://www.deocoach.com/api/paystack
- BANK_DETAILS: the bank-transfer instructions shown on the membership page (multi-line text).
Prices live in lib/plans.js (null = "reserve your place" until set).
