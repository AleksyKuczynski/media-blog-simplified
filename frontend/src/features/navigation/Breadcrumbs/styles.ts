// features/navigation/Breadcrumbs/styles.ts
/**
 * Breadcrumbs - Centralized Style Constants
 * 
 * Unified styling for both Breadcrumbs.tsx and SmartBreadcrumbs.tsx
 * Ensures consistent appearance across all breadcrumb contexts.
 * 
 * Components:
 * - BREADCRUMB_STYLES: Container, list, items, separators, links
 */

export const BREADCRUMB_STYLES = {
  nav: {
    container: 'text-sm mx-2 my-4 max-w-[50vw]',
  },
  
  list: {
    base: 'list-none',
  },
  
  item: {
    container: 'flex items-center',
  },
  
  separator: {
    container: 'mx-2 flex-shrink-0',
    icon: 'w-3 h-3 text-pr-cont',
  },
  
  link: {
    base: 'truncate text-ellipsis text-pr-cont hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200',
  },
  
  currentPage: {
    base: 'text-on-sf-var line-clamp-1',
  },
} as const;