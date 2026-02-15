create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.generate_embed_key()
returns text
language plpgsql
set search_path = public
as $$
begin
  return 'vwk_' || encode(extensions.gen_random_bytes(18), 'hex');
end;
$$;

create or replace function public.storage_workspace_id(object_name text)
returns uuid
language plpgsql
immutable
set search_path = public
as $$
begin
  return split_part(object_name, '/', 1)::uuid;
exception
  when others then
    return null;
end;
$$;

drop policy if exists workspaces_insert_authenticated on public.workspaces;
create policy workspaces_insert_authenticated
  on public.workspaces for insert
  to authenticated
  with check ((select auth.uid()) is not null);

create index if not exists generated_previews_lead_id_idx
  on public.generated_previews (lead_id);

create index if not exists generated_previews_widget_id_idx
  on public.generated_previews (widget_id);

create index if not exists generated_previews_workspace_id_idx
  on public.generated_previews (workspace_id);

create index if not exists generation_jobs_lead_id_idx
  on public.generation_jobs (lead_id);

create index if not exists generation_jobs_session_id_idx
  on public.generation_jobs (session_id);

create index if not exists generation_jobs_workspace_id_idx
  on public.generation_jobs (workspace_id);

create index if not exists leads_material_id_idx
  on public.leads (material_id);

create index if not exists leads_session_id_idx
  on public.leads (session_id);

create index if not exists leads_workspace_id_idx
  on public.leads (workspace_id);

create index if not exists materials_workspace_id_idx
  on public.materials (workspace_id);

create index if not exists widget_events_session_id_idx
  on public.widget_events (session_id);

create index if not exists widget_events_workspace_id_idx
  on public.widget_events (workspace_id);

create index if not exists widget_sessions_workspace_id_idx
  on public.widget_sessions (workspace_id);

create index if not exists workspace_users_user_id_idx
  on public.workspace_users (user_id);
