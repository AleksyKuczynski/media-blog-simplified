// src/main/components/Navigation/MobileNav.tsx - SEO-Enhanced Mobile Navigation (Fixed)
'use client'

import { useState, useRef, useReducer, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { NavProps } from './Navigation'
import { NavButton } from '../Interface'
import Logo from '../Logo'
import NavLinks from './NavLinks'
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '../Interface/constants'
import { menuAnimationReducer } from './menuAnimationReducer'
import SearchBar from '../Search/SearchBar'
import { MobileNavOverlay } from './MobileNavOverlay'

export default function MobileNavigation({
  lang,
  translations,
  currentPageTitle,
}: NavProps) {
  const [menuState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED');
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Auto-close on navigation
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname
    isMenuOpen && setIsMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a')
    if (link) {
      setTimeout(() => handleClose(), 0)
    }
  }

  const handleOpen = useCallback(() => {
    dispatch({ type: 'OPEN_MENU' });
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' });
    }, MENU_ANIMATION_DURATION);
  }, []);

  const handleClose = useCallback(() => {
    handleCloseAnimation()
  }, [])

  const handleCloseAnimation = () => {
    dispatch({ type: 'HIDE_CONTROLS' });
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MENU' });
      setTimeout(() => {
        dispatch({ type: 'RESET' });
        setIsMenuOpen(false);
      }, MENU_ANIMATION_DURATION);
    }, CONTROLS_ANIMATION_DURATION);
  }

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      handleOpen();
    } else {
      handleClose();
      setTimeout(() => {
        setIsMenuOpen(false);
      }, MENU_ANIMATION_DURATION + CONTROLS_ANIMATION_DURATION);
    }
  };

  const handleSearchComplete = useCallback(() => {
    handleClose();
  }, [handleClose]);
  
  return (
    <>
      {/* Top Navigation Bar for Mobile/Tablet */}
      <nav 
        className="xl:hidden bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300"
        aria-label={translations.navigation.mainNavigation}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo 
              lang={lang} 
              variant="mobile"
              role="img"
              aria-label={translations.navigation.logoAlt}
            />
          </div>
          
          {/* Right: Menu Toggle Button - KEPT IN TOP AREA */}
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-content" 
            aria-label={isMenuOpen ? translations.navigation.closeMenu : translations.navigation.openMenu}
            className="p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title={isMenuOpen ? translations.navigation.closeMenu : translations.navigation.openMenu}
            type="button"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isMenuOpen ? (
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
            
            <span className="sr-only">
              {isMenuOpen ? translations.navigation.closeMenu : translations.navigation.openMenu}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <MobileNavOverlay onClose={handleClose} />}
      
      {/* Mobile Menu Panel with Enhanced Semantic Structure */}
      <aside 
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full 
          bg-sf-cont backdrop-blur-lg 
          max-w-[430px] w-full z-60
          rounded-l-3xl shadow-2xl
          transition-all duration-300
          ${(menuState === 'CLOSED' || menuState === 'CLOSING') 
            ? 'translate-x-full opacity-0' 
            : 'translate-x-0 opacity-100'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-describedby="mobile-menu-desc"
        tabIndex={-1}
      >
        {/* Enhanced Menu Header */}
        <header className={`
          fixed top-4 right-4 flex items-center space-x-4 
          transition-all duration-200 z-50
          ${menuState === 'FULLY_OPENED' ? 'opacity-100' : 'opacity-0'}
        `}>
          <h2 id="mobile-menu-title" className="sr-only">
            {translations.navigation.menuTitle}
          </h2>
          <p id="mobile-menu-desc" className="sr-only">
            {translations.navigation.menuDescription}
          </p>
          
          <NavButton
            ref={toggleRef}
            onClick={handleClose}
            context="mobile"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-content"
            aria-label={translations.navigation.closeMenu}
            className="p-3 rounded-full bg-sf-hi hover:bg-sf-hst transition-colors duration-200"
          >
            <svg 
              className="h-6 w-6 text-on-sf" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </NavButton>
        </header>

        {/* Main Menu Content */}
        <main 
          id="mobile-menu-content"
          className="h-full flex flex-col justify-center px-8 py-16 space-y-8"
          role="main"
        >
          
          {/* Brand/Logo Section */}
          <section 
            className="flex justify-center mb-8"
            aria-label={translations.navigation.logoAlt}
          >
            <Logo 
              lang={lang} 
              variant="mobile"
              role="img"
              aria-label={translations.navigation.logoAlt}
            />
          </section>

          {/* Primary Navigation Section - Enhanced for Small Laptops */}
          <section 
            aria-labelledby="mobile-nav-heading"
            onClick={handleNavClick}
          >
            <h3 id="mobile-nav-heading" className="sr-only">
              {translations.navigation.primarySections}
            </h3>
            
            <nav role="navigation" aria-label={translations.navigation.mainNavigation}>
              <ul 
                className="space-y-6 text-center"
                role="menubar"
                aria-orientation="vertical"
              >
                <NavLinks 
                  lang={lang} 
                  translations={translations.navigation} 
                  // Enhanced styles with hover/focus for small laptops
                  linkStyles="block px-6 py-3 rounded-2xl text-lg font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi focus:bg-sf-hi focus:text-on-sf transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  disableClientDecorations={true}
                  role="menuitem"
                />
              </ul>
            </nav>
          </section>

          {/* Search Section */}
          <section 
            className="mt-8"
            aria-labelledby="mobile-search-heading"
          >
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

          {/* Removed Settings Section - No More Theme Toggle */}

        </main>
      </aside>
      
      {/* Current page context for mobile */}
      {currentPageTitle && (
        <div className="sr-only" aria-live="polite">
          {translations.navigation.currentPage}: {currentPageTitle}
        </div>
      )}
    </>
  );
}