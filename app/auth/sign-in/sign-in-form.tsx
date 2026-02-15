'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInForm({
  nextPath,
  initialEmail,
  initialError,
  initialSent,
}: {
  nextPath: string;
  initialEmail: string;
  initialError: string | null;
  initialSent: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState(initialEmail);
  const [companyName, setCompanyName] = useState('');
  const [sent, setSent] = useState(initialSent);
  const [error, setError] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSent(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    const callbackPath = `/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const emailRedirectTo = `${window.location.origin}${callbackPath}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo,
        shouldCreateUser: true,
        data: companyName.trim() ? { company_name: companyName.trim() } : undefined,
      },
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSent(true);
    const query = new URLSearchParams({
      sent: '1',
      email: normalizedEmail,
      next: nextPath,
    });
    router.replace(`/auth/sign-in?${query.toString()}`);
  }

  return (
    <div className="space-y-4 px-8 py-7">
      {sent ? (
        <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Check your email for a magic link. Once you click it, you&apos;ll return here signed in.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Business email</span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Company name (optional)</span>
          <input
            type="text"
            name="company_name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Acme Roofing"
            className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send magic link'}
        </button>
      </form>
    </div>
  );
}
