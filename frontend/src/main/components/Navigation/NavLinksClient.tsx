// src/main/components/Navigation/NavLinksClient.tsx
// Enhanced to properly disable current page links and add visual highlighting

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
        // Apply active state with enhanced accessibility and SEO
        linkElement.setAttribute('aria-current', 'page')
        linkElement.setAttribute('data-active', 'true')
        linkElement.setAttribute('data-seo-current', 'true')
        linkElement.setAttribute('data-nav-status', 'active')
        
        // Remove interactive attributes for current page
        linkElement.setAttribute('tabindex', '-1')
        linkElement.setAttribute('aria-disabled', 'true')
        
        // Add visual indicator to span element
        if (spanElement) {
          spanElement.setAttribute('data-current-page', 'true')
        }
        
        // Override CSS classes to ensure proper styling
        const originalClasses = linkElement.className
        const baseClasses = originalClasses
          .replace(/hover:[^\s]+/g, '') // Remove hover classes
          .replace(/transition-[^\s]+/g, '') // Remove transition classes
        
        linkElement.className = `${baseClasses} nav-link-current`
        
        // Store original classes for restoration
        linkElement.setAttribute('data-original-classes', originalClasses)
        
      } else {
        // Remove active state and restore interactivity
        linkElement.removeAttribute('aria-current')
        linkElement.setAttribute('data-active', 'false')
        linkElement.removeAttribute('data-seo-current')
        linkElement.setAttribute('data-nav-status', 'inactive')
        
        // Restore interactive attributes
        linkElement.removeAttribute('tabindex')
        linkElement.removeAttribute('aria-disabled')
        
        // Remove visual indicator from span element
        if (spanElement) {
          spanElement.removeAttribute('data-current-page')
        }
        
        // Restore original CSS classes
        const originalClasses = linkElement.getAttribute('data-original-classes')
        if (originalClasses) {
          linkElement.className = originalClasses
          linkElement.removeAttribute('data-original-classes')
        } else {
          // Fallback: ensure proper interactive classes
          if (!linkElement.className.includes('hover:')) {
            linkElement.className = linkElement.className.replace('nav-link-current', '')
              + ' hover:text-on-sf hover:bg-sf-hi transition-all duration-200'
          }
        }
      }
    })
    
  }, [pathname, lang])

  return null // This component only manages active states, renders nothing
}