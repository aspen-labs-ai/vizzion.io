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

const DEV_QUICK_ACCOUNTS = [
  { email: 'trey@aspenlabs.ai', label: "Trey's Workspace" },
  { email: 'treyson.peirce@gmail.com', label: 'TEST workspace' },
];

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
  const allowDirectLogin = process.env.NODE_ENV !== 'production';

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-6 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border-default bg-bg-secondary shadow-xl">
        <div className="border-b border-border-default px-8 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Vizzion App</p>
          <h1 className="mt-3 text-3xl font-bold text-text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;ll email you a magic link — no password needed.
          </p>
        </div>
        <SignInForm nextPath={next} initialEmail={email} initialError={error} initialSent={sent} />

        {allowDirectLogin ? (
          <div className="border-t border-border-default px-8 py-6">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              <span className="h-px flex-1 bg-border-default" />
              or direct login
              <span className="h-px flex-1 bg-border-default" />
            </div>
            <p className="mb-3 text-xs text-text-tertiary">
              Email delivery not configured yet — sign in instantly for testing.
            </p>
            <div className="space-y-2">
              {DEV_QUICK_ACCOUNTS.map((account) => (
                <a
                  key={account.email}
                  href={`/api/dev-login?email=${encodeURIComponent(account.email)}`}
                  className="flex items-center justify-between rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm transition hover:border-accent/50"
                >
                  <span>
                    <span className="block font-medium text-text-primary">{account.email}</span>
                    <span className="block text-[11px] text-text-tertiary">{account.label}</span>
                  </span>
                  <span className="text-xs font-semibold text-accent">Sign in →</span>
                </a>
              ))}
            </div>
            <form action="/api/dev-login" method="get" className="mt-3 flex gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="any email"
                className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
              >
                Go
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
