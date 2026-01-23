// features/navigation/Header/utils/header.utils.ts

import { Dictionary } from '@/config/i18n';

/**
 * Get current page title based on pathname
 */
export function getCurrentPageTitle(
  pathname: string, 
  dictionary: Dictionary
): string {
  if (pathname === '/ru') {
    return dictionary.navigation.labels.home;
  }
  
  if (pathname.startsWith('/ru/articles')) {
    return dictionary.navigation.labels.articles;
  }
  
  if (pathname.startsWith('/ru/rubrics')) {
    return dictionary.navigation.labels.rubrics;
  }
  
  if (pathname.startsWith('/ru/authors')) {
    return dictionary.navigation.labels.authors;
  }
  
  if (pathname.startsWith('/ru/search')) {
    return dictionary.search.labels.results;
  }
  
  return '';
}

/**
 * Check if current page is search page
 */
export function isSearchPage(pathname: string): boolean {
  return pathname === '/ru/search';
}

/**
 * Normalize current path for schema usage
 */
export function normalizeCurrentPath(
  currentPath: string | undefined, 
  pathname: string
): string {
  return currentPath || pathname.replace('/ru', '') || '/';
}