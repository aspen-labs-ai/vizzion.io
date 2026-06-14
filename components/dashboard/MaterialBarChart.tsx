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
        <>
          {/* Columns */}
          <div className="mt-6 flex h-44 items-end gap-3">
            {top.map((material, index) => {
              const heightPct = material.leadCount > 0 ? Math.max((material.leadCount / maxLeads) * 100, 5) : 1.5;
              return (
                <div key={material.materialId} className="flex h-full flex-1 flex-col items-center justify-end">
                  <span className="mb-1.5 text-sm font-bold tabular-nums text-text-primary">{material.leadCount}</span>
                  <div
                    className="w-full max-w-[52px] rounded-t-md"
                    style={{
                      height: `${heightPct}%`,
                      background:
                        index === 0 && material.leadCount > 0
                          ? 'linear-gradient(180deg, #15d68f, #0f8a63)'
                          : 'linear-gradient(180deg, color-mix(in srgb, #10B981 58%, #0d1117), color-mix(in srgb, #10B981 34%, #0d1117))',
                    }}
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="mt-2 flex gap-3 border-t border-border-default pt-2">
            {top.map((material) => (
              <span
                key={material.materialId}
                title={material.name}
                className="flex-1 truncate text-center text-[11px] text-text-secondary"
              >
                {material.name}
              </span>
            ))}
          </div>

          {!hasLeads ? (
            <p className="mt-3 text-xs text-text-tertiary">No leads captured yet — bars grow as visitors pick materials.</p>
          ) : null}
        </>
      )}
    </section>
  );
}
