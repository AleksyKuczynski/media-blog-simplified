// src/main/components/Navigation/MobileNav.tsx - Fixed Slide-out Panel Design
'use client'

import { NavProps } from './Navigation'
import Logo from '../Logo'
import NavLinks from './NavLinks'
import SearchBar from '../Search/SearchBar'
import { MobileNavOverlay } from './MobileNavOverlay'
import { useMobileNavigation } from './useMobileNavigation'

export default function MobileNavigation({
  lang,
  translations,
  currentPageTitle,
}: NavProps) {
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
        aria-label={translations.navigation.mainNavigation}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="flex items-center justify-between h-16 px-4">
          <Logo 
            lang={lang} 
            variant="mobile"
            role="img"
            aria-label={translations.navigation.logoAlt}
          />
          
          <button
            ref={toggleRef}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-content" 
            aria-label={isMenuOpen ? translations.navigation.closeMenu : translations.navigation.openMenu}
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
                // Close icon (X)
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu icon (hamburger)
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Backdrop */}
      {isMenuOpen && (
        <MobileNavOverlay 
          onClose={handleClose}
        />
      )}

      {/* Mobile Menu Panel - Slide-out from right */}
      <aside
        ref={menuRef}
        id="mobile-menu-content"
        className={`
          fixed top-0 right-0 h-full 
          bg-sf-cont/95 backdrop-blur-xl 
          max-w-[430px] w-full z-[70]
          rounded-l-3xl shadow-2xl border-l border-ol-var/20
          transition-all duration-300 ease-out
          xl:hidden
          ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-describedby="mobile-menu-description"
      >
        {/* Menu Header with Close Button */}
        <header className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            aria-label={translations.navigation.closeMenu}
            className="
              p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf
              transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              active:scale-95 touch-manipulation
            "
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Hidden titles for accessibility */}
        <h2 id="mobile-menu-title" className="sr-only">
          {translations.navigation.menuTitle}
        </h2>
        <p id="mobile-menu-description" className="sr-only">
          {translations.navigation.menuDescription}
        </p>

        {/* Main Menu Content - No onClick handler to prevent click bubbling */}
        <main 
          className="h-full flex flex-col justify-center px-8 py-16 space-y-8"
          role="main"
        >
          
          {/* Logo Section - No border styling */}
          <section className="flex justify-center mb-8">
            <Logo 
              lang={lang} 
              variant="mobile"
              role="img"
              aria-label={translations.navigation.logoAlt}
              className="
                transition-transform duration-300 hover:scale-105
                focus:outline-none focus:ring-0 focus:ring-offset-0
                no-underline border-0
              "
            />
          </section>

          {/* Navigation Section with mobile styling */}
          <section aria-labelledby="mobile-nav-heading">
            <h3 id="mobile-nav-heading" className="sr-only">
              {translations.navigation.primarySections}
            </h3>
            
            <nav role="navigation" aria-label={translations.navigation.mainNavigation}>
              <ul 
                className="
                  flex flex-col items-center space-y-4 text-center
                  [&_.nav-link]:!px-6 [&_.nav-link]:!py-3 
                  [&_.nav-link]:!min-w-[120px] [&_.nav-link]:!text-center
                  [&_.nav-link]:!block [&_.nav-link]:!w-full
                  [&_li]:!block [&_li]:!w-full
                "
                role="menubar"
                aria-orientation="vertical"
              >
                <NavLinks 
                  lang={lang} 
                  translations={translations.navigation} 
                  role="menuitem"
                />
              </ul>
            </nav>
          </section>

          {/* Search Section */}
          <section className="mt-8 w-full max-w-md mx-auto" aria-labelledby="mobile-search-heading">
            <h3 id="mobile-search-heading" className="sr-only">
              {translations.search.pageDescription}
            </h3>
            
            <div role="search" aria-label={translations.search.pageDescription}>
              <SearchBar 
                searchTranslations={translations.search} 
                lang={lang}
                onSearchComplete={handleSearchComplete}
                className="w-full rounded-2xl"
                aria-label={translations.search.placeholder}
              />
            </div>
          </section>

        </main>
      </aside>
      
      {/* Screen reader context */}
      {currentPageTitle && (
        <div className="sr-only" aria-live="polite">
          {translations.navigation.currentPage}: {currentPageTitle}
        </div>
      )}

      {/* Skip link */}
      <a 
        href="#main-content" 
        className="
          sr-only focus:not-sr-only fixed top-4 left-4 z-[80]
          bg-primary text-on-primary px-4 py-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-variant
          transition-all duration-200
        "
      >
        {translations.navigation.skipToContent}
      </a>
    </>
  );
}