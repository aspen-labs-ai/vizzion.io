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
