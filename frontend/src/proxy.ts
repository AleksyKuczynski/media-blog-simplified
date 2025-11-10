// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore public files
  if (PUBLIC_FILE.test(pathname)) return

  // ✅ REMOVED: All theme management - no longer needed
  // ✅ REMOVED: Color mode cookies - let Tailwind handle dark mode
  // ✅ REMOVED: Language detection - already removed
  
  // ✅ ULTRA-SIMPLIFIED: Just pass through, no modifications needed
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}