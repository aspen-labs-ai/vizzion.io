update public.workspace_subscriptions
set
  overage_enabled = false,
  overage_cap_percent = 0,
  updated_at = timezone('utc', now())
where plan_code = 'free';

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

    if sub.plan_code = 'free' then
      overage_units := 0;
    elsif sub.overage_enabled then
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
declare
  current_plan text;
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

  select ws.plan_code
  into current_plan
  from public.workspace_subscriptions ws
  where ws.workspace_id = workspace_uuid;

  if current_plan = 'free' then
    raise exception 'Overage protection is unavailable on the Free plan.';
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

