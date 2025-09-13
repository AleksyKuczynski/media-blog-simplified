// src/main/components/Navigation/NavLinks.tsx

import Link from 'next/link'
import NavLinksClient from './NavLinksClient'
import { Dictionary, Lang, NavigationRoute } from '@/main/lib/dictionary/types'
import { getNavigationLinkSEO } from '@/main/components/SEO'

interface NavLinksProps {
  dictionary: Dictionary
  lang: Lang
  className?: string
}

// Navigation configuration
type NavigationLink = {
  route: NavigationRoute
  href: string
  priority: number
}

// Enhanced navigation links configuration
const NAVIGATION_LINKS: NavigationLink[] = [
  { 
    route: 'articles',
    href: '/articles',
    priority: 1
  },
  { 
    route: 'rubrics',
    href: '/rubrics',
    priority: 2
  },
  { 
    route: 'authors',
    href: '/authors',
    priority: 3
  },
]

export default function NavLinks({ dictionary, lang, className }: NavLinksProps) {
  return (
    <>
      {NAVIGATION_LINKS.map((link, index) => {
        // NEW: Get enhanced SEO data using helper function
        const linkSEO = getNavigationLinkSEO(dictionary, link.route)
        
        return (
          <li 
            key={link.href} 
            className={`nav-link-item list-none ${className || ''}`}
            role="menuitem"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <Link 
              href={`/ru${link.href}`}
              className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
              data-href={link.href}
              aria-label={linkSEO.description} // NEW: Use enhanced SEO description
              title={linkSEO.description}
              itemProp="url"
              // Enhanced SEO attributes
              data-nav-priority={link.priority}
              data-nav-section={link.route}
              data-nav-enhanced-seo="true" // NEW: Indicate enhanced SEO
            >
              <span itemProp="name">{linkSEO.label}</span> {/* NEW: Use SEO helper */}
              
              {/* Enhanced accessibility description */}
              <span className="sr-only" aria-describedby={`nav-desc-${index}`}>
                - {linkSEO.description}
              </span>
              
              {/* Enhanced schema metadata */}
              <meta itemProp="description" content={linkSEO.description} />
              <meta itemProp="position" content={`${index + 1}`} />
              <meta itemProp="inLanguage" content="ru" />
              <meta itemProp="audience" content={dictionary.navigation.seo.audience} /> {/* NEW: Enhanced audience targeting */}
            </Link>
            
            {/* Hidden detailed description for screen readers */}
            <span 
              id={`nav-desc-${index}`}
              className="sr-only"
              role="tooltip"
            >
              {linkSEO.description}
            </span>
          </li>
        )
      })}
      
      {/* Client-side active state management */}
      <NavLinksClient 
        dictionary={dictionary} 
        lang={lang} // KEEP: Pass lang for compatibility
      />
    </>
  )
}