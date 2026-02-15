'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, LayoutGrid, PaintbrushVertical, Settings, Users } from 'lucide-react';

type NavIcon = 'dashboard' | 'materials' | 'settings' | 'billing' | 'leads';

interface NavItem {
  href: string;
  label: string;
  icon?: NavIcon;
}

interface AppNavProps {
  items: NavItem[];
  orientation?: 'vertical' | 'horizontal';
  alertByHref?: Record<string, boolean>;
}

const iconMap: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutGrid,
  materials: PaintbrushVertical,
  settings: Settings,
  billing: CreditCard,
  leads: Users,
};

export default function AppNav({ items, orientation = 'vertical', alertByHref = {} }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav className={orientation === 'vertical' ? 'space-y-1' : 'flex flex-wrap items-center gap-2'}>
      {items.map(item => {
        const isActive =
          pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const hasAlert = Boolean(alertByHref[item.href]);
        const Icon = item.icon ? iconMap[item.icon] : LayoutGrid;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-accent/40 bg-accent/15 text-accent shadow-[0_0_0_1px_rgba(18,206,153,0.15)_inset]'
                : 'border-transparent text-text-secondary hover:border-border-default hover:bg-bg-primary hover:text-text-primary'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="inline-flex items-center gap-1">
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
      })}
    </nav>
  );
}
