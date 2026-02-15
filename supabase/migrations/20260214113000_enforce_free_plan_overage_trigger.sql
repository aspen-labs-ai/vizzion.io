update public.workspace_subscriptions
set
  overage_enabled = false,
  overage_cap_percent = 0,
  updated_at = timezone('utc', now())
where plan_code = 'free'
  and (overage_enabled is distinct from false or overage_cap_percent is distinct from 0);

create or replace function public.enforce_free_plan_overage_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.plan_code = 'free' then
    new.overage_enabled := false;
    new.overage_cap_percent := 0;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_workspace_subscriptions_enforce_free_overage on public.workspace_subscriptions;
create trigger trg_workspace_subscriptions_enforce_free_overage
  before insert or update of plan_code, overage_enabled, overage_cap_percent
  on public.workspace_subscriptions
  for each row
  execute function public.enforce_free_plan_overage_settings();
