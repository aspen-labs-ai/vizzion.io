create table if not exists public.billing_plans (
  code text primary key,
  name text not null,
  tagline text not null,
  cta_label text not null,
  featured boolean not null default false,
  monthly_price_cents integer,
  annual_price_cents integer,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_public boolean not null default true,
  visualization_quota_per_cycle integer,
  materials_quota integer,
  embed_domains_quota integer,
  feature_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint billing_plans_monthly_price_non_negative check (monthly_price_cents is null or monthly_price_cents >= 0),
  constraint billing_plans_annual_price_non_negative check (annual_price_cents is null or annual_price_cents >= 0),
  constraint billing_plans_visualization_quota_non_negative
    check (visualization_quota_per_cycle is null or visualization_quota_per_cycle >= 0),
  constraint billing_plans_materials_quota_non_negative
    check (materials_quota is null or materials_quota >= 0),
  constraint billing_plans_embed_domains_quota_non_negative
    check (embed_domains_quota is null or embed_domains_quota >= 0)
);

create table if not exists public.workspace_subscriptions (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  plan_code text not null references public.billing_plans(code),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'paused')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  overage_enabled boolean not null default true,
  overage_cap_percent integer not null default 20
    check (overage_cap_percent >= 0 and overage_cap_percent <= 100),
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workspace_subscriptions_period_valid check (current_period_end > current_period_start)
);

create table if not exists public.workspace_usage_cycles (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric text not null check (metric in ('visualizations')),
  period_start timestamptz not null,
  period_end timestamptz not null,
  used_units integer not null default 0 check (used_units >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workspace_usage_cycles_period_valid check (period_end > period_start),
  unique (workspace_id, metric, period_start)
);

create table if not exists public.workspace_credit_adjustments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric text not null check (metric in ('visualizations')),
  period_start timestamptz not null,
  units_delta integer not null,
  reason text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_usage_alerts (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  metric text not null check (metric in ('visualizations')),
  period_start timestamptz not null,
  threshold_percent integer not null check (threshold_percent >= 1 and threshold_percent <= 100),
  created_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, metric, period_start, threshold_percent)
);

create index if not exists billing_plans_sort_order_idx
  on public.billing_plans (sort_order asc);

create index if not exists workspace_subscriptions_plan_code_idx
  on public.workspace_subscriptions (plan_code);

create index if not exists workspace_subscriptions_status_idx
  on public.workspace_subscriptions (status);

create index if not exists workspace_usage_cycles_workspace_metric_period_idx
  on public.workspace_usage_cycles (workspace_id, metric, period_start desc);

create index if not exists workspace_credit_adjustments_workspace_metric_period_idx
  on public.workspace_credit_adjustments (workspace_id, metric, period_start desc);

create index if not exists workspace_usage_alerts_workspace_metric_period_idx
  on public.workspace_usage_alerts (workspace_id, metric, period_start desc);

drop trigger if exists trg_billing_plans_updated_at on public.billing_plans;
create trigger trg_billing_plans_updated_at
  before update on public.billing_plans
  for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_subscriptions_updated_at on public.workspace_subscriptions;
create trigger trg_workspace_subscriptions_updated_at
  before update on public.workspace_subscriptions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_usage_cycles_updated_at on public.workspace_usage_cycles;
create trigger trg_workspace_usage_cycles_updated_at
  before update on public.workspace_usage_cycles
  for each row execute function public.set_updated_at();

alter table public.leads drop constraint if exists leads_email_status_check;
alter table public.leads
  add constraint leads_email_status_check
  check (email_status in ('submitted', 'verified', 'sent', 'failed', 'blocked_quota'));

insert into public.billing_plans (
  code,
  name,
  tagline,
  cta_label,
  featured,
  monthly_price_cents,
  annual_price_cents,
  sort_order,
  is_active,
  is_public,
  visualization_quota_per_cycle,
  materials_quota,
  embed_domains_quota,
  feature_flags
)
values
  (
    'free',
    'Free',
    'Everything you need to prove it works.',
    'Get Started',
    false,
    0,
    0,
    10,
    true,
    true,
    25,
    4,
    1,
    '{}'::jsonb
  ),
  (
    'growth',
    'Growth',
    'For businesses ready to generate real pipeline.',
    'Start Free Trial',
    false,
    14900,
    11900,
    20,
    true,
    true,
    200,
    10,
    1,
    '{}'::jsonb
  ),
  (
    'pro',
    'Pro',
    'For serious lead generation at scale.',
    'Start Free Trial',
    true,
    34900,
    27900,
    30,
    true,
    true,
    1000,
    50,
    3,
    '{}'::jsonb
  ),
  (
    'enterprise',
    'Enterprise',
    'For multi-location and high-volume operations.',
    'Contact Sales',
    false,
    null,
    null,
    40,
    true,
    true,
    null,
    null,
    null,
    '{}'::jsonb
  )
on conflict (code)
do update
set
  name = excluded.name,
  tagline = excluded.tagline,
  cta_label = excluded.cta_label,
  featured = excluded.featured,
  monthly_price_cents = excluded.monthly_price_cents,
  annual_price_cents = excluded.annual_price_cents,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  is_public = excluded.is_public,
  visualization_quota_per_cycle = excluded.visualization_quota_per_cycle,
  materials_quota = excluded.materials_quota,
  embed_domains_quota = excluded.embed_domains_quota,
  feature_flags = excluded.feature_flags,
  updated_at = timezone('utc', now());

create or replace function public.bootstrap_subscription_for_new_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_subscriptions (
    workspace_id,
    plan_code,
    status,
    current_period_start,
    current_period_end,
    overage_enabled,
    overage_cap_percent
  )
  values (
    new.id,
    'free',
    'active',
    timezone('utc', now()),
    timezone('utc', now()) + interval '1 month',
    true,
    20
  )
  on conflict (workspace_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_workspaces_bootstrap_subscription on public.workspaces;
create trigger trg_workspaces_bootstrap_subscription
  after insert on public.workspaces
  for each row execute function public.bootstrap_subscription_for_new_workspace();

insert into public.workspace_subscriptions (
  workspace_id,
  plan_code,
  status,
  current_period_start,
  current_period_end,
  overage_enabled,
  overage_cap_percent
)
select
  w.id,
  'free',
  'active',
  timezone('utc', now()),
  timezone('utc', now()) + interval '1 month',
  true,
  20
from public.workspaces w
where not exists (
  select 1
  from public.workspace_subscriptions ws
  where ws.workspace_id = w.id
);

create or replace function public.normalize_domain(value text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(
    trim(both '/' from split_part(regexp_replace(lower(coalesce(value, '')), '^https?://', ''), '/', 1)),
    ''
  );
$$;

create or replace function public.ensure_workspace_subscription_period(workspace_uuid uuid)
returns public.workspace_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.workspace_subscriptions%rowtype;
  now_utc timestamptz := timezone('utc', now());
  changed boolean := false;
begin
  select *
  into sub
  from public.workspace_subscriptions
  where workspace_id = workspace_uuid
  for update;

  if not found then
    raise exception 'Missing subscription for workspace %', workspace_uuid;
  end if;

  if sub.current_period_end <= sub.current_period_start then
    sub.current_period_start := now_utc;
    sub.current_period_end := now_utc + interval '1 month';
    changed := true;
  end if;

  while sub.current_period_end <= now_utc loop
    sub.current_period_start := sub.current_period_end;
    sub.current_period_end := sub.current_period_end + interval '1 month';
    changed := true;
  end loop;

  if changed then
    update public.workspace_subscriptions ws
    set
      current_period_start = sub.current_period_start,
      current_period_end = sub.current_period_end,
      updated_at = timezone('utc', now())
    where ws.workspace_id = workspace_uuid
    returning * into sub;
  end if;

  return sub;
end;
$$;

create or replace function public.consume_visualization_quota(
  workspace_uuid uuid,
  units integer default 1
)
returns table (
  allowed boolean,
  within_base_quota boolean,
  within_overage boolean,
  blocked boolean,
  used_units integer,
  base_quota_units integer,
  overage_cap_units integer,
  total_quota_units integer,
  period_start timestamptz,
  period_end timestamptz,
  crossed_thresholds integer[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.workspace_subscriptions%rowtype;
  plan_quota integer;
  credit_units integer := 0;
  effective_base_quota integer;
  overage_units integer;
  effective_total_quota integer;
  usage_before integer := 0;
  usage_after integer := 0;
  pct_before numeric := 0;
  pct_after numeric := 0;
  threshold integer;
  thresholds integer[] := array[50, 75, 90, 100];
  crossed integer[] := array[]::integer[];
begin
  if units is null or units <= 0 then
    raise exception 'Units must be greater than zero.';
  end if;

  select * into sub
  from public.ensure_workspace_subscription_period(workspace_uuid);

  select bp.visualization_quota_per_cycle
  into plan_quota
  from public.billing_plans bp
  where bp.code = sub.plan_code;

  if not found then
    raise exception 'Missing billing plan % for workspace %', sub.plan_code, workspace_uuid;
  end if;

  select coalesce(sum(wca.units_delta), 0)::integer
  into credit_units
  from public.workspace_credit_adjustments wca
  where wca.workspace_id = workspace_uuid
    and wca.metric = 'visualizations'
    and wca.period_start = sub.current_period_start;

  if plan_quota is null then
    effective_base_quota := null;
    overage_units := null;
    effective_total_quota := null;
  else
    effective_base_quota := greatest(plan_quota + credit_units, 0);

    if sub.overage_enabled then
      overage_units := ceil((effective_base_quota::numeric * sub.overage_cap_percent::numeric) / 100.0)::integer;
    else
      overage_units := 0;
    end if;

    effective_total_quota := effective_base_quota + overage_units;
  end if;

  insert into public.workspace_usage_cycles (
    workspace_id,
    metric,
    period_start,
    period_end,
    used_units
  )
  values (
    workspace_uuid,
    'visualizations',
    sub.current_period_start,
    sub.current_period_end,
    0
  )
  on conflict (workspace_id, metric, period_start) do nothing;

  select wuc.used_units
  into usage_before
  from public.workspace_usage_cycles wuc
  where wuc.workspace_id = workspace_uuid
    and wuc.metric = 'visualizations'
    and wuc.period_start = sub.current_period_start
  for update;

  usage_after := usage_before + units;

  if effective_total_quota is not null and usage_after > effective_total_quota then
    return query
      select
        false,
        false,
        false,
        true,
        usage_before,
        effective_base_quota,
        overage_units,
        effective_total_quota,
        sub.current_period_start,
        sub.current_period_end,
        array[]::integer[];
    return;
  end if;

  update public.workspace_usage_cycles wuc
  set
    used_units = usage_after,
    updated_at = timezone('utc', now())
  where wuc.workspace_id = workspace_uuid
    and wuc.metric = 'visualizations'
    and wuc.period_start = sub.current_period_start;

  if effective_total_quota is not null and effective_total_quota > 0 then
    pct_before := (usage_before::numeric * 100.0) / effective_total_quota::numeric;
    pct_after := (usage_after::numeric * 100.0) / effective_total_quota::numeric;

    if sub.overage_enabled and overage_units is not null and overage_units > 0 then
      thresholds := thresholds || 95;
    end if;

    foreach threshold in array thresholds loop
      if pct_before < threshold and pct_after >= threshold then
        crossed := array_append(crossed, threshold);
      end if;
    end loop;
  end if;

  select coalesce(array_agg(distinct value order by value), array[]::integer[])
  into crossed
  from unnest(crossed) as value;

  return query
    select
      true,
      (effective_base_quota is null or usage_after <= effective_base_quota),
      (effective_base_quota is not null and usage_after > effective_base_quota),
      false,
      usage_after,
      effective_base_quota,
      overage_units,
      effective_total_quota,
      sub.current_period_start,
      sub.current_period_end,
      coalesce(crossed, array[]::integer[]);
end;
$$;

create or replace function public.check_material_quota(workspace_uuid uuid)
returns table (
  allowed boolean,
  current_count integer,
  quota integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quota_limit integer;
  total_materials integer;
begin
  select bp.materials_quota
  into quota_limit
  from public.workspace_subscriptions ws
  join public.billing_plans bp on bp.code = ws.plan_code
  where ws.workspace_id = workspace_uuid;

  if not found then
    raise exception 'Missing subscription for workspace %', workspace_uuid;
  end if;

  select count(*)::integer
  into total_materials
  from public.materials m
  where m.workspace_id = workspace_uuid;

  return query
    select
      (quota_limit is null or total_materials < quota_limit),
      total_materials,
      quota_limit;
end;
$$;

create or replace function public.enforce_material_quota()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  quota_result record;
begin
  select *
  into quota_result
  from public.check_material_quota(new.workspace_id);

  if not quota_result.allowed then
    raise exception 'Material quota exceeded (%/%). Upgrade your plan or remove materials.', quota_result.current_count, quota_result.quota;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_materials_quota_enforce on public.materials;
create trigger trg_materials_quota_enforce
  before insert on public.materials
  for each row execute function public.enforce_material_quota();

create or replace function public.check_embed_domain_quota(
  workspace_uuid uuid,
  widget_uuid uuid,
  proposed_allowlist text[]
)
returns table (
  allowed boolean,
  current_domain_count integer,
  requested_domain_count integer,
  quota integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quota_limit integer;
  existing_domains integer;
  proposed_domains integer;
begin
  select bp.embed_domains_quota
  into quota_limit
  from public.workspace_subscriptions ws
  join public.billing_plans bp on bp.code = ws.plan_code
  where ws.workspace_id = workspace_uuid;

  if not found then
    raise exception 'Missing subscription for workspace %', workspace_uuid;
  end if;

  select count(distinct domains.domain)
  into existing_domains
  from (
    select public.normalize_domain(domain) as domain
    from public.widgets w
    cross join lateral unnest(coalesce(w.domain_allowlist, '{}'::text[])) as domain
    where w.workspace_id = workspace_uuid
  ) domains
  where domains.domain is not null;

  select count(distinct domains.domain)
  into proposed_domains
  from (
    select public.normalize_domain(domain) as domain
    from public.widgets w
    cross join lateral unnest(coalesce(w.domain_allowlist, '{}'::text[])) as domain
    where w.workspace_id = workspace_uuid
      and (widget_uuid is null or w.id <> widget_uuid)

    union all

    select public.normalize_domain(domain) as domain
    from unnest(coalesce(proposed_allowlist, '{}'::text[])) as domain
  ) domains
  where domains.domain is not null;

  return query
    select
      (quota_limit is null or proposed_domains <= quota_limit),
      coalesce(existing_domains, 0),
      coalesce(proposed_domains, 0),
      quota_limit;
end;
$$;

create or replace function public.enforce_embed_domain_quota()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  quota_result record;
begin
  select *
  into quota_result
  from public.check_embed_domain_quota(new.workspace_id, new.id, new.domain_allowlist);

  if not quota_result.allowed then
    raise exception 'Embed domain quota exceeded (%/%). Upgrade your plan or reduce allowed domains.', quota_result.requested_domain_count, quota_result.quota;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_widgets_embed_domain_quota on public.widgets;
create trigger trg_widgets_embed_domain_quota
  before insert or update of workspace_id, domain_allowlist
  on public.widgets
  for each row execute function public.enforce_embed_domain_quota();

create or replace function public.update_workspace_overage_settings(
  workspace_uuid uuid,
  new_overage_enabled boolean,
  new_overage_cap_percent integer
)
returns table (
  workspace_id uuid,
  overage_enabled boolean,
  overage_cap_percent integer,
  plan_code text,
  current_period_end timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  if not public.is_workspace_owner(workspace_uuid) then
    raise exception 'Only workspace owners can update overage settings.';
  end if;

  if new_overage_cap_percent < 0 or new_overage_cap_percent > 100 then
    raise exception 'Overage cap percent must be between 0 and 100.';
  end if;

  return query
    update public.workspace_subscriptions ws
    set
      overage_enabled = new_overage_enabled,
      overage_cap_percent = new_overage_cap_percent,
      updated_at = timezone('utc', now())
    where ws.workspace_id = workspace_uuid
    returning
      ws.workspace_id,
      ws.overage_enabled,
      ws.overage_cap_percent,
      ws.plan_code,
      ws.current_period_end;
end;
$$;

create or replace function public.admin_set_workspace_plan(
  workspace_uuid uuid,
  new_plan_code text,
  new_status text default 'active',
  period_start timestamptz default null,
  period_end timestamptz default null
)
returns public.workspace_subscriptions
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  applied_start timestamptz;
  applied_end timestamptz;
  sub public.workspace_subscriptions%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' and current_user <> 'postgres' then
    raise exception 'admin_set_workspace_plan is restricted to service_role.';
  end if;

  if not exists (select 1 from public.billing_plans where code = new_plan_code) then
    raise exception 'Unknown billing plan code: %', new_plan_code;
  end if;

  if new_status not in ('active', 'trialing', 'past_due', 'canceled', 'paused') then
    raise exception 'Invalid subscription status: %', new_status;
  end if;

  applied_start := coalesce(period_start, timezone('utc', now()));
  applied_end := coalesce(period_end, applied_start + interval '1 month');

  if applied_end <= applied_start then
    raise exception 'Subscription period end must be greater than period start.';
  end if;

  insert into public.workspace_subscriptions (
    workspace_id,
    plan_code,
    status,
    current_period_start,
    current_period_end
  )
  values (
    workspace_uuid,
    new_plan_code,
    new_status,
    applied_start,
    applied_end
  )
  on conflict (workspace_id)
  do update
  set
    plan_code = excluded.plan_code,
    status = excluded.status,
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    updated_at = timezone('utc', now())
  returning * into sub;

  return sub;
end;
$$;

create or replace function public.admin_add_workspace_credits(
  workspace_uuid uuid,
  metric_name text default 'visualizations',
  units integer default 0,
  reason_text text default 'manual_adjustment',
  target_period_start timestamptz default null,
  creator_user_id uuid default null
)
returns public.workspace_credit_adjustments
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  applied_period_start timestamptz;
  sub public.workspace_subscriptions%rowtype;
  adjustment public.workspace_credit_adjustments%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' and current_user <> 'postgres' then
    raise exception 'admin_add_workspace_credits is restricted to service_role.';
  end if;

  if metric_name <> 'visualizations' then
    raise exception 'Unsupported metric: %', metric_name;
  end if;

  if units = 0 then
    raise exception 'Credit adjustment units must be non-zero.';
  end if;

  if target_period_start is not null then
    applied_period_start := target_period_start;
  else
    select * into sub
    from public.ensure_workspace_subscription_period(workspace_uuid);

    applied_period_start := sub.current_period_start;
  end if;

  insert into public.workspace_credit_adjustments (
    workspace_id,
    metric,
    period_start,
    units_delta,
    reason,
    created_by
  )
  values (
    workspace_uuid,
    metric_name,
    applied_period_start,
    units,
    reason_text,
    creator_user_id
  )
  returning * into adjustment;

  return adjustment;
end;
$$;

alter table public.billing_plans enable row level security;
alter table public.workspace_subscriptions enable row level security;
alter table public.workspace_usage_cycles enable row level security;
alter table public.workspace_credit_adjustments enable row level security;
alter table public.workspace_usage_alerts enable row level security;

drop policy if exists billing_plans_select_public on public.billing_plans;
create policy billing_plans_select_public
  on public.billing_plans for select
  to anon, authenticated
  using (is_public and is_active);

drop policy if exists workspace_subscriptions_select_member on public.workspace_subscriptions;
create policy workspace_subscriptions_select_member
  on public.workspace_subscriptions for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_usage_cycles_select_member on public.workspace_usage_cycles;
create policy workspace_usage_cycles_select_member
  on public.workspace_usage_cycles for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_credit_adjustments_select_member on public.workspace_credit_adjustments;
create policy workspace_credit_adjustments_select_member
  on public.workspace_credit_adjustments for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_usage_alerts_select_member on public.workspace_usage_alerts;
create policy workspace_usage_alerts_select_member
  on public.workspace_usage_alerts for select
  to authenticated
  using (public.is_workspace_member(workspace_id));

revoke execute on function public.update_workspace_overage_settings(uuid, boolean, integer) from public;
revoke execute on function public.check_material_quota(uuid) from public;
revoke execute on function public.check_embed_domain_quota(uuid, uuid, text[]) from public;
revoke execute on function public.consume_visualization_quota(uuid, integer) from public;
revoke execute on function public.admin_set_workspace_plan(uuid, text, text, timestamptz, timestamptz) from public;
revoke execute on function public.admin_add_workspace_credits(uuid, text, integer, text, timestamptz, uuid) from public;

grant execute on function public.update_workspace_overage_settings(uuid, boolean, integer) to authenticated;
grant execute on function public.check_material_quota(uuid) to authenticated;
grant execute on function public.check_embed_domain_quota(uuid, uuid, text[]) to authenticated;
grant execute on function public.consume_visualization_quota(uuid, integer) to authenticated;

grant execute on function public.check_material_quota(uuid) to service_role;
grant execute on function public.check_embed_domain_quota(uuid, uuid, text[]) to service_role;
grant execute on function public.consume_visualization_quota(uuid, integer) to service_role;
grant execute on function public.admin_set_workspace_plan(uuid, text, text, timestamptz, timestamptz) to service_role;
grant execute on function public.admin_add_workspace_credits(uuid, text, integer, text, timestamptz, uuid) to service_role;
