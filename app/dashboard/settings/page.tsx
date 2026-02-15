import CopySnippet from '@/components/dashboard/CopySnippet';
import {
  regenerateEmbedKeyAction,
  updateWorkspaceProfileAction,
  updateWidgetSettingsAction,
} from '@/app/dashboard/actions';
import { getSiteUrl } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import { getSetupLockReason, getMissingSetupRequirements } from '@/lib/vizzion/setup-requirements';
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

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in?next=/dashboard/settings');
  }

  const resolvedParams = await searchParams;
  const error = getSingleParam(resolvedParams.error);
  const saved = getSingleParam(resolvedParams.saved) === '1';
  const workspaceSaved = getSingleParam(resolvedParams.workspace_saved) === '1';
  const keyRegenerated = getSingleParam(resolvedParams.key_regenerated) === '1';
  const missingSetup = getMissingSetupRequirements(context.widget);
  const isEmbedLocked = missingSetup.length > 0;
  const embedLockReason = getSetupLockReason(context.widget);
  const domainAllowlistMissing = missingSetup.some(item => item.key === 'domain_allowlist');
  const isOwner = context.role === 'owner';

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-xl font-semibold text-text-primary">Workspace Profile</h2>
        <p className="mt-1 text-sm text-text-secondary">
          This name appears in your dashboard sidebar and billing context.
        </p>

        {!isOwner ? (
          <p className="mt-4 rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-sm text-text-tertiary">
            You have editor access. Workspace and widget settings are view-only.
          </p>
        ) : null}

        {workspaceSaved ? (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            Workspace profile updated.
          </p>
        ) : null}

        <form action={updateWorkspaceProfileAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <InputField
            label="Workspace Name"
            name="workspace_name"
            defaultValue={context.workspace.company_name ?? context.workspace.name}
            required
            disabled={!isOwner}
          />

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!isOwner}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOwner ? 'Save Workspace Name' : 'Owner Only'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-xl font-semibold text-text-primary">Widget Settings</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Configure behavior, theme, and approved embedding domains.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-border-default bg-bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Widget: {context.widget.name}
          </span>
          {context.widget.is_primary ? (
            <span className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
              Primary
            </span>
          ) : null}
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {saved ? (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            Widget settings updated.
          </p>
        ) : null}

        {keyRegenerated ? (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            Embed key regenerated.
          </p>
        ) : null}

        {missingSetup.length > 0 ? (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Setup incomplete. Complete required fields.
          </p>
        ) : null}

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <InputField
            label="Widget Name"
            name="name"
            defaultValue={context.widget.name}
            required
            disabled={!isOwner}
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Mode</span>
            <select
              name="mode"
              defaultValue={context.widget.mode}
              disabled={!isOwner}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
            >
              <option value="inline">Inline</option>
              <option value="popup">Popup</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-secondary">Theme</span>
            <select
              name="theme"
              defaultValue={context.widget.theme}
              disabled={!isOwner}
              className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label className="md:col-span-2 block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              Domain Allowlist
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border-default bg-bg-primary text-[10px] leading-none text-text-tertiary"
                title="Required. Restricts widget usage to approved website domains. One domain can be used across many pages. Add one domain per line."
              >
                ?
              </span>
              {domainAllowlistMissing ? (
                <span
                  className="inline-flex h-2 w-2 rounded-full bg-red-500"
                  aria-label="Domain allowlist is required"
                />
              ) : null}
            </span>
            <textarea
              name="domain_allowlist"
              rows={4}
              defaultValue={context.widget.domain_allowlist.join('\n')}
              placeholder="example.com\nsubdomain.example.com"
              disabled={!isOwner}
              className={`w-full rounded-lg border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60 ${
                domainAllowlistMissing ? 'border-red-500/60' : 'border-border-default'
              }`}
            />
            <p className={`text-xs ${domainAllowlistMissing ? 'text-red-300' : 'text-text-tertiary'}`}>
              Required before embed code can be copied. Add one domain per line.
            </p>
          </label>

          <NumberField
            label="Max Generations per Session"
            name="max_generations_per_session"
            defaultValue={context.widget.max_generations_per_session}
            placeholder="Unlimited"
            min={1}
            disabled={!isOwner}
          />

          <NumberField
            label="Max Generations per Email (Lifetime)"
            name="max_generations_per_email_lifetime"
            defaultValue={context.widget.max_generations_per_email_lifetime}
            placeholder="Unlimited"
            min={1}
            disabled={!isOwner}
          />

          <InputField
            label="Limit Reached CTA URL"
            name="limit_reached_cta_url"
            defaultValue={context.widget.limit_reached_cta_url ?? ''}
            disabled={!isOwner}
          />

          <ToggleField
            name="is_active"
            label="Widget active"
            description="Disable to temporarily stop all public widget activity."
            defaultChecked={context.widget.is_active}
            disabled={!isOwner}
          />

          <ToggleField
            name="require_email"
            label="Require email"
            description="Collect email before sending visualization results."
            defaultChecked={context.widget.require_email}
            disabled={!isOwner}
          />

          <ToggleField
            name="auto_open_widget"
            label="Auto open"
            description="Open the widget immediately when the page loads."
            defaultChecked={context.widget.auto_open_widget}
            disabled={!isOwner}
          />

          <ToggleField
            name="show_product_names"
            label="Show product names"
            description="Display selected material names in the widget UI."
            defaultChecked={context.widget.show_product_names}
            disabled={!isOwner}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!isOwner}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOwner ? 'Save Settings' : 'Owner Only'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Embed Key</h2>
            <p className="text-sm text-text-secondary">Current key: {context.widget.embed_key}</p>
          </div>

          <form action={regenerateEmbedKeyAction}>
            <button
              type="submit"
              disabled={!isOwner}
              className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOwner ? 'Regenerate Key' : 'Owner Only'}
            </button>
          </form>
        </div>

        <CopySnippet
          embedKey={context.widget.embed_key}
          siteUrl={getSiteUrl()}
          isLocked={isEmbedLocked}
          lockReason={embedLockReason}
        />
      </section>
    </div>
  );
}

function InputField({
  label,
  name,
  defaultValue,
  required,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60"
      />
    </label>
  );
}

function NumberField({
  label,
  name,
  defaultValue,
  min,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: number | null;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <input
        type="number"
        name={name}
        defaultValue={typeof defaultValue === 'number' ? defaultValue : ''}
        min={min}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60"
      />
    </label>
  );
}

function ToggleField({
  name,
  label,
  description,
  defaultChecked,
  disabled,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block rounded-lg border border-border-default bg-bg-primary px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-tertiary">{description}</p>
        </div>

        <span className="relative inline-flex h-6 w-11 items-center">
          <input
            type="checkbox"
            name={name}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full border border-border-default bg-bg-secondary transition peer-checked:border-accent/60 peer-checked:bg-accent/20 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-disabled:opacity-50" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-text-tertiary transition peer-checked:translate-x-5 peer-checked:bg-accent peer-disabled:opacity-50" />
        </span>
      </div>
    </label>
  );
}
