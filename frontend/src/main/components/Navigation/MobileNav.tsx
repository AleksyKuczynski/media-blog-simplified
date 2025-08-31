// src/main/components/Navigation/MobileNav.tsx - Enhanced Mobile Navigation without useEffect
'use client'

import { useState, useRef, useReducer, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()
  const lastPathRef = useRef(pathname)

  // Check for navigation change and auto-close menu
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname
    if (isMenuOpen) {
      // Auto-close on navigation - use setTimeout to avoid state update during render
      setTimeout(() => {
        handleClose()
      }, 0)
    }
  }

  // Enhanced keyboard event handler without useEffect
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMenuOpen) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        handleClose()
        toggleRef.current?.focus()
        break
      case 'Tab':
        // Trap focus within the menu when open
        const focusableElements = menuRef.current?.querySelectorAll(
          'a, button, input, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements && focusableElements.length > 0) {
          const first = focusableElements[0] as HTMLElement
          const last = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
        break
    }
  }, [isMenuOpen])

  // Enhanced navigation click handler
  const handleNavClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    
    if (link && link.href) {
      e.preventDefault()
      const href = link.getAttribute('href')
      
      // Close menu first, then navigate
      handleClose()
      
      // Navigate after menu close animation
      setTimeout(() => {
        if (href?.startsWith('/')) {
          router.push(href)
        }
      }, CONTROLS_ANIMATION_DURATION + MENU_ANIMATION_DURATION)
    }
  }, [router])

  const handleOpen = useCallback(() => {
    setIsMenuOpen(true)
    dispatch({ type: 'OPEN_MENU' });
    
    // Add keyboard event listener when menu opens
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' });
      // Focus the first interactive element after opening
      const firstLink = menuRef.current?.querySelector('a, button:not([aria-hidden="true"])') as HTMLElement
      firstLink?.focus()
    }, MENU_ANIMATION_DURATION);
  }, [handleKeyDown]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'HIDE_CONTROLS' });
    
    // Remove keyboard event listener and restore scroll
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'unset'
    
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MENU' });
      setTimeout(() => {
        dispatch({ type: 'RESET' });
        setIsMenuOpen(false);
      }, MENU_ANIMATION_DURATION);
    }, CONTROLS_ANIMATION_DURATION);
  }, [handleKeyDown])

  const toggleMenu = useCallback(() => {
    if (!isMenuOpen) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [isMenuOpen, handleOpen, handleClose]);

  const handleSearchComplete = useCallback(() => {
    // Close menu after search is completed
    setTimeout(() => {
      handleClose();
    }, 300);
  }, [handleClose]);
  
  return (
    <>
      {/* Top Navigation Bar for Mobile/Tablet */}
      <nav 
        className="xl:hidden bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300 relative z-50"
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
          
          {/* Right: Menu Toggle Button */}
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
            title={isMenuOpen ? translations.navigation.closeMenu : translations.navigation.openMenu}
            type="button"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {isMenuOpen ? (
                <svg 
                  className="w-5 h-5 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="w-5 h-5 transition-transform duration-200" 
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
      
      {/* Enhanced Mobile Menu Panel */}
      <aside 
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full 
          bg-sf-cont/95 backdrop-blur-xl 
          max-w-[430px] w-full z-60
          rounded-l-3xl shadow-2xl border-l border-ol-var/20
          transition-all duration-300 ease-out
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
          absolute top-4 right-4 flex items-center space-x-4 
          transition-all duration-200 z-10
          ${menuState === 'FULLY_OPENED' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <h2 id="mobile-menu-title" className="sr-only">
            {translations.navigation.menuTitle}
          </h2>
          <p id="mobile-menu-desc" className="sr-only">
            {translations.navigation.menuDescription}
          </p>
          
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
            <svg 
              className="h-6 w-6" 
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
          </button>
        </header>

        {/* Main Menu Content with Enhanced Animations */}
        <main 
          id="mobile-menu-content"
          className={`
            h-full flex flex-col justify-center px-8 py-16 space-y-8
            transition-all duration-300 ease-out
            ${menuState === 'FULLY_OPENED' ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}
          `}
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
              className="transition-transform duration-300 hover:scale-105"
            />
          </section>

          {/* Enhanced Navigation Section with Better Touch Support */}
          <section 
            aria-labelledby="mobile-nav-heading"
            onClick={handleNavClick}
          >
            <h3 id="mobile-nav-heading" className="sr-only">
              {translations.navigation.primarySections}
            </h3>
            
            <nav role="navigation" aria-label={translations.navigation.mainNavigation}>
              <ul 
                className="space-y-4 text-center"
                role="menubar"
                aria-orientation="vertical"
              >
                <NavLinks 
                  lang={lang} 
                  translations={translations.navigation} 
                  linkStyles="
                    block px-8 py-4 rounded-2xl text-lg font-medium
                    text-on-sf-var hover:text-on-sf hover:bg-sf-hi 
                    focus:bg-sf-hi focus:text-on-sf
                    active:bg-sf-hst active:scale-95
                    transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    touch-manipulation
                    md:hover:shadow-md md:hover:scale-102
                    relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-r 
                    before:from-transparent before:via-white/5 before:to-transparent
                    before:translate-x-[-100%] hover:before:translate-x-[100%]
                    before:transition-transform before:duration-500
                  "
                  disableClientDecorations={true}
                  role="menuitem"
                />
              </ul>
            </nav>
          </section>

          {/* Search Section - Keep Existing SearchBar Intact */}
          <section 
            className="mt-8"
            aria-labelledby="mobile-search-heading"
          >
            <h3 id="mobile-search-heading" className="sr-only">
              {translations.search.pageDescription}
            </h3>
            
            <div 
              role="search" 
              aria-label={translations.search.pageDescription}
            >
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
      
      {/* Enhanced current page context for screen readers */}
      {currentPageTitle && (
        <div className="sr-only" aria-live="polite">
          {translations.navigation.currentPage}: {currentPageTitle}
        </div>
      )}

      {/* Skip link for mobile users */}
      <a 
        href="#main-content" 
        className="
          sr-only focus:not-sr-only fixed top-4 left-4 z-[70]
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