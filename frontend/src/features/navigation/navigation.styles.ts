// features/navigation/styles.ts
/**
 * Navigation Components - Centralized Style Constants
 * 
 * Organized by component:
 * - HEADER_STYLES: Main header wrapper, site identity
 * - DESKTOP_NAV_STYLES: Desktop navigation layout
 * - MOBILE_NAV_STYLES: Mobile navigation, hamburger menu
 * - SKIP_LINKS_STYLES: Accessibility skip links
 * - NAV_LINK_STYLES: Common navigation link states
 */

import { cn } from "@/lib/utils";

export const HEADER_STYLES = {
  wrapper: 'fixed top-0 left-0 right-0 z-50',
} as const;

export const DESKTOP_NAV_STYLES = {
  container: 'hidden xl:block py-2 backdrop-blur-lg transition-all duration-300',
  grid: 'grid grid-cols-3 items-center mx-auto px-4',
  
  leftSection: 'flex items-center justify-start',
  centerSection: 'flex items-center justify-center',
  rightSection: 'flex items-center justify-end space-x-4',
  
  navList: 'flex items-center justify-start space-x-2 uppercase bg-sf rounded-full py-2',
} as const;

export const SKIP_LINKS_STYLES = {
  wrapper: 'sr-only focus-within:not-sr-only',
  region: 'fixed top-0 left-0 right-0 z-[100] p-4',
  list: 'flex flex-wrap gap-2',
  link: `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
    bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
    transition-all duration-200 z-[100] shadow-lg
    hover:bg-primary-variant active:scale-95
    text-sm tracking-wide`,
} as const;

export const NAV_LINK_STYLES = {
  base: 'px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200',
  active: 'pointer-events-none bg-pr-cont text-on-pr hover:bg-pr-cont hover:text-on-pr',
  listItem: 'list-none',
  mobile: {
    link: cn(
      'flex flex-col items-center gap-3 w-full',
      'text-on-sf font-medium uppercase text-sm md:text-base',
      'py-4 mt-2 rounded-2xl',
      'hover:bg-sf-hi hover:shadow-sm transition-all duration-200',
    ),
    active: 'bg-sf text-on-sf-var hover:bg-sf hover:shadow-none pointer-events-none',
    listItem: 'list-none',
    icon: 'w-12 md:w-16 aspect-square relative',
  },
} as const;

export const QUICK_NAV_STYLES = {
  nav: 'flex flex-wrap xs:gap-2 md:gap-8 lg:gap-12 xl:gap-16 justify-center',
  link: cn(
    'inline-flex flex-col items-center gap-2',
    'text-pr-cont font-medium uppercase max-md:text-sm xl:text-lg', 
    'px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl', 
    'hover:bg-sf-hi hover:shadow-lg focus:shadow-sm transition-all duration-200', 
  ),
  icon: 'w-12 md:w-20 xl:w-24 aspect-square relative',
} as const;

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
    topBar: cn(
      'grid grid-cols-3', 
      'px-3 sm:px-6',
      'py-2'
    ),
  },
  
  sections: {
    left: 'flex justify-start items-center',
    center: 'flex justify-center items-center',
    right: 'flex justify-end items-center',
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
    container: 'flex flex-col mx-2 h-full bg-sf-cont rounded-t-2xl overflow-hidden',
    scrollArea: 'flex-1 overflow-y-auto py-12 md:py-16',
    nav: 'px-2',
    wrapper: 'flex flex-col items-center gap-8',
    list: 'w-full',
  },
  
  search: {
    container: 'mx-2 h-full bg-sf-cont rounded-t-2xl overflow-hidden',
  },
} as const;
