import Link from 'next/link';
import { redirect } from 'next/navigation';
import LeadsTable, { type LeadRow } from '@/components/dashboard/LeadsTable';
import LeadsToolbar from '@/components/dashboard/LeadsToolbar';
import PageHeader from '@/components/dashboard/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { getWidgetMaterials, getWorkspaceContext } from '@/lib/vizzion/workspace';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function single(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

function summaryWindows(): { today: string; seven: string; thirty: string } {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return {
    today: todayStart.toISOString(),
    seven: new Date(now - 7 * 864e5).toISOString(),
    thirty: new Date(now - 30 * 864e5).toISOString(),
  };
}

function resolveRange(params: Record<string, string | string[] | undefined>): {
  sinceIso: string | null;
  untilIso: string | null;
} {
  const from = single(params.from);
  const to = single(params.to);
  const range = single(params.range);
  if (from && to) {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T23:59:59`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      return { sinceIso: start.toISOString(), untilIso: end.toISOString() };
    }
  }
  if (range === 'all') return { sinceIso: null, untilIso: null };
  const days: Record<string, number> = { '7': 7, '30': 30, '90': 90, '180': 180, '365': 365 };
  const n = (range && days[range]) || 30;
  return { sinceIso: new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString(), untilIso: null };
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const selectedWidgetId = single(resolvedParams.widgetId);
  const context = await getWorkspaceContext(supabase, selectedWidgetId);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const widgetId = context.widget.id;
  const emailQuery = single(resolvedParams.q);
  const statusFilter = single(resolvedParams.status);
  const materialFilter = single(resolvedParams.material);
  const { sinceIso, untilIso } = resolveRange(resolvedParams);
  const win = summaryWindows();

  // Summary counts (independent of filters) + the filtered lead list.
  let leadsQuery = supabase
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id')
    .eq('widget_id', widgetId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (sinceIso) leadsQuery = leadsQuery.gte('created_at', sinceIso);
  if (untilIso) leadsQuery = leadsQuery.lte('created_at', untilIso);
  if (statusFilter) leadsQuery = leadsQuery.eq('email_status', statusFilter);
  if (materialFilter) leadsQuery = leadsQuery.eq('material_id', materialFilter);
  if (emailQuery) leadsQuery = leadsQuery.ilike('email', `%${emailQuery}%`);

  const [todayCount, sevenDayCount, thirtyDayCount, leadsResult, materials] = await Promise.all([
    supabase.from('leads').select('*', { head: true, count: 'exact' }).eq('widget_id', widgetId).gte('created_at', win.today),
    supabase.from('leads').select('*', { head: true, count: 'exact' }).eq('widget_id', widgetId).gte('created_at', win.seven),
    supabase.from('leads').select('*', { head: true, count: 'exact' }).eq('widget_id', widgetId).gte('created_at', win.thirty),
    leadsQuery,
    getWidgetMaterials(supabase, widgetId),
  ]);

  const rawLeads = (leadsResult.data ?? []) as Array<{
    id: string;
    email: string;
    email_status: string;
    source_page: string | null;
    created_at: string;
    material_id: string | null;
  }>;
  const leadIds = rawLeads.map((l) => l.id);

  // Which of these leads have generated visualizations and repeat activity?
  const leadsWithPreview = new Set<string>();
  const visualizationCountByLeadId = new Map<string, number>();
  const lastActivityByLeadId = new Map<string, string>();
  if (leadIds.length > 0) {
    const [previewsResult, jobsResult] = await Promise.all([
      supabase
        .from('generated_previews')
        .select('lead_id, created_at')
        .eq('widget_id', widgetId)
        .in('lead_id', leadIds)
        .not('generated_path', 'is', null),
      supabase
        .from('generation_jobs')
        .select('lead_id, created_at')
        .eq('widget_id', widgetId)
        .in('lead_id', leadIds),
    ]);

    for (const row of (previewsResult.data ?? []) as Array<{ lead_id: string | null; created_at: string }>) {
      if (!row.lead_id) continue;
      leadsWithPreview.add(row.lead_id);
      visualizationCountByLeadId.set(row.lead_id, (visualizationCountByLeadId.get(row.lead_id) ?? 0) + 1);
      const current = lastActivityByLeadId.get(row.lead_id);
      if (!current || row.created_at > current) lastActivityByLeadId.set(row.lead_id, row.created_at);
    }
    for (const row of (jobsResult.data ?? []) as Array<{ lead_id: string | null; created_at: string }>) {
      if (!row.lead_id) continue;
      const current = lastActivityByLeadId.get(row.lead_id);
      if (!current || row.created_at > current) lastActivityByLeadId.set(row.lead_id, row.created_at);
    }
  }

  const materialNameById = new Map(materials.map((m) => [m.id, m.name]));
  const leads: LeadRow[] = rawLeads.map((lead) => ({
    id: lead.id,
    email: lead.email,
    materialName: lead.material_id ? materialNameById.get(lead.material_id) ?? null : null,
    emailStatus: lead.email_status,
    hasPreview: leadsWithPreview.has(lead.id),
    visualizationCount: visualizationCountByLeadId.get(lead.id) ?? 0,
    lastActivityAt: lastActivityByLeadId.get(lead.id) ?? lead.created_at,
    sourcePage: lead.source_page,
    createdAt: lead.created_at,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every visitor who submitted their email through your widget."
        actions={
          <Link
            href={`/api/dashboard/leads/export?widgetId=${encodeURIComponent(widgetId)}`}
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
          >
            Export CSV
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <LeadMetric label="Today" value={todayCount.count ?? 0} />
        <LeadMetric label="Last 7 Days" value={sevenDayCount.count ?? 0} />
        <LeadMetric label="Last 30 Days" value={thirtyDayCount.count ?? 0} />
      </section>

      <section className="space-y-4 rounded-2xl border border-border-default bg-bg-secondary p-5">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Lead feed</h2>
          <p className="text-sm text-text-secondary">
            Click any lead to see its visualization. Status reflects the result, not just email delivery.
          </p>
        </div>

        <LeadsToolbar materials={materials.map((m) => ({ id: m.id, name: m.name }))} />

        <LeadsTable leads={leads} />
      </section>
    </div>
  );
}

function LeadMetric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-border-default bg-bg-secondary p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">{value.toLocaleString()}</p>
    </article>
  );
}
