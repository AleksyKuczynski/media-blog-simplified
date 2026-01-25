// src/lib/utils/bodyScrollLock.ts
/**
 * Enhanced body scroll lock without scroll jump
 * Prevents background scrolling when modals/panels are open
 * 
 * IMPORTANT: Does NOT cause scroll position to jump
 * Uses overflow: hidden + padding compensation for scrollbar
 */

let lockCount = 0;
let scrollPosition = 0;
let originalOverflow = '';
let originalPaddingRight = '';
let headerOriginalPadding = '';

/**
 * Lock body scroll - prevents scrolling without position jump
 * Safe to call multiple times (ref counted)
 */
export function lockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Increment lock count (support nested locks)
  lockCount++;
  
  // Only apply lock on first call
  if (lockCount > 1) {
    return;
  }

  // Save current state
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  originalOverflow = document.body.style.overflow;
  originalPaddingRight = document.body.style.paddingRight;

  // Calculate scrollbar width to prevent layout shift
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  // Apply lock - use overflow hidden (no position changes)
  document.body.style.overflow = 'hidden';
  
  // Compensate for scrollbar disappearing (prevent layout shift)
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Apply same padding to fixed header to prevent navbar shift
    const header = document.querySelector('header[role="banner"]');
    if (header instanceof HTMLElement) {
      headerOriginalPadding = header.style.paddingRight;
      header.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  // Prevent scrolling on touch devices
  document.documentElement.style.overflow = 'hidden';
}

/**
 * Unlock body scroll - restores scrolling
 * Safe to call multiple times (ref counted)
 */
export function unlockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Decrement lock count
  lockCount = Math.max(0, lockCount - 1);
  
  // Only unlock when all locks are released
  if (lockCount > 0) {
    return;
  }

  // Restore original styles
  document.body.style.overflow = originalOverflow;
  document.body.style.paddingRight = originalPaddingRight;
  document.documentElement.style.overflow = '';
  
  // Restore fixed header padding
  const header = document.querySelector('header[role="banner"]');
  if (header instanceof HTMLElement) {
    header.style.paddingRight = headerOriginalPadding;
  }

  // Note: Scroll position is NOT restored here
  // The page stays at the same visual position
}

/**
 * Check if scroll is currently locked
 */
export function isScrollLocked(): boolean {
  return lockCount > 0;
}