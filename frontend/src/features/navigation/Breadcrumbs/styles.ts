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

import { cn } from "@/lib/utils";

export const BREADCRUMB_STYLES = {
  nav: {
    container: 'text-sm mx-2 my-4',
  },
  
  list: {
    base: 'list-none flex flex-nowrap items-center whitespace-nowrap',
  },
  
  item: {
    container: 'flex items-center flex-shrink-0',
  },
  
  separator: {
    container: 'mx-2 flex-shrink-0',
    icon: 'w-3 h-3 text-pr-cont',
  },
  
  link: {
    base: cn(
      'truncate text-ellipsis text-pr-cont', 
      'hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200', 
      'max-w-[100px] md:max-w-[180px] lg:max-w-[240px] inline-block',
    )
  },
  
  currentPage: {
    base: 'text-on-sf-var truncate max-w-[120px] md:max-w-[200px] lg:max-w-[300px] inline-block',
  },
} as const;