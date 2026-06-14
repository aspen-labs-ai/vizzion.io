import { updateOverageSettingsAction } from '@/app/dashboard/actions';
import PageHeader from '@/components/dashboard/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { getPublicPricingPlans, getWorkspaceBillingSummary } from '@/lib/vizzion/billing';
import type { BillingPlanRecord } from '@/lib/vizzion/billing';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';
import { Check } from 'lucide-react';
import { redirect } from 'next/navigation';

const BILLING_CONTACT_EMAIL = 'sales@vizzion.io';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }
  return null;
}

function formatUnits(value: number | null): string {
  if (value === null) {
    return 'Unlimited';
  }
  return value.toLocaleString('en-US');
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatPrice(cents: number | null): { amount: string; suffix: string } {
  if (cents === null) {
    return { amount: 'Custom', suffix: '' };
  }
  if (cents === 0) {
    return { amount: '$0', suffix: '/mo' };
  }
  return { amount: `$${Math.round(cents / 100).toLocaleString('en-US')}`, suffix: '/mo' };
}

function planQuotaLines(plan: BillingPlanRecord): string[] {
  return [
    `${formatUnits(plan.visualization_quota_per_cycle)} visualizations / month`,
    `${formatUnits(plan.materials_quota)} materials`,
    `${formatUnits(plan.embed_domains_quota)} website ${plan.embed_domains_quota === 1 ? 'embed' : 'embeds'}`,
  ];
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const [billingSummary, plans] = await Promise.all([
    getWorkspaceBillingSummary(supabase, context.workspace.id),
    getPublicPricingPlans(),
  ]);
  const isOwner = context.role === 'owner';
  const resolvedParams = await searchParams;
  const billingSaved = getSingleParam(resolvedParams.billing_saved) === '1';
  const error = getSingleParam(resolvedParams.error);
  const currentPlanCode = billingSummary?.plan.code ?? null;
  const isFreePlan = currentPlanCode === 'free';
  const overageControlsDisabled = !isOwner || isFreePlan;
  const overageAvailabilityLabel = isFreePlan
    ? 'Paid plans only (Growth+)'
    : 'Available on current plan';

  const currentPlan = plans.find((plan) => plan.code === currentPlanCode) ?? null;
  const currentSortOrder = currentPlan?.sort_order ?? -1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Usage"
        description="Track this cycle's usage, compare plans, and manage overage protection."
      />

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {billingSaved ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Overage settings updated.
        </p>
      ) : null}

      {billingSummary ? (
        <>
          {/* Usage summary */}
          <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Current Plan" value={billingSummary.plan.name} />
              <StatCard label="Subscription Status" value={billingSummary.subscription.status} />
              <StatCard
                label="Cycle Ends"
                value={formatDate(billingSummary.subscription.current_period_end)}
              />
            </div>

            <div className="mt-5 rounded-xl border border-border-default bg-bg-primary p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Visualization Usage</p>
                  <p className="text-xs text-text-tertiary">
                    Used {billingSummary.usedUnits.toLocaleString('en-US')} of{' '}
                    {formatUnits(billingSummary.totalQuotaUnits)} this cycle.
                  </p>
                </div>

                <div className="text-right text-xs text-text-tertiary">
                  <p>Base: {formatUnits(billingSummary.baseQuotaUnits)}</p>
                  <p>Credits: {billingSummary.creditUnits.toLocaleString('en-US')}</p>
                  {isFreePlan ? null : <p>Overage cap: {formatUnits(billingSummary.overageCapUnits)}</p>}
                </div>
              </div>

              {billingSummary.usagePercent !== null ? (
                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${Math.min(Math.max(billingSummary.usagePercent, 0), 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-text-tertiary">
                    {billingSummary.usagePercent.toFixed(1)}% of total quota consumed.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-text-tertiary">Unlimited usage on current plan.</p>
              )}
            </div>
          </section>

          {/* Plan comparison */}
          {plans.length > 0 ? (
            <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-text-primary">Plans</h2>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {isFreePlan
                      ? 'Upgrade to unlock branding, more visualizations, and overage protection.'
                      : 'Compare plans and scale up as Vizzion fills your pipeline.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {plans.map((plan) => {
                  const isCurrent = plan.code === currentPlanCode;
                  const isUpgrade = plan.sort_order > currentSortOrder;
                  const price = formatPrice(plan.monthly_price_cents);
                  const upgradeHref = `mailto:${BILLING_CONTACT_EMAIL}?subject=${encodeURIComponent(
                    `Upgrade ${context.workspace.name} to ${plan.name}`,
                  )}&body=${encodeURIComponent(
                    `I'd like to upgrade my Vizzion workspace (${context.workspace.name}) from ${
                      billingSummary.plan.name
                    } to the ${plan.name} plan.`,
                  )}`;

                  return (
                    <div
                      key={plan.code}
                      className={`relative flex flex-col rounded-xl border p-5 ${
                        isCurrent
                          ? 'border-accent/60 bg-accent/5'
                          : 'border-border-default bg-bg-primary'
                      }`}
                    >
                      {plan.featured && !isCurrent ? (
                        <span className="absolute -top-2.5 left-5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bg-primary">
                          Most popular
                        </span>
                      ) : null}
                      {isCurrent ? (
                        <span className="absolute -top-2.5 left-5 rounded-full border border-accent/60 bg-bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                          Current plan
                        </span>
                      ) : null}

                      <p className="text-sm font-semibold text-text-primary">{plan.name}</p>
                      <p className="mt-0.5 text-xs text-text-tertiary">{plan.tagline}</p>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-text-primary">{price.amount}</span>
                        {price.suffix ? (
                          <span className="text-xs text-text-tertiary">{price.suffix}</span>
                        ) : null}
                      </div>

                      <ul className="mt-4 space-y-2 text-xs text-text-secondary">
                        {planQuotaLines(plan).map((line) => (
                          <li key={line} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-5">
                        {isCurrent ? (
                          <span className="flex w-full items-center justify-center rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-tertiary">
                            Your current plan
                          </span>
                        ) : isUpgrade ? (
                          <a
                            href={upgradeHref}
                            className="flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-bg-primary transition hover:bg-accent-hover"
                          >
                            {plan.monthly_price_cents === null ? 'Contact sales' : `Upgrade to ${plan.name}`}
                          </a>
                        ) : (
                          <a
                            href={upgradeHref}
                            className="flex w-full items-center justify-center rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                          >
                            Switch plan
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-text-tertiary">
                Plan changes are handled by our team — reach us at{' '}
                <a href={`mailto:${BILLING_CONTACT_EMAIL}`} className="font-medium text-accent hover:text-accent-hover">
                  {BILLING_CONTACT_EMAIL}
                </a>{' '}
                and we&apos;ll switch you over, prorated, the same day.
              </p>
            </section>
          ) : null}

          {/* Overage protection */}
          <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
            {isFreePlan ? (
              <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Overage protection is available on paid plans only (Growth+). Upgrade to let traffic keep
                converting after you hit your base quota.
              </p>
            ) : null}

            <form action={updateOverageSettingsAction} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">Overage protection</p>
                    <span className="rounded-full border border-border-default bg-bg-primary px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                      {overageAvailabilityLabel}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Allow additional usage after base quota, up to cap percent.
                  </p>
                </div>

                <span className="relative inline-flex h-6 w-11 items-center">
                  <input
                    type="checkbox"
                    name="overage_enabled"
                    defaultChecked={billingSummary.subscription.overage_enabled}
                    disabled={overageControlsDisabled}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-full border border-border-default bg-bg-primary transition peer-checked:border-accent/60 peer-checked:bg-accent/20 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-disabled:opacity-40" />
                  <span className="absolute left-0.5 h-5 w-5 rounded-full bg-text-tertiary transition peer-checked:translate-x-5 peer-checked:bg-accent peer-disabled:opacity-40" />
                </span>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-secondary">Overage cap percent</span>
                <input
                  type="number"
                  name="overage_cap_percent"
                  min={0}
                  max={100}
                  defaultValue={billingSummary.subscription.overage_cap_percent.toString()}
                  disabled={overageControlsDisabled}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-50"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-text-tertiary">
                  Usage alerts are sent to workspace owners at 50/75/90/100% and near cap.
                </p>
                <button
                  type="submit"
                  disabled={overageControlsDisabled}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Overage Settings
                </button>
              </div>
            </form>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
          <p className="rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-sm text-text-secondary">
            Billing data is not available for this workspace yet.
          </p>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-primary px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-1 text-lg font-semibold text-text-primary">{value}</p>
    </div>
  );
}
