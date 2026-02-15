'use client';

import { createBrowserClient } from '@supabase/ssr';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function requirePublicEnv(value: string | undefined, message: string): string {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

const supabaseUrl = requirePublicEnv(
  rawSupabaseUrl,
  'Missing NEXT_PUBLIC_SUPABASE_URL in client environment.',
);
const supabasePublishableKey = requirePublicEnv(
  rawSupabasePublishableKey,
  'Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in client environment.',
);

export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
