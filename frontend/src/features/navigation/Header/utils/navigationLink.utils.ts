// features/navigation/Header/utils/navigationLink.utils.ts

/**
 * Clean up mobile panel history states before navigation
 * 
 * Removes mobileMenuOpen and mobileSearchOpen flags from history state
 * to prevent back button from reopening panels after navigation.
 */
export function cleanupPanelHistoryStates(
  pathname: string,
  href: string
): void {
  // Only clean up if navigating to a different page
  if (pathname === href || pathname === `${href}/`) {
    return;
  }

  const currentState = window.history.state || {};
  
  // Remove mobile menu/search flags if they exist
  if (currentState.mobileMenuOpen || currentState.mobileSearchOpen) {
    const cleanState = { ...currentState };
    delete cleanState.mobileMenuOpen;
    delete cleanState.mobileSearchOpen;
    
    window.history.replaceState(
      cleanState,
      '',
      window.location.href
    );
  }
}