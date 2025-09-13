// src/main/components/Navigation/NavLinksClient.tsx
// Fixed to support both dictionaries and maintain compatibility

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// NEW: Import new dictionary types
import { Dictionary, Lang } from '@/main/lib/dictionary/types'

interface NavLinksClientProps {
  dictionary: Dictionary
  lang: Lang
}

export default function NavLinksClient({ dictionary, lang }: NavLinksClientProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Find all navigation links and manage their active states
    const links = document.querySelectorAll('.nav-link')
    
    links.forEach((link) => {
      const href = link.getAttribute('data-href')
      if (!href) return

      const linkElement = link as HTMLElement
      const spanElement = linkElement.querySelector('span[itemProp="name"]') as HTMLElement
      
      // Enhanced active state detection
      const isActive = pathname.startsWith(`/ru${href}`)
      const isExactMatch = pathname === `/ru${href}` || (href === '/' && pathname === '/ru')
      const isCurrentPage = isActive || isExactMatch
      
      if (isCurrentPage) {
        // Apply active state
        linkElement.setAttribute('aria-current', 'page')
        linkElement.setAttribute('data-active', 'true')
        
        // Add structured data indicator
        if (spanElement) {
          spanElement.setAttribute('data-current-page', 'true')
        }
        
        // NEW: Enhanced SEO indicators for current page
        linkElement.setAttribute('data-seo-current', 'true')
        linkElement.setAttribute('data-nav-status', 'active')
        
      } else {
        // Remove active state
        linkElement.removeAttribute('aria-current')
        linkElement.setAttribute('data-active', 'false')
        
        // Remove structured data indicator
        if (spanElement) {
          spanElement.removeAttribute('data-current-page')
        }
        
        // NEW: Remove enhanced SEO indicators
        linkElement.removeAttribute('data-seo-current')
        linkElement.setAttribute('data-nav-status', 'inactive')
      }
    })
    
  }, [pathname, lang]) // Include lang in dependencies for compatibility

  return null // This component only manages active states, renders nothing
}