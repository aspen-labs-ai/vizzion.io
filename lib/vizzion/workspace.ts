import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSignedStorageUrl } from './portfolio';

export const SELECTED_WIDGET_COOKIE = 'vz_widget';

export interface WorkspaceRecord {
  id: string;
  name: string;
  slug: string;
  company_name: string | null;
  brand_color: string;
  logo_url: string | null;
  reply_to_email: string | null;
  status: string;
}

export interface WidgetRecord {
  id: string;
  workspace_id: string;
  name: string;
  embed_key: string;
  mode: 'inline' | 'popup' | string;
  theme: 'dark' | 'light' | string;
  brand_color: string;
  is_active: boolean;
  require_email: boolean;
  delivery_mode: 'instant' | 'email' | string;
  auto_open_widget: boolean;
  show_product_names: boolean;
  subject_type: 'home' | 'vehicle' | 'body' | 'yard' | 'boat' | 'room' | 'generic' | string;
  target_surface: string | null;
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
  visualizations30d: number;
  leads30d: number;
  conversionRate30d: number;
  activeMaterials: number;
  sentEmailCount30d: number;
  queuedJobs30d: number;
  previewViews30d: number;
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

export interface StepFunnelMetrics {
  widgetOpened: number;
  uploadStarted: number;
  uploadCompleted: number;
  materialSelected: number;
  emailSubmitted: number;
  generationRequested: number;
  revealRendered: number;
  revealFallbackShown: number;
  generationFailed: number;
}

function toCount(value: number | null): number {
  return typeof value === 'number' ? value : 0;
}

function getSinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

const WIDGET_SELECT =
  'id, workspace_id, name, embed_key, mode, theme, brand_color, is_active, require_email, delivery_mode, auto_open_widget, show_product_names, subject_type, target_surface, domain_allowlist, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, is_primary';

export interface WorkspaceWidgetSummary {
  id: string;
  name: string;
  is_primary: boolean;
  is_active: boolean;
}

export async function listWorkspaceWidgets(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<WorkspaceWidgetSummary[]> {
  const result = await supabase
    .from('widgets')
    .select('id, name, is_primary, is_active')
    .eq('workspace_id', workspaceId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (result.error || !result.data) {
    return [];
  }

  return result.data as WorkspaceWidgetSummary[];
}

export async function getWorkspaceContext(
  supabase: SupabaseClient,
  selectedWidgetId?: string | null,
): Promise<WorkspaceContext | null> {
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
    .select('id, name, slug, company_name, brand_color, logo_url, reply_to_email, status')
    .eq('id', membership.workspace_id)
    .single();

  if (workspaceResult.error || !workspaceResult.data) {
    return null;
  }

  const workspace = workspaceResult.data as WorkspaceRecord;

  let widget: WidgetRecord | null = null;

  // Resolve the active widget: an explicit ?widgetId wins, otherwise fall back
  // to the widget selected in the switcher (persisted in a cookie), and finally
  // to the primary widget. The cookie keeps the selection sticky across nav.
  let effectiveWidgetId = selectedWidgetId ?? null;
  if (!effectiveWidgetId) {
    try {
      const cookieStore = await cookies();
      effectiveWidgetId = cookieStore.get(SELECTED_WIDGET_COOKIE)?.value ?? null;
    } catch {
      // Cookies unavailable in this context; fall through to the primary widget.
    }
  }

  if (effectiveWidgetId) {
    const selectedResult = await supabase
      .from('widgets')
      .select(WIDGET_SELECT)
      .eq('id', effectiveWidgetId)
      .eq('workspace_id', workspace.id)
      .maybeSingle();

    if (!selectedResult.error && selectedResult.data) {
      widget = selectedResult.data as WidgetRecord;
    }
  }

  if (!widget) {
    const widgetResult = await supabase
      .from('widgets')
      .select(WIDGET_SELECT)
      .eq('workspace_id', workspace.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (widgetResult.error) {
      return null;
    }

    widget = widgetResult.data as WidgetRecord | null;
  }

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
      .select(WIDGET_SELECT)
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
  sinceIso?: string,
  untilIso?: string | null,
): Promise<DashboardMetrics> {
  const since = sinceIso ?? getSinceIso(30);
  const withRange = <T extends { gte: (c: string, v: string) => T; lte: (c: string, v: string) => T }>(
    query: T,
    column: string,
  ): T => {
    const ranged = since ? query.gte(column, since) : query;
    return untilIso ? ranged.lte(column, untilIso) : ranged;
  };

  const [
    sessionsResult,
    visualizationsResult,
    leadsResult,
    activeMaterialsResult,
    sentEmailsResult,
    queuedJobsResult,
    previewViewsResult,
  ] = await Promise.all([
    withRange(
      supabase.from('widget_sessions').select('*', { head: true, count: 'exact' }).eq('widget_id', widgetId),
      'started_at',
    ),
    withRange(
      supabase
        .from('generated_previews')
        .select('*', { head: true, count: 'exact' })
        .eq('widget_id', widgetId)
        .not('generated_path', 'is', null),
      'created_at',
    ),
    withRange(
      supabase.from('leads').select('*', { head: true, count: 'exact' }).eq('widget_id', widgetId),
      'created_at',
    ),
    supabase
      .from('materials')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', widgetId)
      .eq('is_active', true),
    withRange(
      supabase
        .from('leads')
        .select('*', { head: true, count: 'exact' })
        .eq('workspace_id', workspaceId)
        .eq('email_status', 'sent'),
      'created_at',
    ),
    withRange(
      supabase
        .from('generation_jobs')
        .select('*', { head: true, count: 'exact' })
        .eq('workspace_id', workspaceId)
        .in('status', ['queued', 'processing']),
      'created_at',
    ),
    withRange(
      supabase
        .from('widget_events')
        .select('*', { head: true, count: 'exact' })
        .eq('widget_id', widgetId)
        .eq('event_type', 'preview_viewed'),
      'created_at',
    ),
  ]);

  const sessions30d = toCount(sessionsResult.count);
  const leads30d = toCount(leadsResult.count);

  return {
    sessions30d,
    visualizations30d: toCount(visualizationsResult.count),
    leads30d,
    conversionRate30d: sessions30d > 0 ? (leads30d / sessions30d) * 100 : 0,
    activeMaterials: toCount(activeMaterialsResult.count),
    sentEmailCount30d: toCount(sentEmailsResult.count),
    queuedJobs30d: toCount(queuedJobsResult.count),
    previewViews30d: toCount(previewViewsResult.count),
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

export async function getStepFunnelMetrics(
  supabase: SupabaseClient,
  widgetId: string,
  sinceIso?: string,
  untilIso?: string | null,
): Promise<StepFunnelMetrics> {
  const since = sinceIso ?? getSinceIso(30);
  let query = supabase
    .from('widget_events')
    .select('event_type, session_id')
    .eq('widget_id', widgetId)
    .in('event_type', [
      'widget_opened',
      'upload_started',
      'upload_completed',
      'material_selected',
      'email_submitted',
      'generation_requested',
      'reveal_rendered',
      'email_delivery_confirmed',
      'reveal_fallback_shown',
      'generation_failed',
    ]);
  if (since) {
    query = query.gte('created_at', since);
  }
  if (untilIso) {
    query = query.lte('created_at', untilIso);
  }
  const result = await query.limit(20000);

  const empty: StepFunnelMetrics = {
    widgetOpened: 0,
    uploadStarted: 0,
    uploadCompleted: 0,
    materialSelected: 0,
    emailSubmitted: 0,
    generationRequested: 0,
    revealRendered: 0,
    revealFallbackShown: 0,
    generationFailed: 0,
  };

  if (result.error || !result.data) {
    return empty;
  }

  // Count UNIQUE sessions per stage so the funnel reflects how many distinct
  // visitors reached each step — not how many raw events fired. Counting raw
  // events makes later stages exceed earlier ones (e.g. one tester generating
  // many times), which produces nonsensical >100% funnel percentages.
  const stageSessions: Record<string, Set<string>> = {
    widget_opened: new Set<string>(),
    upload_started: new Set<string>(),
    upload_completed: new Set<string>(),
    material_selected: new Set<string>(),
    email_submitted: new Set<string>(),
    generation_requested: new Set<string>(),
    reveal: new Set<string>(),
    reveal_fallback_shown: new Set<string>(),
    generation_failed: new Set<string>(),
  };

  for (const row of result.data as Array<{ event_type: string; session_id: string | null }>) {
    if (!row.session_id) {
      continue;
    }
    const stage =
      row.event_type === 'reveal_rendered' || row.event_type === 'email_delivery_confirmed'
        ? 'reveal'
        : row.event_type;
    stageSessions[stage]?.add(row.session_id);
  }

  return {
    widgetOpened: stageSessions.widget_opened.size,
    uploadStarted: stageSessions.upload_started.size,
    uploadCompleted: stageSessions.upload_completed.size,
    materialSelected: stageSessions.material_selected.size,
    emailSubmitted: stageSessions.email_submitted.size,
    generationRequested: stageSessions.generation_requested.size,
    revealRendered: stageSessions.reveal.size,
    revealFallbackShown: stageSessions.reveal_fallback_shown.size,
    generationFailed: stageSessions.generation_failed.size,
  };
}

export async function getMaterialPerformance(
  supabase: SupabaseClient,
  widgetId: string,
  sinceIso?: string,
  untilIso?: string | null,
): Promise<MaterialPerformanceItem[]> {
  let leadsQuery = supabase
    .from('leads')
    .select('material_id')
    .eq('widget_id', widgetId)
    .not('material_id', 'is', null);
  if (sinceIso) {
    leadsQuery = leadsQuery.gte('created_at', sinceIso);
  }
  if (untilIso) {
    leadsQuery = leadsQuery.lte('created_at', untilIso);
  }

  const [materialsResult, leadsResult] = await Promise.all([
    supabase
      .from('materials')
      .select('id, name, is_active, sort_order')
      .eq('widget_id', widgetId)
      .order('sort_order', { ascending: true }),
    leadsQuery,
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
  sinceIso?: string,
  untilIso?: string | null,
): Promise<RecentLeadItem[]> {
  let leadsQuery = supabase
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id')
    .eq('widget_id', widgetId)
    .order('created_at', { ascending: false });
  if (sinceIso) {
    leadsQuery = leadsQuery.gte('created_at', sinceIso);
  }
  if (untilIso) {
    leadsQuery = leadsQuery.lte('created_at', untilIso);
  }
  const leadsResult = await leadsQuery.limit(limit);

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

interface MaterialSnapshot {
  materialId?: unknown;
  name?: unknown;
}

function readSnapshotMaterialId(snapshot: MaterialSnapshot | null): string | null {
  const value = snapshot?.materialId;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readSnapshotMaterialName(snapshot: MaterialSnapshot | null): string | null {
  const value = snapshot?.name;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

export interface MaterialPreviewPerformanceItem {
  materialId: string;
  name: string;
  /** How many visualizations were generated with this material. */
  previewCount: number;
  /** How many distinct visitors generated a preview with this material. */
  visitorCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface VisualizationDepthBucket {
  label: string;
  visitors: number;
}

export interface VisualizationInsights {
  /** Total successful visualizations rendered in the period. */
  totalVisualizations: number;
  /** Distinct visitors (sessions) who generated at least one visualization. */
  visitorsWhoGenerated: number;
  avgVisualizationsPerVisitor: number;
  avgMaterialsPerVisitor: number;
  /** Share of generating visitors who tried 2+ materials, as a percentage. */
  multiMaterialVisitorPct: number;
  depthDistribution: VisualizationDepthBucket[];
  materialPerformance: MaterialPreviewPerformanceItem[];
}

/**
 * Builds the "what visitors actually did" picture from `generated_previews` —
 * the per-visualization record that captures every material a visitor previewed
 * on their photo. The overview cards/charts historically read `leads`, which
 * stores only ONE material per visitor, so a person who tried several looks in a
 * single session collapsed into a single data point. This reconstructs the real
 * activity: total previews, per-material counts, and how many materials each
 * visitor explored.
 */
export async function getVisualizationInsights(
  supabase: SupabaseClient,
  widgetId: string,
  sinceIso?: string,
  untilIso?: string | null,
): Promise<VisualizationInsights> {
  let previewsQuery = supabase
    .from('generated_previews')
    .select('generation_job_id, material_snapshot')
    .eq('widget_id', widgetId)
    .not('generated_path', 'is', null);
  if (sinceIso) {
    previewsQuery = previewsQuery.gte('created_at', sinceIso);
  }
  if (untilIso) {
    previewsQuery = previewsQuery.lte('created_at', untilIso);
  }

  const [materialsResult, previewsResult] = await Promise.all([
    supabase
      .from('materials')
      .select('id, name, is_active, sort_order')
      .eq('widget_id', widgetId)
      .order('sort_order', { ascending: true }),
    previewsQuery.limit(5000),
  ]);

  const previews = (previewsResult.data ?? []) as Array<{
    generation_job_id: string;
    material_snapshot: MaterialSnapshot | null;
  }>;

  // Resolve which session (visitor) each preview belongs to. Previews link to a
  // session only through their generation job, so we look those up in batches.
  const jobIds = Array.from(
    new Set(previews.map(preview => preview.generation_job_id).filter((value): value is string => Boolean(value))),
  );
  const sessionByJobId = new Map<string, string>();
  if (jobIds.length > 0) {
    const jobBatches = await Promise.all(
      chunk(jobIds, 300).map(batch =>
        supabase.from('generation_jobs').select('id, session_id').in('id', batch),
      ),
    );
    for (const batchResult of jobBatches) {
      for (const row of (batchResult.data ?? []) as Array<{ id: string; session_id: string | null }>) {
        if (row.session_id) {
          sessionByJobId.set(row.id, row.session_id);
        }
      }
    }
  }

  const materialPreviewCounts = new Map<string, number>();
  const materialVisitorSets = new Map<string, Set<string>>();
  const snapshotNameById = new Map<string, string>();
  const sessionMaterialSets = new Map<string, Set<string>>();
  const sessionPreviewCounts = new Map<string, number>();

  for (const preview of previews) {
    // Fall back to a per-job key so anonymous/sessionless previews still count
    // as their own distinct visitor rather than merging together.
    const sessionKey = sessionByJobId.get(preview.generation_job_id) ?? `job:${preview.generation_job_id}`;
    sessionPreviewCounts.set(sessionKey, (sessionPreviewCounts.get(sessionKey) ?? 0) + 1);
    if (!sessionMaterialSets.has(sessionKey)) {
      sessionMaterialSets.set(sessionKey, new Set<string>());
    }

    const materialId = readSnapshotMaterialId(preview.material_snapshot);
    if (!materialId) {
      continue;
    }
    materialPreviewCounts.set(materialId, (materialPreviewCounts.get(materialId) ?? 0) + 1);
    if (!materialVisitorSets.has(materialId)) {
      materialVisitorSets.set(materialId, new Set<string>());
    }
    materialVisitorSets.get(materialId)?.add(sessionKey);
    sessionMaterialSets.get(sessionKey)?.add(materialId);

    const name = readSnapshotMaterialName(preview.material_snapshot);
    if (name) {
      snapshotNameById.set(materialId, name);
    }
  }

  const materials = (materialsResult.data ?? []) as Array<{
    id: string;
    name: string;
    is_active: boolean;
    sort_order: number;
  }>;
  const materialIds = new Set(materials.map(material => material.id));

  const materialPerformance: MaterialPreviewPerformanceItem[] = materials.map(material => ({
    materialId: material.id,
    name: material.name,
    previewCount: materialPreviewCounts.get(material.id) ?? 0,
    visitorCount: materialVisitorSets.get(material.id)?.size ?? 0,
    isActive: material.is_active,
    sortOrder: material.sort_order,
  }));

  // Surface previews generated with materials that were since deleted so totals
  // still reconcile with the visualizations count.
  for (const [materialId, previewCount] of materialPreviewCounts) {
    if (!materialIds.has(materialId)) {
      materialPerformance.push({
        materialId,
        name: snapshotNameById.get(materialId) ?? 'Removed material',
        previewCount,
        visitorCount: materialVisitorSets.get(materialId)?.size ?? 0,
        isActive: false,
        sortOrder: Number.MAX_SAFE_INTEGER,
      });
    }
  }

  materialPerformance.sort(
    (a, b) => b.previewCount - a.previewCount || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );

  const visitorsWhoGenerated = sessionPreviewCounts.size;
  let totalMaterialsTried = 0;
  let multiMaterialVisitors = 0;
  const buckets = { one: 0, two: 0, threePlus: 0 };

  for (const materialSet of sessionMaterialSets.values()) {
    // A visitor who generated always tried at least one material, even if the
    // snapshot lacked an id for some edge-case render.
    const distinctMaterials = Math.max(materialSet.size, 1);
    totalMaterialsTried += distinctMaterials;
    if (distinctMaterials >= 2) {
      multiMaterialVisitors += 1;
    }
    if (distinctMaterials <= 1) {
      buckets.one += 1;
    } else if (distinctMaterials === 2) {
      buckets.two += 1;
    } else {
      buckets.threePlus += 1;
    }
  }

  return {
    totalVisualizations: previews.length,
    visitorsWhoGenerated,
    avgVisualizationsPerVisitor: visitorsWhoGenerated > 0 ? previews.length / visitorsWhoGenerated : 0,
    avgMaterialsPerVisitor: visitorsWhoGenerated > 0 ? totalMaterialsTried / visitorsWhoGenerated : 0,
    multiMaterialVisitorPct:
      visitorsWhoGenerated > 0 ? (multiMaterialVisitors / visitorsWhoGenerated) * 100 : 0,
    depthDistribution: [
      { label: '1 material', visitors: buckets.one },
      { label: '2 materials', visitors: buckets.two },
      { label: '3+ materials', visitors: buckets.threePlus },
    ],
    materialPerformance,
  };
}

export interface RecentVisualizationItem {
  id: string;
  createdAt: string;
  materialName: string | null;
  /** Null when the visitor previewed without leaving an email. */
  visitorEmail: string | null;
  originalUrl: string | null;
  generatedUrl: string | null;
  shareUrl: string | null;
}

/**
 * Recent successful visualizations with signed before/after image URLs.
 * Requires an admin client because the storage buckets are private and signed
 * URLs are minted with the service role (mirrors the lead-detail endpoint).
 */
export async function getRecentVisualizations(
  admin: SupabaseClient,
  widgetId: string,
  limit = 6,
  sinceIso?: string,
  untilIso?: string | null,
): Promise<RecentVisualizationItem[]> {
  let query = admin
    .from('generated_previews')
    .select('id, generated_path, original_upload_path, material_snapshot, share_token, created_at, lead_id')
    .eq('widget_id', widgetId)
    .not('generated_path', 'is', null)
    .order('created_at', { ascending: false });
  if (sinceIso) {
    query = query.gte('created_at', sinceIso);
  }
  if (untilIso) {
    query = query.lte('created_at', untilIso);
  }

  const result = await query.limit(limit);
  if (result.error || !result.data) {
    return [];
  }

  const rows = result.data as Array<{
    id: string;
    generated_path: string | null;
    original_upload_path: string | null;
    material_snapshot: MaterialSnapshot | null;
    share_token: string | null;
    created_at: string;
    lead_id: string | null;
  }>;

  const leadIds = Array.from(
    new Set(rows.map(row => row.lead_id).filter((value): value is string => Boolean(value))),
  );
  const emailByLeadId = new Map<string, string>();
  if (leadIds.length > 0) {
    const leadsResult = await admin.from('leads').select('id, email').in('id', leadIds);
    for (const row of (leadsResult.data ?? []) as Array<{ id: string; email: string }>) {
      emailByLeadId.set(row.id, row.email);
    }
  }

  return Promise.all(
    rows.map(async row => {
      const [original, generated] = await Promise.all([
        createSignedStorageUrl(admin, { bucket: 'uploads-original', path: row.original_upload_path }),
        createSignedStorageUrl(admin, { bucket: 'renders-generated', path: row.generated_path }),
      ]);

      return {
        id: row.id,
        createdAt: row.created_at,
        materialName: readSnapshotMaterialName(row.material_snapshot),
        visitorEmail: row.lead_id ? (emailByLeadId.get(row.lead_id) ?? null) : null,
        originalUrl: original.url,
        generatedUrl: generated.url,
        shareUrl: row.share_token ? `/preview/${row.share_token}` : null,
      };
    }),
  );
}
