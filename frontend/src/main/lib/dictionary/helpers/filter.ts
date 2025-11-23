// src/main/lib/dictionary/helpers/filter.ts

import { Category } from '@/main/lib/directus/directusInterfaces';
import { generateCanonicalUrl } from './seo';
import Dictionary from '../types';

// ===================================================================
// FILTER HELPERS - Uses dictionary entries, no hardcoded text
// ===================================================================

/**
 * Get filter labels using dictionary entries
 */
export const getFilterLabels = (dictionary: Dictionary) => {
  return {
    allCategories: dictionary.filter.labels.allCategories,
    reset: dictionary.filter.labels.reset,
    sortOrder: dictionary.filter.labels.sortBy,
    category: dictionary.filter.labels.category,
    newest: dictionary.filter.labels.newest,
    oldest: dictionary.filter.labels.oldest,
  };
};

/**
 * Get sorting options using dictionary entries
 */
export const getSortingOptions = (dictionary: Dictionary) => {
  return {
    newest: dictionary.filter.labels.newest,
    oldest: dictionary.filter.labels.oldest,
    label: dictionary.filter.labels.sortBy,
  };
};

/**
 * Generate category dropdown items using existing helpers
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
    
    // Display info
    selectedCategoryName,
  };
};

/**
 * Validate filter dictionary structure
 */
export const validateFilterDictionary = (dictionary: Dictionary): boolean => {
  try {
    // Check for filter section
    const hasFilter = !!dictionary.filter;
    const hasFilterLabels = !!(
      dictionary.filter?.labels.allCategories &&
      dictionary.filter?.labels.category &&
      dictionary.filter?.labels.reset &&
      dictionary.filter?.labels.sortBy
    );
    
    return hasFilter && hasFilterLabels;
  } catch {
    return false;
  }
};

/**
 * Get filter component accessibility data
 */
export const getFilterAccessibilityData = (dictionary: Dictionary) => {
  return {
    categorySelector: dictionary.filter.accessibility.categorySelector,
    sortingControl: dictionary.filter.accessibility.sortingControl,
    resetButton: dictionary.filter.accessibility.resetButton,
    filterGroup: dictionary.filter.accessibility.filterGroup,
    dropdownLabel: dictionary.filter.accessibility.dropdownLabel,
  };
};