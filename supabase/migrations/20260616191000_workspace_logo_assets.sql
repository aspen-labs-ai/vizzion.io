insert into storage.buckets (id, name, public)
values ('workspace-assets', 'workspace-assets', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists storage_read_member_files on storage.objects;
create policy storage_read_member_files
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('materials', 'uploads-original', 'renders-generated', 'workspace-assets')
    and public.is_workspace_member(public.storage_workspace_id(name))
  );

drop policy if exists storage_write_owner_files on storage.objects;
create policy storage_write_owner_files
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('materials', 'uploads-original', 'renders-generated', 'workspace-assets')
    and public.is_workspace_owner(public.storage_workspace_id(name))
  )
  with check (
    bucket_id in ('materials', 'uploads-original', 'renders-generated', 'workspace-assets')
    and public.is_workspace_owner(public.storage_workspace_id(name))
  );
