import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

interface EventRequestBody {
  embedKey?: string;
  sessionId?: string | null;
  eventType?: string;
  eventData?: unknown;
  pageUrl?: string;
}

function isValidEventType(value: string): boolean {
  return /^[a-zA-Z0-9_.:-]{1,80}$/.test(value);
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  let body: EventRequestBody;
  try {
    body = (await request.json()) as EventRequestBody;
  } catch {
    return publicJsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
  }

  const embedKey = body.embedKey?.trim();
  const eventType = body.eventType?.trim();
  const pageUrl = body.pageUrl?.trim();
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : null;

  if (!embedKey || !eventType) {
    return publicJsonResponse({ error: 'embedKey and eventType are required.' }, 400, origin);
  }

  if (!isValidEventType(eventType)) {
    return publicJsonResponse({ error: 'Invalid eventType format.' }, 400, origin);
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

    const eventData =
      body.eventData && typeof body.eventData === 'object' ? body.eventData : { value: body.eventData };

    const insertResult = await supabase.from('widget_events').insert({
      workspace_id: widget.workspace_id,
      widget_id: widget.id,
      session_id: sessionId,
      event_type: eventType,
      event_data: {
        ...eventData,
        pageUrl,
      },
    });

    if (insertResult.error) {
      return publicJsonResponse({ error: 'Unable to record event.' }, 500, origin);
    }

    return publicJsonResponse({ ok: true }, 200, origin);
  } catch {
    return publicJsonResponse({ error: 'Unable to record event.' }, 500, origin);
  }
}
