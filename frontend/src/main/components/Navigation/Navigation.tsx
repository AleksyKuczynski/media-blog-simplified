// src/main/components/Navigation/Navigation.tsx
// Fixed to support both dictionaries and maintain compatibility

'use client'

import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNav'
import MobileNavigation from './MobileNav'
import SkipLinks from './SkipLinks'

// NEW: Import new dictionary types and SEO components
import { Dictionary } from '@/main/lib/dictionary/types'
import { CompleteNavigationSchema } from '@/main/components/SEO'

// OLD: Import old types for compatibility with Search components
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes'

interface NavigationProps {
  dictionary: Dictionary // NEW: Use new dictionary structure
  lang: Lang // KEEP: Lang parameter for compatibility with fetching library
  currentPath?: string
  breadcrumbs?: Array<{ name: string; href: string }>
}

export interface NavProps extends NavigationProps {
  isSearchPage: boolean
  currentPageTitle?: string
}

export default function Navigation({ 
  dictionary, 
  lang, // KEEP: Lang parameter
  currentPath,
  breadcrumbs = []
}: NavigationProps) {
  const pathname = usePathname()
  const isSearchPage = pathname === '/ru/search'
  
  // NEW: Determine current page context using new dictionary structure
  const getCurrentPageTitle = (): string => {
    if (pathname === '/ru') return dictionary.navigation.labels.home
    if (pathname.startsWith('/ru/articles')) return dictionary.navigation.labels.articles
    if (pathname.startsWith('/ru/rubrics')) return dictionary.navigation.labels.rubrics
    if (pathname.startsWith('/ru/authors')) return dictionary.navigation.labels.authors
    if (pathname.startsWith('/ru/search')) return dictionary.search.labels.results
    return ''
  }

  const currentPageTitle = getCurrentPageTitle()

  // CREATE: Old format translations for Search components compatibility
  const compatibilityTranslations = {
    navigation: {
      home: dictionary.navigation.labels.home,
      articles: dictionary.navigation.labels.articles,
      rubrics: dictionary.navigation.labels.rubrics,
      authors: dictionary.navigation.labels.authors,
      search: dictionary.navigation.labels.search,
      logoAlt: dictionary.navigation.accessibility.logoAlt,
      mainNavigation: dictionary.navigation.accessibility.mainNavigation,
      primarySectionsLabel: dictionary.navigation.accessibility.primarySectionsLabel,
      mainMenuLabel: dictionary.navigation.accessibility.mainMenuLabel,
      searchAndSettingsLabel: dictionary.navigation.accessibility.searchAndSettingsLabel,
      siteSearchLabel: dictionary.navigation.accessibility.siteSearchLabel,
      openMenu: dictionary.navigation.accessibility.openMenu,
      closeMenu: dictionary.navigation.accessibility.closeMenu,
      menuTitle: dictionary.navigation.accessibility.menuTitle,
      menuDescription: dictionary.navigation.accessibility.menuDescription,
      logoMainPageLabel: dictionary.navigation.accessibility.logoMainPageLabel,
      // Add descriptions for existing NavLinks
      articlesDescription: dictionary.navigation.descriptions.articles,
      rubricsDescription: dictionary.navigation.descriptions.rubrics,
      authorsDescription: dictionary.navigation.descriptions.authors,
    },
    search: {
      placeholder: dictionary.search.labels.placeholder,
      searching: dictionary.search.labels.searching,
      noResults: dictionary.search.labels.noResults,
      results: dictionary.search.labels.results,
      pageTitle: dictionary.search.templates.pageTitle,
      submit: dictionary.search.labels.submit,
      minCharacters: dictionary.search.labels.minCharacters,
    }
  }

  return (
    <>
      {/* Enhanced skip links with new dictionary structure */}
      <SkipLinks dictionary={dictionary} />
      
      {/* NEW: Complete navigation schema with enhanced structured data */}
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
        {/* NEW: Enhanced site identity for schema with new dictionary */}
        <meta itemProp="name" content={dictionary.seo.site.siteName} />
        <meta itemProp="url" content="https://event4me.eu" />
        <meta itemProp="description" content={dictionary.seo.site.siteDescription} />
        
        <DesktopNavigation
          dictionary={dictionary}
          lang={lang} // KEEP: Pass lang for compatibility
          translations={compatibilityTranslations} // OLD: For Search components
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
        />
        <MobileNavigation
          dictionary={dictionary}
          lang={lang} // KEEP: Pass lang for compatibility
          translations={compatibilityTranslations} // OLD: For Search components
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
        />
      </header>
    </>
  )
}