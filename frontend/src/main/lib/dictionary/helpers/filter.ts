// src/main/lib/dictionary/helpers/filter.ts
// FIXED: Uses dictionary entries, no hardcoded text, fixed types

import { Dictionary } from '../types';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { generateCanonicalUrl } from './seo';

// ===================================================================
// FILTER HELPERS - Uses dictionary entries, no hardcoded text
// ===================================================================

/**
 * Get filter labels using dictionary entries
 * NO HARDCODED TEXT - uses dictionary.filter section
 */
export const getFilterLabels = (dictionary: Dictionary) => {
  return {
    allCategories: dictionary.filter.allCategories,
    reset: dictionary.filter.reset,
    sortOrder: dictionary.filter.sortOrder,
    category: dictionary.filter.category,
    newest: dictionary.filter.newest,
    oldest: dictionary.filter.oldest,
  };
};

/**
 * Get sorting options using dictionary entries
 * NO HARDCODED TEXT - uses dictionary.filter section
 */
export const getSortingOptions = (dictionary: Dictionary) => {
  return {
    newest: dictionary.filter.newest,
    oldest: dictionary.filter.oldest,
    label: dictionary.filter.sortOrder,
  };
};

/**
 * Generate category dropdown items using existing helpers
 * COMPOSITE function - uses existing patterns, FIXED TYPES
 */
export const generateCategoryDropdownItems = (
  dictionary: Dictionary,
  categories: Category[],
  currentCategory: string
) => {
  const filterLabels = getFilterLabels(dictionary);
  
  return [
    {
      id: 'all',
      label: filterLabels.allCategories,
      value: '',
      selected: currentCategory === '',
    },
    ...categories.map(category => ({
      id: category.slug,
      label: category.name,
      value: category.slug,
      selected: category.slug === currentCategory,
    })),
  ];
};

/**
 * Generate filter navigation URLs using existing helpers
 * NO DUPLICATION - uses existing generateCanonicalUrl
 */
export const generateFilterUrls = (
  baseUrl: string,
  categoryValue: string,
  sortValue: string = 'desc'
) => {
  const params = new URLSearchParams();
  params.set('sort', sortValue);
  
  if (categoryValue) {
    return `${generateCanonicalUrl(`/category/${categoryValue}`, baseUrl)}?${params.toString()}`;
  } else {
    return `${generateCanonicalUrl('/articles', baseUrl)}?${params.toString()}`;
  }
};

/**
 * Get current category information
 * Helper for extracting category from pathname
 */
export const getCurrentCategoryInfo = (pathname: string, categories: Category[]) => {
  const pathSegments = pathname.split('/');
  const categorySlug = pathSegments[pathSegments.length - 1];
  
  const isArticlesPath = pathname.endsWith('/articles');
  const currentCategory = categories.some(cat => cat.slug === categorySlug) ? categorySlug : '';
  
  return {
    isArticlesPath,
    currentCategory,
    categorySlug,
  };
};

/**
 * Generate complete filter state data
 * COMPOSITE function - combines existing helpers, FIXED TYPES
 */
export const generateFilterStateData = (
  dictionary: Dictionary,
  categories: Category[],
  pathname: string,
  searchParams: URLSearchParams
) => {
  const { isArticlesPath, currentCategory } = getCurrentCategoryInfo(pathname, categories);
  const currentSort = searchParams.get('sort') || 'desc';
  
  const filterLabels = getFilterLabels(dictionary);
  const sortingOptions = getSortingOptions(dictionary);
  const categoryItems = generateCategoryDropdownItems(dictionary, categories, currentCategory);
  
  // FIXED: Ensure selectedCategoryName is always a string
  const selectedCategoryName = currentCategory 
    ? categories.find(c => c.slug === currentCategory)?.name || filterLabels.allCategories
    : filterLabels.allCategories;
  
  return {
    // Current state
    currentCategory,
    currentSort,
    isArticlesPath,
    
    // Labels and options
    filterLabels,
    sortingOptions,
    categoryItems,
    
    // Display info - FIXED: always string
    selectedCategoryName,
  };
};

/**
 * Validate filter dictionary structure
 * Uses dictionary.filter section
 */
export const validateFilterDictionary = (dictionary: Dictionary): boolean => {
  try {
    // Check for filter section
    const hasFilter = !!dictionary.filter;
    const hasFilterLabels = !!(
      dictionary.filter?.allCategories &&
      dictionary.filter?.category &&
      dictionary.filter?.reset &&
      dictionary.filter?.sortOrder
    );
    
    return hasFilter && hasFilterLabels;
  } catch {
    return false;
  }
};

/**
 * Get filter component accessibility data
 * Uses dictionary.filter section - NO HARDCODED TEXT
 */
export const getFilterAccessibilityData = (dictionary: Dictionary) => {
  return {
    categorySelector: dictionary.filter.categorySelector,
    sortingControl: dictionary.filter.sortingControl,
    resetButton: dictionary.filter.resetButton,
    filterGroup: dictionary.filter.filterGroup,
    dropdownLabel: dictionary.filter.dropdownLabel,
  };
};