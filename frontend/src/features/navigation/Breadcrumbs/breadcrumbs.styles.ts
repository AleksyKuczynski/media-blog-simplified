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
    container: cn(
      'overflow-x-auto scrollbar-hide',
      'px-2',
      'max-lg:text-sm mt-2 md:mt-4 mb-8 md:mb-12 max-w-6xl',
      'lg:mt-6 lg:mb-16',
      'xl:mb-20',
    ),
  },
  list: {
  base: 'list-none flex flex-nowrap',
  },
  separator: {
  container: 'mx-1 md:mx-2 flex-shrink-0',
  icon: 'w-3 h-3 text-pr-cont',
  },
} as const;

// ===================================================================
// BREADCRUMBS COMPONENT (General pages: 2-3 members)
// ===================================================================
export const SIMPLE_BREADCRUMB_STYLES = {
  item: {
  // Home - no width restriction
  home: 'flex items-center flex-shrink-0',
  // Middle item (Authors/Rubrics context) - controlled width
  context: 'flex items-center flex-shrink-0',
  // Last item - flexible, allow full width usage
  last: 'flex items-center flex-shrink min-w-0',
  },
  link: {
  // Home link
  home: cn(
  'text-pr-cont hover:text-pr-fix hover:underline',
  'underline-offset-4 transition-all duration-200',
  ),
  // Context link (Authors, Rubrics)
  context: cn(
  'truncate text-ellipsis text-pr-cont',
  'hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200',
  'max-w-[80px] sm:max-w-[100px] inline-block',
  ),
  },
  currentPage: {
  // Last item - generous width for author/rubric/category names
  base: 'text-on-sf-var truncate max-w-[180px] sm:max-w-[260px] md:max-w-[360px] lg:max-w-[480px] inline-block',
  },
} as const;

// ===================================================================
// SMART BREADCRUMBS COMPONENT (Article pages: 4 members only)
// ===================================================================
export const SMART_BREADCRUMB_STYLES = {
  item: {
  // Home - no width restriction
  home: 'flex items-center flex-shrink-0',
  // Context (Authors/Rubrics) - controlled
  context: 'flex items-center flex-shrink-0',
  // Parent (Author name/Rubric name) - needs truncation
  parent: 'flex items-center flex-shrink min-w-0',
  // Article title - flexible
  article: 'flex items-center flex-shrink min-w-0',
  },
  link: {
  // Home link
  home: cn(
  'text-pr-cont hover:text-pr-fix hover:underline',
  'underline-offset-4 transition-all duration-200',
  ),
  // Context link (Authors, Rubrics)
  context: cn(
  'truncate text-ellipsis text-pr-cont',
  'hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200',
  'max-w-[88px] xs:max-w-[100px] inline-block',
  ),
  // Parent link (Author name, Rubric name) - medium truncation
  parent: cn(
  'text-pr-cont',
  'hover:text-pr-fix hover:underline underline-offset-4 transition-all duration-200',
  'max-w-[88px] xs:max-w-[180px] md:max-w-[240px] inline-block',
  ),
  },
  currentPage: {
  // Article title - flexible width
  base: 'text-on-sf-var truncate max-w-[140px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[360px] inline-block',
  },
} as const;