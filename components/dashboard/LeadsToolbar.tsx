'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';

interface MaterialOption {
  id: string;
  name: string;
}

interface LeadsToolbarProps {
  materials: MaterialOption[];
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'sent', label: 'Emailed' },
  { value: 'submitted', label: 'Captured' },
  { value: 'failed', label: 'Email failed' },
  { value: 'blocked_quota', label: 'Quota reached' },
];

export default function LeadsToolbar({ materials }: LeadsToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    update((params) => {
      const q = query.trim();
      if (q) params.set('q', q);
      else params.delete('q');
    });
  }

  const inputCls =
    'rounded-lg border border-border-default bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form onSubmit={submitSearch} className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className={`${inputCls} w-full pl-9`}
        />
      </form>

      <select
        value={searchParams.get('status') ?? ''}
        onChange={(e) => update((p) => (e.target.value ? p.set('status', e.target.value) : p.delete('status')))}
        className={inputCls}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('material') ?? ''}
        onChange={(e) => update((p) => (e.target.value ? p.set('material', e.target.value) : p.delete('material')))}
        className={inputCls}
      >
        <option value="">All materials</option>
        {materials.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <DateRangeFilter />
    </div>
  );
}
