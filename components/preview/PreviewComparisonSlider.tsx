'use client';

import { useCallback, useRef, useState } from 'react';
import { readableTextOn } from '@/lib/vizzion/brand-color';

interface PreviewComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
  brandColor: string;
}

export default function PreviewComparisonSlider({
  beforeUrl,
  afterUrl,
  brandColor,
}: PreviewComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const afterTextColor = readableTextOn(brandColor);

  const updateFromClientX = useCallback((clientX: number) => {
    const element = surfaceRef.current;
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      // Capture so the drag keeps tracking even if the finger/cursor leaves the
      // element; touch-action: pan-y (below) lets vertical swipes still scroll.
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some browsers can reject capture; dragging still works without it.
      }
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) {
        return;
      }
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <div
        ref={surfaceRef}
        className="group relative touch-pan-y select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onLostPointerCapture={stopDragging}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL */}
        <img
          src={afterUrl}
          alt="After visualization"
          className="mx-auto block max-h-[64vh] w-full select-none object-contain"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 calc(100% - ${position}%) 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL */}
          <img
            src={beforeUrl}
            alt="Before upload"
            className="block h-full w-full select-none object-cover"
            draggable={false}
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
          Before
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-sm"
          style={{ backgroundColor: brandColor, color: afterTextColor }}
        >
          After
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(15,23,42,0.3)]"
          style={{ left: `${position}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition group-active:scale-105"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 7 5 12l5 5M14 7l5 5-5 5" />
          </svg>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/90 opacity-90 backdrop-blur transition group-active:opacity-0">
          Drag to compare
        </div>

        {/* Keyboard/assistive-tech control only; pointer/touch use the drag
            surface above so there is a single, robust interaction model. */}
        <input
          aria-label="Before and after comparison position"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="pointer-events-none absolute inset-x-4 bottom-4 h-2 opacity-0"
        />
      </div>
    </div>
  );
}
