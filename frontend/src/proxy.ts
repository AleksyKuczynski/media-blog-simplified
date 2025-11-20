// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Ignore public files
  if (PUBLIC_FILE.test(pathname)) return

  // Check for preview mode activation
  const previewParam = searchParams.get('preview');
  const secretParam = searchParams.get('secret');

  if (previewParam === 'true' && secretParam) {
    const validSecret = process.env.PREVIEW_SECRET;
    
    if (secretParam === validSecret) {
      // Set preview cookie
      const response = NextResponse.next();
      response.cookies.set('preview-mode', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
      });

      // Headers to allow iframe embedding
      const directusUrl = process.env.DIRECTUS_URL || 'http://51.21.135.65:8055';
      response.headers.set('Content-Security-Policy', `frame-ancestors 'self' ${directusUrl}`);
      response.headers.set('X-Frame-Options', 'ALLOW-FROM ' + directusUrl);
      return response;
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}