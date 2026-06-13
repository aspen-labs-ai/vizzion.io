import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse } from '@/lib/vizzion/cors';
import { resolvePublicWidget } from '@/lib/vizzion/widget-public';
import { OPTIONS as generateOptions, POST as generatePost } from '../generate/route';

interface GenerateEmailShimBody {
  embedKey?: string;
  email?: string;
  sessionId?: string | null;
  sessionToken?: string | null;
  captchaToken?: string | null;
  materialId?: string | null;
  sourcePage?: string | null;
  uploadId?: string | null;
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function resolveLatestUploadIdBySession(params: {
  embedKey: string;
  sessionId: string | null;
}): Promise<{ uploadId: string | null; widgetMissing: boolean }> {
  const invalidUploadLookup = { uploadId: null, widgetMissing: false };

  const supabase = createAdminClient();
  const widget = await resolvePublicWidget(supabase, params.embedKey);

  if (!widget) {
    return { uploadId: null, widgetMissing: true };
  }

  if (!params.sessionId || !isValidUuid(params.sessionId)) {
    return invalidUploadLookup;
  }

  const uploadResult = await supabase
    .from('widget_uploads')
    .select('id')
    .eq('widget_id', widget.id)
    .eq('session_id', params.sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (uploadResult.error || !uploadResult.data?.id) {
    return invalidUploadLookup;
  }

  return { uploadId: uploadResult.data.id, widgetMissing: false };
}

function cloneHeadersWithJsonContentType(request: NextRequest): Headers {
  const nextHeaders = new Headers();

  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-length') {
      return;
    }

    nextHeaders.set(key, value);
  });

  nextHeaders.set('content-type', 'application/json');
  return nextHeaders;
}

export async function OPTIONS(request: NextRequest) {
  return generateOptions(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  let body: GenerateEmailShimBody;
  try {
    body = (await request.json()) as GenerateEmailShimBody;
  } catch {
    return publicJsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
  }

  const embedKey = body.embedKey?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() ?? '';
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : null;
  const uploadId = typeof body.uploadId === 'string' ? body.uploadId.trim() : '';

  if (!embedKey || !email) {
    return publicJsonResponse({ error: 'embedKey and email are required.' }, 400, origin);
  }

  const uploadLookup = uploadId
    ? { uploadId, widgetMissing: false }
    : await resolveLatestUploadIdBySession({ embedKey, sessionId });

  if (uploadLookup.widgetMissing) {
    return publicJsonResponse({ error: 'Widget not found.' }, 404, origin);
  }

  const resolvedUploadId = uploadLookup.uploadId;

  if (!resolvedUploadId) {
    return publicJsonResponse(
      {
        code: 'upload_required',
        error: 'uploadId is required. Upload an image before requesting generation.',
      },
      400,
      origin,
    );
  }

  const payload = {
    ...body,
    embedKey,
    email,
    uploadId: resolvedUploadId,
    captureOnly: false,
  };

  const proxiedRequest = new NextRequest(
    new Request(request.url, {
      method: 'POST',
      headers: cloneHeadersWithJsonContentType(request),
      body: JSON.stringify(payload),
    }),
  );

  return generatePost(proxiedRequest);
}
