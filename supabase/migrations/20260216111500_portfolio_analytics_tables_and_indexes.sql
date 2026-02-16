create table if not exists public.widget_uploads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  session_id uuid references public.widget_sessions(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  created_at timestamptz not null default timezone('utc', now()),
  constraint widget_uploads_storage_path_check check (length(trim(storage_path)) > 0)
);

create table if not exists public.industry_widget_mappings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  widget_id uuid not null references public.widgets(id) on delete cascade,
  industry_slug text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint industry_widget_mappings_slug_check check (length(trim(industry_slug)) > 0),
  constraint industry_widget_mappings_workspace_slug_key unique (workspace_id, industry_slug),
  constraint industry_widget_mappings_widget_key unique (widget_id)
);

create index if not exists widget_uploads_widget_id_created_at_idx
  on public.widget_uploads (widget_id, created_at desc);

create index if not exists widget_uploads_workspace_id_created_at_idx
  on public.widget_uploads (workspace_id, created_at desc);

create index if not exists generation_jobs_widget_id_status_created_at_idx
  on public.generation_jobs (widget_id, status, created_at desc);

create index if not exists generated_previews_widget_id_created_at_idx
  on public.generated_previews (widget_id, created_at desc);

create index if not exists industry_widget_mappings_workspace_id_idx
  on public.industry_widget_mappings (workspace_id);

create index if not exists industry_widget_mappings_workspace_industry_slug_idx
  on public.industry_widget_mappings (workspace_id, industry_slug);

drop trigger if exists trg_industry_widget_mappings_updated_at on public.industry_widget_mappings;
create trigger trg_industry_widget_mappings_updated_at
  before update on public.industry_widget_mappings
  for each row execute function public.set_updated_at();

alter table public.widget_uploads enable row level security;
alter table public.industry_widget_mappings enable row level security;

drop policy if exists widget_uploads_select_member on public.widget_uploads;
create policy widget_uploads_select_member
  on public.widget_uploads for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists widget_uploads_manage_owner on public.widget_uploads;
create policy widget_uploads_manage_owner
  on public.widget_uploads for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists industry_widget_mappings_select_member on public.industry_widget_mappings;
create policy industry_widget_mappings_select_member
  on public.industry_widget_mappings for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists industry_widget_mappings_manage_owner on public.industry_widget_mappings;
create policy industry_widget_mappings_manage_owner
  on public.industry_widget_mappings for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));
