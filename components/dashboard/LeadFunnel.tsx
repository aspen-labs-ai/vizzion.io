export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  /** Highlight this stage (e.g. the lead-capture moment). */
  highlight?: boolean;
}

interface LeadFunnelProps {
  stages: FunnelStage[];
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

export default function LeadFunnel({ stages }: LeadFunnelProps) {
  const entryCount = stages[0]?.count ?? 0;
  const leadStage = stages.find((s) => s.highlight);
  const finalStage = stages[stages.length - 1];
  const conversion = pct(leadStage?.count ?? 0, entryCount);

  const isEmpty = entryCount === 0 && stages.every((s) => s.count === 0);

  return (
    <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">How visitors become leads</h2>
          <p className="mt-1 text-sm text-text-secondary">
            The journey from opening your widget to a captured lead — last 30 days.
          </p>
        </div>
        {!isEmpty ? (
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary tabular-nums">{entryCount.toLocaleString()}</p>
              <p className="text-xs uppercase tracking-wide text-text-tertiary">Visitors</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent tabular-nums">{(leadStage?.count ?? 0).toLocaleString()}</p>
              <p className="text-xs uppercase tracking-wide text-text-tertiary">Leads</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary tabular-nums">{conversion}%</p>
              <p className="text-xs uppercase tracking-wide text-text-tertiary">Convert</p>
            </div>
          </div>
        ) : null}
      </div>

      {isEmpty ? (
        <p className="mt-6 rounded-xl border border-border-default bg-bg-primary px-4 py-6 text-center text-sm text-text-tertiary">
          No visitor activity yet. Once your widget is live, you&apos;ll see the full journey here.
        </p>
      ) : (
        <div className="mt-7 space-y-3">
          {stages.map((stage, index) => {
            const widthPct = Math.min(100, Math.max(stage.count > 0 ? 14 : 4, pct(stage.count, entryCount)));
            const prev = index > 0 ? stages[index - 1].count : null;
            const dropOff = prev !== null && prev > 0 ? Math.max(0, Math.round((1 - stage.count / prev) * 100)) : null;
            const ofVisitors = pct(stage.count, entryCount);

            return (
              <div key={stage.key} className="flex flex-col items-center">
                <div
                  className={`relative mx-auto flex h-14 items-center justify-between rounded-xl px-4 transition-all ${
                    stage.highlight ? 'ring-2 ring-accent/60' : ''
                  }`}
                  style={{
                    width: `${widthPct}%`,
                    minWidth: 240,
                    background: stage.highlight
                      ? 'linear-gradient(90deg, color-mix(in srgb, #10B981 92%, #fff), #10B981)'
                      : 'linear-gradient(90deg, color-mix(in srgb, #10B981 38%, #0d1117), color-mix(in srgb, #10B981 60%, #0d1117))',
                  }}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    {stage.label}
                    {stage.highlight ? (
                      <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        Lead
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xl font-bold tabular-nums text-white">{stage.count.toLocaleString()}</span>
                </div>
                <p className="mt-1.5 text-xs text-text-tertiary">
                  {ofVisitors}% of visitors
                  {dropOff !== null && dropOff > 0 ? (
                    <span className="text-text-tertiary"> · {dropOff}% drop-off from previous</span>
                  ) : null}
                </p>
              </div>
            );
          })}

          {finalStage ? (
            <p className="pt-1 text-center text-xs text-text-tertiary">
              {pct(finalStage.count, entryCount)}% of visitors received a finished visualization.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
