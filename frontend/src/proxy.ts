// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname)) return

  const previewParam = searchParams.get('preview');
  const secretParam = searchParams.get('secret');

  // Only add iframe headers when preview params present
  if (previewParam === 'true' && secretParam) {
    const validSecret = process.env.PREVIEW_SECRET;
    
    if (secretParam === validSecret) {
      console.log('✅ Preview request:', pathname);
      
      const response = NextResponse.next();
      
      // Only set CSP headers for iframe embedding
      const directusUrl = process.env.DIRECTUS_URL || 'http://51.21.135.65:8055';
      response.headers.set(
        'Content-Security-Policy', 
        `frame-ancestors 'self' ${directusUrl}`
      );
      
      return response;
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}