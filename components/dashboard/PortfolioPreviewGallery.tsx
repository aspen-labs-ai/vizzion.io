'use client';

import { useState } from 'react';
import type { PortfolioPreviewRow } from '@/lib/vizzion/portfolio';

interface PortfolioPreviewGalleryProps {
  previews: PortfolioPreviewRow[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatExpiry(value: string | null): string {
  if (!value) {
    return 'Not set';
  }

  return formatDate(value);
}

export default function PortfolioPreviewGallery({ previews }: PortfolioPreviewGalleryProps) {
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const activePreview = previews.find(preview => preview.id === activePreviewId) ?? null;

  if (previews.length === 0) {
    return <p className="text-sm text-text-tertiary">No previews available in this date range.</p>;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {previews.map(preview => (
          <button
            key={preview.id}
            type="button"
            onClick={() => setActivePreviewId(preview.id)}
            className="rounded-xl border border-border-default bg-bg-primary p-3 text-left transition hover:border-accent/40"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <PreviewImage
                url={preview.originalUploadUrl}
                alt={`Original upload for ${preview.widgetName}`}
                emptyLabel="No original"
              />
              <PreviewImage
                url={preview.generatedPreviewUrl}
                alt={`Generated preview for ${preview.widgetName}`}
                emptyLabel="No preview"
              />
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-text-primary">{preview.widgetName}</p>
            <p className="mt-1 text-xs text-text-tertiary">
              {(preview.industrySlug ?? 'unmapped')} • {formatDate(preview.createdAt)}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              Retention expiry: {formatExpiry(preview.retentionExpiresAt)}
            </p>
          </button>
        ))}
      </div>

      {activePreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl rounded-2xl border border-border-default bg-bg-secondary shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
              <div>
                <p className="text-base font-semibold text-text-primary">{activePreview.widgetName}</p>
                <p className="text-xs text-text-tertiary">
                  {(activePreview.industrySlug ?? 'unmapped')} • {formatDate(activePreview.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewId(null)}
                className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Before
                </p>
                <PreviewImage
                  url={activePreview.originalUploadUrl}
                  alt={`Original upload for ${activePreview.widgetName}`}
                  emptyLabel="No original upload found"
                  large
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  After
                </p>
                <PreviewImage
                  url={activePreview.generatedPreviewUrl}
                  alt={`Generated preview for ${activePreview.widgetName}`}
                  emptyLabel="No generated preview found"
                  large
                />
              </div>
            </div>

            <div className="border-t border-border-default px-5 py-4 text-xs text-text-tertiary">
              <p>Signed URL expires: {formatExpiry(activePreview.signedUrlExpiresAt)}</p>
              <p className="mt-1">Retention expiry: {formatExpiry(activePreview.retentionExpiresAt)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PreviewImage({
  url,
  alt,
  emptyLabel,
  large = false,
}: {
  url: string | null;
  alt: string;
  emptyLabel: string;
  large?: boolean;
}) {
  if (!url) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border-default bg-bg-secondary text-xs text-text-tertiary ${
          large ? 'h-64' : 'h-28'
        }`}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    // Signed storage URLs are short-lived and remote domains vary by environment.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={`w-full rounded-lg border border-border-default object-cover ${large ? 'h-64' : 'h-28'}`}
    />
  );
}
