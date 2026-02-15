alter table public.widgets
  add column if not exists max_generations_per_session integer,
  add column if not exists max_generations_per_email_lifetime integer,
  add column if not exists limit_reached_cta_url text;

alter table public.widgets
  drop constraint if exists widgets_max_generations_per_session_check;
alter table public.widgets
  add constraint widgets_max_generations_per_session_check
  check (
    max_generations_per_session is null
    or max_generations_per_session > 0
  );

alter table public.widgets
  drop constraint if exists widgets_max_generations_per_email_lifetime_check;
alter table public.widgets
  add constraint widgets_max_generations_per_email_lifetime_check
  check (
    max_generations_per_email_lifetime is null
    or max_generations_per_email_lifetime > 0
  );

alter table public.widgets
  drop constraint if exists widgets_limit_reached_cta_url_check;
alter table public.widgets
  add constraint widgets_limit_reached_cta_url_check
  check (
    limit_reached_cta_url is null
    or length(trim(limit_reached_cta_url)) > 0
  );

create index if not exists leads_widget_id_email_idx
  on public.leads (widget_id, email);

create index if not exists generation_jobs_widget_id_session_id_created_at_idx
  on public.generation_jobs (widget_id, session_id, created_at desc);

create index if not exists widget_sessions_widget_id_ip_hash_started_at_idx
  on public.widget_sessions (widget_id, ip_hash, started_at desc);
