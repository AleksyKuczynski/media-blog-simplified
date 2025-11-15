// src/main/hooks/useScrollRestoration.ts
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll Restoration Hook
 * Use beforeunload and scroll events to continuously update position,
 * not just on pathname change which happens too late.
 */

const STORAGE_KEY = 'scroll_positions';
const SCROLL_RESTORATION_DELAY = 100;
const DEBUG = process.env.NODE_ENV === 'development';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollPositions {
  [pathname: string]: ScrollPosition;
}

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[ScrollRestoration]', ...args);
  }
}

function waitForContent(callback: () => void, maxWait = 1000) {
  let lastHeight = document.documentElement.scrollHeight;
  let stableCount = 0;
  const startTime = Date.now();
  
  const check = () => {
    const currentHeight = document.documentElement.scrollHeight;
    
    if (currentHeight === lastHeight) {
      stableCount++;
      if (stableCount >= 3) { // Height stable for 3 checks
        callback();
        return;
      }
    } else {
      stableCount = 0;
      lastHeight = currentHeight;
    }
    
    if (Date.now() - startTime < maxWait) {
      requestAnimationFrame(check);
    } else {
      callback(); // Force after maxWait
    }
  };
  
  requestAnimationFrame(check);
}

function getStoredPositions(): ScrollPositions {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('[ScrollRestoration] Failed to parse stored positions:', error);
    return {};
  }
}

function savePositions(positions: ScrollPositions): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Clean old entries (older than 1 hour)
    const now = Date.now();
    const cleaned = Object.fromEntries(
      Object.entries(positions).filter(
        ([, pos]) => now - pos.timestamp < 3600000
      )
    );
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.warn('[ScrollRestoration] Failed to save positions:', error);
  }
}

function getCurrentPosition(): ScrollPosition {
  // SSR-safe: Check if window exists
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, timestamp: Date.now() };
  }
  
  return {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0,
    timestamp: Date.now(),
  };
}

function restorePosition(position: ScrollPosition, pathname: string): void {
  log('Attempting to restore position for:', pathname, position);
  
  requestAnimationFrame(() => {
    const maxScrollY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const maxScrollX = Math.max(
      0,
      document.documentElement.scrollWidth - window.innerWidth
    );
    
    const safeY = Math.min(Math.max(0, position.y), maxScrollY);
    const safeX = Math.min(Math.max(0, position.x), maxScrollX);
    
    log('Page dimensions:', {
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      maxScrollY,
      requestedY: position.y,
      safeY
    });
    
    window.scrollTo(safeX, safeY);
    
    setTimeout(() => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(currentY - safeY) > 10) {
        log('Position drift detected, re-applying:', { expected: safeY, actual: currentY });
        window.scrollTo(safeX, safeY);
      } else {
        log('✓ Position restored successfully:', safeY);
      }
    }, 50);
  });
}

export function useScrollRestoration() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const isRestoringRef = useRef<boolean>(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef<boolean>(true);
  
  // This ref stores the CURRENT page's scroll position continuously
  // SSR-safe: Initialize with safe default, will be updated on client
  const currentScrollPositionRef = useRef<ScrollPosition>({ x: 0, y: 0, timestamp: Date.now() });

  // Disable Next.js automatic scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      const originalScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      log('✓ Disabled browser scroll restoration');
      
      // Initialize ref with actual scroll position on client
      currentScrollPositionRef.current = getCurrentPosition();
      
      return () => {
        window.history.scrollRestoration = originalScrollRestoration;
      };
    }
  }, []);

  // CRITICAL: Continuously update current scroll position
  useEffect(() => {
    const updateScrollPosition = () => {
      if (isRestoringRef.current) return;
      currentScrollPositionRef.current = getCurrentPosition();
    };

    // Update on every scroll (will be used when navigating away)
    const handleScroll = () => {
      updateScrollPosition();
      
      // Also debounce save to sessionStorage for persistence
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      scrollTimerRef.current = setTimeout(() => {
        const positions = getStoredPositions();
        positions[pathname] = currentScrollPositionRef.current;
        savePositions(positions);
        log('Scroll: Updated position for:', pathname, currentScrollPositionRef.current.y);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [pathname]);

  // Handle pathname changes (navigation)
  useEffect(() => {
    // On initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousPathname.current = pathname;
      log('Initial mount, pathname:', pathname);
      
      // Try to restore position if coming from browser back/forward
      const positions = getStoredPositions();
      const savedPosition = positions[pathname];
      if (savedPosition && savedPosition.y > 0) {
        log('Found saved position on initial mount, restoring...');
        setTimeout(() => {
           waitForContent(() => {
            restorePosition(savedPosition, pathname);
           });
        }, SCROLL_RESTORATION_DELAY);
      }
      
      return;
    }

    // Navigation detected
    if (previousPathname.current && previousPathname.current !== pathname) {
      log('Navigation detected:', previousPathname.current, '→', pathname);
      
      const positions = getStoredPositions();
      
      // CRITICAL FIX: Save the CURRENT scroll position (from ref) for the PREVIOUS page
      // This captures where we were BEFORE navigation started
      const currentPos = currentScrollPositionRef.current;
      positions[previousPathname.current] = currentPos;
      savePositions(positions);
      log('Saved scroll position for:', previousPathname.current, currentPos);

      // Restore scroll position for current page if exists
      const savedPosition = positions[pathname];
      if (savedPosition && !isRestoringRef.current) {
        if (savedPosition.y > 0) {
          log('Found saved position, will restore:', savedPosition);
          isRestoringRef.current = true;
          
          setTimeout(() => {
            restorePosition(savedPosition, pathname);
            setTimeout(() => {
              isRestoringRef.current = false;
              // Reset current position ref for new page
              currentScrollPositionRef.current = getCurrentPosition();
            }, 100);
          }, SCROLL_RESTORATION_DELAY);
        } else {
          log('Saved position is 0, scrolling to top');
          window.scrollTo(0, 0);
        }
      } else {
        log('No saved position found for:', pathname);
        window.scrollTo(0, 0);
      }
    }

    previousPathname.current = pathname;
  }, [pathname]);

  // Save position before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const positions = getStoredPositions();
      // Use the ref which has the most recent scroll position
      const currentPos = currentScrollPositionRef.current;
      positions[pathname] = currentPos;
      savePositions(positions);
      log('beforeunload: Saved position for:', pathname, currentPos);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // CRITICAL: On component unmount (navigation), save current position
      const positions = getStoredPositions();
      const currentPos = currentScrollPositionRef.current;
      positions[pathname] = currentPos;
      savePositions(positions);
      log('unmount: Saved position for:', pathname, currentPos);
    };
  }, [pathname]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      log('popstate event detected');
      
      // Save current position before browser navigates
      const positions = getStoredPositions();
      const currentPos = currentScrollPositionRef.current;
      if (previousPathname.current) {
        positions[previousPathname.current] = currentPos;
        savePositions(positions);
        log('popstate: Saved position for previous page:', previousPathname.current, currentPos);
      }
      
      // Give Next.js time to process the navigation
      setTimeout(() => {
        const updatedPositions = getStoredPositions();
        const savedPosition = updatedPositions[pathname];
        
        if (savedPosition && savedPosition.y > 0) {
          log('popstate: Restoring position for:', pathname, savedPosition);
          isRestoringRef.current = true;
          restorePosition(savedPosition, pathname);
          setTimeout(() => {
            isRestoringRef.current = false;
            currentScrollPositionRef.current = getCurrentPosition();
          }, 200);
        } else {
          log('popstate: No saved position for:', pathname);
        }
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname]);
}

/**
 * Scroll Restoration Component
 */
export default function ScrollRestoration() {
  useScrollRestoration();
  return null;
}