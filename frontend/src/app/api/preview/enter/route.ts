// frontend/src/app/api/preview/enter/route.ts

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://cms.event4me.blog';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const slugParam = searchParams.get('slug');
  const redirectParam = searchParams.get('redirect');

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  let safePath: string;

  if (redirectParam) {
    safePath = redirectParam.startsWith('/') ? redirectParam : '/';
  } else if (slugParam) {
    safePath = `/preview/${encodeURIComponent(slugParam)}`;
  } else {
    safePath = '/';
  }

  const previewPath = safePath + (safePath.includes('?') ? '&' : '?') + 'preview=true';

  const response = NextResponse.redirect(new URL(previewPath, request.url), {
    status: 302,
  });

  // Set cookie here — Route Handlers can set cookies on responses
  response.cookies.set('preview-mode', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  response.headers.set(
    'Content-Security-Policy',
    `frame-ancestors 'self' ${DIRECTUS_URL}`
  );

  return response;
}