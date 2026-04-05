// features/navigation/Header/Header.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import DesktopNavigation from './DesktopNav'
import MobileNavigation, { MobileNavRef } from '../MobileNav/MobileNav'
import SkipLinks from '../SkipLinks'
import { Dictionary, Lang } from '@/config/i18n'
import { CompleteNavigationSchema } from '@/shared/seo'
import { HEADER_STYLES } from '../navigation.styles'
import { 
  getCurrentPageTitle, 
  isSearchPage, 
  normalizeCurrentPath 
} from './utils/header.utils'
import { useNavigationSearch } from '../hooks/useNavigationSearch'

interface NavigationProps {
  dictionary: Dictionary
  lang: Lang
  currentPath?: string
  breadcrumbs?: Array<{ name: string; href: string }>
}

export default function Navigation({ 
  dictionary, 
  lang,
  currentPath,
}: NavigationProps) {
  const pathname = usePathname()
  const searchPage = isSearchPage(pathname)
  const currentPageTitle = getCurrentPageTitle(pathname, dictionary)
  const normalizedPath = normalizeCurrentPath(currentPath, pathname)
  const mobileNavRef = useRef<MobileNavRef>(null)

  const { handleSearchClick } = useNavigationSearch({
    isSearchPage: searchPage,
    onOpenSearch: () => mobileNavRef.current?.openSearch()
  })

  return (
    <>
      <SkipLinks dictionary={dictionary} />
      
      <CompleteNavigationSchema
        dictionary={dictionary}
        lang={lang}
        currentPath={normalizedPath}
      />
      
      <header 
        role="banner" 
        className={HEADER_STYLES.wrapper}
        itemScope 
        itemType="https://schema.org/WebSite"
        aria-label={dictionary.navigation.accessibility.mainNavigation}
      >
        <meta itemProp="name" content={dictionary.seo.site.name} />
        <meta itemProp="url" content={dictionary.seo.site.url} />
        <meta itemProp="description" content={dictionary.seo.site.description} />
        
        <DesktopNavigation
          dictionary={dictionary}
          lang={lang}
          isSearchPage={searchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
          onSearchClick={handleSearchClick}
        />
        <MobileNavigation
          ref={mobileNavRef}
          dictionary={dictionary}
          lang={lang}
          isSearchPage={searchPage}
          currentPageTitle={currentPageTitle}
          currentPath={currentPath}
        />
      </header>
    </>
  )
}