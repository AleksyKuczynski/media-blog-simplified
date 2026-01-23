// features/navigation/Header/utils/useAlternateLanguageUrl.ts
'use client'

import { useEffect, useState } from 'react'
import { Lang } from '@/config/i18n'
import { resolveAlternateLanguageUrl } from '@/lib/actions/resolveAlternateLanguageUrl'

/**
 * Custom hook to resolve alternate language URL
 * 
 * Fetches the appropriate URL for the alternate language version
 * of the current page with proper cleanup.
 */
export function useAlternateLanguageUrl(
  pathname: string,
  currentLang: Lang,
  alternateLang: Lang,
  fallbackUrl: string
): string {
  const [alternateUrl, setAlternateUrl] = useState<string>(fallbackUrl)
  
  useEffect(() => {
    let mounted = true
    
    async function resolveUrl() {
      const url = await resolveAlternateLanguageUrl(pathname, currentLang, alternateLang)
      
      if (mounted) {
        setAlternateUrl(url)
      }
    }
    
    resolveUrl()
    
    return () => {
      mounted = false
    }
  }, [pathname, currentLang, alternateLang])
  
  return alternateUrl
}