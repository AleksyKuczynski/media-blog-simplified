// src/main/lib/dictionary/helpers/search.ts
// MINIMAL search-specific helpers - uses existing SEO helpers

import { Dictionary } from '../types';
import { 
  getPageTitle, 
  getMetaDescription, 
  getKeywords,
  generateCanonicalUrl 
} from './seo';

// ===================================================================
// SEARCH HELPERS - Minimal, using existing functions
// ===================================================================

/**
 * Generate search page title using existing SEO helper
 * NO EXPANSION - uses existing dictionary structure
 */
export const getSearchPageTitle = (dictionary: Dictionary): string => {
  const searchTitleText = 'Поиск'; // Static, no dictionary expansion needed
  return getPageTitle(dictionary, searchTitleText);
};

/**
 * Generate search page description using existing SEO helper
 * NO EXPANSION - uses existing dictionary structure
 */
export const getSearchPageDescription = (dictionary: Dictionary): string => {
  const searchDescriptionText = `Поиск статей и материалов на ${dictionary.seo.site.name}`;
  return getMetaDescription(dictionary, searchDescriptionText);
};

/**
 * Generate search-specific keywords using existing helper
 * NO EXPANSION - uses existing SEO keywords + search terms
 */
export const getSearchKeywords = (dictionary: Dictionary): string => {
  const searchSpecificKeywords = [
    'поиск статей',
    'поиск по сайту',
    dictionary.search.placeholder.toLowerCase(),
  ].join(', ');
  
  return getKeywords(dictionary, 'search', searchSpecificKeywords);
};

/**
 * Generate complete search SEO data using existing helpers
 * COMPOSITE function - no duplication
 */
export const generateSearchSEOData = (dictionary: Dictionary) => {
  const title = getSearchPageTitle(dictionary);
  const description = getSearchPageDescription(dictionary);
  const keywords = getSearchKeywords(dictionary);
  const canonicalUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);
  
  return {
    title,
    description,
    keywords,
    canonicalUrl,
  };
};

/**
 * Generate search action schema data using existing helpers
 * NO EXPANSION - minimal search action properties
 */
export const generateSearchActionData = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  const searchUrl = generateCanonicalUrl('/search', baseUrl);
  
  return {
    name: `Поиск по ${dictionary.seo.site.name}`,
    description: `Поиск материалов на ${dictionary.seo.site.name}`,
    targetUrl: searchUrl,
    queryTemplate: `${searchUrl}?search={search_term_string}`,
    siteName: dictionary.seo.site.name,
    baseUrl,
  };
};

/**
 * Validate search dictionary completeness
 * NO EXPANSION - uses only existing properties
 */
export const validateSearchDictionary = (dictionary: Dictionary): boolean => {
  const required = [
    'search.placeholder',
    'search.labels.results', 
    'search.noResults',
    'search.searching',
    'seo.site.name',
  ];

  const missing = required.filter(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], dictionary as any);
    return !value || (typeof value === 'string' && value.trim().length === 0);
  });

  if (missing.length > 0) {
    console.warn('Missing required search dictionary properties:', missing);
    return false;
  }

  return true;
};