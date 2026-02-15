const SITE_URL = 'https://vizzion.io';

export function getCanonicalUrl(pathname: string): string {
  const prefixedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (prefixedPath === '/') {
    return `${SITE_URL}/`;
  }

  const normalizedPath = prefixedPath.replace(/\/+$/, '');
  return `${SITE_URL}${normalizedPath}`;
}
