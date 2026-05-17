alter table public.jobs
  add column if not exists source_company text,
  add column if not exists source_url text,
  add column if not exists source_external_id text,
  add column if not exists imported_at timestamptz;

create unique index if not exists jobs_source_url_unique_idx
  on public.jobs (source_url)
  where source_url is not null;

create index if not exists jobs_source_company_idx
  on public.jobs (source_company);
