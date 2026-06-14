import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { createSignedStorageUrl } from '@/lib/vizzion/portfolio';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  if (!isValidUuid(leadId)) {
    return NextResponse.json({ error: 'Invalid lead id.' }, { status: 400 });
  }

  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);
  if (!context) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const admin = createAdminClient();

  const leadResult = await admin
    .from('leads')
    .select('id, email, email_status, source_page, created_at, material_id, widget_id')
    .eq('id', leadId)
    .eq('workspace_id', context.workspace.id)
    .maybeSingle();

  if (leadResult.error || !leadResult.data) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  const lead = leadResult.data as {
    id: string;
    email: string;
    email_status: string;
    source_page: string | null;
    created_at: string;
    material_id: string | null;
    widget_id: string;
  };

  let materialName: string | null = null;
  if (lead.material_id) {
    const materialResult = await admin.from('materials').select('name').eq('id', lead.material_id).maybeSingle();
    materialName = (materialResult.data as { name: string } | null)?.name ?? null;
  }

  const previewResult = await admin
    .from('generated_previews')
    .select('original_upload_path, generated_path, created_at')
    .eq('lead_id', leadId)
    .eq('workspace_id', context.workspace.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const preview = previewResult.data as
    | { original_upload_path: string | null; generated_path: string | null }
    | null;

  const [original, generated] = await Promise.all([
    preview?.original_upload_path
      ? createSignedStorageUrl(admin, { bucket: 'uploads-original', path: preview.original_upload_path })
      : Promise.resolve({ url: null, expiresAt: null }),
    preview?.generated_path
      ? createSignedStorageUrl(admin, { bucket: 'renders-generated', path: preview.generated_path })
      : Promise.resolve({ url: null, expiresAt: null }),
  ]);

  return NextResponse.json({
    id: lead.id,
    email: lead.email,
    emailStatus: lead.email_status,
    materialName,
    sourcePage: lead.source_page,
    createdAt: lead.created_at,
    originalUrl: original.url,
    generatedUrl: generated.url,
    hasPreview: Boolean(generated.url),
  });
}
