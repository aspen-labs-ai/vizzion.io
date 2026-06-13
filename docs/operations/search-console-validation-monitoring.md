# Search Console Validation Monitoring

This runbook implements the indexing closure plan for `vizzion.io`.

## Current Status

- `REQUEST INDEXING`: completed.
- `VALIDATE FIX`: completed.
- Search Console validation started: February 12, 2026.

## Monitoring Cadence

Run automated checks every 2-3 days until Search Console marks the issue as passed.

Local run:

```bash
npm run seo:indexing-check
```

Local run with a saved report:

```bash
npm run seo:indexing-check -- --output reports/seo-indexing-report.md
```

GitHub Actions also runs every 3 days using:

- `.github/workflows/seo-indexing-monitor.yml`

## What the Automated Check Verifies

- Redirects are correct:
  - `http://vizzion.io/*` -> `https://vizzion.io/*`
  - `https://www.vizzion.io/*` -> `https://vizzion.io/*`
- Legacy URL behavior:
  - `https://vizzion.io/industries/tattoos` -> `https://vizzion.io/industries`
- Every URL listed in `sitemap.xml` is indexable and self-canonical (`200`, no `noindex`, canonical points to itself)
- `sitemap.xml` contains only canonical HTTPS non-www URLs with no query/hash duplicates.

## Checkpoint Rule (February 26, 2026)

If Search Console validation is still pending beyond February 26, 2026:

1. Run a live URL test in Search Console for:
   - `https://vizzion.io/`
   - `https://vizzion.io/industries`
   - `https://vizzion.io/industries/solar`
2. Request indexing for any URL that reports not indexed.
3. Continue monitoring every 2-3 days.

## Failure Handling

If the automated script fails or Search Console reports a failed URL:

1. Inspect the exact failed URL in Search Console.
2. Confirm it returns `200` (or one intentional redirect).
3. Confirm no `noindex` in response headers or HTML meta tags.
4. Confirm the page has self-canonical `https://vizzion.io/...`.
5. Confirm the URL appears in `sitemap.xml` only in canonical form.
6. Confirm there are no internal links pointing at retired URLs (for example `/industries/tattoos`).
7. Re-run indexing check:

```bash
npm run seo:indexing-check
```

8. Re-click `VALIDATE FIX` after correction.
