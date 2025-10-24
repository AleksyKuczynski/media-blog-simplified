// src/main/hooks/useScrollRestoration.ts
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll Restoration Hook
 * 
 * Fixes the issue where scroll position is not preserved when navigating back
 * from a shorter page to a longer page.
 * 
 * Strategy:
 * 1. Store scroll positions in sessionStorage keyed by pathname
 * 2. On route change, save current scroll position
 * 3. On mount/navigation, restore saved scroll position
 * 4. Handle edge cases (page shorter than saved position)
 * 
 * Usage: Add <ScrollRestoration /> to root layout
 */

const STORAGE_KEY = 'scroll_positions';
const SCROLL_RESTORATION_DELAY = 50; // ms - allow DOM to settle

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollPositions {
  [pathname: string]: ScrollPosition;
}

/**
 * Get stored scroll positions from sessionStorage
 */
function getStoredPositions(): ScrollPositions {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse stored scroll positions:', error);
    return {};
  }
}

/**
 * Save scroll positions to sessionStorage
 */
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
    console.warn('Failed to save scroll positions:', error);
  }
}

/**
 * Get current scroll position
 */
function getCurrentPosition(): ScrollPosition {
  return {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now(),
  };
}

/**
 * Restore scroll position with safety checks
 */
function restorePosition(position: ScrollPosition): void {
  // Wait for DOM to be fully rendered
  setTimeout(() => {
    const maxScrollY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const maxScrollX = Math.max(
      0,
      document.documentElement.scrollWidth - window.innerWidth
    );
    
    // Clamp position to valid range
    const safeY = Math.min(position.y, maxScrollY);
    const safeX = Math.min(position.x, maxScrollX);
    
    window.scrollTo({
      top: safeY,
      left: safeX,
      behavior: 'instant', // Use instant to avoid animation on restore
    });
    
    console.debug(`Restored scroll position: (${safeX}, ${safeY})`);
  }, SCROLL_RESTORATION_DELAY);
}

/**
 * Main scroll restoration hook
 */
export function useScrollRestoration() {
  const pathname = usePathname();
  const previousPathname = useRef<string>(pathname);
  const isRestoringRef = useRef<boolean>(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip on initial mount
    if (previousPathname.current === pathname) {
      previousPathname.current = pathname;
      return;
    }

    const positions = getStoredPositions();
    
    // Save scroll position of previous page
    if (previousPathname.current) {
      positions[previousPathname.current] = getCurrentPosition();
      savePositions(positions);
      console.debug(`Saved scroll for ${previousPathname.current}:`, positions[previousPathname.current]);
    }

    // Restore scroll position for current page if exists
    const savedPosition = positions[pathname];
    if (savedPosition && !isRestoringRef.current) {
      isRestoringRef.current = true;
      restorePosition(savedPosition);
      
      // Reset restoration flag after delay
      setTimeout(() => {
        isRestoringRef.current = false;
      }, SCROLL_RESTORATION_DELAY + 100);
    }

    previousPathname.current = pathname;
  }, [pathname]);

  // Save scroll position on page leave (back/forward/refresh)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const positions = getStoredPositions();
      positions[pathname] = getCurrentPosition();
      savePositions(positions);
    };

    // Save periodically while user scrolls
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      
      // Debounce scroll saves
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      
      scrollTimerRef.current = setTimeout(() => {
        const positions = getStoredPositions();
        positions[pathname] = getCurrentPosition();
        savePositions(positions);
      }, 500); // Save every 500ms of scroll inactivity
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [pathname]);

  // Handle browser back/forward buttons via popstate
  useEffect(() => {
    const handlePopState = () => {
      // Mark that we're handling a browser navigation
      isRestoringRef.current = true;
      
      setTimeout(() => {
        const positions = getStoredPositions();
        const savedPosition = positions[pathname];
        
        if (savedPosition) {
          restorePosition(savedPosition);
        }
        
        setTimeout(() => {
          isRestoringRef.current = false;
        }, SCROLL_RESTORATION_DELAY + 100);
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname]);
}

/**
 * Scroll Restoration Component
 * Add this to your root layout to enable scroll restoration
 */
export default function ScrollRestoration() {
  useScrollRestoration();
  return null;
}