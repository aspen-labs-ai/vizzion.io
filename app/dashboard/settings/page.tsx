import CopySnippet from '@/components/dashboard/CopySnippet';
import PageHeader from '@/components/dashboard/PageHeader';
import SettingsFocus from '@/components/dashboard/SettingsFocus';
import SubmitButton from '@/components/dashboard/SubmitButton';
import ToggleSwitch from '@/components/dashboard/ToggleSwitch';
import WidgetAppearance from '@/components/dashboard/WidgetAppearance';
import {
  regenerateEmbedKeyAction,
  updateWidgetSettingsAction,
} from '@/app/dashboard/actions';
import { getSiteUrl } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import { getEmbedLockReason, getOnboardingState } from '@/lib/vizzion/onboarding';
import { getWidgetEmailResults } from '@/lib/vizzion/widget-public';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
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
  const keyRegenerated = getSingleParam(resolvedParams.key_regenerated) === '1';
  const isOwner = context.role === 'owner';
  const widget = context.widget;

  const [mappingResult, materialsResult, emailResults] = await Promise.all([
    supabase
      .from('industry_widget_mappings')
      .select('industry_slug')
      .eq('workspace_id', context.workspace.id)
      .eq('widget_id', widget.id)
      .maybeSingle(),
    supabase
      .from('materials')
      .select('swatch_url')
      .eq('widget_id', widget.id)
      .eq('is_active', true),
    getWidgetEmailResults(supabase, widget.id),
  ]);

  const industrySlug =
    !mappingResult.error && mappingResult.data && typeof mappingResult.data.industry_slug === 'string'
      ? mappingResult.data.industry_slug
      : '';

  const activeMaterials = (materialsResult.data ?? []) as Array<{ swatch_url: string | null }>;
  const activeMaterialCount = activeMaterials.length;
  const materialsMissingImageCount = activeMaterials.filter(material => !material.swatch_url).length;

  const onboardingInput = {
    widgetId: widget.id,
    subjectType: widget.subject_type,
    targetSurface: widget.target_surface,
    domainAllowlist: widget.domain_allowlist,
    isActive: widget.is_active,
    activeMaterialCount,
    materialsMissingImageCount,
    brandCustomized: (widget.brand_color || '').toUpperCase() !== '#10B981',
    hasLogo: Boolean(context.workspace.logo_url),
  };
  const onboarding = getOnboardingState(onboardingInput);
  const isEmbedLocked = !onboarding.goLiveReady;
  const embedLockReason = getEmbedLockReason(onboardingInput);
  const domainSet = widget.domain_allowlist.length > 0;
  const targetSurfaceSet = Boolean(widget.target_surface?.trim());
  const hasMaterials = activeMaterialCount > 0;

  const widgetIdField = <input type="hidden" name="widget_id" value={widget.id} />;
  const saveButton = (label: string) => (
    <SubmitButton
      disabled={!isOwner}
      pendingLabel="Saving…"
      className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isOwner ? label : 'Owner only'}
    </SubmitButton>
  );

  return (
    <div className="space-y-6">
      <SettingsFocus />
      <PageHeader
        title="Widget Setup"
        description={`Configure ${widget.name}${widget.is_primary ? ' (primary)' : ''} — install, content, appearance, and behavior.`}
      />

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
      ) : null}
      {saved ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Settings saved.</p>
      ) : null}
      {keyRegenerated ? (
        <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">Embed key regenerated.</p>
      ) : null}
      {!isOwner ? (
        <p className="rounded-lg border border-border-default bg-bg-secondary px-4 py-3 text-sm text-text-tertiary">
          You have editor access — settings are view-only.
        </p>
      ) : null}

      {!domainSet || !targetSurfaceSet ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          A required field still needs attention before this widget can go live — it&apos;s outlined in red below.
        </p>
      ) : null}

      {/* Widget-scoped sections — keyed by widget id so every field, toggle, and the
          live preview fully reset when the active widget changes. */}
      <div key={widget.id} className="space-y-6">
      {/* 1 · GO LIVE / INSTALL */}
      <section className="rounded-2xl border border-accent/30 bg-bg-secondary p-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">1 · Go live</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Approve your website and drop the embed snippet on your site.
          </p>
        </div>

        <form action={updateWidgetSettingsAction} className="mt-5 space-y-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="domain_allowlist" />
          <div id="setting-domain_allowlist" className="vz-focus-target space-y-2">
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
          </div>
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
              <SubmitButton
                disabled={!isOwner}
                pendingLabel="Regenerating…"
                className="rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isOwner ? 'Regenerate key' : 'Owner only'}
              </SubmitButton>
            </form>
          </div>
          <div className="mb-4">
            <a
              href={`/widget-preview?widgetId=${widget.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              <ExternalLink className="h-4 w-4" />
              Preview live widget
            </a>
            <p className="mt-1.5 text-xs text-text-tertiary">
              Opens the real, interactive widget in a new tab — exactly what your visitors see, using your saved
              settings. Works before go-live; no domain approval needed.
            </p>
          </div>
          <CopySnippet
            embedKey={widget.embed_key}
            siteUrl={getSiteUrl()}
            isLocked={isEmbedLocked}
            lockReason={embedLockReason}
          />
        </div>
      </section>

      {/* 2 · WHAT VISITORS SEE */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">2 · What visitors see</h2>
        <p className="mt-1 text-sm text-text-secondary">What people upload, what the widget changes, and the looks they can try.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="subject_type,target_surface,show_product_names" />
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
          <InputField
            anchorId="setting-target_surface"
            label="What does this widget change?"
            name="target_surface"
            defaultValue={widget.target_surface ?? ''}
            disabled={!isOwner}
            required
            invalid={!targetSurfaceSet}
            invalidNote="Required to go live."
            hint="The part of the photo your materials are applied to, e.g. “the roof”, “the siding”, “the driveway”. Set it once — every material gets applied here."
          />
          <ToggleField
            name="show_product_names"
            label="Show product names"
            description="Display each material’s name in the picker. Off hides the labels entirely."
            defaultChecked={widget.show_product_names}
            disabled={!isOwner}
          />
          <div className="md:col-span-2 rounded-lg border border-border-default bg-bg-primary px-4 py-3 text-xs text-text-tertiary">
            Materials (the looks customers preview) are managed on the{' '}
            <Link href={`/dashboard/materials?widgetId=${widget.id}`} className="font-semibold text-accent hover:text-accent-hover">
              Materials page
            </Link>
            {hasMaterials ? (
              <>
                {' '}— {activeMaterialCount} active
                {materialsMissingImageCount > 0 ? (
                  <span className="text-amber-300">
                    {' '}· {materialsMissingImageCount} missing a photo
                  </span>
                ) : null}
                .
              </>
            ) : (
              <span className="text-amber-300"> — none yet. Add at least one to go live.</span>
            )}
          </div>
          <div className="md:col-span-2">{saveButton('Save content')}</div>
        </form>
      </section>

      {/* 3 · APPEARANCE */}
      <section id="setting-appearance" className="vz-focus-target rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">3 · Appearance</h2>
        <p className="mt-1 text-sm text-text-secondary">How the widget looks on your site.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="mode,theme,brand_color" />
          <SelectField
            label="Display mode"
            name="mode"
            defaultValue={widget.mode}
            disabled={!isOwner}
            hint="Inline embeds the widget right in your page, in a fixed-size box. Popup adds a button that opens the widget in an overlay, so it never shifts your page layout."
            options={[
              { value: 'inline', label: 'Inline — embedded in the page' },
              { value: 'popup', label: 'Popup — opens in an overlay' },
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

      {/* 4 · LEAD CAPTURE & DELIVERY */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">4 · Lead capture &amp; delivery</h2>
        <p className="mt-1 text-sm text-text-secondary">Collect emails and choose how visitors get their result.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="require_email,delivery_mode,email_results" />
          <ToggleField
            name="require_email"
            label="Require email"
            description="Capture an email before generating or delivering the result."
            defaultChecked={widget.require_email}
            disabled={!isOwner}
          />
          <SelectField
            label="Result delivery"
            name="delivery_mode"
            defaultValue={widget.delivery_mode === 'email' ? 'email' : 'instant'}
            disabled={!isOwner}
            hint="Instant preview shows the result on-site. Email only sends the result to the visitor instead."
            options={[
              { value: 'instant', label: 'Instant preview — show on-site' },
              { value: 'email', label: 'Email only — send result to inbox' },
            ]}
          />
          <ToggleField
            name="email_results"
            label="Also email the result"
            description="When showing the preview on-site, also email a copy to visitors who left an email."
            defaultChecked={emailResults}
            disabled={!isOwner}
          />
          {!widget.require_email ? (
            <p className="md:col-span-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              Email capture is off — you won&apos;t collect leads. Turn it on to capture and follow up.
            </p>
          ) : null}
          {widget.delivery_mode === 'email' ? (
            <p className="md:col-span-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-xs text-accent">
              Email-only delivery requires Resend in production. Visitors get the finished preview by email instead of
              on-site, and email is always required.
            </p>
          ) : null}
          <div className="md:col-span-2">{saveButton('Save lead capture')}</div>
        </form>
      </section>

      {/* 5 · BEHAVIOR */}
      <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
        <h2 className="text-lg font-semibold text-text-primary">5 · Behavior</h2>
        <p className="mt-1 text-sm text-text-secondary">Turn the widget on and control how it opens.</p>

        <form action={updateWidgetSettingsAction} className="mt-5 grid gap-4 md:grid-cols-2">
          {widgetIdField}
          <input type="hidden" name="present_fields" value="name,is_active,auto_open_widget" />
          <InputField
            label="Widget name"
            name="name"
            defaultValue={widget.name}
            required
            disabled={!isOwner}
            hint="Internal label — not shown to visitors."
          />
          <div className="hidden md:block" aria-hidden />
          <ToggleField
            anchorId="setting-is_active"
            name="is_active"
            label="Widget active"
            description="Turn off to pause the widget on your site."
            defaultChecked={widget.is_active}
            disabled={!isOwner}
          />
          <ToggleField
            name="auto_open_widget"
            label="Auto-open"
            description="Open the widget automatically on page load (popup mode)."
            defaultChecked={widget.auto_open_widget}
            disabled={!isOwner}
          />
          <div className="md:col-span-2">{saveButton('Save behavior')}</div>
        </form>
      </section>

      {/* 6 · ADVANCED */}
      <details className="group rounded-2xl border border-border-default bg-bg-secondary p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">6 · Advanced</h2>
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
            hint="Caps previews per email address, all-time. Setting this requires visitors to enter an email."
          />
          <InputField
            label="“Limit reached” link"
            name="limit_reached_cta_url"
            defaultValue={widget.limit_reached_cta_url ?? ''}
            disabled={!isOwner}
            hint="Shown to visitors who hit a limit (e.g. a contact or quote page)."
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
      </div>
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
  anchorId,
  invalid,
  invalidNote,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  anchorId?: string;
  invalid?: boolean;
  invalidNote?: string;
}) {
  return (
    <label id={anchorId} className={`block space-y-2 ${anchorId ? 'vz-focus-target' : ''}`}>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60 ${
          invalid ? 'border-red-500/60' : 'border-border-default'
        }`}
      />
      <FieldHint hint={hint} />
      {invalid && invalidNote ? <p className="text-xs text-red-300">{invalidNote}</p> : null}
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
  anchorId,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  hint?: string;
  anchorId?: string;
}) {
  return (
    <label id={anchorId} className={`block space-y-2 ${anchorId ? 'vz-focus-target' : ''}`}>
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
  anchorId,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  disabled?: boolean;
  anchorId?: string;
}) {
  return (
    <label id={anchorId} className={`block rounded-lg border border-border-default bg-bg-primary px-4 py-3 ${anchorId ? 'vz-focus-target' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-tertiary">{description}</p>
        </div>

        <ToggleSwitch name={name} defaultChecked={defaultChecked} disabled={disabled} />
      </div>
    </label>
  );
}
