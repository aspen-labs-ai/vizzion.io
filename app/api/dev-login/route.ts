import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

function sanitizeNextPath(value: string | null): string {
  return value && value.startsWith('/') ? value : '/dashboard';
}

/**
 * Dev-only instant sign-in used by the sign-in page's "direct login" shortcut
 * (shown only when NODE_ENV !== 'production'). Mints a magic-link token for an
 * existing user via the service role and verifies it server-side to establish
 * the session cookie — no email delivery required. Hard-disabled in production.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const { searchParams, origin } = new URL(request.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  const next = sanitizeNextPath(searchParams.get('next'));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=${encodeURIComponent('Enter a valid email to dev sign-in.')}`,
    );
  }

  const admin = createAdminClient();
  const linkResult = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  const tokenHash = linkResult.data?.properties?.hashed_token;

  if (linkResult.error || !tokenHash) {
    const message = linkResult.error?.message || `No account found for ${email}.`;
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=${encodeURIComponent(message)}&email=${encodeURIComponent(email)}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=${encodeURIComponent(error.message)}&email=${encodeURIComponent(email)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
