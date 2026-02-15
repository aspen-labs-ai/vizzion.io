create or replace function public.is_workspace_member(workspace_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_users wu
    where wu.workspace_id = workspace_uuid
      and wu.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(workspace_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_users wu
    where wu.workspace_id = workspace_uuid
      and wu.user_id = auth.uid()
      and wu.role = 'owner'
  );
$$;

create or replace function public.storage_workspace_id(object_name text)
returns uuid
language plpgsql
immutable
as $$
begin
  return split_part(object_name, '/', 1)::uuid;
exception
  when others then
    return null;
end;
$$;

alter table public.workspaces enable row level security;
alter table public.workspace_users enable row level security;
alter table public.widgets enable row level security;
alter table public.materials enable row level security;
alter table public.widget_sessions enable row level security;
alter table public.widget_events enable row level security;
alter table public.leads enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.generated_previews enable row level security;

drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member
  on public.workspaces for select
  to authenticated
  using (public.is_workspace_member(id));

drop policy if exists workspaces_insert_authenticated on public.workspaces;
create policy workspaces_insert_authenticated
  on public.workspaces for insert
  to authenticated
  with check (auth.uid() is not null);

drop policy if exists workspaces_update_owner on public.workspaces;
create policy workspaces_update_owner
  on public.workspaces for update
  to authenticated
  using (public.is_workspace_owner(id))
  with check (public.is_workspace_owner(id));

drop policy if exists workspace_users_select_member on public.workspace_users;
create policy workspace_users_select_member
  on public.workspace_users for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_users_manage_owner on public.workspace_users;
create policy workspace_users_manage_owner
  on public.workspace_users for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

-- Shared policies for workspace-scoped tables.
drop policy if exists widgets_select_member on public.widgets;
create policy widgets_select_member
  on public.widgets for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists widgets_manage_owner on public.widgets;
create policy widgets_manage_owner
  on public.widgets for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists materials_select_member on public.materials;
create policy materials_select_member
  on public.materials for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists materials_manage_owner on public.materials;
create policy materials_manage_owner
  on public.materials for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists sessions_select_member on public.widget_sessions;
create policy sessions_select_member
  on public.widget_sessions for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists sessions_manage_owner on public.widget_sessions;
create policy sessions_manage_owner
  on public.widget_sessions for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists events_select_member on public.widget_events;
create policy events_select_member
  on public.widget_events for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists events_manage_owner on public.widget_events;
create policy events_manage_owner
  on public.widget_events for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists leads_select_member on public.leads;
create policy leads_select_member
  on public.leads for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists leads_manage_owner on public.leads;
create policy leads_manage_owner
  on public.leads for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists jobs_select_member on public.generation_jobs;
create policy jobs_select_member
  on public.generation_jobs for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists jobs_manage_owner on public.generation_jobs;
create policy jobs_manage_owner
  on public.generation_jobs for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

drop policy if exists previews_select_member on public.generated_previews;
create policy previews_select_member
  on public.generated_previews for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists previews_manage_owner on public.generated_previews;
create policy previews_manage_owner
  on public.generated_previews for all
  to authenticated
  using (public.is_workspace_owner(workspace_id))
  with check (public.is_workspace_owner(workspace_id));

insert into storage.buckets (id, name, public)
values
  ('materials', 'materials', false),
  ('uploads-original', 'uploads-original', false),
  ('renders-generated', 'renders-generated', false)
on conflict (id) do nothing;

drop policy if exists storage_read_member_files on storage.objects;
create policy storage_read_member_files
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('materials', 'uploads-original', 'renders-generated')
    and public.is_workspace_member(public.storage_workspace_id(name))
  );

drop policy if exists storage_write_owner_files on storage.objects;
create policy storage_write_owner_files
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('materials', 'uploads-original', 'renders-generated')
    and public.is_workspace_owner(public.storage_workspace_id(name))
  )
  with check (
    bucket_id in ('materials', 'uploads-original', 'renders-generated')
    and public.is_workspace_owner(public.storage_workspace_id(name))
  );

create or replace function public.cleanup_expired_original_uploads()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from storage.objects
  where bucket_id = 'uploads-original'
    and created_at < now() - interval '30 days';
end;
$$;

create or replace function public.bootstrap_workspace_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  workspace_id uuid;
  base_slug text;
  candidate_slug text;
  suffix int := 0;
  email_prefix text;
begin
  email_prefix := coalesce(split_part(new.email, '@', 1), 'workspace');
  base_slug := regexp_replace(lower(email_prefix), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'workspace';
  end if;

  candidate_slug := base_slug;
  while exists (select 1 from public.workspaces w where w.slug = candidate_slug) loop
    suffix := suffix + 1;
    candidate_slug := base_slug || '-' || suffix::text;
  end loop;

  insert into public.workspaces (name, slug, company_name, status)
  values (
    coalesce(new.raw_user_meta_data ->> 'company_name', initcap(replace(email_prefix, '.', ' ')) || ' Workspace'),
    candidate_slug,
    nullif(new.raw_user_meta_data ->> 'company_name', ''),
    'pending'
  )
  returning id into workspace_id;

  insert into public.workspace_users (workspace_id, user_id, role)
  values (workspace_id, new.id, 'owner');

  insert into public.widgets (workspace_id, name, is_primary, mode, theme)
  values (workspace_id, 'Primary Widget', true, 'inline', 'dark');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_bootstrap on auth.users;
create trigger on_auth_user_created_bootstrap
  after insert on auth.users
  for each row execute function public.bootstrap_workspace_for_new_user();
