import { NextRequest, NextResponse } from 'next/server';

function buildCorsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function publicOptionsResponse(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin')),
  });
}

export function publicJsonResponse(
  payload: unknown,
  status: number,
  origin: string | null,
) {
  return NextResponse.json(payload, {
    status,
    headers: buildCorsHeaders(origin),
  });
}
