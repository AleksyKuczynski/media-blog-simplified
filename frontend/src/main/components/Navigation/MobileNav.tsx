// src/main/components/Navigation/MobileNav.tsx - COMPLETE FIXED VERSION
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
import { FloatingButton } from '../Interface/FloatingButton'

export default function MobileNavigation({
  lang,
  translations,
}: NavProps) {
  const [menuState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED');
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Check if actual navigation occurred
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
    <nav className="xl:hidden">
      {isMenuOpen && <MobileNavOverlay onClose={handleClose} />}
      
      {/* Mobile Menu Panel */}
      <div 
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full 
          bg-sf-cont backdrop-blur-lg 
          max-w-[430px] w-full z-60
          rounded-l-3xl shadow-2xl
          transition-all duration-300
          ${(menuState === 'CLOSED' || menuState === 'CLOSING') 
            ? 'translate-x-full' 
            : 'translate-x-0'}
        `}
      >
        {/* Close Button */}
        <div className={`
          fixed top-4 right-4 flex items-center space-x-4 
          transition-all duration-200 z-50
          ${menuState === 'FULLY_OPENED' ? 'opacity-100' : 'opacity-0'}
        `}>
          <NavButton
            ref={toggleRef}
            onClick={handleClose}
            context="mobile"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Close menu"
            className="p-3 rounded-full bg-sf-hi hover:bg-sf-hst transition-colors duration-200"
          >
            <svg 
              className="h-6 w-6 text-on-sf" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </NavButton>
        </div>

        {/* Menu Content */}
        <div 
          id="mobile-menu" 
          className="h-full flex flex-col justify-center px-8 py-16 space-y-8"
        >
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo lang={lang} variant="mobile" />
          </div>

          {/* Navigation Links */}
          <div onClick={handleNavClick}>
            <ul className="space-y-6 text-center">
              <NavLinks 
                lang={lang} 
                translations={translations.navigation} 
                linkStyles="px-4 py-2 rounded-full text-lg font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
                disableClientDecorations={true}
              />
            </ul>
          </div>

          {/* Search */}
          <div className="mt-8">
            <SearchBar 
              searchTranslations={translations.search} 
              lang={lang}
              onSearchComplete={handleSearchComplete}
              className="w-full rounded-2xl"
            />
          </div>

          {/* Dark/Light Toggle */}
          <div className="flex justify-center">
            <button
              className="p-4 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200"
              onClick={() => document.documentElement.classList.toggle('dark')}
              aria-label="Toggle dark mode"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* FIXED: Complete Floating Menu Button with Hamburger Icon */}
      <FloatingButton
  onClick={toggleMenu}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu" 
  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
  className="!p-4 !bg-pr-cont !text-on-pr !shadow-lg hover:!shadow-xl" // Use ! to force override
  position="bottom-right"
  zIndex="menu"
>
  {/* Hamburger Icon */}
  <svg 
    className="w-6 h-6" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 6h16M4 12h16M4 18h16" 
    />
  </svg>
</FloatingButton>
    </nav>
  );
}