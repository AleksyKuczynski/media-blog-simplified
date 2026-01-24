// features/navigation/Header/Header.tsx
'use client'

import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNav'
import MobileNavigation from '../MobileNav/MobileNav'
import SkipLinks from '../SkipLinks'
import { Dictionary, Lang } from '@/config/i18n'
import { CompleteNavigationSchema } from '@/shared/seo'
import { HEADER_STYLES } from '../navigation.styles'
import { 
  getCurrentPageTitle, 
  isSearchPage, 
  normalizeCurrentPath 
} from './utils/header.utils'

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

  return (
    <>
      <SkipLinks dictionary={dictionary} />
      
      <CompleteNavigationSchema 
        dictionary={dictionary}
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
        />
        <MobileNavigation
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