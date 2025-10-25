// src/main/components/Navigation/useMobileSearch.ts
// Hook for managing mobile search overlay state and interactions

import { useState, useRef, useReducer, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { menuAnimationReducer } from './menuAnimationReducer'
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '../Interface/constants'

export function useMobileSearch(onMenuOpen?: () => void) {
  const [searchState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED');
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Track if we pushed a history state for the search
  const historyStatePushed = useRef(false)
  const previousHistoryState = useRef<any>(null)

  // Use refs to avoid circular dependencies
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)
  const popstateHandlerRef = useRef<((e: PopStateEvent) => void) | null>(null)

  // Core close function
  const handleClose = useCallback((triggeredByPopstate = false) => {
    dispatch({ type: 'HIDE_CONTROLS' });
    
    // Clean up event listeners and restore scroll
    if (keydownHandlerRef.current) {
      document.removeEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.removeEventListener('popstate', popstateHandlerRef.current)
    }
    document.body.style.overflow = 'unset'
    
    // Handle history cleanup
    if (historyStatePushed.current) {
      historyStatePushed.current = false
      
      if (!triggeredByPopstate) {
        // User closed manually (overlay, toggle, escape, etc.)
        // Use replaceState instead of history.back() to avoid navigation
        window.history.replaceState(
          previousHistoryState.current,
          '',
          window.location.href
        )
      }
      
      previousHistoryState.current = null
    }
    
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MENU' });
      setTimeout(() => {
        dispatch({ type: 'RESET' });
        setIsSearchOpen(false);
      }, MENU_ANIMATION_DURATION);
    }, CONTROLS_ANIMATION_DURATION);
  }, [])

  // Enhanced keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isSearchOpen) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        handleClose(false)
        toggleRef.current?.focus()
        break
      case 'Tab':
        // Trap focus within the search panel when open
        const focusableElements = searchRef.current?.querySelectorAll(
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
  }, [isSearchOpen, handleClose])

  // Browser back button handler
  const handlePopState = useCallback((e: PopStateEvent) => {
    // Only handle if we have a search state pushed
    if (historyStatePushed.current) {
      // Back button was pressed - close the search
      handleClose(true)
    }
  }, [handleClose])

  // Update refs when handlers change
  useEffect(() => {
    keydownHandlerRef.current = handleKeyDown
    popstateHandlerRef.current = handlePopState
  }, [handleKeyDown, handlePopState])

  const handleOpen = useCallback(() => {
    // Close menu if it's open
    onMenuOpen?.()
    
    setIsSearchOpen(true)
    dispatch({ type: 'OPEN_MENU' });
    
    // Push a history state for the search
    if (!historyStatePushed.current) {
      previousHistoryState.current = window.history.state
      
      window.history.pushState(
        { mobileSearchOpen: true },
        '',
        window.location.href
      )
      historyStatePushed.current = true
    }
    
    // Add event listeners when search opens
    if (keydownHandlerRef.current) {
      document.addEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.addEventListener('popstate', popstateHandlerRef.current)
    }
    
    // Prevent body scroll when search is open
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' });
      // Focus the search input after opening
      const searchInput = searchRef.current?.querySelector('input[type="text"]') as HTMLElement
      searchInput?.focus()
    }, MENU_ANIMATION_DURATION);
  }, [onMenuOpen]);

  // Auto-close on navigation change
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname
    if (isSearchOpen) {
      setTimeout(() => {
        handleClose(false)
      }, 0)
    }
  }

  const toggleSearch = useCallback(() => {
    if (!isSearchOpen) {
      handleOpen();
    } else {
      handleClose(false);
    }
  }, [isSearchOpen, handleOpen, handleClose]);

  const handleSearchComplete = useCallback(() => {
    // Close search after navigation is completed
    setTimeout(() => {
      handleClose(false);
    }, 300);
  }, [handleClose]);

  // Proper click handling to allow interactions within search content
  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Check if the clicked element is interactive
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
      target.closest('.search-container') ||
      target.closest('[data-interactive]')
    
    // Allow clicks on interactive elements to proceed normally
    if (isInteractiveElement) {
      return
    }
    
    // For non-interactive areas, prevent the click from bubbling to overlay
    e.stopPropagation()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (keydownHandlerRef.current) {
        document.removeEventListener('keydown', keydownHandlerRef.current)
      }
      if (popstateHandlerRef.current) {
        window.removeEventListener('popstate', popstateHandlerRef.current)
      }
      
      document.body.style.overflow = 'unset'
      
      if (historyStatePushed.current && previousHistoryState.current) {
        window.history.replaceState(
          previousHistoryState.current,
          '',
          window.location.href
        )
        historyStatePushed.current = false
        previousHistoryState.current = null
      }
    }
  }, [])

  return {
    // State
    searchState,
    isSearchOpen,
    
    // Refs
    searchRef,
    toggleRef,
    
    // Handlers
    handleOpen,
    handleClose: () => handleClose(false),
    toggleSearch,
    handleSearchComplete,
    handleSearchClick
  }
}