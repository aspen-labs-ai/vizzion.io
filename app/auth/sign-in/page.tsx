import type { Metadata } from 'next';
import { SignInForm } from '@/app/auth/sign-in/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In | Vizzion App',
  description: 'Sign in to manage your Vizzion widget.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
}

function sanitizeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/')) {
    return '/dashboard';
  }
  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const sent = getSingleParam(resolvedParams.sent) === '1';
  const error = getSingleParam(resolvedParams.error);
  const email = getSingleParam(resolvedParams.email) ?? '';
  const next = sanitizeNextPath(getSingleParam(resolvedParams.next));

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-default bg-bg-secondary shadow-xl">
        <div className="border-b border-border-default px-8 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Vizzion App</p>
          <h1 className="mt-3 text-3xl font-bold text-text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Magic link authentication for your widget dashboard.
          </p>
        </div>
        <SignInForm nextPath={next} initialEmail={email} initialError={error} initialSent={sent} />
      </div>
    </main>
  );
}
