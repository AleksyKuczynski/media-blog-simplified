// src/main/lib/dictionary/helpers/search.ts
// OPTIMIZED: Kept only essential search functions for SEO and search pages

import { Dictionary } from '../types';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from './seo';
import { processTemplate } from './templates';

/**
 * Generate search page title using dictionary
 * ESSENTIAL: Used for search page SEO
 */
export const getSearchPageTitle = (dictionary: Dictionary): string => {
  return getPageTitle(dictionary, dictionary.search.templates.pageTitle);
};

/**
 * Generate search page description using dictionary
 * ESSENTIAL: Used for search page SEO
 */
export const getSearchPageDescription = (dictionary: Dictionary): string => {
  const baseDescription = dictionary.search.templates.pageDescription;
  const enhancedDescription = `${baseDescription} на ${dictionary.seo.site.name}`;
  return getMetaDescription(dictionary, enhancedDescription);
};

/**
 * Generate search keywords using dictionary labels
 * KEEP: Used for search page SEO
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
 * ESSENTIAL: Used by search metadata components
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
 * Generate search results title with query
 * KEEP: Used for search results pages
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
 * KEEP: Used for search results SEO
 */
export const generateSearchResultsDescription = (
  dictionary: Dictionary,
  query: string,
  resultCount: number
): string => {
  const countLabel = dictionary.common.count.results;
  return `Найдено ${resultCount} ${countLabel.toLowerCase()} по запросу "${query}"`;
};