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

async function requireOwnerContext() {
  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase);

  if (!context) {
    redirect('/auth/sign-in');
  }

  if (context.role !== 'owner') {
    redirect('/dashboard?error=Only+workspace+owners+can+make+changes.');
  }

  return { supabase, context };
}

export async function updateWidgetSettingsAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();

  const name = getFormValue(formData, 'name') || context.widget.name;
  const mode = getFormValue(formData, 'mode') === 'popup' ? 'popup' : 'inline';
  const theme = getFormValue(formData, 'theme') === 'light' ? 'light' : 'dark';
  const domainAllowlist = sanitizeDomainAllowlist(getFormValue(formData, 'domain_allowlist'));
  const maxGenerationsPerSession = parseOptionalPositiveInteger(
    getFormValue(formData, 'max_generations_per_session'),
  );
  const maxGenerationsPerEmailLifetime = parseOptionalPositiveInteger(
    getFormValue(formData, 'max_generations_per_email_lifetime'),
  );
  const limitReachedCtaUrl = parseOptional(getFormValue(formData, 'limit_reached_cta_url'));

  if (Number.isNaN(maxGenerationsPerSession)) {
    redirect('/dashboard/settings?error=Max+generations+per+session+must+be+1+or+greater.');
  }

  if (Number.isNaN(maxGenerationsPerEmailLifetime)) {
    redirect('/dashboard/settings?error=Max+generations+per+email+must+be+1+or+greater.');
  }

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
    redirect('/dashboard/settings?error=Unable+to+validate+embed+domain+limits.');
  }

  if (!domainQuota.allowed) {
    const quotaLabel =
      domainQuota.quota === null ? 'unlimited' : domainQuota.quota.toString();
    redirect(
      `/dashboard/settings?error=${encodeURIComponent(
        `Embed domain limit reached (${domainQuota.requested_domain_count}/${quotaLabel}). Upgrade your plan to add more domains.`,
      )}`,
    );
  }

  const updateResult = await supabase
    .from('widgets')
    .update({
      name,
      mode,
      theme,
      domain_allowlist: domainAllowlist,
      require_email: parseCheckbox(formData, 'require_email'),
      auto_open_widget: parseCheckbox(formData, 'auto_open_widget'),
      show_product_names: parseCheckbox(formData, 'show_product_names'),
      is_active: parseCheckbox(formData, 'is_active'),
      max_generations_per_session: maxGenerationsPerSession,
      max_generations_per_email_lifetime: maxGenerationsPerEmailLifetime,
      limit_reached_cta_url: limitReachedCtaUrl,
    })
    .eq('id', context.widget.id)
    .eq('workspace_id', context.workspace.id);

  if (updateResult.error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings?saved=1');
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

export async function regenerateEmbedKeyAction() {
  const { supabase, context } = await requireOwnerContext();

  const keyResult = await supabase.rpc('generate_embed_key');
  const newKey = typeof keyResult.data === 'string' ? keyResult.data : null;

  if (keyResult.error || !newKey) {
    redirect('/dashboard/settings?error=Unable+to+regenerate+embed+key.');
  }

  const updateResult = await supabase
    .from('widgets')
    .update({ embed_key: newKey })
    .eq('id', context.widget.id)
    .eq('workspace_id', context.workspace.id);

  if (updateResult.error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(updateResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings?key_regenerated=1');
}

export async function createMaterialAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();

  const name = getFormValue(formData, 'name');
  if (!name) {
    redirect('/dashboard/materials?error=Material+name+is+required.');
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
    redirect(`/dashboard/materials?error=${encodeURIComponent(insertResult.error.message)}`);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/materials');
  redirect('/dashboard/materials?saved=1');
}

export async function updateMaterialAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();

  const materialId = getFormValue(formData, 'material_id');
  const name = getFormValue(formData, 'name');

  if (!materialId || !name) {
    redirect('/dashboard/materials?error=Invalid+material+update+request.');
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
  redirect('/dashboard/materials?saved=1');
}

export async function deleteMaterialAction(formData: FormData) {
  const { supabase, context } = await requireOwnerContext();
  const materialId = getFormValue(formData, 'material_id');

  if (!materialId) {
    redirect('/dashboard/materials?error=Missing+material+id.');
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
  redirect('/dashboard/materials?deleted=1');
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
