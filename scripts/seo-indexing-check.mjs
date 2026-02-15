#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://vizzion.io';
const CHECKPOINT_DATE = '2026-02-26';
const MONITORED_PATHS = ['/', '/industries', '/industries/solar'];
const REDIRECT_EXPECTATIONS = [
  { from: 'http://vizzion.io/', toPrefix: 'https://vizzion.io/' },
  { from: 'https://www.vizzion.io/', toPrefix: 'https://vizzion.io/' },
];

function parseArgs(argv) {
  const args = { baseUrl: DEFAULT_BASE_URL, output: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base-url') {
      args.baseUrl = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--output') {
      args.output = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

function normalizeCanonical(urlString) {
  const parsed = new URL(urlString);
  parsed.search = '';
  parsed.hash = '';

  if (parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }

  return parsed.pathname === '/' ? parsed.origin : `${parsed.origin}${parsed.pathname}`;
}

function isRedirectStatus(status) {
  return status === 301 || status === 302 || status === 307 || status === 308;
}

function extractCanonicalHref(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!match) {
    return null;
  }

  const href = match[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function extractRobotsMetaContent(html) {
  const robotsTagMatches = [...html.matchAll(/<meta[^>]+name=["'](robots|googlebot)["'][^>]*>/gi)];
  return robotsTagMatches
    .map((entry) => entry[0].match(/content=["']([^"']+)["']/i))
    .filter(Boolean)
    .map((entry) => entry[1].toLowerCase());
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function formatCheck(check, index) {
  const status = check.passed ? 'PASS' : 'FAIL';
  return `${index + 1}. [${status}] ${check.name}\n   ${check.details}`;
}

async function fetchText(url, redirect = 'follow') {
  const response = await fetch(url, {
    redirect,
    headers: { 'user-agent': 'vizzion-seo-indexing-monitor/1.0' },
  });
  const body = await response.text();
  return { response, body };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const checks = [];

  const baseUrl = normalizeCanonical(args.baseUrl);
  const baseOrigin = new URL(baseUrl).origin;
  const baseHostname = new URL(baseUrl).hostname;

  for (const expectation of REDIRECT_EXPECTATIONS) {
    const { response } = await fetchText(expectation.from, 'manual');
    const location = response.headers.get('location') ?? '';
    const resolvedLocation = location ? new URL(location, expectation.from).toString() : '';
    const passed = isRedirectStatus(response.status) && resolvedLocation.startsWith(expectation.toPrefix);

    checks.push({
      name: `${expectation.from} redirects to canonical host`,
      passed,
      details: `status=${response.status}, location=${resolvedLocation || '(missing)'}`,
    });
  }

  for (const monitoredPath of MONITORED_PATHS) {
    const pageUrl = new URL(monitoredPath, `${baseOrigin}/`).toString();
    const expectedCanonical = normalizeCanonical(pageUrl);
    const { response, body } = await fetchText(pageUrl, 'follow');
    const xRobots = (response.headers.get('x-robots-tag') ?? '').toLowerCase();
    const metaRobots = extractRobotsMetaContent(body);
    const canonicalHref = extractCanonicalHref(body);
    const canonicalResolved = canonicalHref ? normalizeCanonical(new URL(canonicalHref, response.url).toString()) : null;
    const hasNoindex = xRobots.includes('noindex') || metaRobots.some((entry) => entry.includes('noindex'));
    const passed = response.status === 200 && canonicalResolved === expectedCanonical && !hasNoindex;

    checks.push({
      name: `${expectedCanonical} is indexable with self-canonical`,
      passed,
      details: `status=${response.status}, canonical=${canonicalResolved || '(missing)'}, expected=${expectedCanonical}, noindex=${hasNoindex}`,
    });
  }

  const sitemapUrl = `${baseOrigin}/sitemap.xml`;
  const { response: sitemapResponse, body: sitemapBody } = await fetchText(sitemapUrl, 'follow');
  const sitemapLocs = extractSitemapLocs(sitemapBody);
  const normalizedLocs = sitemapLocs.map((loc) => normalizeCanonical(loc));
  const uniqueLocs = new Set(normalizedLocs);

  const invalidLocs = sitemapLocs.filter((loc) => {
    try {
      const parsed = new URL(loc);
      return (
        parsed.protocol !== 'https:' ||
        parsed.hostname !== baseHostname ||
        parsed.search.length > 0 ||
        parsed.hash.length > 0
      );
    } catch {
      return true;
    }
  });

  const containsRequiredPages = MONITORED_PATHS.every((monitoredPath) => {
    const expected = normalizeCanonical(new URL(monitoredPath, `${baseOrigin}/`).toString());
    return uniqueLocs.has(expected);
  });

  checks.push({
    name: 'sitemap contains only canonical HTTPS vizzion.io URLs',
    passed:
      sitemapResponse.status === 200 &&
      sitemapLocs.length > 0 &&
      invalidLocs.length === 0 &&
      uniqueLocs.size === normalizedLocs.length &&
      containsRequiredPages,
    details: `status=${sitemapResponse.status}, url_count=${sitemapLocs.length}, invalid=${invalidLocs.length}, duplicates=${normalizedLocs.length - uniqueLocs.size}, required_urls_present=${containsRequiredPages}`,
  });

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const now = new Date();
  const checkpointReached = now >= new Date(`${CHECKPOINT_DATE}T00:00:00Z`);
  const renderedChecks = checks.map((check, index) => formatCheck(check, index)).join('\n');

  const report = [
    '# SEO Indexing Validation Report',
    '',
    `- Generated: ${now.toISOString()}`,
    `- Base URL: ${baseUrl}`,
    `- Checkpoint date: ${CHECKPOINT_DATE}`,
    `- Result: ${failedCount === 0 ? 'PASS' : 'FAIL'} (${passedCount}/${checks.length} checks passed)`,
    '',
    '## Automated Checks',
    renderedChecks,
    '',
    '## Manual Search Console Follow-up',
    '- Confirm `Duplicate without user-selected canonical` validation status is `Passed`.',
    '- If validation is still pending after the checkpoint date, run Live URL tests for:',
    '  - `https://vizzion.io/`',
    '  - `https://vizzion.io/industries`',
    '  - `https://vizzion.io/industries/solar`',
    '- Request indexing for any inspected URL that shows as not indexed.',
    '',
    checkpointReached
      ? `Checkpoint reached: if Search Console is still pending on or after ${CHECKPOINT_DATE}, re-run live tests and request indexing for any non-indexed URL.`
      : `Checkpoint not reached yet: continue monitoring every 2-3 days until ${CHECKPOINT_DATE}.`,
  ].join('\n');

  console.log(report);

  if (args.output) {
    const outputPath = path.resolve(args.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${report}\n`, 'utf8');
    console.log(`\nReport written to ${outputPath}`);
  }

  process.exit(failedCount === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(`SEO indexing check failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
