export interface DepthBucket {
  label: string;
  visitors: number;
}

interface EngagementDepthProps {
  avgMaterialsPerVisitor: number;
  multiMaterialVisitorPct: number;
  visitorsWhoGenerated: number;
  depthDistribution: DepthBucket[];
}

export default function EngagementDepth({
  avgMaterialsPerVisitor,
  multiMaterialVisitorPct,
  visitorsWhoGenerated,
  depthDistribution,
}: EngagementDepthProps) {
  const maxBucket = Math.max(...depthDistribution.map((b) => b.visitors), 1);
  const isEmpty = visitorsWhoGenerated === 0;

  return (
    <section className="flex flex-col rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div>
        <h2 className="text-base font-semibold text-text-primary">How deeply visitors explore</h2>
        <p className="mt-0.5 text-xs text-text-tertiary">Different materials each visitor previews</p>
      </div>

      {isEmpty ? (
        <p className="mt-5 rounded-xl border border-border-default bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">
          No visualizations yet — this shows how many looks each visitor tries on their photo.
        </p>
      ) : (
        <>
          <div className="mt-5 flex items-end gap-5">
            <div>
              <p className="text-4xl font-bold leading-none tabular-nums text-text-primary">
                {avgMaterialsPerVisitor.toFixed(1)}
              </p>
              <p className="mt-1.5 text-xs text-text-tertiary">materials per visitor, on average</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold leading-none tabular-nums text-accent">
                {Math.round(multiMaterialVisitorPct)}%
              </p>
              <p className="mt-1.5 text-xs text-text-tertiary">tried 2 or more</p>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            {depthDistribution.map((bucket) => {
              const widthPct = bucket.visitors > 0 ? Math.max((bucket.visitors / maxBucket) * 100, 4) : 0;
              return (
                <div key={bucket.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-text-secondary">{bucket.label}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-primary">
                    <div
                      className="h-full rounded-full bg-accent/70 transition-all"
                      style={{ width: `${widthPct}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-text-primary">
                    {bucket.visitors}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-text-tertiary">
            Based on {visitorsWhoGenerated.toLocaleString()} visitor{visitorsWhoGenerated === 1 ? '' : 's'} who
            generated a preview.
          </p>
        </>
      )}
    </section>
  );
}
