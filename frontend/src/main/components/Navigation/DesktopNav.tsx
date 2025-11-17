// src/main/components/Navigation/DesktopNav.tsx
// Fixed to use correct dictionary entry names

'use client'

import Logo from '../Logo'
import NavLinks from './NavLinks'
import ExpandableSearch from '../Search/ExpandableSearch'
import { Dictionary, Lang } from '@/main/lib/dictionary'

interface DesktopNavProps {
  dictionary: Dictionary
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export default function DesktopNavigation({
  dictionary,
  lang,
  currentPageTitle,
}: DesktopNavProps) {
  return (
    <nav 
      id="main-navigation"
      className="hidden xl:block bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300"
      aria-label={dictionary.navigation.accessibility.mainNavigation}
      role="navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="grid grid-cols-3 items-center h-24 max-w-7xl mx-auto px-6">
        
        {/* Left: Primary Navigation Links */}
        <div 
          className="flex items-center justify-start"
          role="group"
          aria-label={dictionary.navigation.accessibility.primarySectionsLabel}
        >
          <ul 
            className="flex items-center justify-start space-x-2"
            role="menubar"
            aria-label={dictionary.navigation.accessibility.mainMenuLabel}
          >
            <NavLinks 
              dictionary={dictionary}
              lang={lang}
            />
          </ul>
        </div>

        {/* Center: Logo/Brand with enhanced schema */}
        <div 
          className="flex items-center justify-center"
          itemProp="mainEntity"
          itemScope
          itemType="https://schema.org/Organization"
        >
          {/* FIXED: Use correct dictionary property names */}
          <meta itemProp="name" content={dictionary.seo.site.name} />
          <meta itemProp="description" content={dictionary.seo.site.description} />
          <meta itemProp="url" content={dictionary.seo.site.url} />
          <meta itemProp="areaServed" content={dictionary.seo.regional.region} />
          
          <Logo 
            lang={lang}
            variant="desktop"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoMainPageLabel}
          />
        </div>
        
        {/* Right: Enhanced Search */}
        <div 
          className="flex items-center justify-end space-x-4"
          role="group"
          aria-label={dictionary.navigation.accessibility.searchAndSettingsLabel}
        >
          <div 
            id="site-search"
            role="search"
            aria-label={dictionary.navigation.accessibility.siteSearchLabel}
          >
            <ExpandableSearch 
              dictionary={dictionary}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}