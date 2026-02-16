import { updateOverageSettingsAction } from '@/app/dashboard/actions';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceBillingSummary } from '@/lib/vizzion/billing';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';
import { redirect } from 'next/navigation';

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

  const billingSummary = await getWorkspaceBillingSummary(supabase, context.workspace.id);
  const isOwner = context.role === 'owner';
  const resolvedParams = await searchParams;
  const billingSaved = getSingleParam(resolvedParams.billing_saved) === '1';
  const error = getSingleParam(resolvedParams.error);
  const isFreePlan = billingSummary?.plan.code === 'free';
  const overageControlsDisabled = !isOwner || isFreePlan;
  const overageAvailabilityLabel = isFreePlan
    ? 'Paid plans only (Growth+)'
    : 'Available on current plan';

  return (
    <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
      <h2 className="text-xl font-semibold text-text-primary">Billing & Usage</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Track current cycle consumption and configure overage protection.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {billingSaved ? (
        <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Overage settings updated.
        </p>
      ) : null}

      {isFreePlan ? (
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Free plan includes strict quota limits. Overage protection is available on paid plans only
          (Growth+).
        </p>
      ) : null}

      {billingSummary ? (
        <div className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Current Plan" value={billingSummary.plan.name} />
            <StatCard label="Subscription Status" value={billingSummary.subscription.status} />
            <StatCard
              label="Cycle Ends"
              value={formatDate(billingSummary.subscription.current_period_end)}
            />
          </div>

          <div className="rounded-xl border border-border-default bg-bg-primary p-4">
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
              <p className="mt-3 text-xs text-text-tertiary">
                Unlimited usage on current plan.
              </p>
            )}
          </div>

          <form
            action={updateOverageSettingsAction}
            className="space-y-4 rounded-xl border border-border-default bg-bg-primary p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">Overage protection</p>
                  <span className="rounded-full border border-border-default bg-bg-secondary px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
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
                <span className="absolute inset-0 rounded-full border border-border-default bg-bg-secondary transition peer-checked:border-accent/60 peer-checked:bg-accent/20 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-disabled:opacity-40" />
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
                className="w-full rounded-lg border border-border-default bg-bg-secondary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-50"
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
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-sm text-text-secondary">
          Billing data is not available for this workspace yet.
        </p>
      )}
    </section>
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
