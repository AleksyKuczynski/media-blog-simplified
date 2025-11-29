// src/features/navigation/MobileNav/MobileNav.tsx
'use client'

import Logo from '../../../shared/primitives/Logo'
import NavLinks from '../NavLinks'
import SearchButton from './SearchButton'
import OffcanvasPanel from './OffcanvasPanel'
import MobileSearchContent from '../../search/ui/MobileSearchContent'
import LanguageSwitcher from '../LanguageSwitcher'
import { useMobilePanel } from './useMobilePanel'
import { Dictionary, Lang } from '@/config/i18n'
import HamburgerButton from './HamburgerButton'
import { MOBILE_NAV_STYLES, PANEL_CONTENT_STYLES } from './styles'

interface MobileNavProps {
  dictionary: Dictionary
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export default function MobileNavigation({
  dictionary,
  lang,
}: MobileNavProps) {
  
  // Menu panel state management
  const {
    isPanelOpen: isMenuOpen,
    panelRef: menuRef,
    toggleRef: menuToggleRef,
    togglePanel: toggleMenu,
    handleClose: closeMenu,
    handleContentComplete: handleMenuComplete,
  } = useMobilePanel({
    side: 'left',
    panelId: 'mobile-menu-content',
    historyStateKey: 'mobileMenuOpen',
    onOtherPanelOpen: undefined,
    focusSelector: 'a, button:not([aria-hidden="true"])'
  })

  // Search panel state management
  const {
    isPanelOpen: isSearchOpen,
    panelRef: searchRef,
    toggleRef: searchToggleRef,
    togglePanel: toggleSearch,
    handleClose: closeSearch,
    handleContentComplete: handleSearchComplete,
  } = useMobilePanel({
    side: 'right',
    panelId: 'mobile-search-content',
    historyStateKey: 'mobileSearchOpen',
    onOtherPanelOpen: () => {
      if (isMenuOpen) {
        closeMenu(false)
      }
    },
    focusSelector: 'input[type="text"], input[type="search"]'
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
          
          {isSearchOpen && <div className={MOBILE_NAV_STYLES.spacer} />}
          
          {/* Logo - Center */}
          <Logo 
            lang={lang}
            variant="mobile"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoAlt}
          />
          
          {/* Right side: Language Switcher + Search Button */}
          <div className={MOBILE_NAV_STYLES.sections.right}>
            {!isMenuOpen && <LanguageSwitcher currentLang={lang} />}
            
            {!isMenuOpen && (
              <SearchButton
                isOpen={isSearchOpen}
                onClick={toggleSearch}
                ariaControls="mobile-search-content"
                openLabel={dictionary.search.accessibility.openSearch}
                closeLabel={dictionary.search.accessibility.closeSearch}
                buttonRef={searchToggleRef}
              />
            )}
            
            {isMenuOpen && <div className={MOBILE_NAV_STYLES.spacer} />}
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
              onTransitionEnd={handleMenuComplete}
            >
              <ul className={PANEL_CONTENT_STYLES.menu.list}>
                <NavLinks 
                  dictionary={dictionary}
                  lang={lang}
                  className="block w-full text-left"
                />
              </ul>
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
}