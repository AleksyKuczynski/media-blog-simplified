// frontend/src/app/api/preview/enter/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const redirect = searchParams.get('redirect') || '/';

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const response = NextResponse.redirect(new URL(redirect, request.url));

  response.cookies.set('preview-mode', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'none', // Required: Directus (cms.event4me.blog) iframes Vercel cross-origin
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}