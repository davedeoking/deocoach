-- Shared translation cache for DeoCoach (run once in the Supabase SQL editor). Server-only access.
create table if not exists deocoach_translations (
  h text primary key,          -- sha1(lang + NUL + English text)
  lang text not null,
  src text not null,
  out text not null,
  created_at timestamptz not null default now()
);
alter table deocoach_translations enable row level security;
