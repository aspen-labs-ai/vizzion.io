import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

function csvEscape(value: string | null | undefined): string {
  const raw = value ?? '';
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export async function GET() {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leadsResult = await supabase
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id')
    .eq('widget_id', context.widget.id)
    .order('created_at', { ascending: false });

  if (leadsResult.error) {
    return NextResponse.json({ error: 'Unable to export leads.' }, { status: 500 });
  }

  const leads = (leadsResult.data ?? []) as Array<{
    id: string;
    email: string;
    email_status: string;
    source_page: string | null;
    created_at: string;
    material_id: string | null;
  }>;

  const materialIds = Array.from(
    new Set(leads.map(lead => lead.material_id).filter((value): value is string => Boolean(value))),
  );

  let materialNameById = new Map<string, string>();

  if (materialIds.length > 0) {
    const materialsResult = await supabase
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

  const rows = [
    ['id', 'email', 'status', 'material', 'source_page', 'captured_at'].join(','),
    ...leads.map(lead =>
      [
        csvEscape(lead.id),
        csvEscape(lead.email),
        csvEscape(lead.email_status),
        csvEscape(lead.material_id ? (materialNameById.get(lead.material_id) ?? '') : ''),
        csvEscape(lead.source_page),
        csvEscape(lead.created_at),
      ].join(','),
    ),
  ];

  const csv = rows.join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vizzion-leads-${context.workspace.slug}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
