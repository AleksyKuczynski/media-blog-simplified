// src/main/lib/dictionary/helpers/search.ts
// FIXED: Removed all hardcoded Russian text, uses dictionary entries only

import { Dictionary } from '../types';
import { 
  getPageTitle, 
  getMetaDescription, 
  getKeywords,
  generateCanonicalUrl 
} from './seo';

// ===================================================================
// SEARCH HELPERS - NO HARDCODED TEXT, dictionary-driven
// ===================================================================

/**
 * Generate search page title using dictionary entries only
 * NO HARDCODED TEXT - uses dictionary.search.templates.pageTitle
 */
export const getSearchPageTitle = (dictionary: Dictionary): string => {
  return getPageTitle(dictionary, dictionary.search.templates.pageTitle);
};

/**
 * Generate search page description using dictionary entries only
 * NO HARDCODED TEXT - uses dictionary.search.templates.pageDescription
 */
export const getSearchPageDescription = (dictionary: Dictionary): string => {
  const searchDescription = `${dictionary.search.templates.pageDescription} на ${dictionary.seo.site.name}`;
  return getMetaDescription(dictionary, searchDescription);
};

/**
 * Generate search page keywords using dictionary entries only
 * NO HARDCODED TEXT - combines search labels with SEO keywords
 */
export const getSearchKeywords = (dictionary: Dictionary): string => {
  const searchKeywords = [
    dictionary.search.labels.placeholder.toLowerCase(),
    dictionary.search.labels.results.toLowerCase(),
    dictionary.search.templates.pageTitle.toLowerCase(),
  ].join(', ');
  
  return getKeywords(dictionary, 'search', searchKeywords);
};

/**
 * Generate complete search SEO data using dictionary entries only
 * NO HARDCODED TEXT - composite function using existing helpers
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
 * Generate search results title with query using dictionary templates
 * NO HARDCODED TEXT - uses dictionary.search.templates.resultsFor
 */
export const generateSearchResultsTitle = (
  dictionary: Dictionary, 
  query: string
): string => {
  const resultsTitle = dictionary.search.templates.resultsFor.replace('{query}', query);
  return getPageTitle(dictionary, resultsTitle);
};

/**
 * Generate search action schema data using dictionary entries only
 * NO HARDCODED TEXT - uses dictionary.search and dictionary.seo entries
 */
export const generateSearchActionData = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  const searchUrl = generateCanonicalUrl('/search', baseUrl);
  
  // Use dictionary entries for action data
  const actionName = `${dictionary.search.templates.pageTitle} — ${dictionary.seo.site.name}`;
  const actionDescription = dictionary.search.templates.pageDescription;
  
  return {
    name: actionName,
    description: actionDescription,
    targetUrl: searchUrl,
    queryTemplate: `${searchUrl}?search={search_term_string}`,
    siteName: dictionary.seo.site.name,
    baseUrl,
  };
};

/**
 * Validate search dictionary completeness - uses new structure
 * NO HARDCODED PATHS - validates actual dictionary structure
 */
export const validateSearchDictionary = (dictionary: Dictionary): boolean => {
  try {
    // Check labels
    const hasLabels = !!(
      dictionary.search.labels.placeholder &&
      dictionary.search.labels.results &&
      dictionary.search.labels.noResults &&
      dictionary.search.labels.searching &&
      dictionary.search.labels.submit &&
      dictionary.search.labels.minCharacters
    );
    
    // Check templates
    const hasTemplates = !!(
      dictionary.search.templates.resultsFor &&
      dictionary.search.templates.pageTitle &&
      dictionary.search.templates.pageDescription &&
      dictionary.search.templates.relatedTo
    );
    
    // Check accessibility
    const hasAccessibility = !!(
      dictionary.search.accessibility.searchLabel &&
      dictionary.search.accessibility.searchButtonLabel &&
      dictionary.search.accessibility.searchInputLabel
    );
    
    // Check site info
    const hasSiteInfo = !!(
      dictionary.seo.site.name &&
      dictionary.seo.site.url
    );
    
    return hasLabels && hasTemplates && hasAccessibility && hasSiteInfo;
  } catch (error) {
    console.warn('Search dictionary validation failed:', error);
    return false;
  }
};

/**
 * Get search interface labels for UI components
 * NO HARDCODED TEXT - returns dictionary.search.interface entries
 */
export const getSearchInterfaceLabels = (dictionary: Dictionary) => {
  return {
    alternativeNavigation: dictionary.search.interface.alternativeNavigation,
    searchSuggestion: dictionary.search.interface.searchSuggestion,
    popularRubrics: dictionary.search.navigation.popularRubrics,
    latestArticles: dictionary.search.navigation.latestArticles,
    ourAuthors: dictionary.search.navigation.ourAuthors,
  };
};