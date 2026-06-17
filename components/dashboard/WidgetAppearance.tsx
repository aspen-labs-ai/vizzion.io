'use client';

import { useMemo, useState } from 'react';

interface WidgetAppearanceProps {
  defaultTheme: string;
  defaultColor: string;
  disabled?: boolean;
}

const PALETTES = {
  dark: {
    grad: 'radial-gradient(130% 130% at 0% 0%,#14213c 0%,#0f172a 46%,#0b1220 100%)',
    surface: 'rgba(2,6,23,0.5)',
    line: 'rgba(148,163,184,0.3)',
    strong: '#f8fafc',
    text: '#e8edf4',
    muted: '#94a3b8',
  },
  light: {
    grad: 'linear-gradient(180deg,#ffffff 0%,#eef2f7 100%)',
    surface: '#f4f6fa',
    line: 'rgba(15,23,42,0.18)',
    strong: '#0f172a',
    text: '#27313f',
    muted: '#5b6472',
  },
} as const;

function readableTextOn(hex: string): string {
  let color = hex.replace('#', '');
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(color)) {
    return '#06121f';
  }
  const channel = (start: number) => {
    const c = parseInt(color.slice(start, start + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance > 0.45 ? '#06121f' : '#ffffff';
}

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  );
}

export default function WidgetAppearance({ defaultTheme, defaultColor, disabled }: WidgetAppearanceProps) {
  const [theme, setTheme] = useState(defaultTheme === 'light' ? 'light' : 'dark');
  const [color, setColor] = useState(
    /^#[0-9a-fA-F]{6}$/.test(defaultColor) ? defaultColor : '#10B981',
  );

  const palette = PALETTES[theme === 'light' ? 'light' : 'dark'];
  const onBrand = useMemo(() => readableTextOn(color), [color]);

  return (
    <>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-text-secondary">Theme</span>
        <select
          name="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-border-default bg-bg-primary px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent/60 disabled:opacity-60"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-text-secondary">Brand Color</span>
        <span className="flex items-center gap-3">
          <input
            type="color"
            name="brand_color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={disabled}
            aria-label="Widget accent color"
            className="h-10 w-14 cursor-pointer rounded-lg border border-border-default bg-bg-primary p-1 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <span className="font-mono text-sm uppercase text-text-tertiary">{color}</span>
        </span>
      </label>

      <div className="md:col-span-2 space-y-2">
        <div>
          <span className="text-sm font-medium text-text-secondary">Style preview</span>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Updates instantly as you adjust theme and color — no save needed. To test the real, interactive
            widget, use “Preview live widget” under Go live.
          </p>
        </div>
        <div
          aria-hidden
          style={{
            background: palette.grad,
            border: `1px solid ${palette.line}`,
            borderRadius: 18,
            padding: 18,
            color: palette.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            maxWidth: 380,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: palette.strong, letterSpacing: '-0.01em' }}>
            Your Widget
          </div>
          <div style={{ fontSize: 12, color: palette.muted, marginTop: 2 }}>
            Upload, choose, and reveal a realistic preview.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '14px 0' }}>
            {[1, 2, 3].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${n <= 2 ? color : palette.line}`,
                    background: n === 1 ? color : palette.surface,
                    color: n === 1 ? onBrand : n === 2 ? palette.strong : palette.muted,
                    boxShadow: n === 2 ? `0 0 0 4px color-mix(in srgb, ${color} 16%, transparent)` : 'none',
                  }}
                >
                  {n === 1 ? <Check color={onBrand} /> : n}
                </div>
                {i < 2 ? <div style={{ width: 22, height: 2, borderRadius: 999, background: n === 1 ? color : palette.line }} /> : null}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: palette.strong, marginBottom: 10 }}>
            Step 2 · Choose your look
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[true, false].map((active, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `1px solid ${active ? color : palette.line}`,
                  background: palette.surface,
                  boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)` : 'none',
                }}
              >
                <div style={{ height: 46, background: `linear-gradient(135deg, ${palette.muted}33, ${palette.surface})` }} />
                {active ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check color={onBrand} />
                  </div>
                ) : null}
                <div style={{ padding: '7px 9px', fontSize: 11.5, color: palette.text }}>
                  {idx === 0 ? 'Charcoal Shingles' : 'Standing Seam'}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 42,
              borderRadius: 12,
              background: `linear-gradient(180deg, color-mix(in srgb, ${color} 90%, #fff), ${color})`,
              color: onBrand,
              fontWeight: 700,
              fontSize: 13.5,
              boxShadow: `0 10px 20px -10px color-mix(in srgb, ${color} 70%, transparent)`,
            }}
          >
            Reveal visualization
          </div>
        </div>
        <p className="text-xs text-text-tertiary">
          Updates live as you adjust color and theme. Save to apply to your embedded widget.
        </p>
      </div>
    </>
  );
}
