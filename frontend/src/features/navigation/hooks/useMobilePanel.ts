// src/main/components/Navigation/logic/useMobilePanel.ts
// Unified hook for mobile offcanvas panels (menu and search)

import { useState, useRef, useReducer, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { lockBodyScroll, unlockBodyScroll } from '@/lib/utils/bodyScrollLock'
import { menuAnimationReducer } from './menuAnimationReducer'
import { CONTROLS_ANIMATION_DURATION, MENU_ANIMATION_DURATION } from '@/shared/ui/constants'

interface UseMobilePanelConfig {
  side: 'left' | 'right'
  focusSelector?: string
}

export function useMobilePanel({
  side,
  focusSelector
}: UseMobilePanelConfig) {
  const [panelState, dispatch] = useReducer(menuAnimationReducer, 'CLOSED')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const lastPathRef = useRef(pathname)

  // Use refs to avoid circular dependencies
  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null)
  const popstateHandlerRef = useRef<((e: PopStateEvent) => void) | null>(null)

  // Core close function
const handleClose = useCallback(() => {
  dispatch({ type: 'HIDE_CONTROLS' })
  
  // Clean up event listeners
  if (keydownHandlerRef.current) {
    document.removeEventListener('keydown', keydownHandlerRef.current)
  }
  if (popstateHandlerRef.current) {
    window.removeEventListener('popstate', popstateHandlerRef.current)
  }
  
  setTimeout(() => {
    dispatch({ type: 'CLOSE_MENU' })
    setTimeout(() => {
      setIsPanelOpen(false)
      dispatch({ type: 'RESET' })
      
      // Unlock scroll AFTER animation completes
      unlockBodyScroll()
    }, CONTROLS_ANIMATION_DURATION)
  }, CONTROLS_ANIMATION_DURATION)
}, [])

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isPanelOpen) {
      handleClose()
    }
  }, [isPanelOpen, handleClose])

  // Back button handler - just close panel if open
  const handlePopState = useCallback((e: PopStateEvent) => {
    if (isPanelOpen) {
      e.preventDefault()
      handleClose()
    }
  }, [isPanelOpen, handleClose])

  // Setup handlers
  useEffect(() => {
    keydownHandlerRef.current = handleKeyDown
    popstateHandlerRef.current = handlePopState
  }, [handleKeyDown, handlePopState])

  const handleOpen = useCallback(() => {
    
    setIsPanelOpen(true)
    dispatch({ type: 'OPEN_MENU' })
    
    // Add event listeners when panel opens
    if (keydownHandlerRef.current) {
      document.addEventListener('keydown', keydownHandlerRef.current)
    }
    if (popstateHandlerRef.current) {
      window.addEventListener('popstate', popstateHandlerRef.current)
    }
    
    lockBodyScroll()
    
    setTimeout(() => {
      dispatch({ type: 'SHOW_CONTROLS' })
      
      if (focusSelector) {
        const focusTarget = panelRef.current?.querySelector(focusSelector) as HTMLElement
        focusTarget?.focus()
      } else {
        const firstInteractive = panelRef.current?.querySelector(
          'a, button:not([aria-hidden="true"])'
        ) as HTMLElement
        firstInteractive?.focus()
      }
    }, MENU_ANIMATION_DURATION)
  }, [focusSelector])

  // Auto-close on navigation change
  useEffect(() => {
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname
      if (isPanelOpen) {
        // Navigation happened - clean up
        if (keydownHandlerRef.current) {
          document.removeEventListener('keydown', keydownHandlerRef.current)
        }
        if (popstateHandlerRef.current) {
          window.removeEventListener('popstate', popstateHandlerRef.current)
        }
        
        unlockBodyScroll()
        setIsPanelOpen(false)
        dispatch({ type: 'RESET' })
      }
    }
  }, [pathname, isPanelOpen])

  const togglePanel = useCallback(() => {
    if (!isPanelOpen) {
      handleOpen()
    } else {
      handleClose()
    }
  }, [isPanelOpen, handleOpen, handleClose])

  const handleContentComplete = useCallback(() => {
    setTimeout(() => {
      handleClose()
    }, 300)
  }, [handleClose])

  const handlePanelClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
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
    
    if (isInteractiveElement) {
      return
    }
    
    handleClose()
  }, [handleClose])

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