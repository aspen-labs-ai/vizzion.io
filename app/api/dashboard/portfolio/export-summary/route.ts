import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  getPortfolioIndustryBreakdown,
  getPortfolioTotals,
  getPortfolioWidgetBreakdown,
  getWorkspaceWidgets,
  resolvePortfolioDateRange,
} from '@/lib/vizzion/portfolio';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

function csvEscape(value: string | null | undefined): string {
  const raw = value ?? '';
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function getSingleQueryValue(value: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dateRange = resolvePortfolioDateRange({
    dateFrom: getSingleQueryValue(request.nextUrl.searchParams.get('dateFrom')),
    dateTo: getSingleQueryValue(request.nextUrl.searchParams.get('dateTo')),
  });

  const admin = createAdminClient();
  const widgets = await getWorkspaceWidgets(admin, context.workspace.id);
  const widgetRows = await getPortfolioWidgetBreakdown({
    supabase: admin,
    workspaceId: context.workspace.id,
    dateRange,
    widgets,
  });

  const totals = getPortfolioTotals(widgetRows);
  const industryRows = getPortfolioIndustryBreakdown(widgetRows);

  const headers = [
    'record_type',
    'workspace_slug',
    'date_from',
    'date_to',
    'widget_id',
    'widget_name',
    'industry_slug',
    'sessions',
    'uploads',
    'leads',
    'succeeded_previews',
    'session_to_lead_conversion_percent',
    'session_to_preview_conversion_percent',
    'block_rate_percent',
    'queued_jobs',
  ];

  const csvRows = [headers.join(',')];

  const totalRow = [
    'totals',
    context.workspace.slug,
    dateRange.fromInput,
    dateRange.toInput,
    '',
    '',
    '',
    totals.sessions.toString(),
    totals.uploads.toString(),
    totals.leads.toString(),
    totals.succeededPreviews.toString(),
    totals.sessionToLeadConversionPercent.toFixed(4),
    totals.sessionToPreviewConversionPercent.toFixed(4),
    totals.blockRatePercent.toFixed(4),
    totals.queuedJobs.toString(),
  ];
  csvRows.push(totalRow.map(csvEscape).join(','));

  for (const row of widgetRows) {
    const widgetRow = [
      'widget',
      context.workspace.slug,
      dateRange.fromInput,
      dateRange.toInput,
      row.widgetId,
      row.widgetName,
      row.industrySlug ?? '',
      row.sessions.toString(),
      row.uploads.toString(),
      row.leads.toString(),
      row.succeededPreviews.toString(),
      row.conversionPercent.toFixed(4),
      row.sessions > 0 ? ((row.succeededPreviews / row.sessions) * 100).toFixed(4) : '0.0000',
      row.blockRatePercent.toFixed(4),
      row.queuedJobs.toString(),
    ];
    csvRows.push(widgetRow.map(csvEscape).join(','));
  }

  for (const row of industryRows) {
    const industryRow = [
      'industry',
      context.workspace.slug,
      dateRange.fromInput,
      dateRange.toInput,
      row.widgetId,
      row.widgetName,
      row.industrySlug,
      row.sessions.toString(),
      row.uploads.toString(),
      row.leads.toString(),
      row.previews.toString(),
      row.conversionPercent.toFixed(4),
      row.sessions > 0 ? ((row.previews / row.sessions) * 100).toFixed(4) : '0.0000',
      '',
      '',
    ];
    csvRows.push(industryRow.map(csvEscape).join(','));
  }

  return new NextResponse(csvRows.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizzion-portfolio-summary-${context.workspace.slug}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
