import Link from 'next/link';

export interface MaterialPerfItem {
  materialId: string;
  name: string;
  /** Number of visualizations generated with this material. */
  previewCount: number;
  /** Distinct visitors who previewed this material. */
  visitorCount: number;
  isActive: boolean;
}

interface MaterialBarChartProps {
  materials: MaterialPerfItem[];
}

export default function MaterialBarChart({ materials }: MaterialBarChartProps) {
  const ranked = [...materials].sort((a, b) => b.previewCount - a.previewCount);
  const top = ranked.slice(0, 6);
  const maxPreviews = Math.max(...top.map((m) => m.previewCount), 1);
  const hasPreviews = top.some((m) => m.previewCount > 0);
  const topName = hasPreviews ? top[0]?.name ?? null : null;

  return (
    <section className="flex flex-col rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Most-previewed materials</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Times each look was generated on a visitor&apos;s photo
          </p>
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
          Add materials to start measuring which looks attract the most interest.
        </p>
      ) : (
        <>
          <div className="mt-6 flex h-44 items-end gap-3">
            {top.map((material, index) => {
              const heightPct =
                material.previewCount > 0 ? Math.max((material.previewCount / maxPreviews) * 100, 5) : 1.5;
              return (
                <div
                  key={material.materialId}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                  title={
                    material.previewCount > 0
                      ? `${material.name}: ${material.previewCount} preview${material.previewCount === 1 ? '' : 's'} · ${material.visitorCount} visitor${material.visitorCount === 1 ? '' : 's'}`
                      : `${material.name}: no previews yet`
                  }
                >
                  <span className="mb-1.5 text-sm font-bold tabular-nums text-text-primary">
                    {material.previewCount}
                  </span>
                  <div
                    className="w-full max-w-[52px] rounded-t-md transition-all"
                    style={{
                      height: `${heightPct}%`,
                      background:
                        index === 0 && material.previewCount > 0
                          ? 'linear-gradient(180deg, #15d68f, #0f8a63)'
                          : 'linear-gradient(180deg, color-mix(in srgb, #10B981 58%, #0d1117), color-mix(in srgb, #10B981 34%, #0d1117))',
                    }}
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>

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

          {hasPreviews ? (
            topName ? (
              <p className="mt-3 text-xs text-text-tertiary">
                <span className="font-semibold text-text-secondary">{topName}</span> is your most-previewed
                look so far.
              </p>
            ) : null
          ) : (
            <p className="mt-3 text-xs text-text-tertiary">
              No previews yet — bars grow each time a visitor renders a material on their photo.
            </p>
          )}
        </>
      )}
    </section>
  );
}
