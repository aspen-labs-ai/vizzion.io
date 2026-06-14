'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

function readWidgetCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)vz_widget=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export interface WidgetOption {
  id: string;
  name: string;
  is_primary: boolean;
  is_active: boolean;
}

interface WidgetSwitcherProps {
  widgets: WidgetOption[];
  defaultWidgetId: string;
}

export default function WidgetSwitcher({ widgets, defaultWidgetId }: WidgetSwitcherProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // The active widget is resolved on the client so the label is always live even
  // though the dashboard layout (where this lives) is preserved across navigation:
  // explicit ?widgetId > persisted cookie > server-provided default (primary).
  const [cookieId, setCookieId] = useState<string | null>(null);
  useEffect(() => {
    setCookieId(readWidgetCookie());
  }, [pathname, searchParams]);

  const selectedId = searchParams.get('widgetId') ?? cookieId ?? defaultWidgetId;
  const current = widgets.find((w) => w.id === selectedId) ?? widgets.find((w) => w.is_primary) ?? widgets[0];

  function selectWidget(id: string) {
    setOpen(false);
    // Persist selection so it sticks across sidebar navigation (server reads this
    // cookie when no explicit ?widgetId is present), and reflect it instantly.
    // eslint-disable-next-line react-hooks/immutability -- intentional client-side cookie write in an event handler
    document.cookie = `vz_widget=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    setCookieId(id);
    // Stay on the current page; just re-point it at the selected widget.
    const params = new URLSearchParams(searchParams.toString());
    params.set('widgetId', id);
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!current) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2.5 text-left text-sm transition hover:border-accent/40"
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            Widget
          </span>
          <span className="block truncate font-medium text-text-primary">{current.name}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-text-tertiary" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-xl">
            <div className="max-h-64 overflow-y-auto p-1">
              {widgets.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectWidget(w.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-text-secondary transition hover:bg-bg-primary hover:text-text-primary"
                >
                  <span className="min-w-0">
                    <span className="block truncate">{w.name}</span>
                    <span className="block text-[11px] text-text-tertiary">
                      {w.is_primary ? 'Primary' : 'Widget'}
                      {w.is_active ? '' : ' · Inactive'}
                    </span>
                  </span>
                  {w.id === current.id ? <Check className="h-4 w-4 shrink-0 text-accent" /> : null}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/widgets/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-t border-border-default px-3 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/10"
            >
              <Plus className="h-4 w-4" />
              New widget
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
