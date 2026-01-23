// src/main/components/Navigation/useMobilePanel.ts
// Unified hook for mobile offcanvas panels (menu and search)
// Supports panels sliding from left or right with identical behavior
// UPDATED: Enhanced body scroll lock with iOS Safari support

import { useState, useRef, useReducer, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { lockBodyScroll, unlockBodyScroll } from '@/lib/utils/bodyScrollLock'
import { menuAnimationReducer } from './menuAnimationReducer'
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '@/shared/ui/constants'

interface UseMobilePanelConfig {
  side: 'left' | 'right'
  panelId: string
  historyStateKey: string
  onOtherPanelOpen?: () => void
  focusSelector?: string
}

export function useMobilePanel({
  side,
  panelId,
  historyStateKey,
  onOtherPanelOpen,
  focusSelector
}: UseMobilePanelConfig) {
  const [panelState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Track if we pushed a history state for this panel
  const historyStatePushed = useRef(false)
  const previousHistoryState = useRef<any>(null)

  // Use refs to avoid circular dependencies
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)
  const popstateHandlerRef = useRef<((e: PopStateEvent) => void) | null>(null)

  // Core close function
  const handleClose = useCallback((triggeredByPopstate = false) => {
    dispatch({ type: 'HIDE_CONTROLS' })
    
    // Clean up event listeners and restore scroll
    if (keydownHandlerRef.current) {
      document.removeEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.removeEventListener('popstate', popstateHandlerRef.current)
    }
    
    // Use enhanced body scroll unlock
    unlockBodyScroll()
    
    // Handle history cleanup
    if (historyStatePushed.current) {
      historyStatePushed.current = false
      
      if (!triggeredByPopstate) {
        // User closed manually (overlay, toggle, escape, etc.)
        // Replace current state to clean up history
        window.history.replaceState(
          previousHistoryState.current,
          '',
          window.location.href
        )
      }
    }
    
    setTimeout(() => {
      dispatch({ type: 'CLOSE_MENU' })
      setTimeout(() => {
        setIsPanelOpen(false)
        dispatch({ type: 'RESET' })
      }, CONTROLS_ANIMATION_DURATION)
    }, CONTROLS_ANIMATION_DURATION)
  }, [])

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isPanelOpen) {
      handleClose(false)
    }
  }, [isPanelOpen, handleClose])

  // Back button handler
  const handlePopState = useCallback((e: PopStateEvent) => {
    const state = e.state as Record<string, boolean> | null
    
    console.log('[useMobilePanel] handlePopState triggered', {
      historyStateKey,
      currentState: state,
      hasPanelFlag: state?.[historyStateKey],
      isPanelCurrentlyOpen: isPanelOpen,
      pathname: window.location.pathname
    })
    
    // CRITICAL FIX: Only reopen if the state explicitly has our flag AND we're not already open
    // This prevents spurious reopenings on back navigation
    if (state && state[historyStateKey] === true && !isPanelOpen) {
      console.log('[useMobilePanel] Reopening panel from history state')
      // Moving forward to when panel was open
      setIsPanelOpen(true)
      dispatch({ type: 'OPEN_MENU' })
      
      // Mark that we're restoring from history, not creating new state
      historyStatePushed.current = true
      
      // UPDATED: Use enhanced body scroll lock
      lockBodyScroll()
      
      setTimeout(() => {
        dispatch({ type: 'SHOW_CONTROLS' })
      }, MENU_ANIMATION_DURATION)
    } else if (isPanelOpen) {
      console.log('[useMobilePanel] Closing panel due to back navigation')
      // Panel was open, back button pressed -> close it
      handleClose(true)
    } else {
      console.log('[useMobilePanel] No action taken - panel should stay closed')
    }
  }, [isPanelOpen, historyStateKey, handleClose])

  // Setup handlers
  useEffect(() => {
    keydownHandlerRef.current = handleKeyDown
    popstateHandlerRef.current = handlePopState
  }, [handleKeyDown, handlePopState])

  const handleOpen = useCallback(() => {
    // Notify other panel to close if callback provided
    onOtherPanelOpen?.()
    
    setIsPanelOpen(true)
    dispatch({ type: 'OPEN_MENU' })
    
    // Push a history state for this panel
    if (!historyStatePushed.current) {
      previousHistoryState.current = window.history.state
      
      // Preserve existing Next.js state and add our panel state
      const newState = {
        ...(window.history.state || {}),
        [historyStateKey]: true
      }
      
      window.history.pushState(
        newState,
        '',
        window.location.href
      )
      historyStatePushed.current = true
    }
    
    // Add event listeners when panel opens
    if (keydownHandlerRef.current) {
      document.addEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.addEventListener('popstate', popstateHandlerRef.current)
    }
    
    // Use enhanced body scroll lock
    lockBodyScroll()
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' })
      
      // Focus appropriate element after opening
      if (focusSelector) {
        const focusTarget = panelRef.current?.querySelector(focusSelector) as HTMLElement
        focusTarget?.focus()
      } else {
        // Default: focus first interactive element
        const firstInteractive = panelRef.current?.querySelector(
          'a, button:not([aria-hidden="true"])'
        ) as HTMLElement
        firstInteractive?.focus()
      }
    }, MENU_ANIMATION_DURATION)
  }, [historyStateKey, onOtherPanelOpen, focusSelector])

  // Auto-close on navigation change
  useEffect(() => {
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname
      if (isPanelOpen) {
        // Close immediately without animation to avoid visual glitch during navigation
        // Clean up history state properly
        if (historyStatePushed.current) {
          historyStatePushed.current = false
          
          // Replace the current state to remove the panel flag
          // This prevents the back button from trying to reopen the panel
          const cleanState = { ...(window.history.state || {}) }
          delete cleanState[historyStateKey]
          
          window.history.replaceState(
            cleanState,
            '',
            window.location.href
          )
        }
        
        // Clean up event listeners
        if (keydownHandlerRef.current) {
          document.removeEventListener('keydown', keydownHandlerRef.current)
        }
        if (popstateHandlerRef.current) {
          window.removeEventListener('popstate', popstateHandlerRef.current)
        }
        
        // Unlock scroll
        unlockBodyScroll()
        
        // Update state
        setIsPanelOpen(false)
        dispatch({ type: 'RESET' })
      }
    }
  }, [pathname, isPanelOpen, historyStateKey])

  const togglePanel = useCallback(() => {
    if (!isPanelOpen) {
      handleOpen()
    } else {
      handleClose(false)
    }
  }, [isPanelOpen, handleOpen, handleClose])

  const handleContentComplete = useCallback(() => {
    // Close panel after content action is completed (e.g., navigation)
    setTimeout(() => {
      handleClose(false)
    }, 300)
  }, [handleClose])

  // Click handler to allow interactions within panel content
  const handlePanelClick = useCallback((e: React.MouseEvent) => {
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
    
    // Don't close if clicking interactive elements
    if (isInteractiveElement) {
      return
    }
    
    // Only close on clicking non-interactive areas
    handleClose(false)
  }, [handleClose])

  // Calculate transform classes based on side
  const getTransformClasses = () => {
    const isOpen = panelState === 'FULLY_OPENED'
    
    if (side === 'left') {
      return isOpen ? 'translate-x-0' : '-translate-x-full'
    } else {
      return isOpen ? 'translate-x-0' : 'translate-x-full'
    }
  }

  return {
    panelState,
    isPanelOpen,
    panelRef,
    toggleRef,
    togglePanel,
    handleClose,
    handleContentComplete,
    handlePanelClick,
    transformClasses: getTransformClasses()
  }
}