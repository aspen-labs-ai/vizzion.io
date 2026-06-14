'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export interface LeadRow {
  id: string;
  email: string;
  materialName: string | null;
  emailStatus: string;
  hasPreview: boolean;
  sourcePage: string | null;
  createdAt: string;
}

interface LeadDetail {
  email: string;
  emailStatus: string;
  materialName: string | null;
  sourcePage: string | null;
  createdAt: string;
  originalUrl: string | null;
  generatedUrl: string | null;
  hasPreview: boolean;
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
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Captured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default bg-bg-secondary">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-tertiary">
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
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-tertiary">{formatDate(lead.createdAt)}</td>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-default bg-bg-secondary shadow-2xl"
            onClick={(e) => e.stopPropagation()}
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

            <div className="space-y-4 px-5 py-5">
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
                    <Field label="Source page" value={detail.sourcePage ?? '—'} />
                  </div>

                  {detail.emailStatus === 'failed' && detail.hasPreview ? (
                    <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
                      The visualization generated successfully, but the result email didn&apos;t send. Check your
                      email/SMTP settings to deliver it.
                    </p>
                  ) : null}

                  {detail.hasPreview ? (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        Visualization
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <figure className="space-y-1">
                          <span className="text-[11px] text-text-tertiary">Their photo</span>
                          {detail.originalUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element -- signed external URL
                            <img src={detail.originalUrl} alt="Original upload" className="w-full rounded-lg border border-border-default" />
                          ) : (
                            <div className="flex h-32 items-center justify-center rounded-lg border border-border-default text-xs text-text-tertiary">
                              Not available
                            </div>
                          )}
                        </figure>
                        <figure className="space-y-1">
                          <span className="text-[11px] text-text-tertiary">Generated</span>
                          {detail.generatedUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element -- signed external URL
                            <img src={detail.generatedUrl} alt="Generated visualization" className="w-full rounded-lg border border-accent/40" />
                          ) : (
                            <div className="flex h-32 items-center justify-center rounded-lg border border-border-default text-xs text-text-tertiary">
                              Not available
                            </div>
                          )}
                        </figure>
                      </div>
                    </div>
                  ) : (
                    <p className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-sm text-text-tertiary">
                      No visualization was generated for this lead.
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
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
