import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  getDashboardMetrics,
  getEventBreakdown,
  getMaterialPerformance,
  getRecentLeads,
  getWorkspaceContext,
} from '@/lib/vizzion/workspace';

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const resolvedParams = await searchParams;
  const error = getSingleParam(resolvedParams.error);

  const [metrics, eventBreakdown, materialPerformance, recentLeads] = await Promise.all([
    getDashboardMetrics(supabase, context.workspace.id, context.widget.id),
    getEventBreakdown(supabase, context.widget.id),
    getMaterialPerformance(supabase, context.widget.id),
    getRecentLeads(supabase, context.widget.id, 6),
  ]);

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Sessions (30d)" value={metrics.sessions30d.toLocaleString()} />
        <MetricCard label="Leads (30d)" value={metrics.leads30d.toLocaleString()} />
        <MetricCard label="Conversion" value={formatPercent(metrics.conversionRate30d)} />
        <MetricCard label="Active Materials" value={metrics.activeMaterials.toLocaleString()} />
        <MetricCard label="Emails Sent" value={metrics.sentEmailCount30d.toLocaleString()} />
        <MetricCard label="Queued Jobs" value={metrics.queuedJobs30d.toLocaleString()} />
      </section>

      <section className="space-y-4 rounded-2xl border border-border-default bg-bg-secondary p-5">
        <h2 className="text-lg font-semibold text-text-primary">Event Activity (30d)</h2>
        {eventBreakdown.length === 0 ? (
          <p className="text-sm text-text-tertiary">No events yet. Widget activity will appear here.</p>
        ) : (
          <div className="space-y-3">
            {eventBreakdown.map(item => {
              const width = Math.max(8, Math.round((item.count / eventBreakdown[0].count) * 100));
              return (
                <div key={item.eventType} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>{item.eventType}</span>
                    <span>{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-primary">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${width}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-default bg-bg-secondary p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Material Performance</h2>
            <Link
              href="/dashboard/materials"
              className="text-xs font-semibold text-accent hover:text-accent-hover"
            >
              Manage Materials
            </Link>
          </div>

          {materialPerformance.length === 0 ? (
            <p className="text-sm text-text-tertiary">Add materials to start measuring lead interest.</p>
          ) : (
            <div className="space-y-3">
              {materialPerformance.slice(0, 8).map(item => (
                <div
                  key={item.materialId}
                  className="flex items-center justify-between rounded-lg border border-border-default bg-bg-primary px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {item.isActive ? 'Active' : 'Inactive'} • Sort {item.sortOrder}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    {item.leadCount.toLocaleString()} leads
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border-default bg-bg-secondary p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent Leads</h2>
            <Link
              href="/dashboard/leads"
              className="text-xs font-semibold text-accent hover:text-accent-hover"
            >
              View All Leads
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="text-sm text-text-tertiary">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map(lead => (
                <div
                  key={lead.id}
                  className="rounded-lg border border-border-default bg-bg-primary px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-text-primary">{lead.email}</p>
                    <span className="text-xs uppercase tracking-wide text-text-tertiary">
                      {lead.emailStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {lead.materialName ?? 'No material'} • {formatDate(lead.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
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
