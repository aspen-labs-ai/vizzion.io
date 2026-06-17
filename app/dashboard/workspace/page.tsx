import PageHeader from '@/components/dashboard/PageHeader';
import SettingsFocus from '@/components/dashboard/SettingsFocus';
import SubmitButton from '@/components/dashboard/SubmitButton';
import { updateWorkspaceProfileAction } from '@/app/dashboard/actions';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';
import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }
  return null;
}

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const resolvedParams = await searchParams;
  const error = getSingleParam(resolvedParams.error);
  const saved = getSingleParam(resolvedParams.saved) === '1';
  const isOwner = context.role === 'owner';

  return (
    <div className="space-y-6">
      <SettingsFocus />
      <PageHeader
        title="Workspace"
        description="Your account name, logo, and reply-to address — used across the dashboard and customer result emails."
      />

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      ) : null}
      {saved ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Workspace updated.</p>
      ) : null}
      {!isOwner ? (
        <p className="rounded-lg border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-tertiary">
          You have editor access — workspace settings are view-only.
        </p>
      ) : null}

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">Profile &amp; branding</h2>
        <p className="mt-1 text-sm text-text-secondary">
          These details appear in the dashboard and on the visualization emails sent to your customers.
        </p>

        <form action={updateWorkspaceProfileAction} encType="multipart/form-data" className="mt-5 grid gap-4 md:grid-cols-2">
          <InputField
            label="Workspace name"
            name="workspace_name"
            defaultValue={context.workspace.company_name ?? context.workspace.name}
            required
            disabled={!isOwner}
          />
          <InputField
            label="Reply-to email"
            name="reply_to_email"
            type="email"
            defaultValue={context.workspace.reply_to_email ?? ''}
            disabled={!isOwner}
            hint="Customer replies to result emails go here. Leave blank to use the sending address."
          />
          <LogoField existingUrl={context.workspace.logo_url} disabled={!isOwner} />
          <div className="flex items-end md:col-span-2">
            <SubmitButton
              disabled={!isOwner}
              pendingLabel="Saving…"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOwner ? 'Save workspace' : 'Owner only'}
            </SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}

function FieldHint({ hint }: { hint?: string }) {
  if (!hint) return null;
  return <p className="text-xs text-text-tertiary">{hint}</p>;
}

function InputField({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  disabled,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60"
      />
      <FieldHint hint={hint} />
    </label>
  );
}

function LogoField({ existingUrl, disabled }: { existingUrl: string | null; disabled?: boolean }) {
  return (
    <div id="setting-logo" className="vz-focus-target space-y-2 md:col-span-2">
      <span className="text-sm font-medium text-text-secondary">Company logo</span>
      <p className="text-xs text-text-tertiary">
        This is the face of every result your customers see. It appears on the{' '}
        <span className="text-text-secondary">visualization emails</span> they receive, the{' '}
        <span className="text-text-secondary">shared before/after preview page</span>, and as a{' '}
        <span className="text-text-secondary">watermark on downloaded images</span> — so use a
        high-quality one.
      </p>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border-default bg-bg-primary p-4">
        {existingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- customer-uploaded public logo URL
          <img
            src={existingUrl}
            alt="Current workspace logo"
            className="max-h-14 max-w-48 rounded-md border border-border-subtle bg-white object-contain p-2"
          />
        ) : (
          <span className="flex h-14 w-28 items-center justify-center rounded-md border border-dashed border-amber-500/50 text-center text-[11px] leading-tight text-amber-300">
            No logo yet
          </span>
        )}
        <div className="space-y-2">
          <input
            type="file"
            name="logo_file"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
            className="block text-xs text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-semibold file:text-bg-primary disabled:opacity-60"
          />
          <p className="text-xs text-text-tertiary">PNG, JPG, or WebP. Max 2 MB.</p>
          {existingUrl ? (
            <label className="inline-flex items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                name="remove_logo"
                disabled={disabled}
                className="h-4 w-4 rounded border-border-default bg-bg-primary text-accent focus:ring-accent"
              />
              Remove current logo
            </label>
          ) : null}
        </div>
      </div>
      <details className="group rounded-lg border border-border-default bg-bg-primary/40 px-3 py-2">
        <summary className="cursor-pointer list-none text-xs font-semibold text-accent">
          What makes a good logo?
        </summary>
        <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
          <li>High resolution — at least ~512px wide so it stays crisp when scaled down (never blurry or pixelated).</li>
          <li>A PNG with a transparent background works best; a clean white background is fine. Avoid screenshots or photos.</li>
          <li>Use your primary brand mark with true brand colors — make sure it&apos;s legible at a small size.</li>
          <li>Horizontal or square lockups display best in emails and the preview page.</li>
        </ul>
      </details>
    </div>
  );
}
