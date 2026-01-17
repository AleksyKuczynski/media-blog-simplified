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
      'flex flex-row justify-center border border-ol mx-auto group transition-all duration-300',
      'mt-8 mb-16 max-xs:mx-2 max-sm:mx-6 rounded-xl', 
      'md:mb-24 md:w-[498px] md:rounded-2xl',
      'xl:mb-32 xl:w-[576px] xl:rounded-3xl',
    ),
    inactive: 'bg-sf shadow-md',
    active: 'bg-sf-hst shadow-none',
    activeHover: 'bg-sf-hi shadow-none',
  },
  divider: {
    base: 'w-px bg-ol self-center h-12 transition-opacity duration-300',
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
      'hover:bg-sf-hi border border-transparent transition-all duration-300',
      'focus:bg-sf focus:shadow-md',
      '[&.is-dropdown-open]:bg-sf [&.is-dropdown-open]:shadow-md [&.is-dropdown-open]:border-ol',
      'rounded-xl px-6 py-2 text-sm',
      'md:rounded-2xl md:px-8 md:py-3 md:text-base',
      'xl:rounded-3xl xl:px-12 xl:py-4 xl:text-lg',
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