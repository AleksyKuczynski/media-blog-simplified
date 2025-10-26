// src/main/lib/utils/bodyScrollLock.ts
// Enhanced body scroll lock with iOS Safari support
// Prevents background scrolling when mobile panels are open

let scrollPosition = 0;

/**
 * Lock body scroll - prevents scrolling of main content
 * Works on iOS Safari and all modern browsers
 */
export function lockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Save current scroll position
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Apply styles to body
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  
  // Also prevent scrolling on html element (iOS Safari)
  document.documentElement.style.overflow = 'hidden';
}

/**
 * Unlock body scroll - restores scrolling
 * Restores the saved scroll position
 */
export function unlockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Remove styles from body
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  
  // Remove styles from html element
  document.documentElement.style.overflow = '';

  // Restore scroll position
  window.scrollTo(0, scrollPosition);
}