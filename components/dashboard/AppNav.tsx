'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CreditCard, LayoutGrid, PaintbrushVertical, Settings, Users } from 'lucide-react';

type NavIcon = 'dashboard' | 'portfolio' | 'materials' | 'settings' | 'billing' | 'leads';

interface NavItem {
  href: string;
  label: string;
  icon?: NavIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface AppNavProps {
  groups: NavGroup[];
  orientation?: 'vertical' | 'horizontal';
  alertByHref?: Record<string, boolean>;
}

const iconMap: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutGrid,
  portfolio: BarChart3,
  materials: PaintbrushVertical,
  settings: Settings,
  billing: CreditCard,
  leads: Users,
};

function NavLink({
  item,
  active,
  hasAlert,
}: {
  item: NavItem;
  active: boolean;
  hasAlert: boolean;
}) {
  const Icon = item.icon ? iconMap[item.icon] : LayoutGrid;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'border-accent/40 bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(18,206,153,0.15)_inset]'
          : 'border-transparent text-text-secondary hover:border-border-default hover:bg-bg-primary hover:text-text-primary'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="inline-flex items-center gap-1.5">
        {item.label}
        {hasAlert ? (
          <span
            className="inline-block h-2 w-2 rounded-full bg-red-500"
            aria-label={`${item.label} requires attention`}
          />
        ) : null}
      </span>
    </Link>
  );
}

export default function AppNav({ groups, orientation = 'vertical', alertByHref = {} }: AppNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  if (orientation === 'horizontal') {
    const items = groups.flatMap((group) => group.items);
    return (
      <nav className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            hasAlert={Boolean(alertByHref[item.href])}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-5">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            {group.label}
          </p>
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              hasAlert={Boolean(alertByHref[item.href])}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
