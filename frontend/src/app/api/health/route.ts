import { NextResponse } from 'next/server';

export async function GET() {
  const directusUrl = process.env.DIRECTUS_URL;

  try {
    const res = await fetch(`${directusUrl}/server/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    const directusOk = res.ok;

    return NextResponse.json(
      {
        status: directusOk ? 'ok' : 'degraded',
        directus: directusOk ? 'ok' : 'unreachable',
        timestamp: new Date().toISOString(),
      },
      { status: directusOk ? 200 : 503 }
    );
  } catch {
    return NextResponse.json(
      { status: 'degraded', directus: 'unreachable', timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}

export const dynamic = 'force-dynamic';