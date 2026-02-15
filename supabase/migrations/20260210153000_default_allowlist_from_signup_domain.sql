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
  email_domain text;
begin
  email_prefix := coalesce(split_part(new.email, '@', 1), 'workspace');
  email_domain := nullif(lower(split_part(coalesce(new.email, ''), '@', 2)), '');
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

  insert into public.widgets (workspace_id, name, is_primary, mode, theme, domain_allowlist)
  values (
    workspace_id,
    'Primary Widget',
    true,
    'inline',
    'dark',
    case
      when email_domain is null then '{}'::text[]
      else array[email_domain]
    end
  );

  return new;
end;
$$;
