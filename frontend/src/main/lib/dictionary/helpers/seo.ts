// src/main/lib/dictionary/helpers/seo.ts
// SEO utilities - updated for simplified dictionary structure

import { Dictionary } from '../types';
import { processTemplate, createSEOVariables } from './templates';

/**
 * Generate page title using simplified templates
 * @example getPageTitle(dictionary, 'Музыка') => "Музыка — EventForMe"
 */
export const getPageTitle = (dictionary: Dictionary, title: string): string => {
  return processTemplate(dictionary.seo.templates.pageTitle, {
    title,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate collection page title
 * @example getCollectionTitle(dictionary, 'рубрики') => "Все рубрики — EventForMe"  
 */
export const getCollectionTitle = (dictionary: Dictionary, collection: string): string => {
  const collectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, {
    section: collection,
  });
  return processTemplate(dictionary.seo.templates.collectionPage, {
    collection: collectionTitle,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate meta description using templates
 * @example getMetaDescription(dictionary, 'Статьи о музыке') => "Статьи о музыке на EventForMe"
 */
export const getMetaDescription = (dictionary: Dictionary, description: string): string => {
  return processTemplate(dictionary.seo.templates.metaDescription, {
    description,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Generate keywords for page type using simplified structure
 */
export const getKeywords = (dictionary: Dictionary, pageType: string, customKeywords?: string): string => {
  const baseKeywords = dictionary.seo.keywords.base;
  
  // Map page types to keyword categories
  let typeKeywords = '';
  switch (pageType) {
    case 'rubrics':
    case 'rubric':
      typeKeywords = dictionary.seo.keywords.rubrics;
      break;
    case 'articles':
    case 'article':
      typeKeywords = dictionary.seo.keywords.articles;
      break;
    case 'authors':
    case 'author':
      typeKeywords = dictionary.seo.keywords.authors;
      break;
    default:
      typeKeywords = '';
  }
  
  if (customKeywords) {
    return `${customKeywords}, ${baseKeywords}`;
  }
  
  return typeKeywords ? `${typeKeywords}, ${baseKeywords}` : baseKeywords;
};

/**
 * Generate canonical URL - simple construction
 */
export const generateCanonicalUrl = (path: string, baseUrl?: string): string => {
  const url = baseUrl || 'https://event4me.eu';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${url}${cleanPath}`;
};

/**
 * Basic SEO validation - check for Russian content and length
 */
export const validateSEOContent = (content: {
  title: string;
  description: string;
  keywords?: string;
}): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Title validation
  if (content.title.length > 60) {
    warnings.push('Title may be too long for search results');
  }
  
  if (content.title.length < 10) {
    warnings.push('Title is too short');
  }
  
  // Description validation
  if (content.description.length > 160) {
    warnings.push('Description may be too long for search results');
  }
  
  if (content.description.length < 50) {
    warnings.push('Description is too short');
  }
  
  // Russian content validation
  if (!content.title.match(/[а-яё]/i)) {
    warnings.push('Title should contain Russian text');
  }
  
  if (!content.description.match(/[а-яё]/i)) {
    warnings.push('Description should contain Russian text');
  }
  
  // Keywords validation
  if (content.keywords) {
    const keywordArray = content.keywords.split(',').map(k => k.trim());
    if (keywordArray.length > 10) {
      warnings.push('Consider using fewer keywords for better focus');
    }
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

/**
 * Generate complete SEO metadata object
 * Simplified version that works with new dictionary structure
 */
export const generateSEOMetadata = (dictionary: Dictionary, options: {
  type: 'page' | 'collection';
  title: string;
  description: string;
  path: string;
  keywords?: string;
  imageUrl?: string;
}) => {
  const { type, title, description, path, keywords, imageUrl } = options;
  
  const seoTitle = type === 'collection' 
    ? getCollectionTitle(dictionary, title)
    : getPageTitle(dictionary, title);
    
  const seoDescription = getMetaDescription(dictionary, description);
  const seoKeywords = getKeywords(dictionary, type, keywords);
  const canonicalUrl = generateCanonicalUrl(path, dictionary.seo.site.url);
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ru': canonicalUrl,
        'ru-RU': canonicalUrl,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: dictionary.seo.site.name,
      locale: 'ru_RU',
      type: 'website',
      ...(imageUrl && {
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      ...(imageUrl && { images: [imageUrl] }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

// Fix default export - assign to variable first
const seoHelpers = {
  getPageTitle,
  getCollectionTitle,
  getMetaDescription,
  getKeywords,
  generateCanonicalUrl,
  validateSEOContent,
  generateSEOMetadata,
};

export default seoHelpers;

export { generateCanonicalUrl as getCanonicalURL };