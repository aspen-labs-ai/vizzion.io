import type { SupabaseClient } from '@supabase/supabase-js';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RANGE_DAYS = 30;
const DEFAULT_SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;
const HIGH_BLOCK_RATE_ALERT_THRESHOLD = 15;
const STALE_QUEUE_AGE_ALERT_MINUTES = 10;
const CONVERSION_DROP_ALERT_THRESHOLD = 25;

export interface PortfolioDateRange {
  fromIso: string;
  toIso: string;
  fromInput: string;
  toInput: string;
}

export interface WorkspaceWidgetSummary {
  id: string;
  name: string;
  isPrimary: boolean;
  industrySlug: string | null;
}

export interface PortfolioTotals {
  sessions: number;
  uploads: number;
  leads: number;
  succeededPreviews: number;
  sessionToLeadConversionPercent: number;
  sessionToPreviewConversionPercent: number;
  blockRatePercent: number;
  queuedJobs: number;
  blockedAttempts: number;
  submittedAttempts: number;
}

export interface PortfolioWidgetRow {
  widgetId: string;
  widgetName: string;
  industrySlug: string | null;
  sessions: number;
  uploads: number;
  leads: number;
  succeededPreviews: number;
  conversionPercent: number;
  blockRatePercent: number;
  queuedJobs: number;
  blockedAttempts: number;
  submittedAttempts: number;
}

export interface PortfolioIndustryRow {
  industrySlug: string;
  widgetId: string;
  widgetName: string;
  sessions: number;
  uploads: number;
  leads: number;
  previews: number;
  conversionPercent: number;
}

export interface PortfolioPreviewRow {
  id: string;
  widgetId: string;
  widgetName: string;
  industrySlug: string | null;
  createdAt: string;
  originalUploadPath: string | null;
  generatedPath: string | null;
  originalUploadUrl: string | null;
  generatedPreviewUrl: string | null;
  signedUrlExpiresAt: string | null;
  retentionExpiresAt: string | null;
}

export interface PortfolioAlert {
  id: 'high_limit_block_rate' | 'stale_queue_backlog' | 'conversion_drop';
  severity: 'warning' | 'critical';
  title: string;
  message: string;
}

interface WidgetCountQueryResult {
  id: string;
  name: string;
  is_primary: boolean;
}

interface WidgetIndustryMappingResult {
  widget_id: string;
  industry_slug: string;
}

interface GeneratedPreviewResult {
  id: string;
  widget_id: string;
  original_upload_path: string | null;
  generated_path: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

function toCount(value: number | null): number {
  return typeof value === 'number' ? value : 0;
}

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function isMissingRelationError(error: unknown): boolean {
  const errorCode = (error as { code?: string } | null)?.code;
  return errorCode === '42P01';
}

function normalizeIndustrySlug(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function normalizeStoragePath(path: string, bucket: 'uploads-original' | 'renders-generated'): string {
  const normalized = path.trim().replace(/^\/+/, '');
  if (!normalized) {
    return normalized;
  }

  if (normalized.startsWith(`${bucket}/`)) {
    return normalized.slice(bucket.length + 1);
  }

  return normalized;
}

function parseRetentionExpiry(metadata: Record<string, unknown> | null | undefined): string | null {
  if (!metadata) {
    return null;
  }

  const candidates = [
    metadata.retention_expires_at,
    metadata.retentionExpiresAt,
    metadata.expires_at,
    metadata.expiresAt,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue;
    }

    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
}

function getPreviousRange(range: PortfolioDateRange): { fromIso: string; toIso: string } {
  const from = new Date(range.fromIso);
  const to = new Date(range.toIso);
  const durationMs = Math.max(to.getTime() - from.getTime(), DAY_MS);
  const previousTo = new Date(from.getTime());
  const previousFrom = new Date(from.getTime() - durationMs);

  return {
    fromIso: previousFrom.toISOString(),
    toIso: previousTo.toISOString(),
  };
}

export function parseDateInputUtc(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function resolvePortfolioDateRange(params: {
  dateFrom?: string | null;
  dateTo?: string | null;
  defaultDays?: number;
} = {}): PortfolioDateRange {
  const defaultDays = params.defaultDays ?? DEFAULT_RANGE_DAYS;

  const explicitFrom = parseDateInputUtc(params.dateFrom);
  const explicitTo = parseDateInputUtc(params.dateTo);

  if (explicitFrom && explicitTo && explicitFrom.getTime() <= explicitTo.getTime()) {
    const toExclusive = new Date(explicitTo.getTime() + DAY_MS);
    return {
      fromIso: explicitFrom.toISOString(),
      toIso: toExclusive.toISOString(),
      fromInput: toIsoDate(explicitFrom),
      toInput: toIsoDate(explicitTo),
    };
  }

  const now = new Date();
  const from = new Date(now.getTime() - defaultDays * DAY_MS);

  return {
    fromIso: from.toISOString(),
    toIso: now.toISOString(),
    fromInput: toIsoDate(from),
    toInput: toIsoDate(now),
  };
}

export async function getWorkspaceWidgets(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<WorkspaceWidgetSummary[]> {
  const widgetsResult = await supabase
    .from('widgets')
    .select('id, name, is_primary')
    .eq('workspace_id', workspaceId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true });

  if (widgetsResult.error || !widgetsResult.data) {
    return [];
  }

  let industryByWidgetId = new Map<string, string>();

  const mappingResult = await supabase
    .from('industry_widget_mappings')
    .select('widget_id, industry_slug')
    .eq('workspace_id', workspaceId);

  if (!mappingResult.error && mappingResult.data) {
    industryByWidgetId = new Map(
      (mappingResult.data as WidgetIndustryMappingResult[]).map(mapping => [
        mapping.widget_id,
        mapping.industry_slug,
      ]),
    );
  } else if (!isMissingRelationError(mappingResult.error)) {
    industryByWidgetId = new Map();
  }

  return (widgetsResult.data as WidgetCountQueryResult[]).map(widget => ({
    id: widget.id,
    name: widget.name,
    isPrimary: widget.is_primary,
    industrySlug: normalizeIndustrySlug(industryByWidgetId.get(widget.id)),
  }));
}

async function countWidgetUploadsInRange(
  supabase: SupabaseClient,
  widgetId: string,
  range: PortfolioDateRange,
): Promise<number> {
  const uploadsResult = await supabase
    .from('widget_uploads')
    .select('*', { head: true, count: 'exact' })
    .eq('widget_id', widgetId)
    .gte('created_at', range.fromIso)
    .lt('created_at', range.toIso);

  if (!uploadsResult.error) {
    return toCount(uploadsResult.count);
  }

  if (!isMissingRelationError(uploadsResult.error)) {
    return 0;
  }

  const fallbackResult = await supabase
    .from('generated_previews')
    .select('*', { head: true, count: 'exact' })
    .eq('widget_id', widgetId)
    .not('original_upload_path', 'is', null)
    .gte('created_at', range.fromIso)
    .lt('created_at', range.toIso);

  if (fallbackResult.error) {
    return 0;
  }

  return toCount(fallbackResult.count);
}

export async function getPortfolioWidgetBreakdown(params: {
  supabase: SupabaseClient;
  workspaceId: string;
  dateRange: PortfolioDateRange;
  widgets?: WorkspaceWidgetSummary[];
}): Promise<PortfolioWidgetRow[]> {
  const widgets = params.widgets ?? (await getWorkspaceWidgets(params.supabase, params.workspaceId));
  if (widgets.length === 0) {
    return [];
  }

  const rows = await Promise.all(
    widgets.map(async widget => {
      const [
        sessionsResult,
        leadsResult,
        previewsResult,
        queuedJobsResult,
        blockedEventsResult,
        submittedEventsResult,
        uploads,
      ] = await Promise.all([
        params.supabase
          .from('widget_sessions')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .gte('started_at', params.dateRange.fromIso)
          .lt('started_at', params.dateRange.toIso),
        params.supabase
          .from('leads')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .gte('created_at', params.dateRange.fromIso)
          .lt('created_at', params.dateRange.toIso),
        params.supabase
          .from('generated_previews')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .gte('created_at', params.dateRange.fromIso)
          .lt('created_at', params.dateRange.toIso),
        params.supabase
          .from('generation_jobs')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .eq('status', 'queued')
          .gte('created_at', params.dateRange.fromIso)
          .lt('created_at', params.dateRange.toIso),
        params.supabase
          .from('widget_events')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .eq('event_type', 'generation_limit_blocked')
          .gte('created_at', params.dateRange.fromIso)
          .lt('created_at', params.dateRange.toIso),
        params.supabase
          .from('widget_events')
          .select('*', { head: true, count: 'exact' })
          .eq('widget_id', widget.id)
          .eq('event_type', 'lead_submitted')
          .gte('created_at', params.dateRange.fromIso)
          .lt('created_at', params.dateRange.toIso),
        countWidgetUploadsInRange(params.supabase, widget.id, params.dateRange),
      ]);

      const sessions = toCount(sessionsResult.count);
      const leads = toCount(leadsResult.count);
      const succeededPreviews = toCount(previewsResult.count);
      const blockedAttempts = toCount(blockedEventsResult.count);
      const submittedAttempts = toCount(submittedEventsResult.count);

      return {
        widgetId: widget.id,
        widgetName: widget.name,
        industrySlug: widget.industrySlug,
        sessions,
        uploads,
        leads,
        succeededPreviews,
        conversionPercent: sessions > 0 ? (leads / sessions) * 100 : 0,
        blockRatePercent: submittedAttempts > 0 ? (blockedAttempts / submittedAttempts) * 100 : 0,
        queuedJobs: toCount(queuedJobsResult.count),
        blockedAttempts,
        submittedAttempts,
      };
    }),
  );

  return rows.sort((left, right) => right.leads - left.leads || right.sessions - left.sessions);
}

export function getPortfolioTotals(widgetRows: PortfolioWidgetRow[]): PortfolioTotals {
  const totals = widgetRows.reduce(
    (accumulator, row) => {
      accumulator.sessions += row.sessions;
      accumulator.uploads += row.uploads;
      accumulator.leads += row.leads;
      accumulator.succeededPreviews += row.succeededPreviews;
      accumulator.queuedJobs += row.queuedJobs;
      accumulator.blockedAttempts += row.blockedAttempts;
      accumulator.submittedAttempts += row.submittedAttempts;
      return accumulator;
    },
    {
      sessions: 0,
      uploads: 0,
      leads: 0,
      succeededPreviews: 0,
      queuedJobs: 0,
      blockedAttempts: 0,
      submittedAttempts: 0,
    },
  );

  return {
    ...totals,
    sessionToLeadConversionPercent:
      totals.sessions > 0 ? (totals.leads / totals.sessions) * 100 : 0,
    sessionToPreviewConversionPercent:
      totals.sessions > 0 ? (totals.succeededPreviews / totals.sessions) * 100 : 0,
    blockRatePercent:
      totals.submittedAttempts > 0
        ? (totals.blockedAttempts / totals.submittedAttempts) * 100
        : 0,
  };
}

export function getPortfolioIndustryBreakdown(
  widgetRows: PortfolioWidgetRow[],
): PortfolioIndustryRow[] {
  const rows = widgetRows.map(widgetRow => ({
    industrySlug: widgetRow.industrySlug ?? 'unmapped',
    widgetId: widgetRow.widgetId,
    widgetName: widgetRow.widgetName,
    sessions: widgetRow.sessions,
    uploads: widgetRow.uploads,
    leads: widgetRow.leads,
    previews: widgetRow.succeededPreviews,
    conversionPercent: widgetRow.conversionPercent,
  }));

  return rows.sort((left, right) => {
    if (left.industrySlug === right.industrySlug) {
      return left.widgetName.localeCompare(right.widgetName);
    }
    return left.industrySlug.localeCompare(right.industrySlug);
  });
}

export async function createSignedStorageUrl(
  supabase: SupabaseClient,
  params: {
    bucket: 'uploads-original' | 'renders-generated';
    path: string | null | undefined;
    expiresInSeconds?: number;
  },
): Promise<{ url: string | null; expiresAt: string | null }> {
  const rawPath = params.path?.trim();
  if (!rawPath) {
    return { url: null, expiresAt: null };
  }

  const normalizedPath = normalizeStoragePath(rawPath, params.bucket);
  if (!normalizedPath) {
    return { url: null, expiresAt: null };
  }

  const expiresInSeconds = params.expiresInSeconds ?? DEFAULT_SIGNED_URL_TTL_SECONDS;

  const signedUrlResult = await supabase.storage
    .from(params.bucket)
    .createSignedUrl(normalizedPath, expiresInSeconds);

  if (signedUrlResult.error || !signedUrlResult.data?.signedUrl) {
    return { url: null, expiresAt: null };
  }

  return {
    url: signedUrlResult.data.signedUrl,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
  };
}

export async function getPortfolioRecentPreviews(params: {
  supabase: SupabaseClient;
  workspaceId: string;
  dateRange: PortfolioDateRange;
  widgets?: WorkspaceWidgetSummary[];
  limit?: number;
  signedUrlTtlSeconds?: number;
}): Promise<PortfolioPreviewRow[]> {
  const widgets = params.widgets ?? (await getWorkspaceWidgets(params.supabase, params.workspaceId));
  const widgetById = new Map(widgets.map(widget => [widget.id, widget]));
  const limit = params.limit ?? 12;
  const signedUrlTtlSeconds = params.signedUrlTtlSeconds ?? DEFAULT_SIGNED_URL_TTL_SECONDS;

  const previewsResult = await params.supabase
    .from('generated_previews')
    .select('id, widget_id, original_upload_path, generated_path, metadata, created_at')
    .eq('workspace_id', params.workspaceId)
    .gte('created_at', params.dateRange.fromIso)
    .lt('created_at', params.dateRange.toIso)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (previewsResult.error || !previewsResult.data) {
    return [];
  }

  const previews = previewsResult.data as GeneratedPreviewResult[];

  return Promise.all(
    previews.map(async preview => {
      const widget = widgetById.get(preview.widget_id);
      const [originalUpload, generatedPreview] = await Promise.all([
        createSignedStorageUrl(params.supabase, {
          bucket: 'uploads-original',
          path: preview.original_upload_path,
          expiresInSeconds: signedUrlTtlSeconds,
        }),
        createSignedStorageUrl(params.supabase, {
          bucket: 'renders-generated',
          path: preview.generated_path,
          expiresInSeconds: signedUrlTtlSeconds,
        }),
      ]);

      return {
        id: preview.id,
        widgetId: preview.widget_id,
        widgetName: widget?.name ?? 'Unknown widget',
        industrySlug: widget?.industrySlug ?? null,
        createdAt: preview.created_at,
        originalUploadPath: preview.original_upload_path,
        generatedPath: preview.generated_path,
        originalUploadUrl: originalUpload.url,
        generatedPreviewUrl: generatedPreview.url,
        signedUrlExpiresAt: generatedPreview.expiresAt ?? originalUpload.expiresAt,
        retentionExpiresAt: parseRetentionExpiry(preview.metadata),
      };
    }),
  );
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export async function getPortfolioAlerts(params: {
  supabase: SupabaseClient;
  workspaceId: string;
  dateRange: PortfolioDateRange;
  widgetRows: PortfolioWidgetRow[];
}): Promise<PortfolioAlert[]> {
  const totals = getPortfolioTotals(params.widgetRows);
  const alerts: PortfolioAlert[] = [];

  if (totals.blockRatePercent > HIGH_BLOCK_RATE_ALERT_THRESHOLD) {
    alerts.push({
      id: 'high_limit_block_rate',
      severity: 'warning',
      title: 'High limit block rate',
      message: `Limit blocks are ${formatPercent(
        totals.blockRatePercent,
      )} for this range, which is above the ${HIGH_BLOCK_RATE_ALERT_THRESHOLD}% threshold.`,
    });
  }

  const queuedJobResult = await params.supabase
    .from('generation_jobs')
    .select('created_at')
    .eq('workspace_id', params.workspaceId)
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!queuedJobResult.error && queuedJobResult.data?.created_at) {
    const oldestQueuedAt = new Date(queuedJobResult.data.created_at).getTime();
    if (!Number.isNaN(oldestQueuedAt)) {
      const queueAgeMinutes = (Date.now() - oldestQueuedAt) / (60 * 1000);
      if (queueAgeMinutes > STALE_QUEUE_AGE_ALERT_MINUTES) {
        alerts.push({
          id: 'stale_queue_backlog',
          severity: 'critical',
          title: 'Queue backlog is stale',
          message: `Oldest queued job is ${Math.floor(
            queueAgeMinutes,
          )} minutes old, above the ${STALE_QUEUE_AGE_ALERT_MINUTES}-minute threshold.`,
        });
      }
    }
  }

  const previousRange = getPreviousRange(params.dateRange);
  const [previousSessionsResult, previousLeadsResult] = await Promise.all([
    params.supabase
      .from('widget_sessions')
      .select('*', { head: true, count: 'exact' })
      .eq('workspace_id', params.workspaceId)
      .gte('started_at', previousRange.fromIso)
      .lt('started_at', previousRange.toIso),
    params.supabase
      .from('leads')
      .select('*', { head: true, count: 'exact' })
      .eq('workspace_id', params.workspaceId)
      .gte('created_at', previousRange.fromIso)
      .lt('created_at', previousRange.toIso),
  ]);

  const previousSessions = toCount(previousSessionsResult.count);
  const previousLeads = toCount(previousLeadsResult.count);
  const previousConversionPercent =
    previousSessions > 0 ? (previousLeads / previousSessions) * 100 : null;

  if (previousConversionPercent && previousConversionPercent > 0) {
    const dropPercent =
      ((previousConversionPercent - totals.sessionToLeadConversionPercent) / previousConversionPercent)
      * 100;

    if (dropPercent >= CONVERSION_DROP_ALERT_THRESHOLD) {
      alerts.push({
        id: 'conversion_drop',
        severity: 'warning',
        title: 'Conversion rate drop detected',
        message: `Session-to-lead conversion is down ${formatPercent(
          dropPercent,
        )} versus the previous comparable window.`,
      });
    }
  }

  return alerts;
}
