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
    base: 'mt-8 mb-16 flex flex-row justify-center px-4 gap-0.5',
  },
} as const;

export const FILTER_CONTROL_STYLES = {
  wrapper: 'flex flex-col',
  label: 'text-xs lowercase font-medium text-pr-cont pl-4',
  
} as const;

export const FILTER_BUTTON_STYLES = {
  dropdown: {
    button: cn('flex items-center justify-between w-full bg-sf-cont border border-pr-fix rounded-full transition-all duration-200 text-on-sf-var hover:text-on-sf hover:bg-sf-hi',
      'px-4 py-2 text-sm'
      
    ),
    left: 'rounded-r-none',
    rigth: 'rounded-l-none',
    base: 'flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md',
    wide: 'flex items-center justify-between w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md',
    centered: 'flex items-center justify-between w-64 px-4 py-2 border-2 border-prcolor rounded-md',
  },
  
  icon: 'h-5 w-5 ml-2 flex-shrink-0',
  
  text: {
    base: 'truncate lowercase',
  },
} as const;