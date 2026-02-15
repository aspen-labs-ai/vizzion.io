import { unstable_cache } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

export interface BillingPlanRecord {
  code: string;
  name: string;
  tagline: string;
  cta_label: string;
  featured: boolean;
  monthly_price_cents: number | null;
  annual_price_cents: number | null;
  sort_order: number;
  visualization_quota_per_cycle: number | null;
  materials_quota: number | null;
  embed_domains_quota: number | null;
}

export interface WorkspaceSubscriptionRecord {
  workspace_id: string;
  plan_code: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  overage_enabled: boolean;
  overage_cap_percent: number;
}

export interface WorkspaceBillingSummary {
  plan: BillingPlanRecord;
  subscription: WorkspaceSubscriptionRecord;
  usedUnits: number;
  baseQuotaUnits: number | null;
  creditUnits: number;
  overageCapUnits: number | null;
  totalQuotaUnits: number | null;
  usagePercent: number | null;
}

export interface ConsumeVisualizationQuotaResult {
  allowed: boolean;
  within_base_quota: boolean;
  within_overage: boolean;
  blocked: boolean;
  used_units: number;
  base_quota_units: number | null;
  overage_cap_units: number | null;
  total_quota_units: number | null;
  period_start: string;
  period_end: string;
  crossed_thresholds: number[];
}

export interface PricingFeature {
  name: string;
  values: [string, string, string, string];
}

export interface PricingFeatureGroup {
  label: string;
  features: PricingFeature[];
}

function toDisplayQuota(value: number | null): string {
  if (value === null) {
    return 'Unlimited';
  }

  return value.toLocaleString('en-US');
}

const staticFeatureGroups: PricingFeatureGroup[] = [
  {
    label: 'Features',
    features: [
      { name: 'Lead capture (email gate)', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
      { name: 'Custom branding', values: ['No', 'Yes', 'Yes', 'Yes'] },
      { name: 'Lead dashboard', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
      { name: 'Analytics export', values: ['No', 'Yes', 'Yes', 'Yes'] },
      { name: 'CRM integration', values: ['No', 'No', 'Yes', 'Yes'] },
      { name: 'API access', values: ['No', 'No', 'No', 'Yes'] },
      { name: 'Multi-location support', values: ['No', 'No', 'No', 'Yes'] },
    ],
  },
  {
    label: 'Support',
    features: [
      { name: 'Email support', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
      { name: 'Priority support', values: ['No', 'No', 'Yes', 'Yes'] },
      { name: 'Dedicated account manager', values: ['No', 'No', 'No', 'Yes'] },
    ],
  },
];

const getCachedPublicPricingPlans = unstable_cache(
  async (): Promise<BillingPlanRecord[]> => {
    try {
      const supabase = createAdminClient();
      const result = await supabase
        .from('billing_plans')
        .select(
          'code, name, tagline, cta_label, featured, monthly_price_cents, annual_price_cents, sort_order, visualization_quota_per_cycle, materials_quota, embed_domains_quota',
        )
        .eq('is_public', true)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (result.error || !result.data) {
        return [];
      }

      return result.data as BillingPlanRecord[];
    } catch {
      return [];
    }
  },
  ['public-pricing-plans-v1'],
  { revalidate: 300 },
);

export async function getPublicPricingPlans(): Promise<BillingPlanRecord[]> {
  return getCachedPublicPricingPlans();
}

export function buildPricingFeatureGroups(plans: BillingPlanRecord[]): PricingFeatureGroup[] {
  const codeOrder = ['free', 'growth', 'pro', 'enterprise'];

  const sortedPlans = [...plans].sort(
    (a, b) => codeOrder.indexOf(a.code) - codeOrder.indexOf(b.code),
  );

  if (sortedPlans.length !== 4) {
    return [
      {
        label: 'Usage',
        features: [
          { name: 'Visualizations / month', values: ['25', '200', '1,000', 'Unlimited'] },
          { name: 'Materials', values: ['4', '10', '50', 'Unlimited'] },
          { name: 'Website embeds', values: ['1', '1', '3', 'Unlimited'] },
        ],
      },
      ...staticFeatureGroups,
    ];
  }

  const usageGroup: PricingFeatureGroup = {
    label: 'Usage',
    features: [
      {
        name: 'Visualizations / month',
        values: [
          toDisplayQuota(sortedPlans[0].visualization_quota_per_cycle),
          toDisplayQuota(sortedPlans[1].visualization_quota_per_cycle),
          toDisplayQuota(sortedPlans[2].visualization_quota_per_cycle),
          toDisplayQuota(sortedPlans[3].visualization_quota_per_cycle),
        ],
      },
      {
        name: 'Materials',
        values: [
          toDisplayQuota(sortedPlans[0].materials_quota),
          toDisplayQuota(sortedPlans[1].materials_quota),
          toDisplayQuota(sortedPlans[2].materials_quota),
          toDisplayQuota(sortedPlans[3].materials_quota),
        ],
      },
      {
        name: 'Website embeds',
        values: [
          toDisplayQuota(sortedPlans[0].embed_domains_quota),
          toDisplayQuota(sortedPlans[1].embed_domains_quota),
          toDisplayQuota(sortedPlans[2].embed_domains_quota),
          toDisplayQuota(sortedPlans[3].embed_domains_quota),
        ],
      },
    ],
  };

  return [usageGroup, ...staticFeatureGroups];
}

export async function getWorkspaceBillingSummary(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<WorkspaceBillingSummary | null> {
  const subscriptionResult = await supabase
    .from('workspace_subscriptions')
    .select(
      'workspace_id, plan_code, status, current_period_start, current_period_end, overage_enabled, overage_cap_percent',
    )
    .eq('workspace_id', workspaceId)
    .maybeSingle();

  if (subscriptionResult.error || !subscriptionResult.data) {
    return null;
  }

  const subscription = subscriptionResult.data as WorkspaceSubscriptionRecord;

  const [planResult, usageResult, creditsResult] = await Promise.all([
    supabase
      .from('billing_plans')
      .select(
        'code, name, tagline, cta_label, featured, monthly_price_cents, annual_price_cents, sort_order, visualization_quota_per_cycle, materials_quota, embed_domains_quota',
      )
      .eq('code', subscription.plan_code)
      .single(),
    supabase
      .from('workspace_usage_cycles')
      .select('used_units')
      .eq('workspace_id', workspaceId)
      .eq('metric', 'visualizations')
      .eq('period_start', subscription.current_period_start)
      .maybeSingle(),
    supabase
      .from('workspace_credit_adjustments')
      .select('units_delta')
      .eq('workspace_id', workspaceId)
      .eq('metric', 'visualizations')
      .eq('period_start', subscription.current_period_start),
  ]);

  if (planResult.error || !planResult.data) {
    return null;
  }

  const plan = planResult.data as BillingPlanRecord;
  const usedUnits = (usageResult.data as { used_units: number } | null)?.used_units ?? 0;

  const creditUnits = (creditsResult.data as Array<{ units_delta: number }> | null)?.reduce(
    (sum, row) => sum + row.units_delta,
    0,
  ) ?? 0;

  const baseQuotaUnits =
    plan.visualization_quota_per_cycle === null
      ? null
      : Math.max(plan.visualization_quota_per_cycle + creditUnits, 0);

  const overageCapUnits =
    baseQuotaUnits === null
      ? null
      : subscription.overage_enabled
        ? Math.ceil((baseQuotaUnits * subscription.overage_cap_percent) / 100)
        : 0;

  const totalQuotaUnits =
    baseQuotaUnits === null || overageCapUnits === null ? null : baseQuotaUnits + overageCapUnits;

  const usagePercent =
    totalQuotaUnits === null || totalQuotaUnits <= 0
      ? null
      : Math.min((usedUnits / totalQuotaUnits) * 100, 100);

  return {
    plan,
    subscription,
    usedUnits,
    baseQuotaUnits,
    creditUnits,
    overageCapUnits,
    totalQuotaUnits,
    usagePercent,
  };
}

function parseThresholds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => (typeof item === 'number' ? item : Number.NaN))
    .filter(item => Number.isFinite(item));
}

export function mapConsumedVisualizationQuotaResult(
  value: unknown,
): ConsumeVisualizationQuotaResult | null {
  const row = Array.isArray(value)
    ? (value[0] as Record<string, unknown> | undefined)
    : (value as Record<string, unknown> | null);

  if (!row || typeof row !== 'object') {
    return null;
  }

  if (
    typeof row.allowed !== 'boolean' ||
    typeof row.within_base_quota !== 'boolean' ||
    typeof row.within_overage !== 'boolean' ||
    typeof row.blocked !== 'boolean' ||
    typeof row.used_units !== 'number' ||
    typeof row.period_start !== 'string' ||
    typeof row.period_end !== 'string'
  ) {
    return null;
  }

  return {
    allowed: row.allowed,
    within_base_quota: row.within_base_quota,
    within_overage: row.within_overage,
    blocked: row.blocked,
    used_units: row.used_units,
    base_quota_units: typeof row.base_quota_units === 'number' ? row.base_quota_units : null,
    overage_cap_units: typeof row.overage_cap_units === 'number' ? row.overage_cap_units : null,
    total_quota_units: typeof row.total_quota_units === 'number' ? row.total_quota_units : null,
    period_start: row.period_start,
    period_end: row.period_end,
    crossed_thresholds: parseThresholds(row.crossed_thresholds),
  };
}

interface UsageAlertInput {
  supabase: SupabaseClient;
  workspaceId: string;
  thresholds: number[];
  periodStart: string;
  periodEnd: string;
  usedUnits: number;
  totalQuotaUnits: number | null;
}

function buildUsageAlertHtml({
  workspaceName,
  thresholds,
  usedUnits,
  totalQuotaUnits,
  periodEnd,
}: {
  workspaceName: string;
  thresholds: number[];
  usedUnits: number;
  totalQuotaUnits: number | null;
  periodEnd: string;
}): string {
  const thresholdsText = thresholds.map(value => `${value}%`).join(', ');
  const quotaText = totalQuotaUnits === null ? 'Unlimited' : totalQuotaUnits.toLocaleString('en-US');
  const periodEndText = new Date(periodEnd).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `<div style="font-family:Arial,sans-serif;background:#0d1117;color:#f9fafb;padding:24px;line-height:1.5;">
    <h2 style="margin:0 0 12px;color:#10B981;">Vizzion usage alert</h2>
    <p style="margin:0 0 8px;"><strong>${workspaceName}</strong> crossed usage threshold(s): <strong>${thresholdsText}</strong>.</p>
    <p style="margin:0 0 8px;">Current cycle usage: <strong>${usedUnits.toLocaleString('en-US')}</strong> / <strong>${quotaText}</strong>.</p>
    <p style="margin:0;color:#9ca3af;font-size:13px;">Current cycle ends on ${periodEndText}.</p>
  </div>`;
}

export async function notifyUsageThresholdAlerts({
  supabase,
  workspaceId,
  thresholds,
  periodStart,
  periodEnd,
  usedUnits,
  totalQuotaUnits,
}: UsageAlertInput): Promise<void> {
  if (thresholds.length === 0) {
    return;
  }

  const uniqueThresholds = Array.from(new Set(thresholds)).filter(
    threshold => Number.isFinite(threshold) && threshold >= 1 && threshold <= 100,
  );

  if (uniqueThresholds.length === 0) {
    return;
  }

  const alertRows = uniqueThresholds.map(threshold => ({
    workspace_id: workspaceId,
    metric: 'visualizations',
    period_start: periodStart,
    threshold_percent: threshold,
  }));

  const alertInsertResult = await supabase
    .from('workspace_usage_alerts')
    .upsert(alertRows, {
      onConflict: 'workspace_id,metric,period_start,threshold_percent',
      ignoreDuplicates: true,
    })
    .select('threshold_percent');

  if (alertInsertResult.error || !alertInsertResult.data || alertInsertResult.data.length === 0) {
    return;
  }

  const insertedThresholds = (alertInsertResult.data as Array<{ threshold_percent: number }>).map(
    row => row.threshold_percent,
  );

  const [workspaceResult, ownersResult] = await Promise.all([
    supabase.from('workspaces').select('name').eq('id', workspaceId).maybeSingle(),
    supabase
      .from('workspace_users')
      .select('user_id')
      .eq('workspace_id', workspaceId)
      .eq('role', 'owner'),
  ]);

  const workspaceName =
    (workspaceResult.data as { name: string } | null)?.name ?? 'Workspace';
  const ownerIds =
    ((ownersResult.data as Array<{ user_id: string }> | null) ?? []).map(row => row.user_id);

  if (ownerIds.length === 0) {
    return;
  }

  const ownerUsers = await Promise.all(ownerIds.map(id => supabase.auth.admin.getUserById(id)));
  const recipientEmails = ownerUsers
    .map(result => result.data.user?.email)
    .filter((value): value is string => Boolean(value));

  if (recipientEmails.length === 0) {
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    return;
  }

  const resend = new Resend(resendApiKey);
  const highestThreshold = Math.max(...insertedThresholds);

  await resend.emails.send({
    from: resendFromEmail,
    to: recipientEmails,
    subject: `Vizzion usage alert: ${highestThreshold}% of quota reached`,
    html: buildUsageAlertHtml({
      workspaceName,
      thresholds: insertedThresholds,
      usedUnits,
      totalQuotaUnits,
      periodEnd,
    }),
  });
}
