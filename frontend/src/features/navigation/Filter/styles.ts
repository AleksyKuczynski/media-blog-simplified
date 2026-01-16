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
      'mt-8 mb-16 flex flex-row justify-center px-4 gap-0.5', 
      'md:mb-24',
      'xl:mb-32',
    ),
  },
} as const;

export const FILTER_CONTROL_STYLES = {
  wrapper: cn(
    'flex flex-col w-48',
    'md:w-56',
    'xl:w-64',
  ),
  label: cn(
    'text-xs lowercase font-medium text-sec-dim pl-4',
    'md:text-sm md:pl-6',
    'xl:text-base',
  ),
  
} as const;

export const FILTER_BUTTON_STYLES = {
  dropdown: {
    button: cn('flex items-center justify-between w-full shadow-md focus:shadow-sm', 
      'bg-sec-cont rounded-full transition-all duration-200 text-on-sec-var hover:text-on-sec hover:bg-sec-dim',
      'px-4 py-2 text-sm',
      'md:px-6 md:py-3 md:text-base',
      'xl:px-8 xl:py-4 xl:text-lg',
    ),
    left: 'rounded-r-none',
    right: 'rounded-l-none',
    base: 'flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md',
    wide: 'flex items-center justify-between w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md',
    centered: 'flex items-center justify-between w-64 px-4 py-2 border-2 border-prcolor rounded-md',
  },
  
  icon: 'h-5 w-5 ml-2 flex-shrink-0',
  
  text: {
    base: 'truncate lowercase',
  },
} as const;