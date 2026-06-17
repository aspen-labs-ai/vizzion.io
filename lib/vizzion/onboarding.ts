/**
 * Single source of truth for widget onboarding / go-live readiness.
 *
 * Replaces the previous split between `setup-requirements.ts` (embed lock, 2
 * items) and the ad-hoc `setupSteps` array on the dashboard (4 items). Everything
 * — the onboarding assistant, the embed-code lock, the nav "needs attention"
 * dots, and the materials image surfacing — is derived from `getOnboardingState`
 * so the dashboard never disagrees with itself about what "done" means.
 */

export type OnboardingStepKey =
  | 'materials'
  | 'target_surface'
  | 'domain'
  | 'activate'
  | 'material_images'
  | 'logo'
  | 'appearance';

export type OnboardingGroup = 'required' | 'recommended';

export interface OnboardingInput {
  widgetId: string;
  subjectType: string;
  targetSurface: string | null;
  domainAllowlist: string[] | null | undefined;
  isActive: boolean;
  /** Count of active materials on the widget. */
  activeMaterialCount: number;
  /** Active materials that have no swatch photo (rely on name/description only). */
  materialsMissingImageCount: number;
  /** Whether the widget brand color differs from the default emerald. */
  brandCustomized: boolean;
  /** Whether the workspace has uploaded a logo. */
  hasLogo: boolean;
}

export interface OnboardingStep {
  key: OnboardingStepKey;
  group: OnboardingGroup;
  title: string;
  description: string;
  done: boolean;
  /** True when this step must be complete before the embed snippet unlocks. */
  gatesEmbed: boolean;
  /** Deep link to the exact place to complete the step (focus param highlights the field). */
  href: string;
  cta: string;
  /** Short, plain-language how-to shown when the step is expanded. */
  howTo: string[];
  /** Optional count badge, e.g. "2 need a photo". */
  badge?: string;
}

export interface OnboardingState {
  steps: OnboardingStep[];
  requiredSteps: OnboardingStep[];
  recommendedSteps: OnboardingStep[];
  requiredTotal: number;
  requiredDone: number;
  recommendedTotal: number;
  recommendedDone: number;
  /** All embed-gating steps complete — the widget can serve a useful preview. */
  goLiveReady: boolean;
  /** Every step (required + recommended) complete. */
  fullyComplete: boolean;
  materialsMissingImageCount: number;
  activeMaterialCount: number;
}

function normalizeAllowlist(values: string[] | null | undefined): string[] {
  return (values ?? [])
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .map(value => value.replace(/^https?:\/\//, '').replace(/\/$/, ''));
}

function widgetHref(base: string, widgetId: string, focus?: string): string {
  const params = new URLSearchParams();
  if (widgetId) {
    params.set('widgetId', widgetId);
  }
  if (focus) {
    params.set('focus', focus);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function getOnboardingState(input: OnboardingInput): OnboardingState {
  const widgetId = input.widgetId;
  const hasMaterials = input.activeMaterialCount > 0;
  const targetSurfaceSet = Boolean(input.targetSurface?.trim());
  const domainSet = normalizeAllowlist(input.domainAllowlist).length > 0;
  const allImagesPresent = hasMaterials && input.materialsMissingImageCount === 0;

  const steps: OnboardingStep[] = [
    {
      key: 'materials',
      group: 'required',
      title: 'Add a material to preview',
      description: 'Create at least one look (a product, finish, or color) visitors can try on their photo.',
      done: hasMaterials,
      gatesEmbed: true,
      href: widgetHref('/dashboard/materials', widgetId, 'add'),
      cta: hasMaterials ? 'Manage materials' : 'Add your first material',
      howTo: [
        'Open Materials and click "Add Material".',
        'Give it a clear name (e.g. "Charcoal Asphalt Shingles").',
        'Upload a flat, straight-on photo of the material for the most accurate preview — or add a short description.',
      ],
    },
    {
      key: 'target_surface',
      group: 'required',
      title: 'Set the target surface',
      description: 'Tell Vizzion which part of the photo changes — like the roof, siding, or driveway.',
      done: targetSurfaceSet,
      gatesEmbed: true,
      href: widgetHref('/dashboard/settings', widgetId, 'target_surface'),
      cta: targetSurfaceSet ? 'Edit target surface' : 'Set target surface',
      howTo: [
        'Open Setup → "What visitors see".',
        'In "What does this widget change?", enter the surface your materials apply to.',
        'Keep it short: "the roof", "the siding", "the driveway".',
      ],
    },
    {
      key: 'domain',
      group: 'required',
      title: 'Add your website domain',
      description: 'Approve the site where the widget will run. Required before it can go live.',
      done: domainSet,
      gatesEmbed: true,
      href: widgetHref('/dashboard/settings', widgetId, 'domain_allowlist'),
      cta: domainSet ? 'Review domains' : 'Add domain',
      howTo: [
        'Open Setup → "Go live".',
        'Enter the domain where the widget will live (one per line).',
        'Use the real site, e.g. "yoursite.com" — each domain covers all its pages.',
      ],
    },
    {
      key: 'activate',
      group: 'required',
      title: 'Activate the widget',
      description: 'Turn the widget on so visitors can use it on your site.',
      done: input.isActive,
      gatesEmbed: false,
      href: widgetHref('/dashboard/settings', widgetId, 'is_active'),
      cta: input.isActive ? 'Widget is active' : 'Activate widget',
      howTo: [
        'Open Setup → "Behavior".',
        'Switch "Widget active" on.',
      ],
    },
    {
      key: 'material_images',
      group: 'recommended',
      title: 'Add photos to your materials',
      description:
        'Material photos are used as a visual reference, so previews match the real product far more closely.',
      done: allImagesPresent,
      gatesEmbed: false,
      href: widgetHref('/dashboard/materials', widgetId, 'images'),
      cta: 'Add material photos',
      howTo: [
        'Open Materials and edit each look without a photo.',
        'Upload a flat, evenly lit, straight-on photo with true-to-life color.',
        'Avoid steep angles, harsh shadows, and busy backgrounds.',
      ],
      badge:
        hasMaterials && input.materialsMissingImageCount > 0
          ? `${input.materialsMissingImageCount} need${input.materialsMissingImageCount === 1 ? 's' : ''} a photo`
          : undefined,
    },
    {
      key: 'logo',
      group: 'recommended',
      title: 'Add your business logo',
      description:
        'Your logo is the face of every result your customers receive — add a high-quality one.',
      done: input.hasLogo,
      gatesEmbed: false,
      href: '/dashboard/workspace?focus=logo',
      cta: input.hasLogo ? 'Update logo' : 'Upload your logo',
      howTo: [
        'Open Workspace → Company logo and upload a PNG, JPG, or WebP (max 2 MB).',
        'Use a high-resolution logo (~512px+ wide) with a transparent or clean background and true brand colors — it should stay crisp and legible when small.',
        'It appears on the result emails customers receive, the shared before/after preview page, and as a watermark on downloaded images.',
      ],
    },
    {
      key: 'appearance',
      group: 'recommended',
      title: 'Set your brand color',
      description: 'Match the widget and result emails to your brand color and theme.',
      done: input.brandCustomized,
      gatesEmbed: false,
      href: widgetHref('/dashboard/settings', widgetId, 'appearance'),
      cta: 'Customize appearance',
      howTo: [
        'Open Setup → "Appearance".',
        'Pick your brand color and light/dark theme — it carries into the widget and the result emails.',
      ],
    },
  ];

  const requiredSteps = steps.filter(step => step.group === 'required');
  const recommendedSteps = steps.filter(step => step.group === 'recommended');
  const requiredDone = requiredSteps.filter(step => step.done).length;
  const recommendedDone = recommendedSteps.filter(step => step.done).length;
  const goLiveReady = steps.filter(step => step.gatesEmbed).every(step => step.done);

  return {
    steps,
    requiredSteps,
    recommendedSteps,
    requiredTotal: requiredSteps.length,
    requiredDone,
    recommendedTotal: recommendedSteps.length,
    recommendedDone,
    goLiveReady,
    fullyComplete: steps.every(step => step.done),
    materialsMissingImageCount: input.materialsMissingImageCount,
    activeMaterialCount: input.activeMaterialCount,
  };
}

/** Embed-gating steps that are still incomplete. */
export function getEmbedBlockingSteps(input: OnboardingInput): OnboardingStep[] {
  return getOnboardingState(input).steps.filter(step => step.gatesEmbed && !step.done);
}

export function isEmbedLocked(input: OnboardingInput): boolean {
  return getEmbedBlockingSteps(input).length > 0;
}

export function getEmbedLockReason(input: OnboardingInput): string {
  const missing = getEmbedBlockingSteps(input);
  if (missing.length === 0) {
    return '';
  }

  const labels = missing.map(step => step.title.toLowerCase());
  return `Finish setup to unlock your embed code: ${labels.join(', ')}.`;
}

/**
 * Severity of a nav "needs attention" dot:
 * - 'attention' (red): a required, go-live-blocking item is missing.
 * - 'warning' (yellow): a recommended improvement is outstanding (e.g. a
 *   material is missing its photo).
 */
export type NavAlertLevel = 'attention' | 'warning';

/** Which nav items should show a dot, and at what severity. */
export function getOnboardingNavAlerts(
  input: OnboardingInput,
): Record<string, NavAlertLevel | undefined> {
  const state = getOnboardingState(input);

  // Settings only flags the fields that actually live on the Setup page
  // (target surface, domain) — materials gating is surfaced on the Materials nav.
  const settingsNeedsAttention = state.steps.some(
    step =>
      step.gatesEmbed && !step.done && step.href.startsWith('/dashboard/settings'),
  );

  let materials: NavAlertLevel | undefined;
  if (input.activeMaterialCount === 0) {
    materials = 'attention';
  } else if (input.materialsMissingImageCount > 0) {
    materials = 'warning';
  }

  return {
    '/dashboard/settings': settingsNeedsAttention ? 'attention' : undefined,
    '/dashboard/materials': materials,
    // A missing logo is a recommended branding improvement, not a blocker.
    '/dashboard/workspace': input.hasLogo ? undefined : 'warning',
  };
}
