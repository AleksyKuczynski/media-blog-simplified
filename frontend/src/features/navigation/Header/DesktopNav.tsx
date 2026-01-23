// features/navigation/Header/DesktopNav.tsx
'use client'

import Logo from '../../../shared/primitives/Logo'
import NavLinks from './NavLinks'
import LanguageSwitcher from './LanguageSwitcher'
import { Dictionary, Lang } from '@/config/i18n'
import { ExpandableSearch } from '../../search'
import { DESKTOP_NAV_STYLES } from '../styles'

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
}: DesktopNavProps) {
  return (
    <nav 
      id="main-navigation"
      className={DESKTOP_NAV_STYLES.container}
      aria-label={dictionary.navigation.accessibility.mainNavigation}
      role="navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className={DESKTOP_NAV_STYLES.grid}>
        
        <div 
          className={DESKTOP_NAV_STYLES.leftSection}
          role="group"
          aria-label={dictionary.navigation.accessibility.primarySectionsLabel}
        >
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

        <div 
          className={DESKTOP_NAV_STYLES.centerSection}
          itemProp="mainEntity"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <ul 
            className={DESKTOP_NAV_STYLES.navList}
            role="menubar"
            aria-label={dictionary.navigation.accessibility.mainMenuLabel}
          >
            <NavLinks 
              dictionary={dictionary}
              lang={lang}
            />
          </ul>
        </div>
        
        <div 
          className={DESKTOP_NAV_STYLES.rightSection}
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
          
          <LanguageSwitcher currentLang={lang} />          
        </div>
      </div>
    </nav>
  )
}