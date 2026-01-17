// features/navigation/Filter/styles.ts
/**
 * Filter Components - Centralized Style Constants
 * 
 * Unified styling for FilterGroup and SortingControl components.
 * 
 * Components:
 * - FILTER_STYLES: Main filter group container and layout
 * - FILTER_CONTROL_STYLES: Individual filter controls (category, sorting)
 * - FILTER_BUTTON_STYLES: Dropdown buttons and reset button
 */

import { cn } from "@/lib/utils";

export const FILTER_STYLES = {
  container: {
    base: cn(
      'flex flex-row justify-center border border-ol w-96 mx-auto rounded-full group transition-all duration-300',
      'mt-8 mb-16', 
      'md:mb-24',
      'xl:mb-32',
    ),
    inactive: 'bg-sf shadow-md',
    active: 'bg-sf-hst shadow-none',
    activeHover: 'bg-sf-hi shadow-none',
  },
  divider: {
    base: 'w-px bg-ol self-center h-[66%] transition-opacity duration-300',
    visible: 'opacity-100',
    hidden: 'opacity-0',
  },
} as const;

export const FILTER_CONTROL_STYLES = {
  wrapper: cn(
    'flex flex-col w-1/2',
  ),
  label: cn(
    'text-xs lowercase font-medium text-sec-dim',
    'md:text-sm',
    'xl:text-base',
  ),
  dropdown: {
    button: cn('flex flex-col items-start w-full', 
      'rounded-full hover:bg-sf-hi focus:bg-sf focus:shadow-md border border-transparent focus:border-ol transition-all duration-300',
      'px-4 py-2 text-sm',
      'md:px-6 md:py-3 md:text-base',
      'xl:px-8 xl:py-4 xl:text-lg',
    ),
    icon: 'h-5 w-5 ml-2 flex-shrink-0',
    text: 'truncate lowercase',
  },
} as const;

export const FILTER_BUTTON_STYLES = {
  dropdown: {
    base: 'flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md',
    wide: 'flex items-center justify-between w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md',
    centered: 'flex items-center justify-between w-64 px-4 py-2 border-2 border-prcolor rounded-md',
  },
} as const;