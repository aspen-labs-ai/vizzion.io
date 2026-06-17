import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createWidgetAction } from '@/app/dashboard/actions';
import PageHeader from '@/components/dashboard/PageHeader';
import SubmitButton from '@/components/dashboard/SubmitButton';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

export const dynamic = 'force-dynamic';

const SUBJECT_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: 'home', label: 'Home', hint: 'Exterior or interior of a house (roofing, siding, paint, pools…)' },
  { value: 'vehicle', label: 'Vehicle', hint: 'Cars, trucks — wraps, paint, accessories' },
  { value: 'body', label: 'Body', hint: 'Tattoos and other on-body placements' },
  { value: 'yard', label: 'Yard', hint: 'Landscaping, turf, fencing, outdoor spaces' },
  { value: 'boat', label: 'Boat', hint: 'Marine surfaces and decking' },
  { value: 'room', label: 'Room', hint: 'Interior rooms — flooring, countertops, cabinets' },
  { value: 'generic', label: 'Generic', hint: 'Anything else' },
];

export default async function NewWidgetPage() {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  if (context.role !== 'owner') {
    redirect('/dashboard/settings');
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Create a widget"
        description="Each widget has its own subject, materials, embed code, and leads — perfect for a different product line or site."
      />

      <form
        action={createWidgetAction}
        className="space-y-5 rounded-2xl border border-border-default bg-bg-secondary p-6"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Widget name</span>
          <input
            name="name"
            required
            maxLength={80}
            placeholder="e.g. Roofing Visualizer"
            className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
          />
          <span className="text-xs text-text-tertiary">Just for you — shown in the dashboard, not to visitors.</span>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">What will visitors upload?</span>
          <select
            name="subject_type"
            defaultValue="home"
            className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
          >
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} — {option.hint}
              </option>
            ))}
          </select>
          <span className="text-xs text-text-tertiary">
            Controls the upload prompt and copy. You can change it later in Setup.
          </span>
        </label>

        <div className="flex items-center gap-3 pt-1">
          <SubmitButton
            pendingLabel="Creating…"
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
          >
            Create widget
          </SubmitButton>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            Cancel
          </Link>
        </div>

        <p className="text-xs text-text-tertiary">
          After creating, you&apos;ll set the domain, add materials, and copy the embed code — just like your first widget.
        </p>
      </form>
    </div>
  );
}
