create index if not exists candidate_alerts_confirmed_at_idx
  on public.candidate_alerts (confirmed_at)
  where confirmed_at is not null;

create index if not exists candidate_alerts_email_idx
  on public.candidate_alerts (email);
