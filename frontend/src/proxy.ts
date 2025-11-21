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
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Log preview activation (helps debug Directus iframe issues)
      console.log('✅ Preview mode activated:', {
        pathname,
        isProduction,
        directusUrl: process.env.DIRECTUS_URL
      });
      
      // Set preview cookie
      const response = NextResponse.next();
      response.cookies.set('preview-mode', 'true', {
        httpOnly: true,
        // CRITICAL: sameSite 'none' required for cross-origin iframe embedding
        // Must be paired with secure flag
        sameSite: 'none',
        // Secure flag MUST be true when sameSite='none'
        // In development, you may need to test via HTTPS or use a tunnel
        secure: true, 
        maxAge: 60 * 60, // 1 hour
      });

      // Headers to allow iframe embedding from Directus
      const directusUrl = process.env.DIRECTUS_URL || 'http://51.21.135.65:8055';
      
      // CSP frame-ancestors allows embedding in Directus
      response.headers.set(
        'Content-Security-Policy', 
        `frame-ancestors 'self' ${directusUrl}`
      );
      
      // Remove X-Frame-Options - it conflicts with CSP and is deprecated
      // Modern browsers ignore it when CSP frame-ancestors is present
      response.headers.delete('X-Frame-Options');
      
      return response;
    } else {
      console.warn('⚠️ Invalid preview secret attempted:', {
        pathname,
        secretProvided: secretParam?.substring(0, 10) + '...'
      });
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}