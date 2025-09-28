// src/main/components/Navigation/useMobileNavigation.ts
// FIXED: Improved click handling to prevent premature menu closure

import { useState, useRef, useReducer, useCallback } from 'react'
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

  // Use refs to avoid circular dependencies
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)

  // Core close function without dependencies
  const handleClose = useCallback(() => {
    dispatch({ type: 'HIDE_CONTROLS' });
    
    // Clean up event listeners and restore scroll
    if (keydownHandlerRef.current) {
      document.removeEventListener('keydown', keydownHandlerRef.current)
    }
    document.body.style.overflow = 'unset'
    
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

  // Update ref when handler changes
  keydownHandlerRef.current = handleKeyDown

  const handleOpen = useCallback(() => {
    setIsMenuOpen(true)
    dispatch({ type: 'OPEN_MENU' });
    
    // Add keyboard event listener when menu opens
    if (keydownHandlerRef.current) {
      document.addEventListener('keydown', keydownHandlerRef.current)
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
      console.log('Interactive element clicked:', target)
      return
    }
    
    // For non-interactive areas, prevent the click from bubbling to overlay
    e.stopPropagation()
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
    handleMenuClick // FIXED: Now properly implemented
  }
}