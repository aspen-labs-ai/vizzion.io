'use client';

import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/auth/actions';

interface TopbarProps {
  userEmail: string;
  statusLabel: string;
}

const TITLES: { match: string; title: string }[] = [
  { match: '/dashboard/portfolio', title: 'Portfolio' },
  { match: '/dashboard/materials', title: 'Materials' },
  { match: '/dashboard/settings', title: 'Widget Setup' },
  { match: '/dashboard/billing', title: 'Billing & Usage' },
  { match: '/dashboard/leads', title: 'Leads' },
  { match: '/dashboard', title: 'Dashboard' },
];

function titleFor(pathname: string): string {
  const hit = TITLES.find((t) => pathname === t.match || pathname.startsWith(t.match + '/'))
    ?? TITLES.find((t) => pathname.startsWith(t.match));
  return hit ? hit.title : 'Dashboard';
}

function statusTone(label: string): string {
  if (label === 'Active') return 'border-accent/50 bg-accent/10 text-accent';
  if (label === 'Suspended') return 'border-red-500/40 bg-red-500/10 text-red-300';
  return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
}

export default function Topbar({ userEmail, statusLabel }: TopbarProps) {
  const pathname = usePathname();
  const initial = (userEmail?.[0] ?? 'U').toUpperCase();

  return (
    <header className="hidden h-16 shrink-0 items-center justify-between gap-4 border-b border-border-default bg-bg-primary/80 px-7 backdrop-blur lg:flex">
      <h2 className="text-base font-semibold text-text-primary">{titleFor(pathname)}</h2>

      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(statusLabel)}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {statusLabel}
        </span>

        <div className="flex items-center gap-2.5 rounded-full border border-border-default bg-bg-secondary py-1 pl-1 pr-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
            {initial}
          </span>
          <span className="hidden max-w-[160px] truncate text-xs text-text-secondary xl:inline">
            {userEmail}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full px-2.5 py-1 text-xs font-medium text-text-tertiary transition hover:text-text-primary"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
