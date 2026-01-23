// features/navigation/Header/utils/navLinks.utils.ts

/**
 * Navigation image mapping
 */
export const NAV_IMAGE_MAP: Record<string, string> = {
  articles: '/articles.png',
  rubrics: '/rubrics.png',
  authors: '/authors.png',
};

/**
 * Get image source for navigation item
 */
export function getNavImageSrc(key: string): string {
  return NAV_IMAGE_MAP[key] || '/articles.png';
}

/**
 * Check if link is active based on pathname
 */
export function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname === `${href}/`;
}

/**
 * Clean up mobile menu history state before navigation
 * Prevents back button from reopening mobile menu
 */
export function cleanupMobileMenuHistory(
  pathname: string, 
  href: string
): void {
  // Only clean up if navigating to a different page
  if (pathname === href || pathname === `${href}/`) {
    return;
  }

  const currentState = window.history.state || {};
  
  // Remove mobile menu flag if it exists
  if (currentState.mobileMenuOpen) {
    const cleanState = { ...currentState };
    delete cleanState.mobileMenuOpen;
    
    window.history.replaceState(
      cleanState,
      '',
      window.location.href
    );
  }
}