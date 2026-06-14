import Link from 'next/link';

export interface MaterialPerfItem {
  materialId: string;
  name: string;
  leadCount: number;
  isActive: boolean;
}

interface MaterialBarChartProps {
  materials: MaterialPerfItem[];
}

export default function MaterialBarChart({ materials }: MaterialBarChartProps) {
  const top = materials.slice(0, 6);
  const maxLeads = Math.max(...top.map((m) => m.leadCount), 1);
  const hasLeads = top.some((m) => m.leadCount > 0);

  return (
    <section className="flex flex-col rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Material performance</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">Leads by material · last 30 days</p>
        </div>
        <Link
          href="/dashboard/materials"
          className="shrink-0 text-xs font-semibold text-accent hover:text-accent-hover"
        >
          Manage
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="mt-5 rounded-xl border border-border-default bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">
          Add materials to start measuring lead interest.
        </p>
      ) : (
        <div className="mt-5 space-y-3.5">
          {top.map((material, index) => {
            const widthPct = material.leadCount > 0 ? Math.max((material.leadCount / maxLeads) * 100, 5) : 0;
            return (
              <div key={material.materialId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-text-primary">{material.name}</span>
                    {!material.isActive ? (
                      <span className="shrink-0 text-[10px] uppercase tracking-wide text-text-tertiary">inactive</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-text-primary">{material.leadCount}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-bg-primary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${widthPct}%`,
                      background:
                        index === 0 && material.leadCount > 0
                          ? 'linear-gradient(90deg, #0f8a63, #15d68f)'
                          : 'linear-gradient(90deg, color-mix(in srgb, #10B981 34%, #0d1117), color-mix(in srgb, #10B981 58%, #0d1117))',
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            );
          })}
          {!hasLeads ? (
            <p className="pt-1 text-xs text-text-tertiary">No leads captured yet — bars fill as visitors pick materials.</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
