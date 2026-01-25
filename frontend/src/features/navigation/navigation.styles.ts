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
  container: 'hidden xl:block mx-auto mt-1 py-2 max-w-6xl rounded-2xl bg-sf-hst/80 backdrop-blur-lg border border-ol-var transition-all duration-300',
  grid: 'grid grid-cols-3 items-center mx-auto px-6',
  
  leftSection: 'flex items-center justify-start',
  centerSection: 'flex items-center justify-center',
  rightSection: 'flex items-center justify-end space-x-4',
  
  navList: 'flex items-center justify-start space-x-2 uppercase bg-sf rounded-full py-2',
} as const;

export const MOBILE_NAV_STYLES = {
  container: 'xl:hidden bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300 relative z-50',
  topBar: 'flex items-center justify-between h-16 px-4',
  
  leftSection: 'flex-1 flex justify-start',
  centerSection: 'flex-1 flex justify-center',
  rightSection: 'flex-1 flex justify-end items-center space-x-3',
  
  menu: {
    nav: 'py-4 px-4 space-y-1',
  },
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
      'flex flex-col items-center gap-3',
      'text-on-sf font-medium uppercase text-base',
      'px-6 py-6 rounded-2xl',
      'hover:bg-sf-hi hover:shadow-lg transition-all duration-200',
    ),
    active: 'bg-pr-cont text-on-pr hover:bg-pr-cont pointer-events-none',
    listItem: 'list-none',
    icon: 'w-24 aspect-square relative',
  },
} as const;

export const QUICK_NAV_STYLES = {
  nav: 'flex flex-wrap gap-2 md:gap-8 lg:gap-12 xl:gap-16 justify-center',
  link: cn(
    'inline-flex flex-col items-center gap-2',
    'text-pr-cont font-medium uppercase max-md:text-sm xl:text-lg', 
    'px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl', 
    'hover:bg-sf-hi hover:shadow-lg focus:shadow-sm transition-all duration-200', 
  ),
  icon: 'w-16 md:w-20 xl:w-24 aspect-square relative',
} as const;
