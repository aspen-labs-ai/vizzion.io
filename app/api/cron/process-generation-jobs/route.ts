import { NextRequest, NextResponse } from 'next/server';
import { processStuckGenerationJobs } from '@/lib/vizzion/generation-worker';

// Backstop sweep for generation jobs that were never completed by the eager
// after() trigger (e.g. invocation killed mid-flight). Vercel Cron hits this on
// a schedule; see vercel.json. Also recovers jobs stuck in 'processing'.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  // If no secret is configured, only allow Vercel's internal cron invocations.
  if (!secret) {
    return request.headers.get('x-vercel-cron') !== null;
  }
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const outcome = await processStuckGenerationJobs(10);
  return NextResponse.json(outcome, { status: 200 });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
