import type { SupabaseClient } from '@supabase/supabase-js';

export interface PublicWidgetMaterial {
  id: string;
  name: string;
  swatch_url: string | null;
  texture_url: string | null;
  prompt_modifier: string | null;
  sort_order: number;
}

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
  max_generations_per_session: number | null;
  max_generations_per_email_lifetime: number | null;
  limit_reached_cta_url: string | null;
  materials: PublicWidgetMaterial[];
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
      'id, workspace_id, name, embed_key, mode, theme, is_active, domain_allowlist, require_email, auto_open_widget, show_product_names, max_generations_per_session, max_generations_per_email_lifetime, limit_reached_cta_url',
    )
    .eq('embed_key', embedKey)
    .maybeSingle();

  if (widgetResult.error || !widgetResult.data) {
    return null;
  }

  const widget = widgetResult.data as Omit<PublicWidgetConfig, 'materials'>;

  if (!widget.is_active) {
    return null;
  }

  const materialsResult = await supabase
    .from('materials')
    .select('id, name, swatch_url, texture_url, prompt_modifier, sort_order')
    .eq('widget_id', widget.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (materialsResult.error) {
    return null;
  }

  const materials = (materialsResult.data ?? []) as PublicWidgetMaterial[];

  return {
    ...widget,
    domain_allowlist: Array.isArray(widget.domain_allowlist) ? widget.domain_allowlist : [],
    max_generations_per_session:
      typeof widget.max_generations_per_session === 'number'
        ? widget.max_generations_per_session
        : null,
    max_generations_per_email_lifetime:
      typeof widget.max_generations_per_email_lifetime === 'number'
        ? widget.max_generations_per_email_lifetime
        : null,
    limit_reached_cta_url:
      typeof widget.limit_reached_cta_url === 'string' && widget.limit_reached_cta_url.trim()
        ? widget.limit_reached_cta_url.trim()
        : null,
    materials,
  };
}
