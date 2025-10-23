// src/main/components/Navigation/useMobileNavigation.ts
// FIXED: Improved click handling to prevent premature menu closure
// FEATURE: Added browser back button interception for mobile menu

import { useState, useRef, useReducer, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { menuAnimationReducer } from './menuAnimationReducer'
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '../Interface/constants'

export function useMobileNavigation() {
  const [menuState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED');
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Track if we pushed a history state for the menu
  const historyStatePushed = useRef(false)

  // Use refs to avoid circular dependencies
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)
  const popstateHandlerRef = useRef<((e: PopStateEvent) => void) | null>(null)

  // Core close function without dependencies
  const handleClose = useCallback(() => {
    dispatch({ type: 'HIDE_CONTROLS' });
    
    // Clean up event listeners and restore scroll
    if (keydownHandlerRef.current) {
      document.removeEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.removeEventListener('popstate', popstateHandlerRef.current)
    }
    document.body.style.overflow = 'unset'
    
    // Remove history state if we pushed one
    if (historyStatePushed.current) {
      historyStatePushed.current = false
      // Go back to remove our menu state, but prevent the popstate handler from firing
      if (popstateHandlerRef.current) {
        window.removeEventListener('popstate', popstateHandlerRef.current)
      }
      if (window.history.state?.mobileMenuOpen) {
        window.history.back()
      }
    }
    
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MENU' });
      setTimeout(() => {
        dispatch({ type: 'RESET' });
        setIsMenuOpen(false);
      }, MENU_ANIMATION_DURATION);
    }, CONTROLS_ANIMATION_DURATION);
  }, [])

  // Enhanced keyboard event handler
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
  }, [isMenuOpen, handleClose])

  // Browser back button handler
  const handlePopState = useCallback((e: PopStateEvent) => {
    // Check if this popstate is for our menu
    if (isMenuOpen && historyStatePushed.current) {
      // Prevent default navigation
      e.preventDefault()
      
      // Close the menu instead of navigating
      handleClose()
    }
  }, [isMenuOpen, handleClose])

  // Update refs when handlers change
  keydownHandlerRef.current = handleKeyDown
  popstateHandlerRef.current = handlePopState

  const handleOpen = useCallback(() => {
    setIsMenuOpen(true)
    dispatch({ type: 'OPEN_MENU' });
    
    // Push a history state for the menu
    // This allows us to intercept the back button
    if (!historyStatePushed.current) {
      window.history.pushState(
        { mobileMenuOpen: true },
        '',
        window.location.href
      )
      historyStatePushed.current = true
    }
    
    // Add event listeners when menu opens
    if (keydownHandlerRef.current) {
      document.addEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.addEventListener('popstate', popstateHandlerRef.current)
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' });
      // Focus the first interactive element after opening
      const firstLink = menuRef.current?.querySelector('a, button:not([aria-hidden="true"])') as HTMLElement
      firstLink?.focus()
    }, MENU_ANIMATION_DURATION);
  }, []);

  // Auto-close on navigation change
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname
    if (isMenuOpen) {
      setTimeout(() => {
        handleClose()
      }, 0)
    }
  }

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

  // FIXED: Proper click handling to allow interactions within menu content
  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Check if the clicked element is interactive or within an interactive element
    const isInteractiveElement = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[role="combobox"]') ||
      target.closest('.search-container') || // Allow search component interactions
      target.closest('[data-interactive]') // Custom data attribute for interactive elements
    
    // Allow clicks on interactive elements to proceed normally
    if (isInteractiveElement) {
      // Don't prevent default or stop propagation - let the interaction work
      return
    }
    
    // For non-interactive areas, prevent the click from bubbling to overlay
    e.stopPropagation()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove all event listeners
      if (keydownHandlerRef.current) {
        document.removeEventListener('keydown', keydownHandlerRef.current)
      }
      if (popstateHandlerRef.current) {
        window.removeEventListener('popstate', popstateHandlerRef.current)
      }
      
      // Restore scroll
      document.body.style.overflow = 'unset'
      
      // Clean up history state if component unmounts while menu is open
      if (historyStatePushed.current && window.history.state?.mobileMenuOpen) {
        window.history.back()
      }
    }
  }, [])

  return {
    // State
    menuState,
    isMenuOpen,
    
    // Refs
    menuRef,
    toggleRef,
    
    // Handlers
    handleOpen,
    handleClose,
    toggleMenu,
    handleSearchComplete,
    handleMenuClick
  }
}