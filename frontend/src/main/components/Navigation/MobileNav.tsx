// src/main/components/Navigation/MobileNav.tsx
// Refactored mobile navigation with unified offcanvas panels
// Manages state for both menu and search panels

'use client'

import Logo from '../Logo'
import NavLinks from './NavLinks'
import HamburgerButton from './HamburgerButton'
import SearchButton from './SearchButton'
import OffcanvasPanel from './OffcanvasPanel'
import MobileSearchContent from '../Search/MobileSearchContent'
import { useMobilePanel } from './useMobilePanel'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'

interface MobileNavProps {
  dictionary: Dictionary
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

/**
 * MobileNavigation - Unified mobile navigation coordinator
 * Manages both menu and search offcanvas panels
 * Uses unified OffcanvasPanel component for consistent behavior
 */
export default function MobileNavigation({
  dictionary,
  lang,
  currentPageTitle,
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
    onOtherPanelOpen: undefined, // Menu doesn't auto-close search
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
      // Close menu when search opens
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
        className="xl:hidden bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300 relative z-50"
        aria-label={dictionary.navigation.accessibility.mainNavigation}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="flex items-center justify-between h-16 px-4">
          
          {/* Hamburger Menu Button - Left (hidden when search is open) */}
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
          
          {/* Spacer when hamburger is hidden */}
          {isSearchOpen && <div className="w-12" />}
          
          {/* Logo - Center */}
          <Logo 
            lang={lang}
            variant="mobile"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoAlt}
          />
          
          {/* Spacer when search is hidden */}
          {isMenuOpen && <div className="w-12" />}
          
          {/* Search Button - Right (hidden when menu is open) */}
          {!isMenuOpen && (
            <SearchButton
              isOpen={isSearchOpen}
              onClick={toggleSearch}
              ariaControls="mobile-search-content"
              openLabel={dictionary.search.accessibility.openSearch || 'Open search'}
              closeLabel={dictionary.search.accessibility.closeSearch || 'Close search'}
              buttonRef={searchToggleRef}
            />
          )}
        </div>
      </nav>

      {/* Mobile Menu Offcanvas Panel - Slides from LEFT */}
      <OffcanvasPanel
        id="mobile-menu-content"
        isOpen={isMenuOpen}
        onClose={() => closeMenu(false)}
        side="left"
        title={dictionary.navigation.accessibility.menuTitle}
        ariaLabel={dictionary.navigation.accessibility.menuDescription}
        panelRef={menuRef}
      >
        {/* Menu Navigation Links */}
        <div className="px-6 py-6">
          <ul 
            className="space-y-4"
            role="menu"
            aria-label={dictionary.navigation.accessibility.mainMenuLabel}
          >
            <NavLinks 
              dictionary={dictionary}
              lang={lang}
              className="mobile-nav-links"
            />
          </ul>
        </div>
      </OffcanvasPanel>

      {/* Mobile Search Offcanvas Panel - Slides from RIGHT */}
      <OffcanvasPanel
        id="mobile-search-content"
        isOpen={isSearchOpen}
        onClose={() => closeSearch(false)}
        side="right"
        title={dictionary.search.labels.title}
        ariaLabel={dictionary.search.accessibility.searchLabel || 'Search'}
        panelRef={searchRef}
      >
        {/* Search Content - Only render when open for performance */}
        {isSearchOpen && (
          <MobileSearchContent
            dictionary={dictionary}
            lang={lang}
            onSearchComplete={handleSearchComplete}
          />
        )}
      </OffcanvasPanel>
    </>
  )
}