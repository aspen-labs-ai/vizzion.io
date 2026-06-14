'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarRange, Check } from 'lucide-react';

const PRESETS: { key: string; label: string }[] = [
  { key: '7', label: 'Last 7 days' },
  { key: '30', label: 'Last 30 days' },
  { key: '90', label: 'Last 90 days' },
  { key: '180', label: 'Last 180 days' },
  { key: '365', label: 'Last 12 months' },
  { key: 'all', label: 'All time' },
];

function formatShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DateRangeFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const range = searchParams.get('range');

  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(from ?? '');
  const [customTo, setCustomTo] = useState(to ?? '');

  const isCustom = Boolean(from && to);
  const activePreset = isCustom ? null : range ?? '30';
  const label = isCustom
    ? `${formatShort(from as string)} – ${formatShort(to as string)}`
    : PRESETS.find((p) => p.key === activePreset)?.label ?? 'Last 30 days';

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    setOpen(false);
  }

  function applyPreset(key: string) {
    pushParams((params) => {
      params.delete('from');
      params.delete('to');
      if (key === '30') params.delete('range');
      else params.set('range', key);
    });
  }

  function applyCustom() {
    if (!customFrom || !customTo) return;
    pushParams((params) => {
      params.delete('range');
      params.set('from', customFrom);
      params.set('to', customTo);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-secondary px-3.5 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
      >
        <CalendarRange className="h-4 w-4 text-text-tertiary" />
        {label}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default"
          />
          <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-border-default bg-bg-secondary shadow-2xl">
            <div className="p-2">
              <p className="px-2 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Quick ranges
              </p>
              <div className="grid grid-cols-2 gap-1">
                {PRESETS.map((preset) => {
                  const active = preset.key === activePreset;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => applyPreset(preset.key)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-accent/15 font-semibold text-accent'
                          : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                      }`}
                    >
                      {preset.label}
                      {active ? <Check className="h-3.5 w-3.5" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border-default p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                Custom range
              </p>
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <span className="mb-1 block text-[11px] text-text-tertiary">Start</span>
                  <input
                    type="date"
                    value={customFrom}
                    max={customTo || undefined}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-accent/60"
                  />
                </label>
                <label className="flex-1">
                  <span className="mb-1 block text-[11px] text-text-tertiary">End</span>
                  <input
                    type="date"
                    value={customTo}
                    min={customFrom || undefined}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-accent/60"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={applyCustom}
                disabled={!customFrom || !customTo}
                className="mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply range
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
