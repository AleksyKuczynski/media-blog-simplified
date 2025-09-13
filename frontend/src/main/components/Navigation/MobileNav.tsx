// src/main/components/Navigation/MobileNav.tsx
// Fixed to use correct SearchBar props

'use client'

import Logo from '../Logo'
import NavLinks from './NavLinks'
import SearchBar from '../Search/SearchBar'
import { MobileNavOverlay } from './MobileNavOverlay'
import { useMobileNavigation } from './useMobileNavigation'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'

interface MobileNavProps {
  dictionary: Dictionary // NEW: Use new dictionary structure
  lang: Lang
  isSearchPage: boolean
  currentPageTitle?: string
  currentPath?: string
}

export default function MobileNavigation({
  dictionary,
  lang, // KEEP: Lang parameter
  currentPageTitle,
}: MobileNavProps) {
  const {
    menuState,
    isMenuOpen,
    menuRef,
    toggleRef,
    toggleMenu,
    handleClose,
    handleSearchComplete,
  } = useMobileNavigation()
  
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
          <Logo 
            lang={lang}
            variant="mobile"
            role="img"
            aria-label={dictionary.navigation.accessibility.logoAlt}
          />
          
          <button
            ref={toggleRef}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-content" 
            aria-label={
              isMenuOpen 
                ? dictionary.navigation.accessibility.closeMenu
                : dictionary.navigation.accessibility.openMenu
            }
            className="
              p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf 
              transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              active:scale-95 touch-manipulation
            "
            type="button"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isMenuOpen ? (
                // Close icon
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu icon
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <MobileNavOverlay onClose={handleClose} />}

      {/* Slide-out Menu Panel */}
      <div
        ref={menuRef}
        id="mobile-menu-content"
        className={`
          fixed top-16 left-0 right-0 bottom-0 z-40
          bg-sf-cont/95 backdrop-blur-lg border-b border-ol-var/20
          transform transition-transform duration-300 ease-in-out
          ${menuState === 'FULLY_OPENED' ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-hidden={!isMenuOpen}
        aria-label={dictionary.navigation.accessibility.menuDescription}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="px-6 py-4 border-b border-ol-var/20">
            <h2 className="text-lg font-semibold text-on-sf">
              {dictionary.navigation.accessibility.menuTitle}
            </h2>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-6">
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

          {/* Mobile Search - FIXED: Use new dictionary structure */}
          <div className="px-6 py-4 border-t border-ol-var/20">
            <SearchBar
              dictionary={dictionary} // NEW: Use new dictionary structure
              lang={lang}
              onSearchComplete={handleSearchComplete}
            />
          </div>
        </div>
      </div>
    </>
  )
}