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

function log(...args: any[]) {
  const timestamp = new Date().toISOString().split('T')[1];
  console.log('[ScrollRestoration]', timestamp, ...args);
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
    log('💾 Saved:', positions);
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
  
  log('🔄 Restoring:', pathname, '→', safeY);
  
  window.scrollTo({
    left: safeX,
    top: safeY,
    behavior: 'instant' as ScrollBehavior
  });
  
  setTimeout(() => {
    const actualY = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(actualY - safeY) > 10) {
      log('⚠️ Drift, re-applying');
      window.scrollTo({ left: safeX, top: safeY, behavior: 'instant' as ScrollBehavior });
    } else {
      log('✅ Restored');
    }
  }, 50);
}

export function useScrollRestoration() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);  // NEW: Ref for popstate handler
  const previousPathname = useRef<string | null>(null);
  const currentScrollPositionRef = useRef<ScrollPosition>({ x: 0, y: 0, timestamp: Date.now() });
  const scrollBeforeJumpRef = useRef<ScrollPosition | null>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // Update pathname ref whenever pathname changes
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      currentScrollPositionRef.current = getCurrentPosition();
      log('✓ Setup complete');
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
        log('🔍 Jump detected! Preserving:', oldPosition.y);
        scrollBeforeJumpRef.current = oldPosition;
      }
      
      currentScrollPositionRef.current = newPosition;
      
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        log('📜 Settled:', currentScrollPositionRef.current.y);
      }, SCROLL_DEBOUNCE);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [pathname]);

  // Handle navigation
  useEffect(() => {
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      log('🆕 Initial:', pathname);
      return;
    }

    if (previousPathname.current !== pathname) {
      log('🚀 NAVIGATION:', previousPathname.current, '→', pathname);
      
      const positions = getStoredPositions();
      
      // Use preserved position if jump was detected
      let positionToSave: ScrollPosition;
      if (scrollBeforeJumpRef.current && scrollBeforeJumpRef.current.y > 50) {
        positionToSave = scrollBeforeJumpRef.current;
        log('💡 Using preserved:', positionToSave.y);
      } else {
        positionToSave = currentScrollPositionRef.current;
        log('📍 Using current:', positionToSave.y);
      }
      
      log('💾 Saving:', previousPathname.current, '→', positionToSave.y);
      
      positions[previousPathname.current] = positionToSave;
      savePositions(positions);
      
      previousPathname.current = pathname;
      scrollBeforeJumpRef.current = null;
      
      setTimeout(() => {
        currentScrollPositionRef.current = getCurrentPosition();
        log('🔓 Navigation complete');
      }, 100);
    }
  }, [pathname]);

  // FIXED: Handle popstate with empty deps array
  useEffect(() => {
    const handlePopState = () => {
      log('⬅️ POPSTATE FIRED!');
      
      setTimeout(() => {
        const currentPath = pathnameRef.current;  // Use ref instead of pathname
        const positions = getStoredPositions();
        const savedPosition = positions[currentPath];
        
        log('🔍 Current path:', currentPath);
        log('📦 Saved position:', savedPosition);
        
        if (savedPosition && savedPosition.y > 0) {
          log('✅ Restoring:', savedPosition.y);
          
          isRestoringRef.current = true;
          
          waitForContentStability(() => {
            restorePosition(savedPosition, currentPath);
            
            setTimeout(() => {
              isRestoringRef.current = false;
              currentScrollPositionRef.current = getCurrentPosition();
            }, 100);
          });
        } else {
          log('❌ No saved position for:', currentPath);
        }
      }, 100);  // Increased delay to ensure pathname has updated
    };

    window.addEventListener('popstate', handlePopState);
    log('✅ Popstate listener attached (permanent)');
    
    return () => {
      log('🧹 Removing popstate listener');
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);  // CRITICAL: Empty deps array - listener stays attached permanently

}

export default function ScrollRestoration() {
  useScrollRestoration();
  return null;
}