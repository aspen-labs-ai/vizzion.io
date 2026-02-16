import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import {
  createSignedStorageUrl,
  getWorkspaceWidgets,
  parseDateInputUtc,
} from '@/lib/vizzion/portfolio';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

const DAY_MS = 24 * 60 * 60 * 1000;

interface LeadRow {
  id: string;
  email: string;
  email_status: string;
  source_page: string | null;
  created_at: string;
  material_id: string | null;
  widget_id: string;
}

interface GenerationJobRow {
  id: string;
  lead_id: string | null;
  created_at: string;
}

interface GeneratedPreviewRow {
  generation_job_id: string;
  original_upload_path: string | null;
  generated_path: string | null;
}

function csvEscape(value: string | null | undefined): string {
  const raw = value ?? '';
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function normalizeQueryValue(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeIndustrySlug(value: string | null): string | null {
  const normalized = normalizeQueryValue(value);
  return normalized ? normalized.toLowerCase() : null;
}

function parseDateRangeParams(searchParams: URLSearchParams): {
  fromIso: string | null;
  toIso: string | null;
  fromInput: string | null;
  toInput: string | null;
  error: string | null;
} {
  const fromInput = normalizeQueryValue(searchParams.get('dateFrom'));
  const toInput = normalizeQueryValue(searchParams.get('dateTo'));

  const parsedFrom = fromInput ? parseDateInputUtc(fromInput) : null;
  if (fromInput && !parsedFrom) {
    return {
      fromIso: null,
      toIso: null,
      fromInput,
      toInput,
      error: 'Invalid dateFrom. Expected YYYY-MM-DD.',
    };
  }

  const parsedTo = toInput ? parseDateInputUtc(toInput) : null;
  if (toInput && !parsedTo) {
    return {
      fromIso: null,
      toIso: null,
      fromInput,
      toInput,
      error: 'Invalid dateTo. Expected YYYY-MM-DD.',
    };
  }

  const fromIso = parsedFrom ? parsedFrom.toISOString() : null;
  const toIso = parsedTo ? new Date(parsedTo.getTime() + DAY_MS).toISOString() : null;

  if (fromIso && toIso && fromIso >= toIso) {
    return {
      fromIso,
      toIso,
      fromInput,
      toInput,
      error: 'dateFrom must be on or before dateTo.',
    };
  }

  return {
    fromIso,
    toIso,
    fromInput,
    toInput,
    error: null,
  };
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const widgetIdFilter = normalizeQueryValue(request.nextUrl.searchParams.get('widgetId'));
  const industrySlugFilter = normalizeIndustrySlug(request.nextUrl.searchParams.get('industrySlug'));
  const dateRangeParams = parseDateRangeParams(request.nextUrl.searchParams);

  if (dateRangeParams.error) {
    return NextResponse.json({ error: dateRangeParams.error }, { status: 400 });
  }

  const admin = createAdminClient();
  const workspaceWidgets = await getWorkspaceWidgets(admin, context.workspace.id);
  const widgetById = new Map(workspaceWidgets.map(widget => [widget.id, widget]));

  if (widgetIdFilter && !widgetById.has(widgetIdFilter)) {
    return NextResponse.json({ error: 'widgetId is not in this workspace.' }, { status: 400 });
  }

  let filteredWidgetIds = workspaceWidgets.map(widget => widget.id);

  if (widgetIdFilter) {
    filteredWidgetIds = filteredWidgetIds.filter(widgetId => widgetId === widgetIdFilter);
  }

  if (industrySlugFilter) {
    const industryWidgetIds = workspaceWidgets
      .filter(widget =>
        industrySlugFilter === 'unmapped'
          ? widget.industrySlug === null
          : widget.industrySlug === industrySlugFilter,
      )
      .map(widget => widget.id);
    filteredWidgetIds = filteredWidgetIds.filter(widgetId => industryWidgetIds.includes(widgetId));
  }

  const headers = [
    'id',
    'email',
    'status',
    'widget_id',
    'widget_name',
    'industry_slug',
    'material',
    'source_page',
    'captured_at',
    'original_upload_path',
    'generated_preview_path',
    'generated_preview_signed_url',
    'signed_preview_url_expires_at',
  ];

  if (filteredWidgetIds.length === 0) {
    return new NextResponse(headers.join(','), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="vizzion-leads-${context.workspace.slug}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  let leadsQuery = admin
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id, widget_id')
    .eq('workspace_id', context.workspace.id)
    .in('widget_id', filteredWidgetIds)
    .order('created_at', { ascending: false });

  if (dateRangeParams.fromIso) {
    leadsQuery = leadsQuery.gte('created_at', dateRangeParams.fromIso);
  }

  if (dateRangeParams.toIso) {
    leadsQuery = leadsQuery.lt('created_at', dateRangeParams.toIso);
  }

  const leadsResult = await leadsQuery;

  if (leadsResult.error) {
    return NextResponse.json({ error: 'Unable to export leads.' }, { status: 500 });
  }

  const leads = (leadsResult.data ?? []) as LeadRow[];
  const leadIds = leads.map(lead => lead.id);

  const materialIds = Array.from(
    new Set(leads.map(lead => lead.material_id).filter((value): value is string => Boolean(value))),
  );

  let materialNameById = new Map<string, string>();

  if (materialIds.length > 0) {
    const materialsResult = await admin
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

  const latestJobByLeadId = new Map<string, string>();

  if (leadIds.length > 0) {
    const jobsResult = await admin
      .from('generation_jobs')
      .select('id, lead_id, created_at')
      .eq('workspace_id', context.workspace.id)
      .in('lead_id', leadIds)
      .order('created_at', { ascending: false });

    if (!jobsResult.error && jobsResult.data) {
      for (const job of jobsResult.data as GenerationJobRow[]) {
        if (!job.lead_id || latestJobByLeadId.has(job.lead_id)) {
          continue;
        }
        latestJobByLeadId.set(job.lead_id, job.id);
      }
    }
  }

  const previewByGenerationJobId = new Map<string, GeneratedPreviewRow>();
  const generationJobIds = Array.from(new Set(latestJobByLeadId.values()));

  if (generationJobIds.length > 0) {
    const previewsResult = await admin
      .from('generated_previews')
      .select('generation_job_id, original_upload_path, generated_path')
      .eq('workspace_id', context.workspace.id)
      .in('generation_job_id', generationJobIds);

    if (!previewsResult.error && previewsResult.data) {
      for (const preview of previewsResult.data as GeneratedPreviewRow[]) {
        previewByGenerationJobId.set(preview.generation_job_id, preview);
      }
    }
  }

  const generatedPaths = Array.from(
    new Set(
      Array.from(previewByGenerationJobId.values())
        .map(preview => preview.generated_path?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const signedPreviewUrlByPath = new Map<string, { url: string | null; expiresAt: string | null }>();

  await Promise.all(
    generatedPaths.map(async generatedPath => {
      const signed = await createSignedStorageUrl(admin, {
        bucket: 'renders-generated',
        path: generatedPath,
      });
      signedPreviewUrlByPath.set(generatedPath, signed);
    }),
  );

  const csvRows = [
    headers.join(','),
    ...leads.map(lead => {
      const widget = widgetById.get(lead.widget_id);
      const generationJobId = latestJobByLeadId.get(lead.id) ?? null;
      const preview = generationJobId ? previewByGenerationJobId.get(generationJobId) : null;
      const generatedPath = preview?.generated_path?.trim() || null;
      const signedUrl = generatedPath ? signedPreviewUrlByPath.get(generatedPath) : null;

      return [
        csvEscape(lead.id),
        csvEscape(lead.email),
        csvEscape(lead.email_status),
        csvEscape(lead.widget_id),
        csvEscape(widget?.name ?? ''),
        csvEscape(widget?.industrySlug ?? 'unmapped'),
        csvEscape(lead.material_id ? (materialNameById.get(lead.material_id) ?? '') : ''),
        csvEscape(lead.source_page),
        csvEscape(lead.created_at),
        csvEscape(preview?.original_upload_path ?? ''),
        csvEscape(preview?.generated_path ?? ''),
        csvEscape(signedUrl?.url ?? ''),
        csvEscape(signedUrl?.expiresAt ?? ''),
      ].join(',');
    }),
  ];

  return new NextResponse(csvRows.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizzion-leads-${context.workspace.slug}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
