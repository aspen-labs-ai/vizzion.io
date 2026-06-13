import type { SupabaseClient } from '@supabase/supabase-js';

export interface PublicWidgetMaterial {
  id: string;
  name: string;
  swatch_url: string | null;
  texture_url: string | null;
  prompt_modifier: string | null;
  sort_order: number;
}

export type WidgetSubjectType =
  | 'home'
  | 'vehicle'
  | 'body'
  | 'yard'
  | 'boat'
  | 'room'
  | 'generic';

export interface PublicWidgetConfig {
  id: string;
  workspace_id: string;
  name: string;
  embed_key: string;
  mode: string;
  theme: string;
  is_active: boolean;
  domain_allowlist: string[];
  require_email: boolean;
  auto_open_widget: boolean;
  show_product_names: boolean;
  subject_type: WidgetSubjectType;
  brand_color: string;
  max_generations_per_session: number | null;
  max_generations_per_email_lifetime: number | null;
  limit_reached_cta_url: string | null;
  materials: PublicWidgetMaterial[];
}

interface RawWidgetRecord {
  id: string;
  workspace_id: string;
  name: string;
  embed_key: string;
  mode: string;
  theme: string;
  is_active: boolean;
  domain_allowlist: string[] | null;
  require_email: boolean;
  auto_open_widget: boolean;
  show_product_names: boolean;
  subject_type: string | null;
  max_generations_per_session: number | null;
  max_generations_per_email_lifetime: number | null;
  limit_reached_cta_url: string | null;
  workspace: { brand_color: string | null } | Array<{ brand_color: string | null }> | null;
}

interface ResolveByIndustryOptions {
  originHeader?: string | null;
  pageUrl?: string | null | undefined;
}

function extractHostname(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const candidate = trimmed.includes('://') ? trimmed : `https://${trimmed}`;

  try {
    return new URL(candidate).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function normalizeAllowedHost(value: string): string | null {
  const hostname = extractHostname(value);
  if (!hostname) {
    return null;
  }

  return hostname.replace(/^\*\./, '');
}

function hostMatches(host: string, allowPattern: string): boolean {
  const normalized = allowPattern.replace(/^\*\./, '').toLowerCase();
  return host === normalized || host.endsWith(`.${normalized}`);
}

function normalizeSubjectType(value: string | null | undefined): WidgetSubjectType {
  if (
    value === 'home'
    || value === 'vehicle'
    || value === 'body'
    || value === 'yard'
    || value === 'boat'
    || value === 'room'
    || value === 'generic'
  ) {
    return value;
  }

  return 'home';
}

async function loadWidgetMaterials(
  supabase: SupabaseClient,
  widgetId: string,
): Promise<PublicWidgetMaterial[] | null> {
  const materialsResult = await supabase
    .from('materials')
    .select('id, name, swatch_url, texture_url, prompt_modifier, sort_order')
    .eq('widget_id', widgetId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (materialsResult.error) {
    return null;
  }

  return (materialsResult.data ?? []) as PublicWidgetMaterial[];
}

function sanitizeLimitCtaUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toPublicWidgetConfig(
  widget: RawWidgetRecord,
  materials: PublicWidgetMaterial[],
): PublicWidgetConfig {
  const workspaceRow = Array.isArray(widget.workspace) ? widget.workspace[0] ?? null : widget.workspace;

  return {
    id: widget.id,
    workspace_id: widget.workspace_id,
    name: widget.name,
    embed_key: widget.embed_key,
    mode: widget.mode,
    theme: widget.theme,
    is_active: widget.is_active,
    domain_allowlist: Array.isArray(widget.domain_allowlist) ? widget.domain_allowlist : [],
    require_email: widget.require_email,
    auto_open_widget: widget.auto_open_widget,
    show_product_names: widget.show_product_names,
    subject_type: normalizeSubjectType(widget.subject_type),
    brand_color:
      typeof workspaceRow?.brand_color === 'string' && workspaceRow.brand_color.trim()
        ? workspaceRow.brand_color.trim()
        : '#10B981',
    max_generations_per_session:
      typeof widget.max_generations_per_session === 'number'
        ? widget.max_generations_per_session
        : null,
    max_generations_per_email_lifetime:
      typeof widget.max_generations_per_email_lifetime === 'number'
        ? widget.max_generations_per_email_lifetime
        : null,
    limit_reached_cta_url: sanitizeLimitCtaUrl(widget.limit_reached_cta_url),
    materials,
  };
}

async function hydratePublicWidget(
  supabase: SupabaseClient,
  widget: RawWidgetRecord,
): Promise<PublicWidgetConfig | null> {
  if (!widget.is_active) {
    return null;
  }

  const materials = await loadWidgetMaterials(supabase, widget.id);
  if (!materials) {
    return null;
  }

  return toPublicWidgetConfig(widget, materials);
}

export function isOriginAllowed(
  allowlist: string[] | null | undefined,
  originHeader: string | null,
  pageUrl: string | null | undefined,
): boolean {
  const normalizedAllowlist = (allowlist ?? [])
    .map(normalizeAllowedHost)
    .filter((value): value is string => Boolean(value));

  // Empty allowlist is treated as "not configured" and therefore denied.
  if (normalizedAllowlist.length === 0) {
    return false;
  }

  const candidateHosts = [extractHostname(originHeader), extractHostname(pageUrl)].filter(
    (value): value is string => Boolean(value),
  );

  if (candidateHosts.length === 0) {
    return false;
  }

  return candidateHosts.some(host =>
    normalizedAllowlist.some(allowedHost => hostMatches(host, allowedHost)),
  );
}

export async function resolvePublicWidget(
  supabase: SupabaseClient,
  embedKey: string,
): Promise<PublicWidgetConfig | null> {
  const widgetResult = await supabase
    .from('widgets')
    .select(
      'id, workspace_id, name, embed_key, mode, theme, is_active, domain_allowlist, require_email, auto_open_widget, show_product_names, subject_type, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, workspace:workspaces(brand_color)',
    )
    .eq('embed_key', embedKey)
    .maybeSingle();

  if (widgetResult.error || !widgetResult.data) {
    return null;
  }

  return hydratePublicWidget(supabase, widgetResult.data as RawWidgetRecord);
}

export async function resolvePublicWidgetByIndustrySlug(
  supabase: SupabaseClient,
  industrySlug: string,
  options: ResolveByIndustryOptions = {},
): Promise<PublicWidgetConfig | null> {
  const normalizedSlug = industrySlug.trim().toLowerCase();
  if (!normalizedSlug) {
    return null;
  }

  const mappingResult = await supabase
    .from('industry_widget_mappings')
    .select('widget_id')
    .eq('industry_slug', normalizedSlug)
    .order('created_at', { ascending: true })
    .limit(25);

  if (mappingResult.error || !mappingResult.data || mappingResult.data.length === 0) {
    return null;
  }

  const widgetIds = mappingResult.data
    .map(row => row.widget_id)
    .filter((value): value is string => typeof value === 'string' && value.length > 0);

  for (const widgetId of widgetIds) {
    const widgetResult = await supabase
      .from('widgets')
      .select(
        'id, workspace_id, name, embed_key, mode, theme, is_active, domain_allowlist, require_email, auto_open_widget, show_product_names, subject_type, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url, workspace:workspaces(brand_color)',
      )
      .eq('id', widgetId)
      .maybeSingle();

    if (widgetResult.error || !widgetResult.data) {
      continue;
    }

    const hydrated = await hydratePublicWidget(supabase, widgetResult.data as RawWidgetRecord);
    if (!hydrated) {
      continue;
    }

    if (
      (options.originHeader || options.pageUrl)
      && !isOriginAllowed(hydrated.domain_allowlist, options.originHeader ?? null, options.pageUrl)
    ) {
      continue;
    }

    return hydrated;
  }

  return null;
}

export async function resolvePublicWidgetByIdentifier(
  supabase: SupabaseClient,
  params: {
    embedKey?: string | null;
    industrySlug?: string | null;
    originHeader?: string | null;
    pageUrl?: string | null;
  },
): Promise<PublicWidgetConfig | null> {
  const embedKey = params.embedKey?.trim();
  if (embedKey) {
    return resolvePublicWidget(supabase, embedKey);
  }

  const industrySlug = params.industrySlug?.trim();
  if (industrySlug) {
    return resolvePublicWidgetByIndustrySlug(supabase, industrySlug, {
      originHeader: params.originHeader,
      pageUrl: params.pageUrl,
    });
  }

  return null;
}
