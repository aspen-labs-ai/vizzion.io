import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function sanitizeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/')) {
    return '/dashboard';
  }
  return value;
}

function getEmailDomain(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }

  const domain = email.split('@')[1]?.trim().toLowerCase();
  return domain ? domain : null;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = sanitizeNextPath(searchParams.get('next'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const emailDomain = getEmailDomain(user?.email);

        if (user?.id && emailDomain) {
          const membershipResult = await supabase
            .from('workspace_users')
            .select('workspace_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          const workspaceId = (membershipResult.data as { workspace_id: string } | null)?.workspace_id;

          if (workspaceId) {
            const widgetResult = await supabase
              .from('widgets')
              .select('id, domain_allowlist')
              .eq('workspace_id', workspaceId)
              .order('is_primary', { ascending: false })
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle();

            const widget = widgetResult.data as { id: string; domain_allowlist: string[] | null } | null;
            const hasAllowlist = Array.isArray(widget?.domain_allowlist) && widget.domain_allowlist.length > 0;

            if (widget && !hasAllowlist) {
              await supabase
                .from('widgets')
                .update({ domain_allowlist: [emailDomain] })
                .eq('id', widget.id)
                .eq('workspace_id', workspaceId);
            }
          }
        }
      } catch {
        // Best-effort defaulting only; authentication should still succeed.
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=${encodeURIComponent('Invalid or expired magic link.')}`,
  );
}
