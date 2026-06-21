import { IndustryData } from '@/data/industries/types';

export default function IndustryComparison({ data }: { data: IndustryData }) {
  const rows = Array.from(
    { length: Math.max(data.comparison.oldWay.length, data.comparison.vizzionWay.length) },
    (_, index) => ({
      oldWay: data.comparison.oldWay[index],
      vizzionWay: data.comparison.vizzionWay[index],
    }),
  );

  return (
    <section className="relative overflow-hidden bg-bg-secondary py-20 px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent" />

      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-text-primary text-center">
          {data.comparison.headline}
        </h2>

        <div className="overflow-hidden rounded-3xl border border-border-default/80 bg-gradient-to-b from-bg-secondary to-bg-primary shadow-xl shadow-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-bg-primary/60">
                  <th className="w-1/2 px-5 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary md:px-7">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-300">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      The Old Way
                    </span>
                  </th>
                  <th className="w-1/2 px-5 py-5 text-left text-xs font-semibold uppercase tracking-[0.2em] text-accent md:px-7">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      With Vizzion
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="group transition-colors duration-250 hover:bg-bg-primary/35">
                    <td className="border-t border-border-subtle/70 px-5 py-4 align-top md:px-7 md:py-5">
                      {row.oldWay ? (
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-300">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </span>
                          <span className="text-text-secondary leading-relaxed">{row.oldWay}</span>
                        </div>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>
                    <td className="border-t border-border-subtle/70 px-5 py-4 align-top md:px-7 md:py-5">
                      {row.vizzionWay ? (
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-accent/40 bg-gradient-to-br from-accent/20 via-teal-400/15 to-cyan-400/15 text-accent">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-text-secondary leading-relaxed">{row.vizzionWay}</span>
                        </div>
                      ) : (
                        <span className="text-text-disabled">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
