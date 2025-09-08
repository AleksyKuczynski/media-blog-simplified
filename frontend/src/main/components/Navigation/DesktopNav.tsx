// src/main/components/Navigation/DesktopNav.tsx
// Fixed to support both dictionaries and maintain Search compatibility

'use client'

import React from 'react'
import Logo from '../Logo'
import NavLinks from './NavLinks'
import ExpandableSearch from '../Search/ExpandableSearch'

// NEW: Import new dictionary types
import { Dictionary } from '@/main/lib/dictionary/types'
// OLD: Import old types for Search component compatibility
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes'

interface DesktopNavProps {
  dictionary: Dictionary // NEW: Use new dictionary structure
  lang: Lang // KEEP: Lang parameter for compatibility
  translations: any // OLD: Compatibility translations for Search components
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export default function DesktopNavigation({
  dictionary,
  lang, // KEEP: Lang parameter
  translations, // OLD: For Search components
  currentPageTitle,
}: DesktopNavProps) {
  return (
    <nav 
      id="main-navigation"
      className="hidden xl:block bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300"
      aria-label={dictionary.navigation.accessibility.mainNavigation} // NEW: Updated access pattern
      role="navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="grid grid-cols-3 items-center h-24 max-w-7xl mx-auto px-6">
        
        {/* Left: Primary Navigation Links */}
        <div 
          className="flex items-center justify-start"
          role="group"
          aria-label={dictionary.navigation.accessibility.primarySectionsLabel} // NEW: Updated access pattern
        >
          <ul 
            className="flex items-center justify-start space-x-2"
            role="menubar"
            aria-label={dictionary.navigation.accessibility.mainMenuLabel} // NEW: Updated access pattern
          >
            {/* Enhanced NavLinks with new dictionary structure */}
            <NavLinks 
              dictionary={dictionary} // NEW: Pass new dictionary
              lang={lang} // KEEP: Pass lang for compatibility
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
          {/* NEW: Enhanced schema metadata from new dictionary */}
          <meta itemProp="name" content={dictionary.seo.site.siteName} />
          <meta itemProp="description" content={dictionary.seo.site.siteDescription} />
          <meta itemProp="url" content="https://event4me.eu" />
          <meta itemProp="areaServed" content={dictionary.seo.regional.geographicCoverage} />
          
          <Logo 
            lang={lang} // KEEP: Lang parameter
            variant="desktop"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoMainPageLabel} // NEW: Updated access pattern
          />
        </div>
        
        {/* Right: Enhanced Search */}
        <div 
          className="flex items-center justify-end space-x-4"
          role="group"
          aria-label={dictionary.navigation.accessibility.searchAndSettingsLabel} // NEW: Updated access pattern
        >
          <div 
            id="site-search"
            role="search"
            aria-label={dictionary.navigation.accessibility.siteSearchLabel} // NEW: Updated access pattern
          >
            <ExpandableSearch 
              searchTranslations={translations.search} // OLD: Use compatibility translations
              lang={lang} // KEEP: Lang parameter for Search component
              aria-label={translations.search.placeholder} // OLD: Use compatibility format
            />
          </div>
        </div>
      </div>
    </nav>
  )
}