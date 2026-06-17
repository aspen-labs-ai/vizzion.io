'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export interface LeadRow {
  id: string;
  email: string;
  materialName: string | null;
  emailStatus: string;
  hasPreview: boolean;
  visualizationCount: number;
  previewViews: number;
  lastActivityAt: string;
  sourcePage: string | null;
  createdAt: string;
}

interface LeadVisualization {
  id: string;
  createdAt: string;
  materialName: string | null;
  status: string | null;
  originalUrl: string | null;
  generatedUrl: string | null;
  shareUrl: string | null;
}

interface LeadDetail {
  email: string;
  emailStatus: string;
  materialName: string | null;
  sourcePage: string | null;
  createdAt: string;
  visualizationCount: number;
  previewViews: number;
  originalUrl: string | null;
  generatedUrl: string | null;
  hasPreview: boolean;
  visualizations: LeadVisualization[];
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

// The lead's email_status is about email DELIVERY, not lead quality. Combine it
// with whether a visualization was generated into an honest, friendly status.
function statusFor(emailStatus: string, hasPreview: boolean): { label: string; cls: string } {
  if (hasPreview) {
    return emailStatus === 'sent'
      ? { label: 'Emailed', cls: 'border-accent/40 bg-accent/10 text-accent' }
      : { label: 'Image ready', cls: 'border-accent/40 bg-accent/10 text-accent' };
  }
  if (emailStatus === 'blocked_quota') {
    return { label: 'Quota reached', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300' };
  }
  if (emailStatus === 'failed') {
    return { label: 'Failed', cls: 'border-red-500/40 bg-red-500/10 text-red-300' };
  }
  return { label: 'Captured', cls: 'border-border-default bg-bg-primary text-text-secondary' };
}

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openLead(id: string) {
    setActiveId(id);
    setDetail(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`);
      if (!res.ok) throw new Error('Could not load this lead.');
      setDetail((await res.json()) as LeadDetail);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this lead.');
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setActiveId(null);
    setDetail(null);
    setError(null);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border-default">
        <table className="min-w-full divide-y divide-border-default text-sm">
          <thead className="bg-bg-primary text-left text-xs uppercase tracking-wide text-text-tertiary">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Material</th>
              <th className="px-4 py-3 font-semibold">Visuals</th>
              <th className="px-4 py-3 font-semibold">Views</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Last Activity</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-bg-secondary">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-tertiary">
                  No leads match these filters.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const status = statusFor(lead.emailStatus, lead.hasPreview);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => openLead(lead.id)}
                    className="cursor-pointer transition hover:bg-bg-primary/50"
                  >
                    <td className="max-w-[20rem] truncate px-4 py-3 font-medium text-text-primary">{lead.email}</td>
                    <td className="px-4 py-3 text-text-secondary">{lead.materialName ?? '—'}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <span className="rounded-full border border-border-default bg-bg-primary px-2.5 py-1 text-xs font-semibold text-text-primary">
                        {lead.visualizationCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      <span className="rounded-full border border-border-default bg-bg-primary px-2.5 py-1 text-xs font-semibold text-text-primary">
                        {lead.previewViews}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-tertiary">{formatDate(lead.lastActivityAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold text-accent">View</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {activeId ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            style={{ animation: 'vz-fade-in 0.2s ease' }}
            onClick={close}
            aria-hidden
          />
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border-default bg-bg-secondary shadow-2xl"
            style={{ animation: 'vz-sheet-in 0.26s cubic-bezier(0.22,0.61,0.36,1)' }}
            role="dialog"
            aria-label="Lead detail"
          >
            <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
              <h3 className="text-base font-semibold text-text-primary">Lead detail</h3>
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-border-default bg-bg-primary p-1.5 text-text-secondary transition hover:text-text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {loading ? (
                <p className="py-8 text-center text-sm text-text-tertiary">Loading…</p>
              ) : error ? (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
              ) : detail ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Email" value={detail.email} />
                    <Field label="Material" value={detail.materialName ?? '—'} />
                    <Field label="Captured" value={formatDate(detail.createdAt)} />
                    <Field label="Visualizations" value={detail.visualizationCount.toString()} />
                    <Field label="Preview views" value={detail.previewViews.toString()} />
                    <Field label="Source page" value={detail.sourcePage ?? '—'} />
                  </div>

                  {detail.emailStatus === 'failed' && detail.hasPreview ? (
                    <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
                      The visualization generated successfully, but the result email didn&apos;t send. Check your
                      email/SMTP settings to deliver it.
                    </p>
                  ) : null}

                  {detail.hasPreview ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Visualization history</p>
                      {detail.visualizations.map((visualization, index) => (
                        <article key={visualization.id} className="space-y-3 rounded-xl border border-border-default bg-bg-primary p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">
                                Preview {detail.visualizations.length - index}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {formatDate(visualization.createdAt)} · {visualization.materialName ?? 'Unknown material'}
                              </p>
                            </div>
                            {visualization.shareUrl ? (
                              <a
                                href={visualization.shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-accent/50 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10"
                              >
                                Open slider
                              </a>
                            ) : null}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <PreviewImage label="Before" url={visualization.originalUrl} />
                            <PreviewImage label="After" url={visualization.generatedUrl} accent />
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-sm text-text-tertiary">
                      No visualization was generated for this lead.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </aside>

          <style>{`
            @keyframes vz-fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes vz-sheet-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
          `}</style>
        </div>
      ) : null}
    </>
  );
}

function PreviewImage({ label, url, accent = false }: { label: string; url: string | null; accent?: boolean }) {
  return (
    <figure className="space-y-1.5">
      <span className="text-[11px] uppercase tracking-wide text-text-tertiary">{label}</span>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- signed external URL
        <img
          src={url}
          alt={`${label} visualization`}
          className={`w-full rounded-lg border ${accent ? 'border-accent/40' : 'border-border-default'}`}
        />
      ) : (
        <div className="flex h-28 items-center justify-center rounded-lg border border-border-default text-xs text-text-tertiary">
          Not available
        </div>
      )}
    </figure>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="truncate text-sm text-text-primary">{value}</p>
    </div>
  );
}
