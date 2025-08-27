// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { Theme } from './main/components/ThemeSwitcher/themeTypes'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore public files
  if (PUBLIC_FILE.test(pathname)) return

  // ✅ REMOVED: Language detection and redirect logic
  // ✅ REMOVED: Supported languages array
  // ✅ REMOVED: pathname language checking
  // ✅ REMOVED: Accept-Language header parsing

  // Get the color mode from the cookie or default to system preference
  let colorMode = request.cookies.get('colorMode')?.value
  if (!colorMode) {
    const prefersDark = request.headers.get('Sec-CH-Prefers-Color-Scheme') === 'dark'
    colorMode = prefersDark ? 'dark' : 'light'
  }

  // Get the geometric theme from the cookie or default to 'default'
  let theme = request.cookies.get('theme')?.value as Theme
  if (!theme || !['default', 'rounded', 'sharp'].includes(theme)) {
    theme = 'default' // Will be changed to 'rounded' in Phase 3
  }

  // ✅ SIMPLIFIED: No language-based redirects, just proceed normally
  const response = NextResponse.next()

  // Set the color mode cookie if it doesn't exist
  if (!request.cookies.get('colorMode')) {
    response.cookies.set('colorMode', colorMode)
  }

  // Set the theme cookie if it doesn't exist
  if (!request.cookies.get('theme')) {
    response.cookies.set('theme', theme)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}