// src/main/components/SEO/metadata/SearchMetadata.tsx
// Fixed search metadata with proper imports and correct dictionary paths

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
  
  // Create enhanced description
  const baseDescription = searchDict.templates.pageDescription;
  const description = getProcessedSEODescription(seoDict, 'search', {
    description: baseDescription,
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

  // Create SEO data
  const seoData = createWebsiteSEOData(
    title,
    description,
    keywords,
    getCanonicalURL('/search')
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
  };

  // Build the metadata using the core builder
  const metadata = buildMetadata(seoData, {
    // Open Graph specific for search
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: seoDict.site.name, // FIXED: was siteName
      images: [
        {
          url: 'https://event4me.eu/og-search.jpg',
          width: 1200,
          height: 630,
          alt: searchDict.templates.pageTitle,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary',
      title: baseTitle,
      description: baseDescription,
    },
    
    // Robots directives for search page
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  }, additionalMeta);

  return metadata;
};

/**
 * Generate search-specific Open Graph data
 */
export const getSearchOpenGraphData = (
  dictionary: Dictionary
) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  
  return {
    type: 'website' as const,
    locale: 'ru_RU',
    siteName: seoDict.site.name, // FIXED: was siteName
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
    'seo.site.name', // FIXED: was siteName
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
    // Dublin Core for search
    'DC.relation.isPartOf': getCanonicalURL('/'),
    'DC.relation.hasFormat': 'application/html',
    'DC.type': 'Text.SearchPage',
    
    // Search-specific
    'search:interface': 'enabled',
    'search:language': seoDict.regional.language,
    'search:region': seoDict.regional.region,
    
    // Yandex-specific for search
    'yandex:search': 'true',
    'yandex:verification': process.env.YANDEX_VERIFICATION || '',
  };
};