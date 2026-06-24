/**
 * Microsoft Clarity custom-event helpers.
 *
 * Clarity is only loaded on the marketing site (see components/ClarityAnalytics).
 * These helpers no-op safely when the tag isn't present (app side, ad blockers)
 * and retry briefly, because events are usually fired on page load — sometimes
 * before the `afterInteractive` Clarity tag has finished booting.
 */

type ClarityArgs =
  | ['event', string]
  | ['set', string, string | string[]]
  | [string, ...unknown[]];

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

const MAX_ATTEMPTS = 20;
const RETRY_MS = 250;

function send(args: ClarityArgs, attempt = 0): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.clarity === 'function') {
    window.clarity(...args);
    return;
  }

  if (attempt < MAX_ATTEMPTS) {
    window.setTimeout(() => send(args, attempt + 1), RETRY_MS);
  }
}

/** Fire a Clarity custom event (filterable in recordings, usable in funnels). */
export function trackClarityEvent(name: string): void {
  send(['event', name]);
}

/** Attach a custom tag to the current Clarity session for segmentation. */
export function setClarityTag(key: string, value: string | string[]): void {
  send(['set', key, value]);
}
