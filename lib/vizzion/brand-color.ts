// Shared brand-color helpers used across server-rendered surfaces (result email,
// shared preview page). The embeddable widget keeps its own copy in
// public/widget.js since it ships as a standalone script.

const DEFAULT_BRAND_COLOR = '#10B981';

export function sanitizeBrandColor(value: string | null | undefined): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim())
    ? value.trim()
    : DEFAULT_BRAND_COLOR;
}

// WCAG relative luminance for a hex color, or null when the value is invalid.
export function relativeLuminance(hex: string): number | null {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color
      .split('')
      .map(channel => channel + channel)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(color)) {
    return null;
  }
  const toLinear = (start: number) => {
    const value = parseInt(color.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(0) + 0.7152 * toLinear(2) + 0.0722 * toLinear(4);
}

// Pick a legible text color to place ON a brand-colored background so CTAs stay
// readable whether the merchant chose a light or dark brand color.
export function readableTextOn(hex: string): string {
  const luminance = relativeLuminance(hex);
  if (luminance === null) {
    return '#ffffff';
  }
  return luminance > 0.45 ? '#06121f' : '#ffffff';
}

// The brand color is sometimes used as text/accents directly on a white surface.
// Very light brand colors wash out there, so fall back to dark slate when
// contrast against white is too low.
export function readableBrandOnLight(hex: string): string {
  const luminance = relativeLuminance(hex);
  if (luminance === null) {
    return '#0f172a';
  }
  const contrastWithWhite = 1.05 / (luminance + 0.05);
  return contrastWithWhite >= 2 ? hex : '#0f172a';
}
