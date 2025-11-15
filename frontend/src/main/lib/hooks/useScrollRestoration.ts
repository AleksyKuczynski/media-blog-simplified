// src/main/lib/hooks/useScrollRestoration.ts
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'scroll_positions';
const SCROLL_DEBOUNCE = 150;
const MAX_STORED_POSITIONS = 10;
const CONTENT_WAIT_MAX = 500;

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollPositions {
  [pathname: string]: ScrollPosition;
}

function getStoredPositions(): ScrollPositions {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('[ScrollRestoration] Failed to parse:', error);
    return {};
  }
}

function savePositions(positions: ScrollPositions): void {
  if (typeof window === 'undefined') return;
  
  try {
    const entries = Object.entries(positions);
    if (entries.length > MAX_STORED_POSITIONS) {
      const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      positions = Object.fromEntries(sorted.slice(0, MAX_STORED_POSITIONS));
    }
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch (error) {
    console.error('[ScrollRestoration] Failed to save:', error);
  }
}

function getCurrentPosition(): ScrollPosition {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, timestamp: Date.now() };
  }
  
  return {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0,
    timestamp: Date.now(),
  };
}

function waitForContentStability(callback: () => void, maxWait = CONTENT_WAIT_MAX) {
  let lastHeight = document.documentElement.scrollHeight;
  let stableCount = 0;
  const startTime = Date.now();
  
  const check = () => {
    const currentHeight = document.documentElement.scrollHeight;
    
    if (currentHeight === lastHeight) {
      stableCount++;
      if (stableCount >= 3) {
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
      callback();
    }
  };
  
  requestAnimationFrame(check);
}

function restorePosition(position: ScrollPosition, pathname: string): void {
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const maxScrollX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
  
  const safeY = Math.min(Math.max(0, position.y), maxScrollY);
  const safeX = Math.min(Math.max(0, position.x), maxScrollX);
  
  window.scrollTo({
    left: safeX,
    top: safeY,
    behavior: 'instant' as ScrollBehavior
  });
  
  setTimeout(() => {
    const actualY = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(actualY - safeY) > 10) {
      window.scrollTo({ left: safeX, top: safeY, behavior: 'instant' as ScrollBehavior });
    }
  }, 50);
}

export function useScrollRestoration() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const previousPathname = useRef<string | null>(null);
  const currentScrollPositionRef = useRef<ScrollPosition>({ x: 0, y: 0, timestamp: Date.now() });
  const scrollBeforeJumpRef = useRef<ScrollPosition | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);
  
  // Track whether navigation was triggered by popstate
  const isPopstateNavigationRef = useRef(false);

  // Update pathname ref whenever pathname changes
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      currentScrollPositionRef.current = getCurrentPosition();
    }
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringRef.current) {
        return;
      }
      
      const newPosition = getCurrentPosition();
      const oldPosition = currentScrollPositionRef.current;
      
      // Detect jump-to-zero (navigation starting)
      if (oldPosition.y > 50 && newPosition.y < 50) {
        scrollBeforeJumpRef.current = oldPosition;
      }
      
      currentScrollPositionRef.current = newPosition;
      
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
      }, SCROLL_DEBOUNCE);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [pathname]);

  // Handle navigation (programmatic only)
  useEffect(() => {
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }

    if (previousPathname.current !== pathname) {
      // Skip saving if this was a popstate navigation
      if (isPopstateNavigationRef.current) {
        previousPathname.current = pathname;
        isPopstateNavigationRef.current = false;
        scrollBeforeJumpRef.current = null;
        
        setTimeout(() => {
          currentScrollPositionRef.current = getCurrentPosition();
        }, 100);
        return;
      }
      
      const positions = getStoredPositions();
      
      // Use preserved position if jump was detected
      let positionToSave: ScrollPosition;
      if (scrollBeforeJumpRef.current && scrollBeforeJumpRef.current.y > 50) {
        positionToSave = scrollBeforeJumpRef.current;
      } else {
        positionToSave = currentScrollPositionRef.current;
      }
      
      positions[previousPathname.current] = positionToSave;
      savePositions(positions);
      
      previousPathname.current = pathname;
      scrollBeforeJumpRef.current = null;
      
      setTimeout(() => {
        currentScrollPositionRef.current = getCurrentPosition();
      }, 100);
    }
  }, [pathname]);

  // Handle popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      
      // Set flag before pathname changes
      isPopstateNavigationRef.current = true;
      
      setTimeout(() => {
        const currentPath = pathnameRef.current;
        const positions = getStoredPositions();
        const savedPosition = positions[currentPath];
        
        // Allow restoration of position 0 (top of page)
        if (savedPosition !== undefined && savedPosition !== null) {
          isRestoringRef.current = true;
          
          waitForContentStability(() => {
            restorePosition(savedPosition, currentPath);
            
            setTimeout(() => {
              isRestoringRef.current = false;
              currentScrollPositionRef.current = getCurrentPosition();
            }, 100);
          });
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

}

export default function ScrollRestoration() {
  useScrollRestoration();
  return null;
}