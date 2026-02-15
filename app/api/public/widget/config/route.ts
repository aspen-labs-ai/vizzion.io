import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const embedKey = request.nextUrl.searchParams.get('embedKey')?.trim();
  const pageUrl = request.nextUrl.searchParams.get('pageUrl');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

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

    return publicJsonResponse(
      {
        widget: {
          id: widget.id,
          name: widget.name,
          mode: widget.mode,
          theme: widget.theme,
          requireEmail: widget.require_email,
          autoOpenWidget: widget.auto_open_widget,
          showProductNames: widget.show_product_names,
          maxGenerationsPerSession: widget.max_generations_per_session,
          maxGenerationsPerEmailLifetime: widget.max_generations_per_email_lifetime,
          limitReachedCtaUrl: widget.limit_reached_cta_url,
          materials: widget.materials,
        },
        turnstileSiteKey,
      },
      200,
      origin,
    );
  } catch {
    return publicJsonResponse({ error: 'Unable to load widget config.' }, 500, origin);
  }
}
