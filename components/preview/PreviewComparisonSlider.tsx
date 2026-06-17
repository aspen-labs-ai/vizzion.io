'use client';

import { useCallback, useState } from 'react';

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

  const updateFromClientX = useCallback((clientX: number, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    if (!rect.width) {
      return;
    }
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80 md:p-4">
      <div
        className="group relative overflow-hidden rounded-[1.5rem] bg-slate-100"
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
          className="mx-auto block max-h-[68vh] w-full select-none object-contain"
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

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-800 shadow-sm backdrop-blur">
          Before
        </span>
        <span
          className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm"
          style={{ backgroundColor: brandColor }}
        >
          After
        </span>

        <div
          className="absolute inset-y-0 w-1 bg-white shadow-[0_0_20px_rgba(15,23,42,0.35)]"
          style={{ left: `${position}%` }}
        />
        <button
          type="button"
          className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-2xl transition group-hover:scale-105"
          style={{ left: `${position}%` }}
          aria-label="Drag to compare before and after"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 7 5 12l5 5M14 7l5 5-5 5" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur">
          Drag to compare
        </div>

        <input
          aria-label="Before and after comparison position"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-x-6 bottom-5 h-2 cursor-ew-resize accent-slate-900 opacity-0"
        />
      </div>
    </div>
  );
}
