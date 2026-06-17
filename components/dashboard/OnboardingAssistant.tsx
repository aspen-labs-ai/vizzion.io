'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  ImagePlus,
  Rocket,
  Sparkles,
} from 'lucide-react';
import type { OnboardingState, OnboardingStep } from '@/lib/vizzion/onboarding';

interface OnboardingAssistantProps {
  state: OnboardingState;
  widgetId: string;
  embedHref: string;
  previewHref: string;
}

function storageKey(widgetId: string): string {
  return `vz_onboarding_collapsed_${widgetId}`;
}

export default function OnboardingAssistant({
  state,
  widgetId,
  embedHref,
  previewHref,
}: OnboardingAssistantProps) {
  const { requiredSteps, recommendedSteps, requiredDone, requiredTotal, goLiveReady } = state;

  const firstIncompleteKey = useMemo(() => {
    const next = requiredSteps.find(step => !step.done) ?? recommendedSteps.find(step => !step.done);
    return next?.key ?? null;
  }, [requiredSteps, recommendedSteps]);

  const [openKey, setOpenKey] = useState<string | null>(firstIncompleteKey);
  // Default expanded so server and client first paint match; an effect restores
  // the persisted preference after hydration (no SSR mismatch).
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey(widgetId)) === '1') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only restore of a persisted collapse preference
        setCollapsed(true);
      }
    } catch {
      // localStorage unavailable; default to expanded.
    }
  }, [widgetId]);

  function toggleCollapsed() {
    setCollapsed(previous => {
      const next = !previous;
      try {
        window.localStorage.setItem(storageKey(widgetId), next ? '1' : '0');
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }

  const progressPct = requiredTotal > 0 ? (requiredDone / requiredTotal) * 100 : 0;
  const recommendedRemaining = recommendedSteps.filter(step => !step.done);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-border-default bg-bg-secondary">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              goLiveReady ? 'bg-accent text-bg-primary' : 'bg-accent/15 text-accent'
            }`}
          >
            {goLiveReady ? <Rocket className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {goLiveReady ? 'Your widget is ready to go live' : 'Set up your widget'}
            </h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              {goLiveReady
                ? 'Add the embed snippet to your site to start capturing leads — or keep polishing below.'
                : 'A guided walkthrough — I’ll take you to the exact setting for each step.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border-default bg-bg-primary px-3 py-1 text-xs font-semibold text-text-secondary">
            {requiredDone} of {requiredTotal} required
          </span>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="rounded-lg border border-border-default bg-bg-primary px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            aria-expanded={!collapsed}
          >
            {collapsed ? 'Show' : 'Hide'}
          </button>
        </div>
      </div>

      <div className="px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-primary">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {collapsed ? (
        <div className="p-5 pt-4" />
      ) : (
        <div className="space-y-5 p-5">
          <ol className="space-y-2.5">
            {requiredSteps.map(step => (
              <StepRow
                key={step.key}
                step={step}
                isOpen={openKey === step.key}
                onToggle={() => setOpenKey(current => (current === step.key ? null : step.key))}
              />
            ))}
          </ol>

          {recommendedRemaining.length > 0 ? (
            <div className="space-y-2.5 border-t border-border-default pt-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold text-text-primary">Boost your results</p>
              </div>
              <ol className="space-y-2.5">
                {recommendedRemaining.map(step => (
                  <StepRow
                    key={step.key}
                    step={step}
                    isOpen={openKey === step.key}
                    onToggle={() => setOpenKey(current => (current === step.key ? null : step.key))}
                  />
                ))}
              </ol>
            </div>
          ) : null}

          {goLiveReady ? (
            <div className="flex flex-wrap gap-3 border-t border-border-default pt-5">
              <Link
                href={embedHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
              >
                Get embed code <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
              >
                <ExternalLink className="h-4 w-4" /> Preview widget
              </a>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function StepRow({
  step,
  isOpen,
  onToggle,
}: {
  step: OnboardingStep;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const showImageIcon = step.key === 'material_images';

  return (
    <li
      className={`rounded-xl border transition ${
        step.done
          ? 'border-border-subtle bg-bg-primary/40'
          : 'border-border-default bg-bg-primary/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            step.done ? 'bg-accent text-bg-primary' : 'border border-border-default text-text-tertiary'
          }`}
        >
          {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : showImageIcon ? <ImagePlus className="h-3.5 w-3.5" /> : ''}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-medium ${step.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
              {step.title}
            </span>
            {step.badge && !step.done ? (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                {step.badge}
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-xs text-text-tertiary">{step.description}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className="space-y-3 border-t border-border-default px-4 py-3.5">
          {step.howTo.length > 0 ? (
            <ol className="space-y-1.5">
              {step.howTo.map((line, index) => (
                <li key={index} className="flex gap-2.5 text-xs text-text-secondary">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-secondary text-[10px] font-semibold text-text-tertiary">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          ) : null}
          <Link
            href={step.href}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              step.done
                ? 'border border-border-default bg-bg-secondary text-text-secondary hover:border-accent/40 hover:text-text-primary'
                : 'bg-accent text-bg-primary hover:bg-accent-hover'
            }`}
          >
            {step.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </li>
  );
}
