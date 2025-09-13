// src/main/components/Navigation/DesktopNav.tsx
// Fixed to use new dictionary structure with ExpandableSearch

'use client'

import React from 'react'
import Logo from '../Logo'
import NavLinks from './NavLinks'
import ExpandableSearch from '../Search/ExpandableSearch'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'

interface DesktopNavProps {
  dictionary: Dictionary
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export default function DesktopNavigation({
  dictionary,
  lang, // KEEP: Lang parameter
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
          {/* Enhanced schema metadata from new dictionary */}
          <meta itemProp="name" content={dictionary.seo.site.siteName} />
          <meta itemProp="description" content={dictionary.seo.site.siteDescription} />
          <meta itemProp="url" content="https://event4me.eu" />
          <meta itemProp="areaServed" content={dictionary.seo.regional.geographicCoverage} />
          
          <Logo 
            lang={lang}
            variant="desktop"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoMainPageLabel}
          />
        </div>
        
        {/* Right: Enhanced Search - FIXED: Use new dictionary structure */}
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
              dictionary={dictionary} // NEW: Use new dictionary structure
              lang={lang}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}