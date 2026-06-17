export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  /** Highlight this stage (e.g. the lead-capture moment). */
  highlight?: boolean;
}

interface LeadFunnelProps {
  stages: FunnelStage[];
  /** Total visualizations generated in the period — the volume behind the funnel. */
  totalVisualizations?: number;
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

export default function LeadFunnel({ stages, totalVisualizations }: LeadFunnelProps) {
  const entryCount = stages[0]?.count ?? 0;
  const leadStage = stages.find((s) => s.highlight);
  const conversion = Math.min(100, pct(leadStage?.count ?? 0, entryCount));
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  const isEmpty = entryCount === 0 && stages.every((s) => s.count === 0);

  return (
    <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">How visitors become leads</h2>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Each step counts unique visitors who reached it
          </p>
        </div>
        {!isEmpty ? (
          <div className="flex items-center gap-5 text-sm">
            <span className="text-text-secondary">
              <strong className="text-text-primary tabular-nums">{entryCount.toLocaleString()}</strong> visitors
            </span>
            <span className="text-text-secondary">
              <strong className="text-accent tabular-nums">{(leadStage?.count ?? 0).toLocaleString()}</strong> leads
            </span>
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent tabular-nums">
              {conversion}% convert
            </span>
          </div>
        ) : null}
      </div>

      {!isEmpty && typeof totalVisualizations === 'number' ? (
        <p className="mt-2 text-xs text-text-tertiary">
          These {entryCount.toLocaleString()} visitor{entryCount === 1 ? '' : 's'} generated{' '}
          <strong className="font-semibold text-text-secondary tabular-nums">
            {totalVisualizations.toLocaleString()}
          </strong>{' '}
          visualization{totalVisualizations === 1 ? '' : 's'} in total — one visitor often tries several looks.
        </p>
      ) : null}

      {isEmpty ? (
        <p className="mt-4 rounded-xl border border-border-default bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">
          No visitor activity yet — once your widget is live, the journey shows here.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {stages.map((stage, index) => {
            const widthPct = stage.count > 0 ? Math.max((stage.count / maxCount) * 100, 6) : 2;
            const prev = index > 0 ? stages[index - 1].count : null;
            const dropOff =
              prev !== null && prev > 0 ? Math.max(0, Math.round((1 - stage.count / prev) * 100)) : null;
            const ofVisitors = pct(stage.count, entryCount);

            return (
              <div key={stage.key} className="flex items-center gap-4">
                {/* To-scale centered bar */}
                <div className="flex flex-1 justify-center">
                  <div
                    className={`h-8 rounded-full transition-all ${stage.highlight ? 'shadow-[0_0_0_1px_rgba(16,185,129,0.5)]' : ''}`}
                    style={{
                      width: `${widthPct}%`,
                      minWidth: 8,
                      background: stage.highlight
                        ? 'linear-gradient(90deg, #0f8a63, #15d68f)'
                        : 'linear-gradient(90deg, color-mix(in srgb, #10B981 32%, #0d1117), color-mix(in srgb, #10B981 55%, #0d1117))',
                    }}
                    aria-hidden
                  />
                </div>

                {/* Aligned labels + metrics */}
                <div className="flex w-72 shrink-0 items-center gap-3">
                  <span className="flex flex-1 items-center gap-1.5 truncate text-sm text-text-primary">
                    {stage.label}
                    {stage.highlight ? (
                      <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                        Lead
                      </span>
                    ) : null}
                  </span>
                  <span className="w-6 text-right text-base font-bold tabular-nums text-text-primary">
                    {stage.count.toLocaleString()}
                  </span>
                  <div className="w-20 text-right leading-tight">
                    <span className="text-xs font-medium text-text-secondary tabular-nums">{ofVisitors}%</span>
                    {dropOff !== null && dropOff > 0 ? (
                      <span className="block text-[11px] text-rose-400/80 tabular-nums">−{dropOff}%</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
