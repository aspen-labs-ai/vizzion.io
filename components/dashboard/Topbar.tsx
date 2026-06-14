'use client';

import { usePathname } from 'next/navigation';

const TITLES: { match: string; title: string }[] = [
  { match: '/dashboard/portfolio', title: 'Portfolio' },
  { match: '/dashboard/materials', title: 'Materials' },
  { match: '/dashboard/settings', title: 'Widget Setup' },
  { match: '/dashboard/billing', title: 'Billing & Usage' },
  { match: '/dashboard/leads', title: 'Leads' },
  { match: '/dashboard', title: 'Dashboard' },
];

function titleFor(pathname: string): string {
  const hit =
    TITLES.find((t) => pathname === t.match || pathname.startsWith(t.match + '/')) ??
    TITLES.find((t) => pathname.startsWith(t.match));
  return hit ? hit.title : 'Dashboard';
}

export default function Topbar() {
  const pathname = usePathname();

  return (
    <header className="hidden h-16 shrink-0 items-center border-b border-border-default bg-bg-primary/80 px-7 backdrop-blur lg:flex">
      <h2 className="text-base font-semibold text-text-primary">{titleFor(pathname)}</h2>
    </header>
  );
}
