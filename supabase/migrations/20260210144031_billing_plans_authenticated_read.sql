drop policy if exists billing_plans_select_public on public.billing_plans;
drop policy if exists billing_plans_select_authenticated on public.billing_plans;

create policy billing_plans_select_public
  on public.billing_plans for select
  to anon
  using (is_public and is_active);

create policy billing_plans_select_authenticated
  on public.billing_plans for select
  to authenticated
  using (true);
