import CopySnippet from '@/components/dashboard/CopySnippet';
import PageHeader from '@/components/dashboard/PageHeader';
import WidgetAppearance from '@/components/dashboard/WidgetAppearance';
import {
  regenerateEmbedKeyAction,
  updateWorkspaceProfileAction,
  updateWidgetSettingsAction,
} from '@/app/dashboard/actions';
import { getSiteUrl } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import { getSetupLockReason, getMissingSetupRequirements } from '@/lib/vizzion/setup-requirements';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';
import { Check } from 'lucide-react';
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
  const resolvedParams = await searchParams;
  const selectedWidgetId = getSingleParam(resolvedParams.widgetId);
  const context = await getWorkspaceContext(supabase, selectedWidgetId);

  if (!context) {
    redirect('/auth/sign-in');
  }

  const error = getSingleParam(resolvedParams.error);
  const saved = getSingleParam(resolvedParams.saved) === '1';
  const workspaceSaved = getSingleParam(resolvedParams.workspace_saved) === '1';
  const keyRegenerated = getSingleParam(resolvedParams.key_regenerated) === '1';
  const missingSetup = getMissingSetupRequirements(context.widget);
  const isEmbedLocked = missingSetup.length > 0;
  const embedLockReason = getSetupLockReason(context.widget);
  const domainSet = context.widget.domain_allowlist.length > 0;
  const isOwner = context.role === 'owner';
  const widget = context.widget;

  const mappingResult = await supabase
    .from('industry_widget_mappings')
    .select('industry_slug')
    .eq('workspace_id', context.workspace.id)
    .eq('widget_id', widget.id)
    .maybeSingle();
  const industrySlug =
    !mappingResult.error && mappingResult.data && typeof mappingResult.data.industry_slug === 'string'
      ? mappingResult.data.industry_slug
      : '';

  const widgetIdField = <input type="hidden" name="widget_id" value={widget.id} />;
  const saveButton = (label: string) => (
    <button
      type="submit"
      disabled={!isOwner}
      className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isOwner ? label : 'Owner only'}
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Widget Setup"
        description={`Configure ${widget.name}${widget.is_primary ? ' (primary)' : ''} — appearance, behavior, and where it runs.`}
      />

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      ) : null}
      {saved ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Settings saved.</p>
      ) : null}
      {workspaceSaved ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Workspace updated.</p>
      ) : null}
      {keyRegenerated ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Embed key regenerated.</p>
      ) : null}
      {!isOwner ? (
        <p className="rounded-lg border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-tertiary">
          You have editor access — settings are view-only.
        </p>
      ) : null}

      {/* GO LIVE */}
      <section className="rounded-2xl border border-accent/30 bg-bg-secondary p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Go live</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Approve your website, then drop the embed snippet on your site.
            </p>
          </div>
          <div className="flex gap-2">
            <StatusChip ok={domainSet} okLabel="Domain set" pendingLabel="Domain needed" />
            <StatusChip ok={!isEmbedLocked} okLabel="Embed ready" pendingLabel="Embed locked" />
          </div>
        </div>

        <form action={updateWidgetSettingsAction} className="mt-5 space-y-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="domain_allowlist" />
          <span className="text-sm font-medium text-text-secondary">Approved website domains</span>
          <textarea
            name="domain_allowlist"
            rows={3}
            defaultValue={widget.domain_allowlist.join('\n')}
            placeholder={'yoursite.com\nshop.yoursite.com'}
            disabled={!isOwner}
            className={`w-full rounded-lg border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent/60 ${
              domainSet ? 'border-border-default' : 'border-red-500/60'
            }`}
          />
          <p className={`text-xs ${domainSet ? 'text-text-tertiary' : 'text-red-300'}`}>
            Required to go live. One domain per line — each covers all its pages.
          </p>
          <div className="pt-1">{saveButton('Save domains')}</div>
        </form>

        <div className="mt-6 border-t border-border-default pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Embed snippet</h3>
              <p className="text-xs text-text-tertiary">Key: {widget.embed_key}</p>
            </div>
            <form action={regenerateEmbedKeyAction}>
              {widgetIdField}
              <button
                type="submit"
                disabled={!isOwner}
                className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOwner ? 'Regenerate key' : 'Owner only'}
              </button>
            </form>
          </div>
          <CopySnippet
            embedKey={widget.embed_key}
            siteUrl={getSiteUrl()}
            isLocked={isEmbedLocked}
            lockReason={embedLockReason}
          />
        </div>
      </section>

      {/* APPEARANCE */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
        <p className="mt-1 text-sm text-text-secondary">How the widget looks on your site.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="mode,theme,brand_color" />
          <SelectField
            label="Display mode"
            name="mode"
            defaultValue={widget.mode}
            disabled={!isOwner}
            hint="Inline embeds it in the page; Popup shows a button that opens it."
            options={[
              { value: 'inline', label: 'Inline' },
              { value: 'popup', label: 'Popup' },
            ]}
          />
          <WidgetAppearance
            defaultTheme={widget.theme}
            defaultColor={widget.brand_color || '#10B981'}
            disabled={!isOwner}
          />
          <div className="md:col-span-2">{saveButton('Save appearance')}</div>
        </form>
      </section>

      {/* BEHAVIOR */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">Behavior</h2>
        <p className="mt-1 text-sm text-text-secondary">What visitors upload and how the widget acts.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input
            type="hidden"
            name="present_fields"
            value="name,subject_type,require_email,auto_open_widget,show_product_names,is_active"
          />
          <InputField label="Widget name" name="name" defaultValue={widget.name} required disabled={!isOwner} hint="Internal label — not shown to visitors." />
          <SelectField
            label="What visitors upload"
            name="subject_type"
            defaultValue={widget.subject_type ?? 'home'}
            disabled={!isOwner}
            hint="Sets the upload prompt + reveal copy for this widget."
            options={[
              { value: 'home', label: 'Home — house exterior/interior' },
              { value: 'vehicle', label: 'Vehicle — cars, trucks' },
              { value: 'body', label: 'Body — tattoos & placements' },
              { value: 'yard', label: 'Yard — landscaping, turf' },
              { value: 'boat', label: 'Boat — marine surfaces' },
              { value: 'room', label: 'Room — interior spaces' },
              { value: 'generic', label: 'Generic — anything' },
            ]}
          />
          <ToggleField
            name="require_email"
            label="Require email"
            description="Capture an email before showing the result (recommended)."
            defaultChecked={widget.require_email}
            disabled={!isOwner}
          />
          <ToggleField
            name="is_active"
            label="Widget active"
            description="Turn off to pause the widget on your site."
            defaultChecked={widget.is_active}
            disabled={!isOwner}
          />
          <ToggleField
            name="auto_open_widget"
            label="Auto-open"
            description="Open the widget automatically on page load."
            defaultChecked={widget.auto_open_widget}
            disabled={!isOwner}
          />
          <ToggleField
            name="show_product_names"
            label="Show product names"
            description="Display material names in the picker."
            defaultChecked={widget.show_product_names}
            disabled={!isOwner}
          />
          {!widget.require_email ? (
            <p className="md:col-span-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              Email capture is off — you won&apos;t collect leads. Turn it on to capture and follow up.
            </p>
          ) : null}
          <div className="md:col-span-2">{saveButton('Save behavior')}</div>
        </form>
      </section>

      {/* ADVANCED */}
      <details className="group rounded-2xl border border-border-default bg-bg-secondary p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Advanced</h2>
            <p className="mt-1 text-sm text-text-secondary">Rate limits and industry-page mapping.</p>
          </div>
          <span className="text-xs font-medium text-text-tertiary group-open:hidden">Show</span>
          <span className="hidden text-xs font-medium text-text-tertiary group-open:inline">Hide</span>
        </summary>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input
            type="hidden"
            name="present_fields"
            value="max_generations_per_session,max_generations_per_email_lifetime,limit_reached_cta_url,industry_slug"
          />
          <NumberField
            label="Max previews per session"
            name="max_generations_per_session"
            defaultValue={widget.max_generations_per_session}
            placeholder="Unlimited"
            min={1}
            disabled={!isOwner}
            hint="Caps previews one visitor can make per visit. Blank = unlimited."
          />
          <NumberField
            label="Max previews per email (lifetime)"
            name="max_generations_per_email_lifetime"
            defaultValue={widget.max_generations_per_email_lifetime}
            placeholder="Unlimited"
            min={1}
            disabled={!isOwner}
            hint="Caps previews per email address, all-time. Blank = unlimited."
          />
          <InputField
            label="“Limit reached” link"
            name="limit_reached_cta_url"
            defaultValue={widget.limit_reached_cta_url ?? ''}
            disabled={!isOwner}
            hint="Where to send visitors who hit a limit (e.g. a contact page)."
          />
          <InputField
            label="Industry page slug"
            name="industry_slug"
            defaultValue={industrySlug}
            disabled={!isOwner}
            hint="Optional. Links this widget to an industry landing page (e.g. 'solar')."
          />
          <div className="md:col-span-2">{saveButton('Save advanced')}</div>
        </form>
      </details>

      {/* WORKSPACE */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">Workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">Your account name, shown in the sidebar and billing.</p>

        <form action={updateWorkspaceProfileAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <InputField
            label="Workspace name"
            name="workspace_name"
            defaultValue={context.workspace.company_name ?? context.workspace.name}
            required
            disabled={!isOwner}
          />
          <div className="flex items-end">{saveButton('Save workspace')}</div>
        </form>
      </section>
    </div>
  );
}

function StatusChip({ ok, okLabel, pendingLabel }: { ok: boolean; okLabel: string; pendingLabel: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        ok ? 'border-accent/50 bg-accent/10 text-accent' : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
      }`}
    >
      {ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {ok ? okLabel : pendingLabel}
    </span>
  );
}

function FieldHint({ hint }: { hint?: string }) {
  if (!hint) return null;
  return <p className="text-xs text-text-tertiary">{hint}</p>;
}

function InputField({
  label,
  name,
  defaultValue,
  required,
  disabled,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
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
      <FieldHint hint={hint} />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
  disabled,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldHint hint={hint} />
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
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: number | null;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
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
      <FieldHint hint={hint} />
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
          <input type="checkbox" name={name} defaultChecked={defaultChecked} disabled={disabled} className="peer sr-only" />
          <span className="absolute inset-0 rounded-full border border-border-default bg-bg-secondary transition peer-checked:border-accent/60 peer-checked:bg-accent/20 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-disabled:opacity-50" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-text-tertiary transition peer-checked:translate-x-5 peer-checked:bg-accent peer-disabled:opacity-50" />
        </span>
      </div>
    </label>
  );
}
