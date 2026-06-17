import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Info } from 'lucide-react';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import EngagementDepth from '@/components/dashboard/EngagementDepth';
import LeadFunnel, { type FunnelStage } from '@/components/dashboard/LeadFunnel';
import MaterialBarChart from '@/components/dashboard/MaterialBarChart';
import OnboardingAssistant from '@/components/dashboard/OnboardingAssistant';
import PageHeader from '@/components/dashboard/PageHeader';
import RecentVisualizations from '@/components/dashboard/RecentVisualizations';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { getOnboardingState } from '@/lib/vizzion/onboarding';
import {
  getDashboardMetrics,
  getRecentLeads,
  getRecentVisualizations,
  getStepFunnelMetrics,
  getVisualizationInsights,
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

function resolveDateRange(params: Record<string, string | string[] | undefined>): {
  sinceIso: string;
  untilIso: string | null;
  label: string;
} {
  const from = getSingleParam(params.from);
  const to = getSingleParam(params.to);
  const range = getSingleParam(params.range);

  if (from && to) {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T23:59:59`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      return {
        sinceIso: start.toISOString(),
        untilIso: end.toISOString(),
        label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      };
    }
  }

  if (range === 'all') {
    return { sinceIso: '1970-01-01T00:00:00.000Z', untilIso: null, label: 'all time' };
  }

  const presets: Record<string, { days: number; label: string }> = {
    '7': { days: 7, label: 'the last 7 days' },
    '30': { days: 30, label: 'the last 30 days' },
    '90': { days: 90, label: 'the last 90 days' },
    '180': { days: 180, label: 'the last 180 days' },
    '365': { days: 365, label: 'the last 12 months' },
  };
  const preset = (range && presets[range]) || presets['30'];
  const since = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000);
  return { sinceIso: since.toISOString(), untilIso: null, label: preset.label };
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
        'id, workspace_id, name, embed_key, mode, theme, brand_color, is_active, require_email, delivery_mode, auto_open_widget, show_product_names, subject_type, target_surface, domain_allowlist, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, is_primary',
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

  const { sinceIso, untilIso, label: rangeLabel } = resolveDateRange(resolvedParams);
  const admin = createAdminClient();

  const [metrics, insights, recentLeads, recentVisualizations, stepFunnel] = await Promise.all([
    getDashboardMetrics(supabase, context.workspace.id, selectedWidget.id, sinceIso, untilIso),
    getVisualizationInsights(supabase, selectedWidget.id, sinceIso, untilIso),
    getRecentLeads(supabase, selectedWidget.id, 8, sinceIso, untilIso),
    getRecentVisualizations(admin, selectedWidget.id, 6, sinceIso, untilIso),
    getStepFunnelMetrics(supabase, selectedWidget.id, sinceIso, untilIso),
  ]);
  const funnelStages: FunnelStage[] = [
    { key: 'opened', label: 'Opened the widget', count: stepFunnel.widgetOpened },
    { key: 'uploaded', label: 'Uploaded a photo', count: stepFunnel.uploadCompleted },
    { key: 'material', label: 'Chose a look', count: stepFunnel.materialSelected },
    { key: 'email', label: 'Left their email', count: stepFunnel.emailSubmitted, highlight: true },
    { key: 'preview', label: 'Got their preview', count: stepFunnel.revealRendered },
  ];

  const avgPerVisitorLabel =
    insights.avgVisualizationsPerVisitor > 0
      ? `≈ ${insights.avgVisualizationsPerVisitor.toFixed(1)} per visitor`
      : undefined;
  const conversionLabel =
    metrics.sessions30d > 0
      ? `${metrics.leads30d.toLocaleString()} of ${metrics.sessions30d.toLocaleString()} visitors`
      : undefined;
  // A handful of sessions with real activity is almost always the owner testing
  // from their own browser (repeat visits in one browser count as one visitor).
  const looksLikeTestData = metrics.sessions30d > 0 && metrics.sessions30d <= 2 && metrics.visualizations30d > 0;

  const isPrimaryView = selectedWidget.id === context.widget.id;

  const activeMaterialsResult = await supabase
    .from('materials')
    .select('swatch_url')
    .eq('widget_id', selectedWidget.id)
    .eq('is_active', true);
  const activeMaterialRows = (activeMaterialsResult.data ?? []) as Array<{ swatch_url: string | null }>;
  const onboardingState = getOnboardingState({
    widgetId: selectedWidget.id,
    subjectType: selectedWidget.subject_type,
    targetSurface: selectedWidget.target_surface,
    domainAllowlist: selectedWidget.domain_allowlist,
    isActive: selectedWidget.is_active,
    activeMaterialCount: activeMaterialRows.length,
    materialsMissingImageCount: activeMaterialRows.filter(material => !material.swatch_url).length,
    brandCustomized: (selectedWidget.brand_color || '').toUpperCase() !== '#10B981',
    hasLogo: Boolean(context.workspace.logo_url),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Performance and activity for ${selectedWidget.name} over ${rangeLabel}.`}
        actions={
          <>
            <DateRangeFilter />
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center rounded-lg border border-border-default bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              Widget setup
            </Link>
          </>
        }
      />

      {isPrimaryView ? (
        <OnboardingAssistant
          state={onboardingState}
          widgetId={selectedWidget.id}
          embedHref={`/dashboard/settings?widgetId=${selectedWidget.id}`}
          previewHref={`/widget-preview?widgetId=${selectedWidget.id}`}
        />
      ) : null}

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

      {looksLikeTestData ? (
        <div className="flex items-start gap-3 rounded-2xl border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p>
            This looks like test activity from your own browser. Repeat visits from the same browser count as{' '}
            <strong className="font-semibold text-text-primary">one visitor</strong>, so trying several materials
            yourself shows as a single visitor with many visualizations. Once real visitors use your widget, these
            numbers reflect them.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Visualizations"
          value={metrics.visualizations30d.toLocaleString()}
          hint={avgPerVisitorLabel}
          tone="accent"
        />
        <MetricCard label="Visitors" value={metrics.sessions30d.toLocaleString()} />
        <MetricCard label="Leads" value={metrics.leads30d.toLocaleString()} hint={conversionLabel} />
        <MetricCard label="Emails Sent" value={metrics.sentEmailCount30d.toLocaleString()} />
        <MetricCard label="Active Materials" value={metrics.activeMaterials.toLocaleString()} />
        <MetricCard label="Shared Opens" value={metrics.previewViews30d.toLocaleString()} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadFunnel stages={funnelStages} totalVisualizations={metrics.visualizations30d} />
        </div>
        <EngagementDepth
          avgMaterialsPerVisitor={insights.avgMaterialsPerVisitor}
          multiMaterialVisitorPct={insights.multiMaterialVisitorPct}
          visitorsWhoGenerated={insights.visitorsWhoGenerated}
          depthDistribution={insights.depthDistribution}
        />
      </section>

      <MaterialBarChart materials={insights.materialPerformance} />

      <RecentVisualizations visualizations={recentVisualizations} />

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
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
          <p className="rounded-xl border border-border-default bg-bg-primary px-4 py-5 text-center text-sm text-text-tertiary">
            No leads in this period.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border-default">
            <div className="divide-y divide-border-default">
              {recentLeads.map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-4 px-4 py-2.5 transition hover:bg-bg-primary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{lead.email}</p>
                    <p className="truncate text-xs text-text-tertiary">
                      {lead.materialName ?? 'No material'} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border-default bg-bg-primary px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                    {lead.emailStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'accent';
}) {
  const isAccent = tone === 'accent';
  return (
    <article
      className={`rounded-2xl border p-4 ${
        isAccent ? 'border-accent/40 bg-accent/10' : 'border-border-default bg-bg-secondary'
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          isAccent ? 'text-accent' : 'text-text-tertiary'
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-text-tertiary">{hint}</p> : null}
    </article>
  );
}
