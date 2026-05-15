create extension if not exists "pgcrypto";

create type job_status as enum ('draft', 'pending', 'live', 'expired', 'rejected');
create type country_code as enum ('DE', 'AT', 'CH');
create type work_mode as enum ('remote', 'hybrid', 'onsite');
create type seniority as enum ('junior', 'mid', 'senior', 'lead');
create type salary_currency as enum ('EUR', 'CHF');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  status job_status not null default 'draft',
  title text not null,
  company_name text not null,
  company_logo_url text,
  location_city text not null,
  country country_code not null default 'DE',
  work_mode work_mode not null,
  employment_type text not null,
  role_type text not null,
  seniority seniority not null,
  description_markdown text not null,
  apply_url text not null,
  contact_email text not null,
  salary_min integer,
  salary_max integer,
  salary_currency salary_currency not null default 'EUR',
  tags text[] not null default '{}',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_customer_email text,
  published_at timestamptz,
  expires_at timestamptz,
  admin_notes text,
  constraint jobs_salary_range_check check (
    salary_min is null or salary_max is null or salary_min <= salary_max
  )
);

create table public.candidate_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  preferred_role_type text not null,
  preferred_city text not null,
  confirmed_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor text,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'
);

create index jobs_live_idx on public.jobs (status, published_at desc) where status = 'live';
create index jobs_filters_idx on public.jobs (role_type, location_city, work_mode, seniority);
create index candidate_alerts_email_idx on public.candidate_alerts (email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;
alter table public.candidate_alerts enable row level security;
alter table public.audit_events enable row level security;

create policy "Public can read live unexpired jobs"
on public.jobs
for select
using (
  status = 'live'
  and (expires_at is null or expires_at > now())
);

create policy "Authenticated admins can read jobs"
on public.jobs
for select
to authenticated
using (true);

create policy "Authenticated admins can update jobs"
on public.jobs
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can read alerts"
on public.candidate_alerts
for select
to authenticated
using (true);

create policy "Authenticated admins can read audit events"
on public.audit_events
for select
to authenticated
using (true);

-- Inserts for jobs and candidate_alerts are performed server-side with the service role key.
