import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getRecentLeads, getWorkspaceContext } from '@/lib/vizzion/workspace';

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default async function LeadsPage() {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todayCountResult, sevenDayCountResult, thirtyDayCountResult, leads] = await Promise.all([
    supabase
      .from('leads')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', context.widget.id)
      .gte('created_at', todayStart.toISOString()),
    supabase
      .from('leads')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', context.widget.id)
      .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('leads')
      .select('*', { head: true, count: 'exact' })
      .eq('widget_id', context.widget.id)
      .gte('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    getRecentLeads(supabase, context.widget.id, 200),
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <LeadMetric label="Today" value={todayCountResult.count ?? 0} />
        <LeadMetric label="Last 7 Days" value={sevenDayCountResult.count ?? 0} />
        <LeadMetric label="Last 30 Days" value={thirtyDayCountResult.count ?? 0} />
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Lead Feed</h2>
            <p className="text-sm text-text-secondary">Most recent captured emails and source context.</p>
          </div>

          <Link
            href="/api/dashboard/leads/export"
            className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            Export CSV
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border-default">
          <table className="min-w-full divide-y divide-border-default text-sm">
            <thead className="bg-bg-primary text-left text-xs uppercase tracking-wide text-text-tertiary">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source Page</th>
                <th className="px-4 py-3">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default bg-bg-secondary">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-tertiary">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id}>
                    <td className="max-w-[18rem] truncate px-4 py-3 text-text-primary">{lead.email}</td>
                    <td className="px-4 py-3 text-text-secondary">{lead.materialName ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                        {lead.emailStatus}
                      </span>
                    </td>
                    <td className="max-w-[20rem] truncate px-4 py-3 text-text-secondary">
                      {lead.sourcePage ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-tertiary">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LeadMetric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-border-default bg-bg-secondary p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">{value.toLocaleString()}</p>
    </article>
  );
}
