// src/main/lib/dictionary/helpers/search.ts
// Search helpers optimized for new dictionary structure and SEO

import { Dictionary } from '../types';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from './seo';
import { processTemplate } from './templates';

// ===================================================================
// SEARCH PAGE SEO HELPERS
// ===================================================================

/**
 * Generate search page title using dictionary
 * @example getSearchPageTitle(dictionary) => "Поиск — EventForMe"
 */
export const getSearchPageTitle = (dictionary: Dictionary): string => {
  return getPageTitle(dictionary, dictionary.search.templates.pageTitle);
};

/**
 * Generate search page description using dictionary
 * @example getSearchPageDescription(dictionary) => "Найдите интересующий вас контент на EventForMe"
 */
export const getSearchPageDescription = (dictionary: Dictionary): string => {
  const baseDescription = dictionary.search.templates.pageDescription;
  const enhancedDescription = `${baseDescription} на ${dictionary.seo.site.name}`;
  return getMetaDescription(dictionary, enhancedDescription);
};

/**
 * Generate search keywords using dictionary labels
 */
export const getSearchKeywords = (dictionary: Dictionary): string => {
  const searchTerms = [
    dictionary.search.labels.placeholder.toLowerCase(),
    dictionary.search.labels.results.toLowerCase(),
    dictionary.search.templates.pageTitle.toLowerCase(),
  ].join(', ');
  
  return getKeywords(dictionary, 'base', searchTerms);
};

/**
 * Generate complete search SEO data
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

// ===================================================================
// SEARCH RESULTS HELPERS
// ===================================================================

/**
 * Generate search results title with query
 * @example generateSearchResultsTitle(dictionary, 'музыка') => "Результаты поиска: музыка — EventForMe"
 */
export const generateSearchResultsTitle = (
  dictionary: Dictionary,
  query: string
): string => {
  const resultsTitle = processTemplate(dictionary.search.templates.resultsFor, { query });
  return getPageTitle(dictionary, resultsTitle);
};

/**
 * Generate search results description
 * @example generateSearchResultsDescription(dictionary, 'музыка', 15) => "Найдено 15 результатов по запросу 'музыка'"
 */
export const generateSearchResultsDescription = (
  dictionary: Dictionary,
  query: string,
  resultCount: number
): string => {
  const countLabel = dictionary.common.count.results;
  return `Найдено ${resultCount} ${countLabel.toLowerCase()} по запросу "${query}"`;
};

/**
 * Generate no results message
 * @example generateNoResultsMessage(dictionary, 'xyz') => "По запросу 'xyz' ничего не найдено"
 */
export const generateNoResultsMessage = (
  dictionary: Dictionary,
  query: string
): string => {
  return `По запросу "${query}" ${dictionary.search.labels.noResults.toLowerCase()}`;
};

// ===================================================================
// SEARCH ACTION SCHEMA HELPERS
// ===================================================================

/**
 * Generate search action schema data for structured data
 */
export const generateSearchActionData = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  const searchUrl = generateCanonicalUrl('/search', baseUrl);
  
  return {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${searchUrl}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
    name: dictionary.search.templates.pageTitle,
    description: dictionary.search.templates.pageDescription,
  };
};

/**
 * Generate search box schema for website
 */
export const generateSearchBoxSchema = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: dictionary.seo.site.name,
    description: dictionary.seo.site.description,
    potentialAction: generateSearchActionData(dictionary),
  };
};

// ===================================================================
// SEARCH INTERFACE HELPERS
// ===================================================================

/**
 * Get search form labels for UI components
 */
export const getSearchFormLabels = (dictionary: Dictionary) => {
  return {
    placeholder: dictionary.search.labels.placeholder,
    submitButton: dictionary.search.labels.submit,
    searchingText: dictionary.search.labels.searching,
    minCharactersHint: dictionary.search.labels.minCharacters,
  };
};

/**
 * Get search accessibility attributes
 */
export const getSearchAccessibilityData = (dictionary: Dictionary) => {
  const { accessibility } = dictionary.search;
  
  return {
    searchLabel: accessibility.searchLabel,
    searchButtonLabel: accessibility.searchButtonLabel,
    searchInputLabel: accessibility.searchInputLabel,
    searchRegion: 'search',
    searchForm: {
      'aria-label': accessibility.searchLabel,
      role: 'search',
    },
    searchInput: {
      'aria-label': accessibility.searchInputLabel,
      placeholder: dictionary.search.labels.placeholder,
    },
    searchButton: {
      'aria-label': accessibility.searchButtonLabel,
      type: 'submit',
    },
  };
};

/**
 * Get search results accessibility data
 */
export const getSearchResultsAccessibilityData = (
  dictionary: Dictionary,
  query: string,
  resultCount: number
) => {
  return {
    resultsRegion: {
      'aria-label': `${dictionary.search.labels.results} для запроса ${query}`,
      'aria-live': 'polite',
      role: 'region',
    },
    resultsList: {
      'aria-label': `${resultCount} ${dictionary.common.count.results.toLowerCase()}`,
      role: 'list',
    },
    noResults: {
      'aria-label': generateNoResultsMessage(dictionary, query),
      role: 'status',
    },
  };
};

// ===================================================================
// SEARCH SUGGESTIONS & RELATED CONTENT
// ===================================================================

/**
 * Get search suggestions data
 */
export const getSearchSuggestionsData = (dictionary: Dictionary) => {
  return {
    title: dictionary.search.templates.relatedTo,
    popularRubrics: dictionary.sections.rubrics.allRubrics,
    latestArticles: dictionary.sections.articles.latestArticles,
    ourAuthors: dictionary.sections.authors.ourAuthors,
  };
};

/**
 * Generate search-related navigation suggestions
 */
export const generateSearchNavigationSuggestions = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  
  return [
    {
      title: dictionary.sections.rubrics.allRubrics,
      description: dictionary.sections.rubrics.categoriesDescription,
      url: `${baseUrl}/ru/rubrics`,
      type: 'collection',
    },
    {
      title: dictionary.sections.articles.allArticles,
      description: dictionary.sections.articles.collectionPageDescription,
      url: `${baseUrl}/ru/articles`,
      type: 'collection',
    },
    {
      title: dictionary.sections.authors.allAuthors,
      description: dictionary.sections.authors.collectionPageDescription,
      url: `${baseUrl}/ru/authors`,
      type: 'collection',
    },
  ];
};

// ===================================================================
// SEARCH VALIDATION
// ===================================================================

/**
 * Validate search dictionary completeness
 */
export const validateSearchDictionary = (dictionary: Dictionary): boolean => {
  try {
    // Check labels
    const hasLabels = !!(
      dictionary.search?.labels?.placeholder &&
      dictionary.search?.labels?.results &&
      dictionary.search?.labels?.noResults &&
      dictionary.search?.labels?.searching &&
      dictionary.search?.labels?.submit &&
      dictionary.search?.labels?.minCharacters
    );
    
    // Check templates
    const hasTemplates = !!(
      dictionary.search?.templates?.resultsFor &&
      dictionary.search?.templates?.pageTitle &&
      dictionary.search?.templates?.pageDescription &&
      dictionary.search?.templates?.relatedTo
    );
    
    // Check accessibility
    const hasAccessibility = !!(
      dictionary.search?.accessibility?.searchLabel &&
      dictionary.search?.accessibility?.searchButtonLabel &&
      dictionary.search?.accessibility?.searchInputLabel
    );
    
    // Check site info
    const hasSiteInfo = !!(
      dictionary.seo?.site?.name &&
      dictionary.seo?.site?.url
    );
    
    return hasLabels && hasTemplates && hasAccessibility && hasSiteInfo;
  } catch (error) {
    console.warn('Search dictionary validation failed:', error);
    return false;
  }
};

// ===================================================================
// SEARCH QUERY PROCESSING
// ===================================================================

/**
 * Validate search query
 */
export const validateSearchQuery = (
  query: string,
  dictionary: Dictionary
): { isValid: boolean; message?: string } => {
  if (!query || query.trim().length === 0) {
    return {
      isValid: false,
      message: 'Введите поисковый запрос',
    };
  }
  
  if (query.trim().length < 2) {
    return {
      isValid: false,
      message: dictionary.search.labels.minCharacters,
    };
  }
  
  return { isValid: true };
};

/**
 * Sanitize search query for safe processing
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .substring(0, 100); // Limit length
};

/**
 * Generate search URL with query
 */
export const generateSearchUrl = (
  query: string,
  dictionary: Dictionary,
  additionalParams?: Record<string, string>
): string => {
  const baseUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);
  const sanitizedQuery = sanitizeSearchQuery(query);
  
  const params = new URLSearchParams({
    q: sanitizedQuery,
    ...additionalParams,
  });
  
  return `${baseUrl}?${params.toString()}`;
};