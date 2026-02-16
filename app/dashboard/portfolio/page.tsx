import Link from 'next/link';
import { redirect } from 'next/navigation';
import PortfolioPreviewGallery from '@/components/dashboard/PortfolioPreviewGallery';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  getPortfolioAlerts,
  getPortfolioIndustryBreakdown,
  getPortfolioRecentPreviews,
  getPortfolioTotals,
  getPortfolioWidgetBreakdown,
  getWorkspaceWidgets,
  resolvePortfolioDateRange,
} from '@/lib/vizzion/portfolio';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

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

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function withRangeQuery(basePath: string, dateFrom: string, dateTo: string): string {
  const [path, rawQuery] = basePath.split('?');
  const searchParams = new URLSearchParams(rawQuery ?? '');
  searchParams.set('dateFrom', dateFrom);
  searchParams.set('dateTo', dateTo);

  return `${path}?${searchParams.toString()}`;
}

export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const resolvedParams = await searchParams;
  const dateRange = resolvePortfolioDateRange({
    dateFrom: getSingleParam(resolvedParams.dateFrom),
    dateTo: getSingleParam(resolvedParams.dateTo),
  });

  const admin = createAdminClient();
  const widgets = await getWorkspaceWidgets(admin, context.workspace.id);

  if (widgets.length <= 1) {
    redirect('/dashboard');
  }

  const widgetRows = await getPortfolioWidgetBreakdown({
    supabase: admin,
    workspaceId: context.workspace.id,
    dateRange,
    widgets,
  });

  const [recentPreviews, alerts] = await Promise.all([
    getPortfolioRecentPreviews({
      supabase: admin,
      workspaceId: context.workspace.id,
      dateRange,
      widgets,
      limit: 12,
    }),
    getPortfolioAlerts({
      supabase: admin,
      workspaceId: context.workspace.id,
      dateRange,
      widgetRows,
    }),
  ]);

  const totals = getPortfolioTotals(widgetRows);
  const industryRows = getPortfolioIndustryBreakdown(widgetRows);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Portfolio</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Cross-widget analytics for multi-industry performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={withRangeQuery(
                '/api/dashboard/portfolio/export-summary',
                dateRange.fromInput,
                dateRange.toInput,
              )}
              className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              Export Summary CSV
            </Link>
            <Link
              href={withRangeQuery('/api/dashboard/leads/export', dateRange.fromInput, dateRange.toInput)}
              className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              Export Leads CSV
            </Link>
          </div>
        </div>

        <form className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Date From
            </span>
            <input
              type="date"
              name="dateFrom"
              defaultValue={dateRange.fromInput}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Date To
            </span>
            <input
              type="date"
              name="dateTo"
              defaultValue={dateRange.toInput}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary md:self-end"
          >
            Apply
          </button>
          <Link
            href="/dashboard/portfolio"
            className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-center text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary md:self-end"
          >
            Reset
          </Link>
        </form>
      </section>

      {alerts.length > 0 ? (
        <section className="grid gap-3 lg:grid-cols-3">
          {alerts.map(alert => (
            <article
              key={alert.id}
              className={`rounded-xl border px-4 py-3 ${
                alert.severity === 'critical'
                  ? 'border-red-500/40 bg-red-500/10'
                  : 'border-amber-500/40 bg-amber-500/10'
              }`}
            >
              <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{alert.message}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Sessions" value={totals.sessions.toLocaleString()} />
        <MetricCard label="Uploads" value={totals.uploads.toLocaleString()} />
        <MetricCard label="Leads" value={totals.leads.toLocaleString()} />
        <MetricCard label="Succeeded Previews" value={totals.succeededPreviews.toLocaleString()} />
        <MetricCard
          label="Session -> Lead Conversion"
          value={formatPercent(totals.sessionToLeadConversionPercent)}
        />
        <MetricCard
          label="Session -> Preview Conversion"
          value={formatPercent(totals.sessionToPreviewConversionPercent)}
        />
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Per Widget</h2>
          <p className="text-xs text-text-tertiary">Click a widget to open its dashboard context.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border-default">
          <table className="min-w-full divide-y divide-border-default text-sm">
            <thead className="bg-bg-primary text-left text-xs uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="px-4 py-3">Widget</th>
                <th className="px-4 py-3">Sessions</th>
                <th className="px-4 py-3">Uploads</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Succeeded Previews</th>
                <th className="px-4 py-3">Conversion</th>
                <th className="px-4 py-3">Block Rate</th>
                <th className="px-4 py-3">Queued Jobs</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default bg-bg-secondary">
              {widgetRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-tertiary">
                    No widget activity found in this date range.
                  </td>
                </tr>
              ) : (
                widgetRows.map(row => (
                  <tr key={row.widgetId}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard?widgetId=${encodeURIComponent(row.widgetId)}`}
                        className="font-semibold text-accent hover:text-accent-hover"
                      >
                        {row.widgetName}
                      </Link>
                      <p className="text-xs text-text-tertiary">{row.industrySlug ?? 'unmapped'}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{row.sessions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.uploads.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.leads.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.succeededPreviews.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{formatPercent(row.conversionPercent)}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatPercent(row.blockRatePercent)}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.queuedJobs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={withRangeQuery(
                          `/api/dashboard/leads/export?widgetId=${encodeURIComponent(row.widgetId)}`,
                          dateRange.fromInput,
                          dateRange.toInput,
                        )}
                        className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                      >
                        Export Leads
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">Per Industry</h2>
        <div className="overflow-x-auto rounded-xl border border-border-default">
          <table className="min-w-full divide-y divide-border-default text-sm">
            <thead className="bg-bg-primary text-left text-xs uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Mapped Widget</th>
                <th className="px-4 py-3">Sessions</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Previews</th>
                <th className="px-4 py-3">Conversion</th>
                <th className="px-4 py-3 text-right">Leads Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default bg-bg-secondary">
              {industryRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-tertiary">
                    No mapped industry activity found in this date range.
                  </td>
                </tr>
              ) : (
                industryRows.map(row => (
                  <tr key={`${row.industrySlug}-${row.widgetId}`}>
                    <td className="px-4 py-3 font-medium text-text-primary">{row.industrySlug}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.widgetName}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.sessions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.leads.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.previews.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-secondary">{formatPercent(row.conversionPercent)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={withRangeQuery(
                          `/api/dashboard/leads/export?industrySlug=${encodeURIComponent(row.industrySlug)}`,
                          dateRange.fromInput,
                          dateRange.toInput,
                        )}
                        className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
                      >
                        Export Leads
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Recent Previews</h2>
          <p className="text-sm text-text-secondary">
            Before/after thumbnails with signed links and retention visibility.
          </p>
        </div>
        <PortfolioPreviewGallery previews={recentPreviews} />
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border-default bg-bg-secondary p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
    </article>
  );
}
