interface ToggleSwitchProps {
  name: string;
  defaultChecked: boolean;
  disabled?: boolean;
}

/**
 * The single source of truth for dashboard toggle switches so every toggle
 * (settings, billing, etc.) is pixel-identical.
 *
 * Geometry: a 44×24 track with a 16×16 knob explicitly pinned at top-1/left-1
 * (4px clearance on every side) sliding 20px on check. Pinning both axes — and
 * leaving real breathing room — keeps the knob from appearing to bulge past the
 * pill at non-100% browser zoom / fractional device-pixel ratios, which a tight
 * 20px knob with 2px clearance did.
 */
export default function ToggleSwitch({ name, defaultChecked, disabled }: ToggleSwitchProps) {
  return (
    <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="peer sr-only"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full border border-border-default bg-bg-secondary transition-colors peer-checked:border-accent/60 peer-checked:bg-accent/20 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-disabled:opacity-50" />
      <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-text-tertiary transition peer-checked:translate-x-5 peer-checked:bg-accent peer-disabled:opacity-50" />
    </span>
  );
}
