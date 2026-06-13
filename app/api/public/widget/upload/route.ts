import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function guessExtension(file: File): string {
  if (file.type === 'image/jpeg') {
    return 'jpg';
  }
  if (file.type === 'image/png') {
    return 'png';
  }
  if (file.type === 'image/webp') {
    return 'webp';
  }

  const name = file.name.trim().toLowerCase();
  const ext = name.split('.').pop();
  if (ext && /^[a-z0-9]{2,8}$/.test(ext)) {
    return ext;
  }

  return 'bin';
}

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return publicJsonResponse({ error: 'Invalid multipart body.' }, 400, origin);
  }

  const embedKey = getFormString(formData, 'embedKey');
  const pageUrl = getFormString(formData, 'pageUrl') || getFormString(formData, 'sourcePage') || null;
  const sessionIdInput = getFormString(formData, 'sessionId');
  const sessionId = sessionIdInput || null;
  const fileValue = formData.get('file');

  if (!embedKey) {
    return publicJsonResponse({ error: 'embedKey is required.' }, 400, origin);
  }

  if (!(fileValue instanceof File)) {
    return publicJsonResponse({ error: 'file is required.' }, 400, origin);
  }

  if (!ALLOWED_MIME_TYPES.has(fileValue.type)) {
    return publicJsonResponse(
      {
        error: 'Unsupported file type. Use JPG, PNG, or WebP.',
      },
      400,
      origin,
    );
  }

  if (fileValue.size < 1 || fileValue.size > MAX_UPLOAD_BYTES) {
    return publicJsonResponse(
      {
        error: 'File must be between 1 byte and 10 MB.',
      },
      400,
      origin,
    );
  }

  if (sessionId && !isValidUuid(sessionId)) {
    return publicJsonResponse({ error: 'Invalid sessionId.' }, 400, origin);
  }

  try {
    const supabase = createAdminClient();
    const widget = await resolvePublicWidget(supabase, embedKey);

    if (!widget) {
      return publicJsonResponse({ error: 'Widget not found.' }, 404, origin);
    }

    if (!isOriginAllowed(widget.domain_allowlist, origin, pageUrl)) {
      return publicJsonResponse({ error: 'Origin not allowed.' }, 403, origin);
    }

    if (sessionId) {
      const sessionResult = await supabase
        .from('widget_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('widget_id', widget.id)
        .maybeSingle();

      if (sessionResult.error || !sessionResult.data) {
        return publicJsonResponse({ error: 'Session not found for widget.' }, 400, origin);
      }
    }

    const extension = guessExtension(fileValue);
    const storagePath = `${widget.workspace_id}/${widget.id}/${sessionId ?? 'anon'}/${Date.now()}-${randomUUID()}.${extension}`;
    const fileBuffer = Buffer.from(await fileValue.arrayBuffer());

    const uploadResult = await supabase.storage
      .from('uploads-original')
      .upload(storagePath, fileBuffer, {
        contentType: fileValue.type,
        upsert: false,
      });

    if (uploadResult.error) {
      return publicJsonResponse({ error: 'Unable to upload file.' }, 500, origin);
    }

    const insertResult = await supabase
      .from('widget_uploads')
      .insert({
        workspace_id: widget.workspace_id,
        widget_id: widget.id,
        session_id: sessionId,
        storage_path: storagePath,
        mime_type: fileValue.type,
        file_size_bytes: fileValue.size,
      })
      .select('id')
      .single();

    if (insertResult.error || !insertResult.data) {
      await supabase.storage.from('uploads-original').remove([storagePath]);
      return publicJsonResponse({ error: 'Unable to record upload.' }, 500, origin);
    }

    return publicJsonResponse(
      {
        upload: {
          id: insertResult.data.id,
          storagePath,
          mimeType: fileValue.type,
          fileSizeBytes: fileValue.size,
        },
      },
      201,
      origin,
    );
  } catch {
    return publicJsonResponse({ error: 'Unable to process upload.' }, 500, origin);
  }
}
