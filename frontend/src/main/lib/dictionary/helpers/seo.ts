// src/main/lib/dictionary/helpers/seo.ts
// OPTIMIZED: Kept essential SEO functions used by navigation and metadata components

import { Dictionary } from '../dictionary';
import { processTemplate } from './templates';

/**
 * Generate page title using dictionary templates
 * ESSENTIAL: Used by navigation helpers and metadata components
 */
export const getPageTitle = (dictionary: Dictionary, title: string): string => {
  return processTemplate(dictionary.seo.templates.pageTitle, {
    title,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate collection page title
 * KEEP: Used by collection metadata generation
 */
export const getCollectionTitle = (
  dictionary: Dictionary, 
  collectionType: 'rubrics' | 'authors' | 'articles'
): string => {
  const sectionLabel = dictionary.sections.labels[collectionType];
  const collectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, {
    section: sectionLabel,
  });
  
  return processTemplate(dictionary.seo.templates.collectionPage, {
    collection: collectionTitle,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate meta description using templates
 * ESSENTIAL: Used by navigation helpers and metadata components
 */
export const getMetaDescription = (
  dictionary: Dictionary, 
  description: string
): string => {
  return processTemplate(dictionary.seo.templates.metaDescription, {
    description,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate keywords for page type
 * ESSENTIAL: Used by navigation helpers
 */
export const getKeywords = (
  dictionary: Dictionary, 
  pageType: keyof typeof dictionary.seo.keywords | 'collection',
  customKeywords?: string
): string => {
  const baseKeywords = dictionary.seo.keywords.base;
  
  let typeKeywords = '';
  if (pageType !== 'collection' && pageType in dictionary.seo.keywords) {
    typeKeywords = dictionary.seo.keywords[pageType];
  }
  
  const parts = [customKeywords, typeKeywords, baseKeywords].filter(Boolean);
  return parts.join(', ');
};

/**
 * Generate canonical URL
 * ESSENTIAL: Used by navigation helpers and metadata components
 */
export const generateCanonicalUrl = (path: string, baseUrl?: string): string => {
  const url = baseUrl || 'https://event4me.eu';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${url}${cleanPath}`;
};

/**
 * Get collection page description
 * KEEP: Used by collection metadata
 */
export const getCollectionDescription = (
  dictionary: Dictionary,
  collectionType: 'rubrics' | 'authors' | 'articles'
): string => {
  return dictionary.sections[collectionType].collectionPageDescription;
};