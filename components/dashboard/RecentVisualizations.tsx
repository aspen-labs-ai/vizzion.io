import Link from 'next/link';

export interface RecentVisualizationCard {
  id: string;
  createdAt: string;
  materialName: string | null;
  visitorEmail: string | null;
  originalUrl: string | null;
  generatedUrl: string | null;
  shareUrl: string | null;
}

interface RecentVisualizationsProps {
  visualizations: RecentVisualizationCard[];
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function Thumb({ url, alt, className }: { url: string; alt: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- short-lived signed storage URL
    <img src={url} alt={alt} className={className} loading="lazy" />
  );
}

export default function RecentVisualizations({ visualizations }: RecentVisualizationsProps) {
  return (
    <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Recent visualizations</h2>
        <p className="mt-0.5 text-xs text-text-tertiary">
          Actual previews visitors generated on their own photos
        </p>
      </div>

      {visualizations.length === 0 ? (
        <p className="rounded-xl border border-border-default bg-bg-primary px-4 py-5 text-center text-sm text-text-tertiary">
          No visualizations in this period yet — they appear here as visitors render looks on their photos.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visualizations.map((visualization) => {
            const card = (
              <div className="group h-full overflow-hidden rounded-xl border border-border-default bg-bg-primary transition hover:border-accent/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-tertiary">
                  {visualization.generatedUrl ? (
                    <Thumb
                      url={visualization.generatedUrl}
                      alt={visualization.materialName ?? 'Visualization'}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-text-tertiary">
                      No image
                    </div>
                  )}
                  {visualization.originalUrl ? (
                    <span className="absolute bottom-1.5 left-1.5 block overflow-hidden rounded-md border-2 border-white/70 shadow-md">
                      <Thumb url={visualization.originalUrl} alt="Before" className="h-9 w-9 object-cover" />
                    </span>
                  ) : null}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {visualization.materialName ?? 'Material'}
                  </p>
                  <p className="truncate text-[11px] text-text-tertiary">
                    {visualization.visitorEmail ?? 'Anonymous visitor'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary">{formatWhen(visualization.createdAt)}</p>
                </div>
              </div>
            );

            return visualization.shareUrl ? (
              <Link
                key={visualization.id}
                href={visualization.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </Link>
            ) : (
              <div key={visualization.id}>{card}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}
