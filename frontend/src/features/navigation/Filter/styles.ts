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

export const FILTER_STYLES = {
  container: {
    base: 'mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4',
    minimal: 'mb-4 flex items-center justify-between px-4',
    centered: 'mb-6 flex justify-center',
  },
} as const;

export const FILTER_CONTROL_STYLES = {
  wrapper: 'flex flex-col',
  wrapperWithGap: 'flex flex-col gap-2',
  
  label: 'mb-2 text-sm font-medium text-prcolor',
  
  resetButtonWrapper: 'flex flex-col justify-end',
} as const;

export const FILTER_BUTTON_STYLES = {
  dropdown: {
    base: 'flex items-center justify-between w-full px-4 py-2 border-2 border-prcolor rounded-md',
    wide: 'flex items-center justify-between w-full sm:w-48 px-4 py-2 border-2 border-prcolor rounded-md',
    centered: 'flex items-center justify-between w-64 px-4 py-2 border-2 border-prcolor rounded-md',
  },
  
  icon: 'h-5 w-5 ml-2 flex-shrink-0',
  
  text: {
    base: 'truncate',
  },
} as const;