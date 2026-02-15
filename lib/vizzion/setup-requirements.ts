export interface SetupRequirement {
  key: 'domain_allowlist';
  label: string;
  route: '/dashboard/settings';
  isComplete: boolean;
}

interface WidgetSetupInput {
  domain_allowlist?: string[] | null;
}

function normalizeAllowlist(values: string[] | null | undefined): string[] {
  return (values ?? [])
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .map(value => value.replace(/^https?:\/\//, '').replace(/\/$/, ''));
}

export function getWidgetSetupRequirements(widget: WidgetSetupInput): SetupRequirement[] {
  const normalizedAllowlist = normalizeAllowlist(widget.domain_allowlist);

  return [
    {
      key: 'domain_allowlist',
      label: 'Domain allowlist',
      route: '/dashboard/settings',
      isComplete: normalizedAllowlist.length > 0,
    },
  ];
}

export function getMissingSetupRequirements(widget: WidgetSetupInput): SetupRequirement[] {
  return getWidgetSetupRequirements(widget).filter(requirement => !requirement.isComplete);
}

export function getSetupLockReason(widget: WidgetSetupInput): string {
  const missing = getMissingSetupRequirements(widget);

  if (missing.length === 0) {
    return '';
  }

  return `Complete ${missing.map(item => item.label).join(', ')} in Settings to unlock embed code.`;
}

