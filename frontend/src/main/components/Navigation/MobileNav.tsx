// src/main/components/Navigation/MobileNav.tsx
'use client'

import { useState, useRef, useReducer, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { NavProps } from './Navigation'
import { NavButton } from '../Interface'
import Logo from '../Logo'
import NavLinks from './NavLinks'
// ✅ REMOVED: LanguageSwitcher import - no longer needed for Russian-only site
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '../Interface/constants'
import { menuAnimationReducer } from './menuAnimationReducer'
import SearchBar from '../Search/SearchBar'
import { MobileNavOverlay } from './MobileNavOverlay'
import { FloatingButton } from '../Interface/FloatingButton'

// ✅ SIMPLIFIED: Only 'rounded' theme styles (will be hardcoded later)
const linkStylesValues = {
  default: 'px-3 py-2 text-sm font-medium uppercase tracking-wider',
  rounded: 'px-4 py-2 rounded-full text-sm font-medium',
  sharp: 'px-3 py-2 border-b-2 border-transparent text-sm font-semibold',
};

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
    // Only process actual link clicks
    const link = (e.target as HTMLElement).closest('a')
    if (link) {
      // Let the navigation complete first
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
      // Delay state change until animation completes
      setTimeout(() => {
        setIsMenuOpen(false);
      }, MENU_ANIMATION_DURATION + CONTROLS_ANIMATION_DURATION);
    }
  };

  const handleSearchComplete = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const getMenuClassName = () => {
    const base = `
      fixed top-0 right-0 h-full 
      backdrop-blur-lg 
      max-w-[430px] w-full
      z-60
      transition-all duration-300
    `;
    // Add CLOSING state to translate-x-full condition
    const position = (menuState === 'CLOSED' || menuState === 'CLOSING') 
      ? 'translate-x-full' 
      : 'translate-x-0';
    return `${base} ${position}`;
  };

  const getControlsClassName = () => {
    const base = "fixed top-4 right-4 flex items-center space-x-4 transition-all duration-200 z-50";
    switch (menuState) {
      case 'FULLY_OPENED':
        return `${base} opacity-100`;
      case 'HIDING_CONTROLS':
      case 'CLOSING':
      case 'CLOSED':
        return `${base} opacity-0`;
      default:
        return `${base} opacity-0`;
    }
  };
  
  return (
    <nav className="xl:hidden">
      {isMenuOpen && <MobileNavOverlay onClose={handleClose} />}
      <div 
        ref={menuRef}
        className={getMenuClassName()}
      >
        <div className={getControlsClassName()}>
          <NavButton
            ref={toggleRef}
            onClick={handleClose}
            context="mobile"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg 
              className="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen 
                  ? "M6 18L18 6M6 6l12 12" // Close icon (X)
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger menu
                }
              />
            </svg>
          </NavButton>
        </div>

        {/* Menu Content */}
        <div id="mobile-menu" className="h-full flex flex-col justify-center px-8 py-16 space-y-8">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo lang={lang} variant="mobile" />
          </div>

          {/* Navigation Links */}
          <div onClick={handleNavClick}>
            <ul className="space-y-6 text-center">
              <li>
                <NavLinks 
                  lang={lang} 
                  translations={translations.navigation} 
                  disableClientDecorations={true}
                />
              </li>
            </ul>
          </div>

          {/* Search */}
          <div className="mt-8">
            <SearchBar 
              searchTranslations={translations.search} 
              lang={lang}
              onSearchComplete={handleSearchComplete}
              className="w-full"
            />
          </div>

        </div>
      </div>

      {/* Floating Menu Button */}
      <FloatingButton
        onClick={toggleMenu}
        isOpen={isMenuOpen}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      />
    </nav>
  );
}