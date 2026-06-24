// Shared helpers for the customer-facing shared preview surfaces: the preview
// page (app/preview/[token]/page.tsx) and the watermarked download route
// (app/preview/[token]/download/route.ts).

const SHARE_TOKEN_PATTERN = /^[a-zA-Z0-9_-]{24,80}$/;

export function isValidShareToken(token: string): boolean {
  return SHARE_TOKEN_PATTERN.test(token);
}

export function normalizeStoragePath(path: string, bucket: string): string {
  const normalized = path.trim().replace(/^\/+/, '');
  return normalized.startsWith(`${bucket}/`)
    ? normalized.slice(bucket.length + 1)
    : normalized;
}

export function getMaterialName(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const name = (value as { name?: unknown }).name;
  return typeof name === 'string' && name.trim() ? name.trim() : null;
}

export function buildDownloadFilename(companyName: string, materialName: string | null): string {
  const base = `${companyName} ${materialName ?? 'visualization'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
  return `${base || 'visualization'}.jpg`;
}

const VIZZION_SITE_URL = 'https://vizzion.io';

// Attribution slug for UTM params, e.g. "Joe's Roofing" -> "joes-roofing".
function toAttributionSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

/**
 * "Powered by Vizzion" link with UTM params so an inbound click is attributed to
 * the customer who drove it (utm_source) and to the surface it came from
 * (utm_medium, e.g. "preview" or "demo"). Falls back to a generic source when
 * the name can't be slugified.
 */
export function buildPoweredByUrl(companyName: string, medium: string = 'preview'): string {
  const params = new URLSearchParams({
    utm_source: toAttributionSlug(companyName) || 'customer',
    utm_medium: medium,
    utm_campaign: 'powered_by',
  });
  return `${VIZZION_SITE_URL}/?${params.toString()}`;
}
