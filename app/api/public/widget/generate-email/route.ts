import { createHash } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  mapConsumedVisualizationQuotaResult,
  notifyUsageThresholdAlerts,
} from '@/lib/vizzion/billing';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

interface GenerateEmailRequestBody {
  embedKey?: string;
  email?: string;
  sessionId?: string | null;
  sessionToken?: string | null;
  captchaToken?: string | null;
  materialId?: string | null;
  sourcePage?: string | null;
}

type LimitBlockReason = 'session_cap' | 'email_cap' | 'ip_hour_cap' | 'ip_day_cap';

interface GenerationLimitSummary {
  session: { used: number; limit: number } | null;
  emailLifetime: { used: number; limit: number } | null;
  ipHourly: { used: number; limit: number };
  ipDaily: { used: number; limit: number };
}

const IP_HOURLY_LIMIT = 12;
const IP_DAILY_LIMIT = 30;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toCount(value: number | null): number {
  return typeof value === 'number' ? value : 0;
}

function getSinceIso(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
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

function hasConfiguredGenerationCap(widget: {
  max_generations_per_session: number | null;
  max_generations_per_email_lifetime: number | null;
}): boolean {
  return (
    typeof widget.max_generations_per_session === 'number'
    || typeof widget.max_generations_per_email_lifetime === 'number'
  );
}

function buildLimitSummary(params: {
  sessionUsed: number;
  sessionLimit: number | null;
  emailUsed: number;
  emailLimit: number | null;
  ipHourUsed: number;
  ipDayUsed: number;
}): GenerationLimitSummary {
  return {
    session:
      typeof params.sessionLimit === 'number'
        ? {
            used: params.sessionUsed,
            limit: params.sessionLimit,
          }
        : null,
    emailLifetime:
      typeof params.emailLimit === 'number'
        ? {
            used: params.emailUsed,
            limit: params.emailLimit,
          }
        : null,
    ipHourly: {
      used: params.ipHourUsed,
      limit: IP_HOURLY_LIMIT,
    },
    ipDaily: {
      used: params.ipDayUsed,
      limit: IP_DAILY_LIMIT,
    },
  };
}

function buildLeadEmailHtml(): string {
  return `<div style="font-family:Arial,sans-serif;background:#0d1117;color:#f9fafb;padding:24px;line-height:1.5;">
    <h2 style="margin:0 0 12px;color:#10B981;">Thanks for trying Vizzion</h2>
    <p style="margin:0 0 10px;">We received your visualization request. Your preview is being generated now.</p>
    <p style="margin:0;color:#9ca3af;font-size:14px;">You will receive the final result by email shortly.</p>
  </div>`;
}

function escapeSqlLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, match => `\\${match}`);
}

async function verifyTurnstileToken(
  captchaToken: string,
  turnstileSecret: string,
  clientIp: string | null,
): Promise<boolean> {
  const payload = new URLSearchParams({
    secret: turnstileSecret,
    response: captchaToken,
  });

  if (clientIp) {
    payload.set('remoteip', clientIp);
  }

  try {
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload.toString(),
      },
    );

    if (!verificationResponse.ok) {
      return false;
    }

    const verificationPayload = (await verificationResponse.json()) as {
      success?: boolean;
    };

    return verificationPayload.success === true;
  } catch {
    return false;
  }
}

async function countGenerationJobsForSession(
  supabase: SupabaseClient,
  widgetId: string,
  sessionId: string,
): Promise<number> {
  const countResult = await supabase
    .from('generation_jobs')
    .select('*', { head: true, count: 'exact' })
    .eq('widget_id', widgetId)
    .eq('session_id', sessionId);

  if (countResult.error) {
    throw new Error('Unable to count generation jobs by session.');
  }

  return toCount(countResult.count);
}

async function countGenerationJobsForEmail(
  supabase: SupabaseClient,
  widgetId: string,
  email: string,
): Promise<number> {
  const leadResult = await supabase
    .from('leads')
    .select('id')
    .eq('widget_id', widgetId)
    .ilike('email', escapeSqlLikePattern(email));

  if (leadResult.error) {
    throw new Error('Unable to load leads for email limit check.');
  }

  const leadIds = (leadResult.data ?? [])
    .map(row => row.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  if (leadIds.length === 0) {
    return 0;
  }

  const generationResult = await supabase
    .from('generation_jobs')
    .select('*', { head: true, count: 'exact' })
    .eq('widget_id', widgetId)
    .in('lead_id', leadIds);

  if (generationResult.error) {
    throw new Error('Unable to count generation jobs for email limit check.');
  }

  return toCount(generationResult.count);
}

async function countGenerationJobsForIp(
  supabase: SupabaseClient,
  widgetId: string,
  ipHash: string,
): Promise<{ hour: number; day: number }> {
  const sessionsResult = await supabase
    .from('widget_sessions')
    .select('id')
    .eq('widget_id', widgetId)
    .eq('ip_hash', ipHash);

  if (sessionsResult.error) {
    throw new Error('Unable to load sessions for IP throttling.');
  }

  const sessionIds = (sessionsResult.data ?? [])
    .map(row => row.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  if (sessionIds.length === 0) {
    return { hour: 0, day: 0 };
  }

  const sinceHour = getSinceIso(1);
  const sinceDay = getSinceIso(24);

  const [hourResult, dayResult] = await Promise.all([
    supabase
      .from('generation_jobs')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', widgetId)
      .in('session_id', sessionIds)
      .gte('created_at', sinceHour),
    supabase
      .from('generation_jobs')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', widgetId)
      .in('session_id', sessionIds)
      .gte('created_at', sinceDay),
  ]);

  if (hourResult.error || dayResult.error) {
    throw new Error('Unable to count generation jobs for IP throttling.');
  }

  return {
    hour: toCount(hourResult.count),
    day: toCount(dayResult.count),
  };
}

async function recordGenerationLimitBlockedEvent(params: {
  supabase: SupabaseClient;
  workspaceId: string;
  widgetId: string;
  sessionId: string;
  leadId: string;
  materialId: string | null;
  sourcePage: string | null;
  reason: LimitBlockReason;
  limits: GenerationLimitSummary;
}) {
  await params.supabase.from('widget_events').insert({
    workspace_id: params.workspaceId,
    widget_id: params.widgetId,
    session_id: params.sessionId,
    event_type: 'generation_limit_blocked',
    event_data: {
      reason: params.reason,
      leadId: params.leadId,
      materialId: params.materialId,
      sourcePage: params.sourcePage,
      limits: params.limits,
    },
  });
}

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  let body: GenerateEmailRequestBody;
  try {
    body = (await request.json()) as GenerateEmailRequestBody;
  } catch {
    return publicJsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
  }

  const embedKey = body.embedKey?.trim();
  const email = body.email?.trim().toLowerCase();
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : null;
  const sessionToken = typeof body.sessionToken === 'string' ? body.sessionToken.trim() : null;
  const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken.trim() : null;
  const materialId = typeof body.materialId === 'string' ? body.materialId.trim() : null;
  const sourcePage = typeof body.sourcePage === 'string' ? body.sourcePage.trim() : null;

  if (!embedKey || !email) {
    return publicJsonResponse({ error: 'embedKey and email are required.' }, 400, origin);
  }

  if (!isValidEmail(email)) {
    return publicJsonResponse({ error: 'Invalid email address.' }, 400, origin);
  }

  if (sessionId && !isValidUuid(sessionId)) {
    return publicJsonResponse({ error: 'Invalid sessionId.' }, 400, origin);
  }

  if (materialId && !isValidUuid(materialId)) {
    return publicJsonResponse({ error: 'Invalid materialId.' }, 400, origin);
  }

  try {
    const supabase = createAdminClient();
    const widget = await resolvePublicWidget(supabase, embedKey);

    if (!widget) {
      return publicJsonResponse({ error: 'Widget not found.' }, 404, origin);
    }

    if (!isOriginAllowed(widget.domain_allowlist, origin, sourcePage)) {
      return publicJsonResponse({ error: 'Origin not allowed.' }, 403, origin);
    }

    if (materialId && !widget.materials.some(material => material.id === materialId)) {
      return publicJsonResponse({ error: 'Material does not belong to widget.' }, 400, origin);
    }

    const cappedWidget = hasConfiguredGenerationCap(widget);
    const clientIp = getClientIp(request);
    let ipHashForRateLimit: string | null = null;

    if (cappedWidget) {
      if (!sessionId || !sessionToken) {
        return publicJsonResponse(
          {
            code: 'invalid_session',
            error: 'sessionId and sessionToken are required for this widget.',
          },
          401,
          origin,
        );
      }

      const sessionResult = await supabase
        .from('widget_sessions')
        .select('id, session_token')
        .eq('id', sessionId)
        .eq('widget_id', widget.id)
        .maybeSingle();

      if (
        sessionResult.error
        || !sessionResult.data
        || sessionResult.data.session_token !== sessionToken
      ) {
        return publicJsonResponse(
          {
            code: 'invalid_session',
            error: 'Invalid session credentials.',
          },
          401,
          origin,
        );
      }

      if (!captchaToken) {
        return publicJsonResponse(
          {
            code: 'captcha_required',
            error: 'captchaToken is required for this widget.',
          },
          400,
          origin,
        );
      }

      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
      if (!turnstileSecret) {
        return publicJsonResponse({ error: 'Turnstile is not configured.' }, 500, origin);
      }

      const captchaVerified = await verifyTurnstileToken(captchaToken, turnstileSecret, clientIp);
      if (!captchaVerified) {
        return publicJsonResponse(
          {
            code: 'captcha_failed',
            error: 'Captcha verification failed.',
          },
          400,
          origin,
        );
      }

      ipHashForRateLimit = hashIp(clientIp);
      if (!ipHashForRateLimit) {
        return publicJsonResponse(
          {
            error: 'Unable to determine client IP for throttling.',
          },
          400,
          origin,
        );
      }
    }

    let leadResult;

    if (sessionId) {
      leadResult = await supabase
        .from('leads')
        .upsert(
          {
            workspace_id: widget.workspace_id,
            widget_id: widget.id,
            session_id: sessionId,
            material_id: materialId,
            email,
            source_page: sourcePage,
            email_status: 'submitted',
          },
          { onConflict: 'widget_id,session_id,email' },
        )
        .select('id, email_status')
        .single();
    } else {
      leadResult = await supabase
        .from('leads')
        .insert({
          workspace_id: widget.workspace_id,
          widget_id: widget.id,
          material_id: materialId,
          email,
          source_page: sourcePage,
          email_status: 'submitted',
        })
        .select('id, email_status')
        .single();
    }

    if (leadResult.error || !leadResult.data) {
      return publicJsonResponse({ error: 'Unable to capture lead.' }, 500, origin);
    }

    const lead = leadResult.data as { id: string; email_status: string };
    const leadSubmittedEventPayload = {
      workspace_id: widget.workspace_id,
      widget_id: widget.id,
      session_id: sessionId,
      event_type: 'lead_submitted',
      event_data: {
        leadId: lead.id,
        materialId,
        sourcePage,
      },
    };

    await supabase.from('widget_events').insert(leadSubmittedEventPayload);

    if (cappedWidget && sessionId && ipHashForRateLimit) {
      const [sessionGenerationCount, emailGenerationCount, ipGenerationCounts] = await Promise.all([
        countGenerationJobsForSession(supabase, widget.id, sessionId),
        countGenerationJobsForEmail(supabase, widget.id, email),
        countGenerationJobsForIp(supabase, widget.id, ipHashForRateLimit),
      ]);

      const limits = buildLimitSummary({
        sessionUsed: sessionGenerationCount,
        sessionLimit: widget.max_generations_per_session,
        emailUsed: emailGenerationCount,
        emailLimit: widget.max_generations_per_email_lifetime,
        ipHourUsed: ipGenerationCounts.hour,
        ipDayUsed: ipGenerationCounts.day,
      });

      let reason: LimitBlockReason | null = null;
      if (
        typeof widget.max_generations_per_session === 'number'
        && sessionGenerationCount >= widget.max_generations_per_session
      ) {
        reason = 'session_cap';
      } else if (
        typeof widget.max_generations_per_email_lifetime === 'number'
        && emailGenerationCount >= widget.max_generations_per_email_lifetime
      ) {
        reason = 'email_cap';
      } else if (ipGenerationCounts.hour >= IP_HOURLY_LIMIT) {
        reason = 'ip_hour_cap';
      } else if (ipGenerationCounts.day >= IP_DAILY_LIMIT) {
        reason = 'ip_day_cap';
      }

      if (reason) {
        await recordGenerationLimitBlockedEvent({
          supabase,
          workspaceId: widget.workspace_id,
          widgetId: widget.id,
          sessionId,
          leadId: lead.id,
          materialId,
          sourcePage,
          reason,
          limits,
        });

        return publicJsonResponse(
          {
            code: 'generation_limit_reached',
            reason,
            message: 'Generation limit reached. Contact us for additional previews.',
            contactCtaUrl: widget.limit_reached_cta_url,
            limits,
            leadCaptured: true,
            lead: {
              id: lead.id,
              emailStatus: lead.email_status,
            },
          },
          429,
          origin,
        );
      }
    }

    const quotaConsumptionResult = await supabase.rpc('consume_visualization_quota', {
      workspace_uuid: widget.workspace_id,
      units: 1,
    });
    const quotaState = mapConsumedVisualizationQuotaResult(quotaConsumptionResult.data);

    if (quotaConsumptionResult.error || !quotaState) {
      return publicJsonResponse({ error: 'Unable to process usage quota.' }, 500, origin);
    }

    const subscriptionResult = await supabase
      .from('workspace_subscriptions')
      .select('plan_code')
      .eq('workspace_id', widget.workspace_id)
      .maybeSingle();
    const planCode = (subscriptionResult.data as { plan_code: string } | null)?.plan_code ?? null;
    const freePlanOverageBlocked = planCode === 'free' && quotaState.within_overage;

    if (quotaState.blocked || !quotaState.allowed || freePlanOverageBlocked) {
      await Promise.all([
        supabase
          .from('leads')
          .update({
            email_status: 'blocked_quota',
          })
          .eq('id', lead.id),
        supabase.from('widget_events').insert({
          workspace_id: widget.workspace_id,
          widget_id: widget.id,
          session_id: sessionId,
          event_type: 'generation_blocked_quota',
          event_data: {
            leadId: lead.id,
            materialId,
            sourcePage,
            used: quotaState.used_units,
            quota: quotaState.base_quota_units,
            overageCap: quotaState.overage_cap_units,
            totalQuota: quotaState.total_quota_units,
            planCode,
            freePlanOverageBlocked,
            periodEnd: quotaState.period_end,
          },
        }),
      ]);

      return publicJsonResponse(
        {
          code: 'quota_exceeded',
          message:
            planCode === 'free'
              ? 'Free plan limit reached for this billing cycle. Upgrade to a paid plan to continue generating visualizations.'
              : 'Usage quota exceeded for the current billing cycle.',
          periodEndsAt: quotaState.period_end,
          used: quotaState.used_units,
          quota: quotaState.base_quota_units,
          overageCap: quotaState.overage_cap_units,
          totalQuota: quotaState.total_quota_units,
          leadCaptured: true,
          lead: {
            id: lead.id,
            emailStatus: 'blocked_quota',
          },
        },
        429,
        origin,
      );
    }

    const generationResult = await supabase
      .from('generation_jobs')
      .insert({
        workspace_id: widget.workspace_id,
        widget_id: widget.id,
        session_id: sessionId,
        lead_id: lead.id,
        status: 'queued',
        provider: 'gemini',
      })
      .select('id, status')
      .single();

    if (generationResult.error || !generationResult.data) {
      await Promise.all([
        supabase
          .from('leads')
          .update({
            email_status: 'failed',
          })
          .eq('id', lead.id),
        supabase.from('widget_events').insert({
          workspace_id: widget.workspace_id,
          widget_id: widget.id,
          session_id: sessionId,
          event_type: 'generation_enqueue_failed',
          event_data: {
            leadId: lead.id,
            materialId,
            sourcePage,
            error: generationResult.error?.message ?? 'enqueue_failed',
          },
        }),
      ]);

      return publicJsonResponse(
        {
          code: 'generation_unavailable',
          message: 'Unable to queue visualization right now. Please try again shortly.',
          leadCaptured: true,
          lead: {
            id: lead.id,
            emailStatus: 'failed',
          },
        },
        503,
        origin,
      );
    }

    let emailStatus = lead.email_status;

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;

    if (resendApiKey && resendFromEmail) {
      const resend = new Resend(resendApiKey);

      const emailResult = await resend.emails.send({
        from: resendFromEmail,
        to: [email],
        subject: 'Your Vizzion request is in progress',
        html: buildLeadEmailHtml(),
      });

      emailStatus = emailResult.error ? 'failed' : 'sent';

      await supabase
        .from('leads')
        .update({
          email_status: emailStatus,
          preview_sent_at: emailStatus === 'sent' ? new Date().toISOString() : null,
        })
        .eq('id', lead.id);
    }

    await notifyUsageThresholdAlerts({
      supabase,
      workspaceId: widget.workspace_id,
      thresholds: quotaState.crossed_thresholds,
      periodStart: quotaState.period_start,
      periodEnd: quotaState.period_end,
      usedUnits: quotaState.used_units,
      totalQuotaUnits: quotaState.total_quota_units,
    });

    return publicJsonResponse(
      {
        lead: {
          id: lead.id,
          emailStatus,
        },
        generationJob: {
          id: generationResult.data.id,
          status: generationResult.data.status,
        },
        usage: {
          used: quotaState.used_units,
          quota: quotaState.base_quota_units,
          overageCap: quotaState.overage_cap_units,
          totalQuota: quotaState.total_quota_units,
          periodEndsAt: quotaState.period_end,
        },
      },
      200,
      origin,
    );
  } catch {
    return publicJsonResponse({ error: 'Unable to process lead.' }, 500, origin);
  }
}
