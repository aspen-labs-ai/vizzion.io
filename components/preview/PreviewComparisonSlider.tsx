'use client';

import { useCallback, useState } from 'react';

interface PreviewComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

export default function PreviewComparisonSlider({
  beforeUrl,
  afterUrl,
}: PreviewComparisonSliderProps) {
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-border-default bg-black shadow-2xl"
      onPointerDown={(event) => {
        const target = event.currentTarget;
        target.setPointerCapture(event.pointerId);
        updateFromClientX(event.clientX, target);
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) {
          return;
        }
        updateFromClientX(event.clientX, event.currentTarget);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase URL */}
      <img
        src={afterUrl}
        alt="After visualization"
        className="block h-auto w-full select-none"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
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

      <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-bg-primary">
        After
      </span>

      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_24px_rgba(255,255,255,0.65)]"
        style={{ left: `${position}%` }}
      />
      <button
        type="button"
        className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-bg-primary shadow-2xl transition group-hover:scale-105"
        style={{ left: `${position}%` }}
        aria-label="Drag to compare before and after"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 7 5 12l5 5M14 7l5 5-5 5" />
        </svg>
      </button>

      <input
        aria-label="Before and after comparison position"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-x-6 bottom-5 h-2 cursor-ew-resize accent-white opacity-0"
      />
    </div>
  );
}
