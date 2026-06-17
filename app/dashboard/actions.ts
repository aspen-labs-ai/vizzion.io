'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

const MATERIAL_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
const MATERIAL_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const WORKSPACE_LOGO_MAX_BYTES = 2 * 1024 * 1024;
const WORKSPACE_LOGO_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function materialImageExtension(file: File): string {
  if (file.type === 'image/png') {
    return 'png';
  }
  if (file.type === 'image/webp') {
    return 'webp';
  }
  return 'jpg';
}

/**
 * Uploads an optional customer-provided material image to the public `materials`
 * bucket and returns its public URL. The path is prefixed with the workspace id
 * so the owner-only storage RLS policy (keyed off storage_workspace_id) permits
 * the write. Returns null when no file was provided, or an { error } when the
 * file is present but invalid.
 */
async function uploadMaterialImage(
  supabase: SupabaseClient,
  workspaceId: string,
  widgetId: string,
  fileValue: FormDataEntryValue | null,
): Promise<{ url: string } | { error: string } | null> {
  if (!(fileValue instanceof File) || fileValue.size < 1) {
    return null;
  }

  if (!MATERIAL_IMAGE_MIME_TYPES.has(fileValue.type)) {
    return { error: 'Material image must be a JPG, PNG, or WebP file.' };
  }

  if (fileValue.size > MATERIAL_IMAGE_MAX_BYTES) {
    return { error: 'Material image must be 8 MB or smaller.' };
  }

  const path = `${workspaceId}/${widgetId}/${randomUUID()}.${materialImageExtension(fileValue)}`;
  const buffer = Buffer.from(await fileValue.arrayBuffer());

  const uploadResult = await supabase.storage
    .from('materials')
    .upload(path, buffer, { contentType: fileValue.type, upsert: false });

  if (uploadResult.error) {
    return { error: 'Unable to upload the material image. Please try again.' };
  }

  return { url: supabase.storage.from('materials').getPublicUrl(path).data.publicUrl };
}

async function uploadWorkspaceLogo(
  supabase: SupabaseClient,
  workspaceId: string,
  fileValue: FormDataEntryValue | null,
): Promise<{ url: string } | { error: string } | null> {
  if (!(fileValue instanceof File) || fileValue.size < 1) {
    return null;
  }

  if (!WORKSPACE_LOGO_MIME_TYPES.has(fileValue.type)) {
    return { error: 'Logo must be a JPG, PNG, or WebP file.' };
  }

  if (fileValue.size > WORKSPACE_LOGO_MAX_BYTES) {
    return { error: 'Logo must be 2 MB or smaller.' };
  }

  const path = `${workspaceId}/logos/${randomUUID()}.${materialImageExtension(fileValue)}`;
  const buffer = Buffer.from(await fileValue.arrayBuffer());

  const uploadResult = await supabase.storage
    .from('workspace-assets')
    .upload(path, buffer, { contentType: fileValue.type, upsert: false });

  if (uploadResult.error) {
    return { error: 'Unable to upload the logo. Please try again.' };
  }

  return { url: supabase.storage.from('workspace-assets').getPublicUrl(path).data.publicUrl };
}

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function parseOptional(value: string): string | null {
  return value ? value : null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

function parseDeliveryMode(value: string): string {
  return value === 'email' ? 'email' : 'instant';
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
  if (has('target_surface')) {
    update.target_surface = parseOptional(getFormValue(formData, 'target_surface').slice(0, 120));
  }
  if (has('require_email')) {
    update.require_email = parseCheckbox(formData, 'require_email');
  }
  if (has('delivery_mode')) {
    const deliveryMode = parseDeliveryMode(getFormValue(formData, 'delivery_mode'));
    update.delivery_mode = deliveryMode;
    if (deliveryMode === 'email') {
      update.require_email = true;
    }
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

  // `email_results` is behind a migration that may not be applied yet, so write
  // it in isolation and ignore a missing-column error (42703) — the toggle
  // simply has no effect until the migration runs.
  if (has('email_results')) {
    const emailResultsUpdate = await supabase
      .from('widgets')
      .update({ email_results: parseCheckbox(formData, 'email_results') })
      .eq('id', context.widget.id)
      .eq('workspace_id', context.workspace.id);

    if (emailResultsUpdate.error && emailResultsUpdate.error.code !== '42703') {
      fail(emailResultsUpdate.error.message);
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
    redirect('/dashboard/workspace?error=Workspace+name+is+required.');
  }

  if (workspaceName.length > 80) {
    redirect('/dashboard/workspace?error=Workspace+name+must+be+80+characters+or+less.');
  }

  const replyToEmail = getFormValue(formData, 'reply_to_email').toLowerCase();
  if (replyToEmail && !isValidEmail(replyToEmail)) {
    redirect('/dashboard/workspace?error=Reply-to+email+must+be+a+valid+email+address.');
  }

  const logoResult = await uploadWorkspaceLogo(supabase, context.workspace.id, formData.get('logo_file'));
  if (logoResult && 'error' in logoResult) {
    redirect(`/dashboard/workspace?error=${encodeURIComponent(logoResult.error)}`);
  }

  const update: Record<string, unknown> = {
    name: workspaceName,
    company_name: workspaceName,
    reply_to_email: parseOptional(replyToEmail),
  };

  if (logoResult?.url) {
    update.logo_url = logoResult.url;
  } else if (parseCheckbox(formData, 'remove_logo')) {
    update.logo_url = null;
  }

  const updateResult = await supabase
    .from('workspaces')
    .update(update)
    .eq('id', context.workspace.id);

  if (updateResult.error) {
    redirect(`/dashboard/workspace?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/workspace');
  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/billing');
  redirect('/dashboard/workspace?saved=1');
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

  const imageResult = await uploadMaterialImage(
    supabase,
    context.workspace.id,
    context.widget.id,
    formData.get('image_file'),
  );
  if (imageResult && 'error' in imageResult) {
    redirect(`/dashboard/materials?error=${encodeURIComponent(imageResult.error)}${widgetSuffix(widgetId)}`);
  }

  const insertResult = await supabase.from('materials').insert({
    workspace_id: context.workspace.id,
    widget_id: context.widget.id,
    name,
    swatch_url: imageResult?.url ?? null,
    texture_url: null,
    prompt_modifier: parseOptional(getFormValue(formData, 'description')),
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

  const imageResult = await uploadMaterialImage(
    supabase,
    context.workspace.id,
    context.widget.id,
    formData.get('image_file'),
  );
  if (imageResult && 'error' in imageResult) {
    redirect(`/dashboard/materials?error=${encodeURIComponent(imageResult.error)}${widgetSuffix(widgetId)}`);
  }

  const update: Record<string, unknown> = {
    name,
    prompt_modifier: parseOptional(getFormValue(formData, 'description')),
    sort_order: parseInteger(getFormValue(formData, 'sort_order'), 0),
    is_active: parseCheckbox(formData, 'is_active'),
  };
  // Only touch the image when a new one was uploaded or removal was requested —
  // otherwise the existing swatch is left intact.
  if (imageResult?.url) {
    update.swatch_url = imageResult.url;
  } else if (parseCheckbox(formData, 'remove_image')) {
    update.swatch_url = null;
  }

  const updateResult = await supabase
    .from('materials')
    .update(update)
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
