import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export interface SetupStep {
  label: string;
  description: string;
  done: boolean;
  href: string;
}

interface SetupChecklistProps {
  steps: SetupStep[];
  embedHref: string;
}

export default function SetupChecklist({ steps, embedHref }: SetupChecklistProps) {
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;

  if (allDone) {
    return (
      <section className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-bg-primary">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">Your widget is ready to go live</p>
            <p className="text-xs text-text-secondary">Add the embed snippet to your site to start capturing leads.</p>
          </div>
        </div>
        <Link
          href={embedHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-hover"
        >
          Get embed code <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  const firstIncomplete = steps.find((s) => !s.done);

  return (
    <section className="mb-6 rounded-2xl border border-border-default bg-bg-secondary p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Finish setting up your widget</h2>
          <p className="mt-1 text-sm text-text-secondary">
            A few quick steps to get your widget live on your site.
          </p>
        </div>
        <span className="rounded-full border border-border-default bg-bg-primary px-3 py-1 text-xs font-semibold text-text-secondary">
          {doneCount} of {steps.length} complete
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-primary">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ol className="mt-5 space-y-2.5">
        {steps.map((step) => {
          const isNext = step === firstIncomplete;
          return (
            <li key={step.label}>
              <Link
                href={step.href}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  step.done
                    ? 'border-border-subtle bg-bg-primary/40'
                    : isNext
                      ? 'border-accent/40 bg-accent/5 hover:bg-accent/10'
                      : 'border-border-default bg-bg-primary/40 hover:border-accent/30'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    step.done ? 'bg-accent text-bg-primary' : 'border border-border-default text-text-tertiary'
                  }`}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : ''}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-medium ${step.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                    {step.label}
                  </span>
                  <span className="block text-xs text-text-tertiary">{step.description}</span>
                </span>
                {!step.done ? (
                  <ArrowRight className={`h-4 w-4 shrink-0 ${isNext ? 'text-accent' : 'text-text-tertiary'}`} />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
