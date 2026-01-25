// features/navigation/MobileNav/styles.ts
/**
 * Mobile Navigation - Centralized Style Constants
 * 
 * Organized by component:
 * - MOBILE_NAV_STYLES: Top navigation bar layout
 * - HAMBURGER_BUTTON_STYLES: Menu toggle button
 * - SEARCH_BUTTON_STYLES: Search toggle button  
 * - OFFCANVAS_PANEL_STYLES: Slide panel container and animations
 * - PANEL_OVERLAY_STYLES: Backdrop overlay
 * - PANEL_CONTENT_STYLES: Panel inner content areas
 */

export const MOBILE_NAV_STYLES = {
  nav: {
    container: 'xl:hidden bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300 relative z-50',
    topBar: 'flex items-center justify-between h-16 px-4',
  },
  
  sections: {
    left: 'flex-1 flex justify-start',
    center: 'flex-1 flex justify-center',
    right: 'flex items-center gap-2',
  },
  
  spacer: 'w-12',
} as const;

export const HAMBURGER_BUTTON_STYLES = {
  button: 'p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200 active:scale-95 touch-manipulation',
  iconContainer: 'w-6 h-6 flex items-center justify-center',
  icon: 'w-5 h-5',
} as const;

export const SEARCH_BUTTON_STYLES = {
  button: 'p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200 active:scale-95 touch-manipulation',
  iconContainer: 'w-6 h-6 flex items-center justify-center',
  icon: 'w-5 h-5',
} as const;

export const OFFCANVAS_PANEL_STYLES = {
  panel: {
    base: 'fixed top-0 h-full w-full sm:w-4/5 max-w-lg bg-sf shadow-2xl z-[60] transition-transform duration-300 ease-in-out pointer-events-auto',
    left: 'left-0',
    right: 'right-0',
  },
  
  header: {
    container: 'flex items-center justify-between px-6 py-4 text-on-sf-var',
    title: 'text-md font-medium uppercase',
    closeButton: 'p-2 rounded-full hover:bg-sf-hst transition-colors active:scale-95',
    closeIcon: 'w-6 h-6',
  },
} as const;

export const PANEL_OVERLAY_STYLES = {
  overlay: 'fixed inset-0 bg-black/20 z-[45] pointer-events-auto',
} as const;

export const PANEL_CONTENT_STYLES = {
  menu: {
    container: 'flex flex-col h-full',
    scrollArea: 'flex-1 overflow-y-auto py-6',
    nav: 'space-y-1 px-4',
    list: 'space-y-1',
  },
  
  search: {
    container: 'mx-2 h-full bg-sf-cont rounded-t-2xl overflow-hidden',
  },
} as const;