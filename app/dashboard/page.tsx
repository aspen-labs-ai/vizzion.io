import Link from 'next/link';
import { redirect } from 'next/navigation';
import LeadFunnel, { type FunnelStage } from '@/components/dashboard/LeadFunnel';
import PageHeader from '@/components/dashboard/PageHeader';
import SetupChecklist from '@/components/dashboard/SetupChecklist';
import { createClient } from '@/lib/supabase/server';
import {
  getDashboardMetrics,
  getMaterialPerformance,
  getRecentLeads,
  getStepFunnelMetrics,
  getWorkspaceContext,
  type WidgetRecord,
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
  const requestedWidgetId = getSingleParam(resolvedParams.widgetId);
  let selectedWidget: WidgetRecord = context.widget;

  if (requestedWidgetId && requestedWidgetId !== context.widget.id) {
    const widgetResult = await supabase
      .from('widgets')
      .select(
        'id, workspace_id, name, embed_key, mode, theme, is_active, require_email, auto_open_widget, show_product_names, subject_type, domain_allowlist, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, is_primary',
      )
      .eq('workspace_id', context.workspace.id)
      .eq('id', requestedWidgetId)
      .maybeSingle();

    if (!widgetResult.error && widgetResult.data) {
      const widget = widgetResult.data as WidgetRecord;
      widget.domain_allowlist = Array.isArray(widget.domain_allowlist) ? widget.domain_allowlist : [];
      selectedWidget = widget;
    }
  }

  const [metrics, materialPerformance, recentLeads, stepFunnel] = await Promise.all([
    getDashboardMetrics(supabase, context.workspace.id, selectedWidget.id),
    getMaterialPerformance(supabase, selectedWidget.id),
    getRecentLeads(supabase, selectedWidget.id, 6),
    getStepFunnelMetrics(supabase, selectedWidget.id, 30),
  ]);
  const funnelStages: FunnelStage[] = [
    { key: 'opened', label: 'Opened the widget', count: stepFunnel.widgetOpened },
    { key: 'uploaded', label: 'Uploaded a photo', count: stepFunnel.uploadCompleted },
    { key: 'material', label: 'Chose a look', count: stepFunnel.materialSelected },
    { key: 'email', label: 'Left their email', count: stepFunnel.emailSubmitted, highlight: true },
    { key: 'preview', label: 'Got their preview', count: stepFunnel.revealRendered },
  ];

  const isPrimaryView = selectedWidget.id === context.widget.id;
  const setupSteps = [
    {
      label: 'Add a material',
      description: 'Create at least one product or finish customers can preview.',
      done: metrics.activeMaterials > 0,
      href: '/dashboard/materials',
    },
    {
      label: 'Set your website domain',
      description: 'Allow the widget to run on your site (required to go live).',
      done: Array.isArray(selectedWidget.domain_allowlist) && selectedWidget.domain_allowlist.length > 0,
      href: '/dashboard/settings',
    },
    {
      label: 'Activate the widget',
      description: 'Turn the widget on so visitors can use it.',
      done: selectedWidget.is_active,
      href: '/dashboard/settings',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Performance and activity for ${selectedWidget.name} over the last 30 days.`}
        actions={
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center rounded-lg border border-border-default bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            Widget setup
          </Link>
        }
      />

      {isPrimaryView ? <SetupChecklist steps={setupSteps} embedHref="/dashboard/settings" /> : null}

      {selectedWidget.id !== context.widget.id ? (
        <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Viewing metrics for <strong>{selectedWidget.name}</strong>.{' '}
          <Link href="/dashboard" className="font-semibold underline hover:text-accent-hover">
            Return to primary widget
          </Link>
          .
        </div>
      ) : null}

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

      <LeadFunnel stages={funnelStages} />

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
