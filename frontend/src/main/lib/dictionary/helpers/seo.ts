// src/main/lib/dictionary/helpers/seo.ts
// Clean SEO utilities using the new dictionary structure

import { Dictionary, TemplateVariables } from '../types';
import { processTemplate, createSEOVariables, createCollectionVariables } from './templates';

/**
 * Generate page title using dictionary templates
 */
export const getPageTitle = (dictionary: Dictionary, title: string): string => {
  return processTemplate(dictionary.seo.templates.pageTitle, {
    title,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate collection page title
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
 */
export const generateCanonicalUrl = (path: string, baseUrl?: string): string => {
  const url = baseUrl || 'https://event4me.eu';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${url}${cleanPath}`;
};

/**
 * Get collection page description
 */
export const getCollectionDescription = (
  dictionary: Dictionary,
  collectionType: 'rubrics' | 'authors' | 'articles'
): string => {
  return dictionary.sections[collectionType].collectionPageDescription;
};

/**
 * Generate complete SEO metadata for collection pages
 */
export const generateCollectionSEO = (
  dictionary: Dictionary,
  collectionType: 'rubrics' | 'authors' | 'articles',
  totalCount: number,
  currentPath: string,
  customItems?: string[]
) => {
  const title = getCollectionTitle(dictionary, collectionType);
  const description = getCollectionDescription(dictionary, collectionType);
  const enhancedDescription = getMetaDescription(dictionary, description);
  
  // Add count and custom items to keywords
  const customKeywords = customItems ? customItems.join(', ') : '';
  const keywords = getKeywords(dictionary, collectionType, customKeywords);
  
  const canonicalUrl = generateCanonicalUrl(currentPath, dictionary.seo.site.url);
  const imageUrl = `${dictionary.seo.site.url}/og-${collectionType}.jpg`;
  
  return {
    title,
    description: enhancedDescription,
    keywords,
    canonicalUrl,
    imageUrl,
    totalCount,
    collectionType,
  };
};

/**
 * Generate breadcrumb data
 */
export const generateBreadcrumbs = (
  dictionary: Dictionary,
  path: string[]
): Array<{ name: string; href: string }> => {
  const breadcrumbs = [
    {
      name: dictionary.navigation.labels.home,
      href: '/ru',
    },
  ];
  
  path.forEach((segment, index) => {
    const href = `/ru/${path.slice(0, index + 1).join('/')}`;
    
    // Map path segments to dictionary labels
    let name = segment;
    if (segment === 'rubrics') {
      name = dictionary.navigation.labels.rubrics;
    } else if (segment === 'authors') {
      name = dictionary.navigation.labels.authors;
    } else if (segment === 'articles') {
      name = dictionary.navigation.labels.articles;
    }
    
    breadcrumbs.push({ name, href });
  });
  
  return breadcrumbs;
};

/**
 * Validate SEO content for Russian content and length
 */
export const validateSEOContent = (content: {
  title: string;
  description: string;
  keywords?: string;
}): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Check title length
  if (content.title.length > 60) {
    warnings.push(`Title too long: ${content.title.length} chars (recommended: ≤60)`);
  }
  
  // Check description length
  if (content.description.length > 160) {
    warnings.push(`Description too long: ${content.description.length} chars (recommended: ≤160)`);
  }
  
  // Check for Russian content
  const hasRussian = /[а-яё]/i.test(content.title + content.description);
  if (!hasRussian) {
    warnings.push('No Russian text detected in title or description');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

/**
 * Get localized count with proper label
 */
export const getLocalizedCount = (
  dictionary: Dictionary,
  count: number,
  type: 'articles' | 'rubrics' | 'authors'
): string => {
  const label = dictionary.common.count[type];
  return `${label} ${count}`;
};