import type { SupabaseClient } from '@supabase/supabase-js';

export interface WorkspaceRecord {
  id: string;
  name: string;
  slug: string;
  company_name: string | null;
  brand_color: string;
  status: string;
}

export interface WidgetRecord {
  id: string;
  workspace_id: string;
  name: string;
  embed_key: string;
  mode: 'inline' | 'popup' | string;
  theme: 'dark' | 'light' | string;
  is_active: boolean;
  require_email: boolean;
  auto_open_widget: boolean;
  show_product_names: boolean;
  domain_allowlist: string[];
  max_generations_per_session: number | null;
  max_generations_per_email_lifetime: number | null;
  limit_reached_cta_url: string | null;
  is_primary: boolean;
}

export interface MaterialRecord {
  id: string;
  name: string;
  swatch_url: string | null;
  texture_url: string | null;
  prompt_modifier: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface WorkspaceContext {
  userId: string;
  role: string;
  workspace: WorkspaceRecord;
  widget: WidgetRecord;
}

export interface DashboardMetrics {
  sessions30d: number;
  leads30d: number;
  conversionRate30d: number;
  activeMaterials: number;
  sentEmailCount30d: number;
  queuedJobs30d: number;
}

export interface EventBreakdownItem {
  eventType: string;
  count: number;
}

export interface MaterialPerformanceItem {
  materialId: string;
  name: string;
  leadCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface RecentLeadItem {
  id: string;
  email: string;
  emailStatus: string;
  sourcePage: string | null;
  createdAt: string;
  materialName: string | null;
}

function toCount(value: number | null): number {
  return typeof value === 'number' ? value : 0;
}

function getSinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export async function getWorkspaceContext(supabase: SupabaseClient): Promise<WorkspaceContext | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const membershipResult = await supabase
    .from('workspace_users')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipResult.error || !membershipResult.data) {
    return null;
  }

  const membership = membershipResult.data as { workspace_id: string; role: string };

  const workspaceResult = await supabase
    .from('workspaces')
    .select('id, name, slug, company_name, brand_color, status')
    .eq('id', membership.workspace_id)
    .single();

  if (workspaceResult.error || !workspaceResult.data) {
    return null;
  }

  const workspace = workspaceResult.data as WorkspaceRecord;

  const widgetResult = await supabase
    .from('widgets')
    .select(
      'id, workspace_id, name, embed_key, mode, theme, is_active, require_email, auto_open_widget, show_product_names, domain_allowlist, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, is_primary',
    )
    .eq('workspace_id', workspace.id)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (widgetResult.error) {
    return null;
  }

  let widget = widgetResult.data as WidgetRecord | null;

  if (!widget) {
    const createResult = await supabase
      .from('widgets')
      .insert({
        workspace_id: workspace.id,
        name: 'Primary Widget',
        is_primary: true,
        mode: 'inline',
        theme: 'dark',
      })
      .select(
        'id, workspace_id, name, embed_key, mode, theme, is_active, require_email, auto_open_widget, show_product_names, domain_allowlist, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, is_primary',
      )
      .single();

    if (createResult.error || !createResult.data) {
      return null;
    }

    widget = createResult.data as WidgetRecord;
  }

  widget.domain_allowlist = Array.isArray(widget.domain_allowlist) ? widget.domain_allowlist : [];

  return {
    userId: user.id,
    role: membership.role,
    workspace,
    widget,
  };
}

export async function getWidgetMaterials(
  supabase: SupabaseClient,
  widgetId: string,
): Promise<MaterialRecord[]> {
  const result = await supabase
    .from('materials')
    .select('id, name, swatch_url, texture_url, prompt_modifier, sort_order, is_active')
    .eq('widget_id', widgetId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (result.error || !result.data) {
    return [];
  }

  return result.data as MaterialRecord[];
}

export async function getDashboardMetrics(
  supabase: SupabaseClient,
  workspaceId: string,
  widgetId: string,
): Promise<DashboardMetrics> {
  const since = getSinceIso(30);

  const [sessionsResult, leadsResult, activeMaterialsResult, sentEmailsResult, queuedJobsResult] =
    await Promise.all([
      supabase
        .from('widget_sessions')
        .select('*', { head: true, count: 'exact' })
        .eq('widget_id', widgetId)
        .gte('started_at', since),
      supabase
        .from('leads')
        .select('*', { head: true, count: 'exact' })
        .eq('widget_id', widgetId)
        .gte('created_at', since),
      supabase
        .from('materials')
        .select('*', { head: true, count: 'exact' })
        .eq('widget_id', widgetId)
        .eq('is_active', true),
      supabase
        .from('leads')
        .select('*', { head: true, count: 'exact' })
        .eq('workspace_id', workspaceId)
        .eq('email_status', 'sent')
        .gte('created_at', since),
      supabase
        .from('generation_jobs')
        .select('*', { head: true, count: 'exact' })
        .eq('workspace_id', workspaceId)
        .in('status', ['queued', 'processing'])
        .gte('created_at', since),
    ]);

  const sessions30d = toCount(sessionsResult.count);
  const leads30d = toCount(leadsResult.count);

  return {
    sessions30d,
    leads30d,
    conversionRate30d: sessions30d > 0 ? (leads30d / sessions30d) * 100 : 0,
    activeMaterials: toCount(activeMaterialsResult.count),
    sentEmailCount30d: toCount(sentEmailsResult.count),
    queuedJobs30d: toCount(queuedJobsResult.count),
  };
}

export async function getEventBreakdown(
  supabase: SupabaseClient,
  widgetId: string,
): Promise<EventBreakdownItem[]> {
  const since = getSinceIso(30);

  const result = await supabase
    .from('widget_events')
    .select('event_type')
    .eq('widget_id', widgetId)
    .gte('created_at', since)
    .limit(2000);

  if (result.error || !result.data) {
    return [];
  }

  const rows = result.data as Array<{ event_type: string }>;
  const counts = new Map<string, number>();

  for (const row of rows) {
    const eventType = row.event_type || 'unknown';
    counts.set(eventType, (counts.get(eventType) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([eventType, count]) => ({ eventType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getMaterialPerformance(
  supabase: SupabaseClient,
  widgetId: string,
): Promise<MaterialPerformanceItem[]> {
  const [materialsResult, leadsResult] = await Promise.all([
    supabase
      .from('materials')
      .select('id, name, is_active, sort_order')
      .eq('widget_id', widgetId)
      .order('sort_order', { ascending: true }),
    supabase
      .from('leads')
      .select('material_id')
      .eq('widget_id', widgetId)
      .not('material_id', 'is', null),
  ]);

  if (materialsResult.error || !materialsResult.data) {
    return [];
  }

  const materials = materialsResult.data as Array<{
    id: string;
    name: string;
    is_active: boolean;
    sort_order: number;
  }>;

  const leadCounts = new Map<string, number>();
  const leadRows = (leadsResult.data ?? []) as Array<{ material_id: string | null }>;

  for (const row of leadRows) {
    if (!row.material_id) {
      continue;
    }
    leadCounts.set(row.material_id, (leadCounts.get(row.material_id) ?? 0) + 1);
  }

  return materials
    .map(material => ({
      materialId: material.id,
      name: material.name,
      leadCount: leadCounts.get(material.id) ?? 0,
      isActive: material.is_active,
      sortOrder: material.sort_order,
    }))
    .sort((a, b) => b.leadCount - a.leadCount || a.sortOrder - b.sortOrder);
}

export async function getRecentLeads(
  supabase: SupabaseClient,
  widgetId: string,
  limit = 15,
): Promise<RecentLeadItem[]> {
  const leadsResult = await supabase
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id')
    .eq('widget_id', widgetId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (leadsResult.error || !leadsResult.data) {
    return [];
  }

  const rows = leadsResult.data as Array<{
    id: string;
    email: string;
    email_status: string;
    source_page: string | null;
    created_at: string;
    material_id: string | null;
  }>;

  const materialIds = Array.from(
    new Set(rows.map(row => row.material_id).filter((value): value is string => Boolean(value))),
  );

  let materialNameById = new Map<string, string>();

  if (materialIds.length > 0) {
    const materialsResult = await supabase
      .from('materials')
      .select('id, name')
      .in('id', materialIds);

    if (materialsResult.data) {
      materialNameById = new Map(
        (materialsResult.data as Array<{ id: string; name: string }>).map(material => [
          material.id,
          material.name,
        ]),
      );
    }
  }

  return rows.map(row => ({
    id: row.id,
    email: row.email,
    emailStatus: row.email_status,
    sourcePage: row.source_page,
    createdAt: row.created_at,
    materialName: row.material_id ? (materialNameById.get(row.material_id) ?? null) : null,
  }));
}
