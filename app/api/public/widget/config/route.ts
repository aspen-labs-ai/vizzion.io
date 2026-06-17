import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import {
  isOriginAllowed,
  resolvePublicWidgetByIdentifier,
} from '@/lib/vizzion/widget-public';

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const embedKey = request.nextUrl.searchParams.get('embedKey')?.trim();
  const industrySlug = request.nextUrl.searchParams.get('industrySlug')?.trim() || null;
  const pageUrl = request.nextUrl.searchParams.get('pageUrl');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

  if (!embedKey && !industrySlug) {
    return publicJsonResponse({ error: 'embedKey or industrySlug is required.' }, 400, origin);
  }

  try {
    const supabase = createAdminClient();
    const widget = await resolvePublicWidgetByIdentifier(supabase, {
      embedKey,
      industrySlug,
      originHeader: origin,
      pageUrl,
    });

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
          embedKey: widget.embed_key,
          mode: widget.mode,
          theme: widget.theme,
          subjectType: widget.subject_type,
          brandColor: widget.brand_color,
          uiVersion: 'v2',
          requireEmail: widget.delivery_mode === 'email' || widget.require_email,
          deliveryMode: widget.delivery_mode,
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
