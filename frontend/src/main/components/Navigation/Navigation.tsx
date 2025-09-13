// src/main/components/Navigation/Navigation.tsx
// Fixed to use correct dictionary entry names

'use client'

import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNav'
import MobileNavigation from './MobileNav'
import SkipLinks from './SkipLinks'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'
import { CompleteNavigationSchema } from '@/main/components/SEO'

interface NavigationProps {
  dictionary: Dictionary
  lang: Lang
  currentPath?: string
  breadcrumbs?: Array<{ name: string; href: string }>
}

export interface NavProps extends NavigationProps {
  isSearchPage: boolean
  currentPageTitle?: string
}

export default function Navigation({ 
  dictionary, 
  lang,
  currentPath,
  breadcrumbs = []
}: NavigationProps) {
  const pathname = usePathname()
  const isSearchPage = pathname === '/ru/search'
  
  // Determine current page context using new dictionary structure
  const getCurrentPageTitle = (): string => {
    if (pathname === '/ru') return dictionary.navigation.labels.home
    if (pathname.startsWith('/ru/articles')) return dictionary.navigation.labels.articles
    if (pathname.startsWith('/ru/rubrics')) return dictionary.navigation.labels.rubrics
    if (pathname.startsWith('/ru/authors')) return dictionary.navigation.labels.authors
    if (pathname.startsWith('/ru/search')) return dictionary.search.labels.results
    return ''
  }

  const currentPageTitle = getCurrentPageTitle()

  return (
    <>
      {/* Enhanced skip links with dictionary structure */}
      <SkipLinks dictionary={dictionary} />
      
      {/* Complete navigation schema with enhanced structured data */}
      <CompleteNavigationSchema 
        dictionary={dictionary}
        currentPath={currentPath || pathname.replace('/ru', '') || '/'}
        breadcrumbs={breadcrumbs}
        includeMobile={true}
      />
      
      {/* Enhanced navigation wrapper with better semantic markup */}
      <header 
        role="banner" 
        className="fixed top-0 left-0 right-0 z-50"
        itemScope 
        itemType="https://schema.org/WebSite"
        aria-label={dictionary.navigation.accessibility.mainNavigation}
      >
        {/* FIXED: Enhanced site identity for schema with correct property names */}
        <meta itemProp="name" content={dictionary.seo.site.name} />
        <meta itemProp="url" content="https://event4me.eu" />
        <meta itemProp="description" content={dictionary.seo.site.description} />
        
        <DesktopNavigation
          dictionary={dictionary}
          lang={lang}
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
        />
        <MobileNavigation
          dictionary={dictionary}
          lang={lang}
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
        />
      </header>
    </>
  )
}