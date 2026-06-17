'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type FormAction = (formData: FormData) => void | Promise<void>;

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Text shown beside the spinner while this button's submission is pending. */
  pendingLabel?: ReactNode;
  /** Per-button server action (for forms that have more than one submit). */
  formAction?: FormAction;
  formNoValidate?: boolean;
  /**
   * For forms with multiple submit buttons, the action this button maps to so it
   * only spins for its own submission. Defaults to `formAction`.
   */
  trackAction?: FormAction;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/**
 * Submit button with built-in pending feedback for server-action forms. Shows a
 * spinner (and optional pending label) on the button itself while the form is
 * submitting, so users get immediate confirmation their click is working —
 * without needing to see a status banner elsewhere on the page.
 */
export default function SubmitButton({
  children,
  className,
  disabled,
  pendingLabel,
  formAction,
  formNoValidate,
  trackAction,
}: SubmitButtonProps) {
  const status = useFormStatus();
  const tracked = trackAction ?? formAction;
  // For multi-submit forms, only spin when THIS button's action is the one
  // running; otherwise spin whenever the parent form is submitting.
  const isPending = status.pending && (tracked ? status.action === tracked : true);

  return (
    <button
      type="submit"
      formAction={formAction}
      formNoValidate={formNoValidate}
      disabled={disabled || status.pending}
      aria-busy={isPending}
      className={className}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {isPending ? <Spinner /> : null}
        <span>{isPending && pendingLabel ? pendingLabel : children}</span>
      </span>
    </button>
  );
}
