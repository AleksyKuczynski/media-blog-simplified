// src/main/components/SEO/metadata/SearchMetadata.tsx
// DRY: Uses existing helpers, no dictionary expansion

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import {
  generateSearchResultsTitle,
  generateSearchSEOData,
  validateSearchDictionary,
} from '@/main/lib/dictionary/helpers/search';
import { processTemplate } from '@/main/lib/dictionary/helpers';

// ===================================================================
// TYPES - Simple and focused
// ===================================================================

export interface SearchMetadataProps {
  dictionary: Dictionary;
  query?: string;
  resultCount?: number;
  customTitle?: string;
  customDescription?: string;
  imageUrl?: string;
}

// ===================================================================
// MAIN SEARCH METADATA FUNCTIONS - DRY
// ===================================================================

/**
 * Generate search page metadata using existing helpers
 * NO DUPLICATION - uses existing SEO and search helpers
 */
export const generateSearchMetadata = async ({
  dictionary,
  query,
  resultCount,
  customTitle,
  customDescription,
  imageUrl,
}: SearchMetadataProps): Promise<Metadata> => {
  
  try {
    // Validate dictionary first
    if (!validateSearchDictionary(dictionary)) {
      console.error('SearchMetadata: Invalid dictionary structure');
    }

    // Use existing search helper - NO DUPLICATION
    const searchSEOData = generateSearchSEOData(dictionary);
    
    // Customize title/description if provided
    const baseTitle = customTitle || searchSEOData.title;
    const baseDescription = customDescription || searchSEOData.description;
    
    // Add query context if provided - uses dictionary template
    const finalTitle = query 
      ? generateSearchResultsTitle(dictionary, query)
      : baseTitle;
    
    // Generate description with query using dictionary template
    const finalDescription = query && resultCount !== undefined
      ? processTemplate(
          `${dictionary.search.templates.resultsFor} на {siteName}`, 
          { 
            query, 
            siteName: dictionary.seo.site.name 
          }
        )
      : baseDescription;

    // Create SEO data using existing function - NO DUPLICATION
    const seoData = createWebsiteSEOData(
      finalTitle,
      finalDescription,
      searchSEOData.keywords,
      searchSEOData.canonicalUrl,
      imageUrl || `${dictionary.seo.site.url}/og-search.jpg`
    );

    // Validate using existing function - NO DUPLICATION
    if (!validateSEOData(seoData)) {
      console.error('SearchMetadata: Invalid SEO data');
    }

    // Additional search-specific metadata
    const additionalMeta: Record<string, string | number | undefined> = {
      'search:interface': 'enabled',
      'search:language': dictionary.seo.regional?.language || 'ru',
      'search:region': dictionary.seo.regional?.region || 'RU',
      'DC.type': 'Text.SearchPage',
      'DC.language': 'ru',
      'DC.relation.isPartOf': dictionary.seo.site.url,
      
      // Add query and result info if available
      ...(query && { 'search:query': query }),
      ...(resultCount !== undefined && { 'search:resultCount': resultCount }),
    };

    // Use existing MetadataBuilder - NO DUPLICATION
    const metadata = buildMetadata(
      seoData,
      {
        baseUrl: dictionary.seo.site.url,
        defaultImageUrl: `${dictionary.seo.site.url}/og-search.jpg`,
        siteName: dictionary.seo.site.name,
        locale: 'ru_RU',
        region: dictionary.seo.regional?.region || 'RU',
      },
      additionalMeta
    );

    return metadata;
    
  } catch (error) {
    console.error('SearchMetadata: Error generating metadata', error);
    
    // Fallback metadata using basic info
    return {
      title: dictionary.search.templates.pageTitle,
      description: dictionary.search.templates.pageDescription,
    };
  }
};

/**
 * Generate search metadata for static search page
 * Uses existing helpers - simplified API
 */
export const generateStaticSearchMetadata = async (
  dictionary: Dictionary
): Promise<Metadata> => {
  return generateSearchMetadata({ dictionary });
};

/**
 * Generate search metadata for dynamic search results
 * Uses existing helpers - adds query context
 */
export const generateDynamicSearchMetadata = async (
  dictionary: Dictionary,
  query: string,
  resultCount?: number
): Promise<Metadata> => {
  return generateSearchMetadata({ 
    dictionary, 
    query, 
    resultCount 
  });
};

/**
 * Get search OpenGraph data - uses existing pattern
 * NO DUPLICATION - reuses search SEO data
 */
export const getSearchOpenGraphData = (
  dictionary: Dictionary,
  query?: string
) => {
  const searchSEOData = generateSearchSEOData(dictionary);
  
  // Use dictionary templates for title construction
  const title = query 
    ? generateSearchResultsTitle(dictionary, query)
    : searchSEOData.title;
    
  // Use dictionary template for description with query
  const description = query
    ? processTemplate(
        `${dictionary.search.templates.resultsFor} на {siteName}`,
        { query, siteName: dictionary.seo.site.name }
      )
    : searchSEOData.description;

  return {
    title,
    description,
    url: searchSEOData.canonicalUrl,
    siteName: dictionary.seo.site.name,
    locale: 'ru_RU',
    type: 'website' as const,
    
    images: [
      {
        url: `${dictionary.seo.site.url}/og-search.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
};

/**
 * Validate search metadata - uses existing validation patterns
 * NO DUPLICATION
 */
export const validateSearchMetadata = (
  metadata: Metadata
): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (!metadata.title) errors.push('Search title is required');
  if (!metadata.description) errors.push('Search description is required');

  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length > 60) {
    errors.push('Search title too long (>60 chars)');
  }

  if (metadata.description && metadata.description.length > 160) {
    errors.push('Search description too long (>160 chars)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get search meta tags - uses existing pattern
 * NO DUPLICATION
 */
export const getSearchMetaTags = (
  dictionary: Dictionary,
  query?: string
) => {
  const searchSEOData = generateSearchSEOData(dictionary);
  
  const title = query 
    ? `${query} — ${searchSEOData.title}`
    : searchSEOData.title;

  return [
    { name: 'title', content: title },
    { name: 'description', content: searchSEOData.description },
    { name: 'keywords', content: searchSEOData.keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: searchSEOData.description },
    { property: 'og:url', content: searchSEOData.canonicalUrl },
    { property: 'og:site_name', content: dictionary.seo.site.name },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: searchSEOData.description },
    { name: 'search:interface', content: 'enabled' },
    { name: 'DC.type', content: 'Text.SearchPage' },
    { name: 'DC.language', content: 'ru' },
  ];
};