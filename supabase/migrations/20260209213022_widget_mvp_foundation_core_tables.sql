create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.generate_embed_key()
returns text
language plpgsql
as $$
begin
  return 'vwk_' || encode(extensions.gen_random_bytes(18), 'hex');
end;
$$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  company_name text,
  brand_color text not null default '#10B981',
  logo_url text,
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_users (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (workspace_id, user_id)
);

create table if not exists public.widgets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null default 'Primary Widget',
  embed_key text not null unique default public.generate_embed_key(),
  mode text not null default 'inline' check (mode in ('inline', 'popup')),
  theme text not null default 'dark' check (theme in ('dark', 'light')),
  is_primary boolean not null default false,
  is_active boolean not null default true,
  domain_allowlist text[] not null default '{}',
  require_email boolean not null default true,
  auto_open_widget boolean not null default false,
  show_product_names boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists widgets_one_primary_per_workspace_idx
  on public.widgets (workspace_id)
  where is_primary;

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  name text not null,
  swatch_url text,
  texture_url text,
  prompt_modifier text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (widget_id, name)
);

create table if not exists public.widget_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  session_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  page_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  started_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.widget_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  session_id uuid references public.widget_sessions(id) on delete set null,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  session_id uuid references public.widget_sessions(id) on delete set null,
  material_id uuid references public.materials(id) on delete set null,
  email text not null,
  email_status text not null default 'submitted' check (email_status in ('submitted', 'verified', 'sent', 'failed')),
  source_page text,
  preview_sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (widget_id, session_id, email)
);

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  session_id uuid references public.widget_sessions(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'succeeded', 'failed')),
  provider text not null default 'gemini',
  provider_model text,
  prompt text,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.generated_previews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  generation_job_id uuid not null unique references public.generation_jobs(id) on delete cascade,
  original_upload_path text,
  generated_path text,
  material_snapshot jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists widget_sessions_widget_id_started_at_idx
  on public.widget_sessions (widget_id, started_at desc);

create index if not exists widget_events_widget_id_created_at_idx
  on public.widget_events (widget_id, created_at desc);

create index if not exists leads_widget_id_created_at_idx
  on public.leads (widget_id, created_at desc);

create index if not exists generation_jobs_widget_id_created_at_idx
  on public.generation_jobs (widget_id, created_at desc);

create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

create trigger trg_widgets_updated_at
  before update on public.widgets
  for each row execute function public.set_updated_at();

create trigger trg_materials_updated_at
  before update on public.materials
  for each row execute function public.set_updated_at();

create trigger trg_generation_jobs_updated_at
  before update on public.generation_jobs
  for each row execute function public.set_updated_at();
