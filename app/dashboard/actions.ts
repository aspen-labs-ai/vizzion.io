'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseOptional(value: string): string | null {
  return value ? value : null;
}

function parseInteger(value: string, fallback = 0): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOptionalPositiveInteger(value: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return Number.NaN;
  }

  return parsed;
}

function parseCheckbox(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

function getFirstRpcRow<T extends Record<string, unknown>>(value: unknown): T | null {
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (first && typeof first === 'object') {
      return first as T;
    }
  }

  if (value && typeof value === 'object') {
    return value as T;
  }

  return null;
}

function sanitizeDomainAllowlist(rawValue: string): string[] {
  return rawValue
    .split(/[\n,]/)
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .map(value => value.replace(/^https?:\/\//, '').replace(/\/$/, ''));
}

function sanitizeIndustrySlug(value: string): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || null;
}

function parseSubjectType(value: string): string {
  if (
    value === 'home'
    || value === 'vehicle'
    || value === 'body'
    || value === 'yard'
    || value === 'boat'
    || value === 'room'
    || value === 'generic'
  ) {
    return value;
  }

  return 'home';
}

async function requireOwnerContext(widgetId?: string | null) {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase, widgetId || undefined);

  if (!context) {
    redirect('/auth/sign-in');
  }

  if (context.role !== 'owner') {
    redirect('/dashboard?error=Only+workspace+owners+can+make+changes.');
  }

  return { supabase, context };
}

/** Builds a trailing query suffix that preserves the selected widget across redirects. */
function widgetSuffix(widgetId: string | null | undefined): string {
  return widgetId ? `&widgetId=${encodeURIComponent(widgetId)}` : '';
}

export async function updateWidgetSettingsAction(formData: FormData) {
  const widgetId = getFormValue(formData, 'widget_id') || null;
  const { supabase, context } = await requireOwnerContext(widgetId);
  const suffix = widgetSuffix(context.widget.id);
  const fail = (message: string): never =>
    redirect(`/dashboard/settings?error=${encodeURIComponent(message)}${suffix}`);

  // Only the fields this section submitted (declared via the hidden present_fields
  // input) are touched — so a section can save without resetting fields it doesn't show.
  const present = new Set(
    getFormValue(formData, 'present_fields')
      .split(',')
      .map(field => field.trim())
      .filter(Boolean),
  );
  const has = (field: string) => present.has(field);

  const update: Record<string, unknown> = {};

  if (has('name')) {
    update.name = getFormValue(formData, 'name') || context.widget.name;
  }
  if (has('mode')) {
    update.mode = getFormValue(formData, 'mode') === 'popup' ? 'popup' : 'inline';
  }
  if (has('theme')) {
    update.theme = getFormValue(formData, 'theme') === 'light' ? 'light' : 'dark';
  }
  if (has('brand_color')) {
    const raw = (getFormValue(formData, 'brand_color') || '').trim();
    update.brand_color = /^#[0-9a-fA-F]{6}$/.test(raw)
      ? raw.toUpperCase()
      : context.widget.brand_color || '#10B981';
  }
  if (has('subject_type')) {
    update.subject_type = parseSubjectType(getFormValue(formData, 'subject_type'));
  }
  if (has('require_email')) {
    update.require_email = parseCheckbox(formData, 'require_email');
  }
  if (has('auto_open_widget')) {
    update.auto_open_widget = parseCheckbox(formData, 'auto_open_widget');
  }
  if (has('show_product_names')) {
    update.show_product_names = parseCheckbox(formData, 'show_product_names');
  }
  if (has('is_active')) {
    update.is_active = parseCheckbox(formData, 'is_active');
  }
  if (has('limit_reached_cta_url')) {
    update.limit_reached_cta_url = parseOptional(getFormValue(formData, 'limit_reached_cta_url'));
  }
  if (has('max_generations_per_session')) {
    const value = parseOptionalPositiveInteger(getFormValue(formData, 'max_generations_per_session'));
    if (Number.isNaN(value)) {
      fail('Max generations per session must be 1 or greater.');
    }
    update.max_generations_per_session = value;
  }
  if (has('max_generations_per_email_lifetime')) {
    const value = parseOptionalPositiveInteger(
      getFormValue(formData, 'max_generations_per_email_lifetime'),
    );
    if (Number.isNaN(value)) {
      fail('Max generations per email must be 1 or greater.');
    }
    update.max_generations_per_email_lifetime = value;
  }

  if (has('domain_allowlist')) {
    const domainAllowlist = sanitizeDomainAllowlist(getFormValue(formData, 'domain_allowlist'));

    const domainQuotaResult = await supabase.rpc('check_embed_domain_quota', {
      workspace_uuid: context.workspace.id,
      widget_uuid: context.widget.id,
      proposed_allowlist: domainAllowlist,
    });
    const domainQuota = getFirstRpcRow<{
      allowed: boolean;
      current_domain_count: number;
      requested_domain_count: number;
      quota: number | null;
    }>(domainQuotaResult.data);

    if (domainQuotaResult.error || !domainQuota) {
      fail('Unable to validate embed domain limits.');
    } else if (!domainQuota.allowed) {
      const quotaLabel = domainQuota.quota === null ? 'unlimited' : domainQuota.quota.toString();
      fail(
        `Embed domain limit reached (${domainQuota.requested_domain_count}/${quotaLabel}). Upgrade your plan to add more domains.`,
      );
    }

    update.domain_allowlist = domainAllowlist;
  }

  if (Object.keys(update).length > 0) {
    const updateResult = await supabase
      .from('widgets')
      .update(update)
      .eq('id', context.widget.id)
      .eq('workspace_id', context.workspace.id);

    if (updateResult.error) {
      fail(updateResult.error.message);
    }
  }

  if (has('industry_slug')) {
    const industrySlug = sanitizeIndustrySlug(getFormValue(formData, 'industry_slug'));

    const clearMappingResult = await supabase
      .from('industry_widget_mappings')
      .delete()
      .eq('workspace_id', context.workspace.id)
      .eq('widget_id', context.widget.id);

    if (clearMappingResult.error) {
      fail(clearMappingResult.error.message);
    }

    if (industrySlug) {
      const mappingResult = await supabase.from('industry_widget_mappings').upsert(
        {
          workspace_id: context.workspace.id,
          widget_id: context.widget.id,
          industry_slug: industrySlug,
        },
        { onConflict: 'workspace_id,industry_slug' },
      );

      if (mappingResult.error) {
        fail(mappingResult.error.message);
      }
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/portfolio');
  revalidatePath('/dashboard/settings');
  redirect(`/dashboard/settings?saved=1${suffix}`);
}

export async function updateWorkspaceProfileAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();

  const workspaceName = getFormValue(formData, 'workspace_name');
  if (!workspaceName) {
    redirect('/dashboard/settings?error=Workspace+name+is+required.');
  }

  if (workspaceName.length > 80) {
    redirect('/dashboard/settings?error=Workspace+name+must+be+80+characters+or+less.');
  }

  const updateResult = await supabase
    .from('workspaces')
    .update({
      name: workspaceName,
      company_name: workspaceName,
    })
    .eq('id', context.workspace.id);

  if (updateResult.error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/billing');
  redirect('/dashboard/settings?workspace_saved=1');
}

export async function regenerateEmbedKeyAction(formData: FormData) {
  const widgetId = getFormValue(formData, 'widget_id') || null;
  const { supabase, context } = await requireOwnerContext(widgetId);

  const keyResult = await supabase.rpc('generate_embed_key');
  const newKey = typeof keyResult.data === 'string' ? keyResult.data : null;

  if (keyResult.error || !newKey) {
    redirect(`/dashboard/settings?error=Unable+to+regenerate+embed+key.${widgetSuffix(context.widget.id)}`);
  }

  const updateResult = await supabase
    .from('widgets')
    .update({ embed_key: newKey })
    .eq('id', context.widget.id)
    .eq('workspace_id', context.workspace.id);

  if (updateResult.error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(updateResult.error.message)}${widgetSuffix(context.widget.id)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  redirect(`/dashboard/settings?key_regenerated=1${widgetSuffix(context.widget.id)}`);
}

export async function createWidgetAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();

  const name = getFormValue(formData, 'name') || 'New Widget';
  const subjectType = parseSubjectType(getFormValue(formData, 'subject_type'));

  const insertResult = await supabase
    .from('widgets')
    .insert({
      workspace_id: context.workspace.id,
      name,
      subject_type: subjectType,
      is_primary: false,
      mode: 'inline',
      theme: 'dark',
    })
    .select('id')
    .single();

  if (insertResult.error || !insertResult.data) {
    redirect(
      `/dashboard/settings?error=${encodeURIComponent(insertResult.error?.message ?? 'Unable to create widget.')}`,
    );
  }

  const newId = (insertResult.data as { id: string }).id;
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  redirect(`/dashboard/settings?saved=1${widgetSuffix(newId)}`);
}

export async function createMaterialAction(formData: FormData) {
  const widgetId = getFormValue(formData, 'widget_id') || null;
  const { supabase, context } = await requireOwnerContext(widgetId);

  const name = getFormValue(formData, 'name');
  if (!name) {
    redirect(`/dashboard/materials?error=Material+name+is+required.${widgetSuffix(widgetId)}`);
  }

  const quotaCheckResult = await supabase.rpc('check_material_quota', {
    workspace_uuid: context.workspace.id,
  });
  const materialQuota = getFirstRpcRow<{
    allowed: boolean;
    current_count: number;
    quota: number | null;
  }>(quotaCheckResult.data);

  if (quotaCheckResult.error || !materialQuota) {
    redirect('/dashboard/materials?error=Unable+to+validate+material+limits.');
  }

  if (!materialQuota.allowed) {
    const quotaLabel =
      materialQuota.quota === null ? 'unlimited' : materialQuota.quota.toString();
    redirect(
      `/dashboard/materials?error=${encodeURIComponent(
        `Material limit reached (${materialQuota.current_count}/${quotaLabel}). Upgrade your plan to add more materials.`,
      )}`,
    );
  }

  const insertResult = await supabase.from('materials').insert({
    workspace_id: context.workspace.id,
    widget_id: context.widget.id,
    name,
    swatch_url: parseOptional(getFormValue(formData, 'swatch_url')),
    texture_url: parseOptional(getFormValue(formData, 'texture_url')),
    prompt_modifier: parseOptional(getFormValue(formData, 'prompt_modifier')),
    sort_order: parseInteger(getFormValue(formData, 'sort_order'), 0),
    is_active: parseCheckbox(formData, 'is_active'),
  });

  if (insertResult.error) {
    redirect(`/dashboard/materials?error=${encodeURIComponent(insertResult.error.message)}${widgetSuffix(widgetId)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/materials');
  redirect(`/dashboard/materials?saved=1${widgetSuffix(widgetId)}`);
}

export async function updateMaterialAction(formData: FormData) {
  const widgetId = getFormValue(formData, 'widget_id') || null;
  const { supabase, context } = await requireOwnerContext(widgetId);

  const materialId = getFormValue(formData, 'material_id');
  const name = getFormValue(formData, 'name');

  if (!materialId || !name) {
    redirect(`/dashboard/materials?error=Invalid+material+update+request.${widgetSuffix(widgetId)}`);
  }

  const updateResult = await supabase
    .from('materials')
    .update({
      name,
      swatch_url: parseOptional(getFormValue(formData, 'swatch_url')),
      texture_url: parseOptional(getFormValue(formData, 'texture_url')),
      prompt_modifier: parseOptional(getFormValue(formData, 'prompt_modifier')),
      sort_order: parseInteger(getFormValue(formData, 'sort_order'), 0),
      is_active: parseCheckbox(formData, 'is_active'),
    })
    .eq('id', materialId)
    .eq('workspace_id', context.workspace.id)
    .eq('widget_id', context.widget.id);

  if (updateResult.error) {
    redirect(`/dashboard/materials?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/materials');
  redirect(`/dashboard/materials?saved=1${widgetSuffix(widgetId)}`);
}

export async function deleteMaterialAction(formData: FormData) {
  const widgetId = getFormValue(formData, 'widget_id') || null;
  const { supabase, context } = await requireOwnerContext(widgetId);
  const materialId = getFormValue(formData, 'material_id');

  if (!materialId) {
    redirect(`/dashboard/materials?error=Missing+material+id.${widgetSuffix(widgetId)}`);
  }

  const deleteResult = await supabase
    .from('materials')
    .delete()
    .eq('id', materialId)
    .eq('workspace_id', context.workspace.id)
    .eq('widget_id', context.widget.id);

  if (deleteResult.error) {
    redirect(`/dashboard/materials?error=${encodeURIComponent(deleteResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/materials');
  redirect(`/dashboard/materials?deleted=1${widgetSuffix(widgetId)}`);
}

export async function updateOverageSettingsAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();
  const overageEnabled = parseCheckbox(formData, 'overage_enabled');
  const overageCapInput = getFormValue(formData, 'overage_cap_percent');
  const overageCapPercent = Math.min(Math.max(parseInteger(overageCapInput, 20), 0), 100);

  const subscriptionResult = await supabase
    .from('workspace_subscriptions')
    .select('plan_code')
    .eq('workspace_id', context.workspace.id)
    .maybeSingle();

  const planCode = (subscriptionResult.data as { plan_code: string } | null)?.plan_code ?? null;

  if (planCode === 'free') {
    redirect('/dashboard/billing?error=Overage+protection+is+not+available+on+the+Free+plan.');
  }

  const updateResult = await supabase.rpc('update_workspace_overage_settings', {
    workspace_uuid: context.workspace.id,
    new_overage_enabled: overageEnabled,
    new_overage_cap_percent: overageCapPercent,
  });

  if (updateResult.error) {
    redirect(`/dashboard/billing?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/billing');
  redirect('/dashboard/billing?billing_saved=1');
}
