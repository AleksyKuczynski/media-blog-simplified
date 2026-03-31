// src/features/navigation/MobileNav/MobileNav.tsx
'use client'

import Logo from '../../../shared/primitives/Logo'
import NavLinks from '../Header/NavLinks'
import SearchButton from './SearchButton'
import OffcanvasPanel from './OffcanvasPanel'
import MobileSearchContent from '../../search/ui/MobileSearchContent'
import LanguageSwitcher from '../Header/LanguageSwitcher'
import { Dictionary, Lang } from '@/config/i18n'
import HamburgerButton from './HamburgerButton'
import { MOBILE_NAV_STYLES, PANEL_CONTENT_STYLES } from '../navigation.styles'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { useMobileNavSearch } from '../hooks/useMobileNavSearch'
import { useMobilePanel } from '../hooks/useMobilePanel'

interface MobileNavProps {
  dictionary: Dictionary
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export interface MobileNavRef {
  openSearch: () => void
}

const MobileNavigation = forwardRef<MobileNavRef, MobileNavProps>(({
  dictionary,
  lang,
  isSearchPage,
}, ref) => {
  
  // Menu panel state management
  const {
    isPanelOpen: isMenuOpen,
    panelRef: menuRef,
    toggleRef: menuToggleRef,
    togglePanel: toggleMenu,
    handleClose: closeMenu,
  } = useMobilePanel({
    side: 'left',
    focusSelector: 'a, button:not([aria-hidden="true"])'
  })

  // Search panel state management
  const {
    isPanelOpen: isSearchOpen,
    panelRef: searchRef,
    toggleRef: searchToggleRef,
    togglePanel: toggleSearch,
    handleClose: closeSearch,
  } = useMobilePanel({
    side: 'right',
    focusSelector: 'input[type="text"], input[type="search"]'
  })

  const { handleSearchClick } = useMobileNavSearch({
    isSearchPage,
    toggleSearch,
    ref
  })
  
  return (
    <>
      {/* Top Navigation Bar */}
      <nav 
        className={MOBILE_NAV_STYLES.nav.container}
        aria-label={dictionary.navigation.accessibility.mainNavigation}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className={MOBILE_NAV_STYLES.nav.topBar}>
          
          {/* Hamburger Menu Button - Left */}
          <div className={MOBILE_NAV_STYLES.sections.left}>
            {!isSearchOpen && (
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={toggleMenu}
                ariaControls="mobile-menu-content"
                openLabel={dictionary.navigation.accessibility.openMenu}
                closeLabel={dictionary.navigation.accessibility.closeMenu}
                buttonRef={menuToggleRef}
              />
            )}
          </div>
          
          {isSearchOpen && <div className={MOBILE_NAV_STYLES.spacer} />}
          
          {/* Logo - Center (hidden when any panel is open) */}
          <div className={MOBILE_NAV_STYLES.sections.center}>
            <div className={cn(
              'transition-opacity duration-300',
              (isMenuOpen || isSearchOpen) ?
              'opacity-0 pointer-events-none' : 'opacity-100'
            )}>
              <Logo 
                lang={lang}
                variant="mobile"
                role="img"
                aria-label={dictionary.navigation.accessibility.logoAlt}
              />
            </div>
          </div>
          
          {/* Right side: Language Switcher + Search Button */}
          <div className={cn(
            MOBILE_NAV_STYLES.sections.right,
            'transition-opacity duration-300',
            isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}>
            <LanguageSwitcher currentLang={lang} />
            
            <SearchButton
              isOpen={isSearchOpen}
              onClick={handleSearchClick}
              ariaControls="mobile-search-content"
              openLabel={dictionary.search.accessibility.openSearch}
              closeLabel={dictionary.search.accessibility.closeSearch}
              buttonRef={searchToggleRef}
            />
          </div>
        </div>
      </nav>

      {/* Menu Offcanvas Panel */}
      <OffcanvasPanel
        id="mobile-menu-content"
        isOpen={isMenuOpen}
        onClose={closeMenu}
        side="left"
        title={dictionary.navigation.accessibility.menuTitle}
        ariaLabel={dictionary.navigation.accessibility.menuDescription}
        panelRef={menuRef}
      >
        <div className={PANEL_CONTENT_STYLES.menu.container}>
          <div className={PANEL_CONTENT_STYLES.menu.scrollArea}>
            <nav 
              className={PANEL_CONTENT_STYLES.menu.nav}
              role="menu"
              aria-label={dictionary.navigation.accessibility.mainMenuLabel}
            >
              <div className={PANEL_CONTENT_STYLES.menu.wrapper}>
                <Logo 
                  lang={lang}
                  variant="offcanvas"
                  role="img"
                  aria-label={dictionary.navigation.accessibility.logoAlt}
                  className="w-full lg:py-6 hover:bg-ol hover:shadow-lg focus:shadow-sm transition-all duration-200 py-4 rounded-2xl"
                />
                <ul className={PANEL_CONTENT_STYLES.menu.list}>
                  <NavLinks 
                    dictionary={dictionary}
                    lang={lang}
                    variant="mobile"
                  />
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </OffcanvasPanel>

      {/* Search Offcanvas Panel */}
      <OffcanvasPanel
        id="mobile-search-content"
        isOpen={isSearchOpen}
        onClose={closeSearch}
        side="right"
        title={dictionary.search.labels.title}
        ariaLabel={dictionary.search.accessibility.searchDescription}
        panelRef={searchRef}
      >
        <div className={PANEL_CONTENT_STYLES.search.container}>
          <MobileSearchContent 
            dictionary={dictionary}
            lang={lang}
            onSearchComplete={closeSearch}
          />
        </div>
      </OffcanvasPanel>
    </>
  )
})

MobileNavigation.displayName = 'MobileNavigation'

export default MobileNavigation