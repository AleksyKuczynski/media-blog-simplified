// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LANGUAGES, DEFAULT_LANG, GEO_LANGUAGE_MAP } from '@/config/constants/constants'

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip public files
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next()

  // ========================================
  // PREVIEW MODE HANDLING (Existing Logic)
  // ========================================
  const previewParam = searchParams.get('preview');
  const secretParam = searchParams.get('secret');

  if (previewParam === 'true' && secretParam) {
    const validSecret = process.env.PREVIEW_SECRET;
    
    if (secretParam === validSecret) {
      console.log('✅ Preview request:', pathname);
      
      const response = NextResponse.next();
      
      const directusUrl = process.env.DIRECTUS_URL || 'http://51.21.135.65:8055';
      response.headers.set(
        'Content-Security-Policy', 
        `frame-ancestors 'self' ${directusUrl}`
      );
      
      return response;
    }
  }

  // ========================================
  // LANGUAGE DETECTION & ROUTING
  // ========================================
  
  // Check if pathname already has language prefix
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If already has locale, continue
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Detect user's preferred language
  const detectedLang = detectLanguage(request);

  // Root path - redirect to language-prefixed home
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${detectedLang}`, request.url)
    );
  }

  // Other paths without language prefix - redirect with language
  return NextResponse.redirect(
    new URL(`/${detectedLang}${pathname}`, request.url)
  );
}

/**
 * Detect user's preferred language based on:
 * 1. Cookie preference (highest priority)
 * 2. Geo-location header (Vercel-specific)
 * 3. Accept-Language header
 * 4. Default to English
 */
function detectLanguage(request: NextRequest): string {
  // 1. Cookie preference
  const cookieLang = request.cookies.get('preferred-language')?.value;
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang as any)) {
    return cookieLang;
  }

  // 2. Geo-location (Vercel provides x-vercel-ip-country header)
  // ✅ FIX: Use headers instead of request.geo
  const country = request.headers.get('x-vercel-ip-country');
  if (country && GEO_LANGUAGE_MAP[country]) {
    return GEO_LANGUAGE_MAP[country];
  }

  // 3. Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage
      .split(',')[0]
      ?.split('-')[0]
      ?.toLowerCase();
    
    if (preferredLang === 'ru' && SUPPORTED_LANGUAGES.includes('ru')) {
      return 'ru';
    }
  }

  // 4. Default to English
  return DEFAULT_LANG;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}