import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

interface SessionRequestBody {
  embedKey?: string;
  pageUrl?: string;
  referrer?: string;
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  return request.headers.get('x-real-ip');
}

function hashIp(ip: string | null): string | null {
  if (!ip) {
    return null;
  }

  const salt = process.env.WIDGET_IP_HASH_SALT ?? 'vizzion-widget-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  let body: SessionRequestBody;
  try {
    body = (await request.json()) as SessionRequestBody;
  } catch {
    return publicJsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
  }

  const embedKey = body.embedKey?.trim();
  const pageUrl = body.pageUrl?.trim() || null;
  const referrer = body.referrer?.trim() || request.headers.get('referer');

  if (!embedKey) {
    return publicJsonResponse({ error: 'embedKey is required.' }, 400, origin);
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

    const sessionResult = await supabase
      .from('widget_sessions')
      .insert({
        workspace_id: widget.workspace_id,
        widget_id: widget.id,
        page_url: pageUrl,
        referrer,
        user_agent: request.headers.get('user-agent'),
        ip_hash: hashIp(getClientIp(request)),
      })
      .select('id, session_token, started_at')
      .single();

    if (sessionResult.error || !sessionResult.data) {
      return publicJsonResponse({ error: 'Unable to create widget session.' }, 500, origin);
    }

    await supabase.from('widget_events').insert({
      workspace_id: widget.workspace_id,
      widget_id: widget.id,
      session_id: sessionResult.data.id,
      event_type: 'session_started',
      event_data: {
        pageUrl,
        referrer,
      },
    });

    return publicJsonResponse(
      {
        session: {
          id: sessionResult.data.id,
          token: sessionResult.data.session_token,
          startedAt: sessionResult.data.started_at,
        },
      },
      201,
      origin,
    );
  } catch {
    return publicJsonResponse({ error: 'Unable to create session.' }, 500, origin);
  }
}
