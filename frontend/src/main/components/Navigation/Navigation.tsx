// src/main/components/Navigation/Navigation.tsx - SEO-Enhanced Navigation
'use client'

import { usePathname } from 'next/navigation'
import DesktopNavigation from './DesktopNav'
import MobileNavigation from './MobileNav'
import { Lang, NavigationTranslations, SearchTranslations } from "@/main/lib/dictionaries/dictionariesTypes";
import { NavigationSchema } from './NavigationSchema';
import SkipLinks from './SkipLinks';

interface NavigationProps {
  lang: Lang
  translations: {
    navigation: NavigationTranslations
    search: SearchTranslations
  }
}

export interface NavProps extends NavigationProps {
  isSearchPage: boolean;
  currentPageTitle?: string;
}

export default function Navigation({ lang, translations }: NavigationProps) {
  const pathname = usePathname()
  const isSearchPage = pathname === `/ru/search`
  
  // Determine current page context for better navigation semantics
  const getCurrentPageTitle = (): string => {
    if (pathname === '/ru') return translations.navigation.home;
    if (pathname.startsWith('/ru/articles')) return translations.navigation.articles;
    if (pathname.startsWith('/ru/rubrics')) return translations.navigation.rubrics;
    if (pathname.startsWith('/ru/authors')) return translations.navigation.authors;
    if (pathname.startsWith('/ru/search')) return translations.search.pageTitle;
    return '';
  };

  const currentPageTitle = getCurrentPageTitle();

  return (
    <>
      {/* Skip links for accessibility and SEO */}
      <SkipLinks translations={translations} />
      
      {/* Enhanced navigation with Schema.org markup */}
      <NavigationSchema lang={lang} translations={translations.navigation} />
      
      {/* Main navigation wrapper with proper semantic markup */}
      <header 
        role="banner" 
        className="fixed top-0 left-0 right-0 z-50"
        itemScope 
        itemType="https://schema.org/WebSite"
      >
        {/* Site identity for schema */}
        <meta itemProp="name" content="EventForMe" />
        <meta itemProp="url" content="https://event4me.eu" />
        
        <DesktopNavigation
          lang={lang}
          translations={translations}
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
        />
        <MobileNavigation
          lang={lang}
          translations={translations}
          isSearchPage={isSearchPage}
          currentPageTitle={currentPageTitle}
        />
      </header>
    </>
  );
}