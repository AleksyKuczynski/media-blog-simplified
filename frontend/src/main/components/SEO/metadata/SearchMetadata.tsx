// src/main/components/SEO/metadata/SearchMetadata.tsx
// Fixed search metadata with proper type safety and correct API usage

import { Metadata } from 'next';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  getCanonicalURL,
  getProcessedSEOTitle,
  getProcessedSEODescription,
  getPageTypeKeywords,
  validateSEOMetadata,
} from '@/main/lib/dictionary/helpers';

interface SearchMetadataProps {
  readonly dictionary: Dictionary;
}

/**
 * Generate static search page metadata
 * Focuses on search interface capability, not dynamic results
 */
export const generateSearchMetadata = (
  dictionary: Dictionary
): Metadata => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  
  // Build SEO content using helper functions
  const baseTitle = searchDict.templates.pageTitle;
  const title = getProcessedSEOTitle(seoDict, 'search', { 
    title: baseTitle,
    siteName: seoDict.site.name 
  });
  
  // Create enhanced description - FIXED: Remove invalid 'description' property
  const baseDescription = searchDict.templates.pageDescription;
  const description = getProcessedSEODescription(seoDict, 'search', {
    title: baseDescription, // Use 'title' instead of 'description'
    siteName: seoDict.site.name
  });
  
  // Get search-specific keywords
  const keywords = getPageTypeKeywords(seoDict, 'search', [
    'поиск статей',
    'поиск по сайту',
    searchDict.labels.placeholder.toLowerCase()
  ]);

  // Validate SEO content
  const validation = validateSEOMetadata(title, description, keywords, 'search');
  if (!validation.isValid) {
    console.warn('Search SEO validation errors:', validation.errors);
  }

  // Create SEO data with search-specific image
  const seoData = createWebsiteSEOData(
    title,
    description,
    keywords,
    getCanonicalURL('/search'),
    'https://event4me.eu/og-search.jpg' // Search-specific OG image
  );

  // Validate and build metadata
  if (!validateSEOData(seoData)) {
    console.error('Invalid SEO data for search metadata');
  }

  // Additional metadata for search page
  const additionalMeta: Record<string, string | number | undefined> = {
    'search:enhanced': 'true',
    'search:functionality': 'static-interface',
    'search:language': seoDict.regional.language,
    // Dublin Core for search
    'DC.relation.isPartOf': getCanonicalURL('/'),
    'DC.relation.hasFormat': 'application/html',
    'DC.type': 'Text.SearchPage',
    // Yandex-specific for search
    'yandex:search': 'true',
  };

  // FIXED: Use only valid SEOContext properties, no openGraph
  const metadata = buildMetadata(
    seoData,
    {
      // Only valid SEOContext properties
      baseUrl: 'https://event4me.eu',
      defaultImageUrl: 'https://event4me.eu/og-search.jpg',
      siteName: seoDict.site.name,
      locale: 'ru_RU',
      region: 'RU',
    },
    additionalMeta
  );

  return metadata;
};

/**
 * Generate search-specific Open Graph data
 * This is now a utility function since buildMetadata handles OG internally
 */
export const getSearchOpenGraphData = (
  dictionary: Dictionary
) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  
  return {
    type: 'website' as const,
    locale: 'ru_RU',
    siteName: seoDict.site.name,
    title: searchDict.templates.pageTitle,
    description: searchDict.templates.pageDescription,
    url: getCanonicalURL('/search'),
    images: [
      {
        url: 'https://event4me.eu/og-search.jpg',
        width: 1200,
        height: 630,
        alt: searchDict.templates.pageTitle,
      },
    ],
  };
};

/**
 * Validate search metadata completeness
 * Uses correct dictionary paths that actually exist
 */
export const validateSearchMetadata = (dictionary: Dictionary): boolean => {
  const required = [
    'search.templates.pageTitle',
    'search.templates.pageDescription',
    'search.labels.placeholder',
    'seo.site.name',
  ];

  const missing = required.filter(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], dictionary as any);
    return !value || (typeof value === 'string' && value.trim().length === 0);
  });

  if (missing.length > 0) {
    console.warn('Missing required search metadata:', missing);
    return false;
  }

  return true;
};

/**
 * Get enhanced meta tags for search page
 * Uses available dictionary properties
 */
export const getSearchMetaTags = (
  dictionary: Dictionary
): Record<string, string | number | undefined> => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  return {
    // Search-specific
    'search:interface': 'enabled',
    'search:language': seoDict.regional.language,
    'search:region': seoDict.regional.region,
    
    // Dublin Core for search
    'DC.relation.isPartOf': getCanonicalURL('/'),
    'DC.relation.hasFormat': 'application/html',
    'DC.type': 'Text.SearchPage',
    
    // Yandex-specific for search
    'yandex:search': 'true',
    'yandex:verification': process.env.YANDEX_VERIFICATION || '',
  };
};