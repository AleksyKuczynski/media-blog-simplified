// features/navigation/Header/Header.tsx
'use client'

import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNav'
import MobileNavigation from '../MobileNav/MobileNav'
import SkipLinks from '../SkipLinks'
import { Dictionary, Lang } from '@/config/i18n'
import { CompleteNavigationSchema } from '@/shared/seo'
import { HEADER_STYLES } from '../styles'

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
  const isSearchPage = pathname === '/ru/search'
  
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
      <SkipLinks dictionary={dictionary} />
      
      <CompleteNavigationSchema 
        dictionary={dictionary}
        currentPath={currentPath || pathname.replace('/ru', '') || '/'}
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