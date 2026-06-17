'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Reads the `?focus=` deep-link param (set by the onboarding assistant and setup
 * links) and scrolls to + briefly highlights the matching settings field. Field
 * wrappers opt in with id="setting-<focus>". Collapsed <details> ancestors are
 * opened so the field is actually visible.
 */
export default function SettingsFocus() {
  const params = useSearchParams();
  const focus = params.get('focus');

  useEffect(() => {
    if (!focus) {
      return;
    }

    const element = document.getElementById(`setting-${focus}`);
    if (!element) {
      return;
    }

    let ancestor: HTMLElement | null = element.parentElement;
    while (ancestor) {
      if (ancestor.tagName === 'DETAILS') {
        (ancestor as HTMLDetailsElement).open = true;
      }
      ancestor = ancestor.parentElement;
    }

    const scrollTimer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('vz-focus-flash');
    }, 80);

    const clearTimer = window.setTimeout(() => {
      element.classList.remove('vz-focus-flash');
    }, 3000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
      element.classList.remove('vz-focus-flash');
    };
  }, [focus]);

  return null;
}
