// src/main/components/SEO/core/MetadataBuilder.tsx
// FIXED: Correct variable order and Next.js Metadata compatibility

import { Metadata } from 'next';
import { 
  SEOData, 
  ArticleSEOData, 
  WebsiteSEOData, 
  CollectionSEOData,
  BaseSEOData 
} from './types';

// ===================================================================
// HELPER FUNCTIONS - DECLARED FIRST
// ===================================================================

/**
 * Helper function to validate URLs
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * FIXED: Filter out undefined values with proper typing for Next.js Metadata
 */
const filterDefinedValues = (obj: Record<string, any>): Record<string, string | number | (string | number)[]> => {
  const filtered: Record<string, string | number | (string | number)[]> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      // Ensure value matches Next.js Metadata expected types
      if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
        filtered[key] = value;
      } else if (typeof value === 'boolean') {
        filtered[key] = value.toString();
      } else {
        filtered[key] = String(value);
      }
    }
  }
  
  return filtered;
};

/**
 * FIXED: Validate SEO data before building metadata (DECLARED BEFORE USE)
 */
export const validateSEOData = (seoData: SEOData): boolean => {
  if (!seoData.title || seoData.title.trim().length === 0) {
    console.warn('SEO: Title is required');
    return false;
  }
  
  if (!seoData.description || seoData.description.trim().length === 0) {
    console.warn('SEO: Description is required');
    return false;
  }
  
  if (!seoData.canonicalUrl || !isValidUrl(seoData.canonicalUrl)) {
    console.warn('SEO: Valid canonical URL is required');
    return false;
  }

  // Length recommendations
  if (seoData.title.length > 60) {
    console.warn(`SEO: Title length is ${seoData.title.length} characters (recommended: ≤60)`);
  }
  
  if (seoData.description.length > 160) {
    console.warn(`SEO: Description length is ${seoData.description.length} characters (recommended: ≤160)`);
  }

  return true;
};

// ===================================================================
// MAIN BUILDER FUNCTIONS
// ===================================================================

/**
 * FIXED: Core metadata building function with proper Next.js types
 */
export const buildMetadata = (seoData: SEOData): Metadata => {
  const baseMetadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    
    alternates: {
      canonical: seoData.canonicalUrl,
      languages: {
        'ru': seoData.canonicalUrl,
        'ru-RU': seoData.canonicalUrl,
      },
    },

    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonicalUrl,
      siteName: seoData.siteName || 'EventForMe',
      locale: seoData.locale || 'ru_RU',
      type: seoData.type === 'article' ? 'article' : 'website',
      images: seoData.imageUrl ? [
        {
          url: seoData.imageUrl,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ] : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.imageUrl ? [seoData.imageUrl] : [],
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

  // FIXED: Properly handle the 'other' field with correct filtering
  const baseOtherMetadata = {
    'DC.language': 'ru',
    'DC.coverage': 'Russia',
    'geo.region': 'RU',
    'geo.placename': 'Russia',
  };

  // Article-specific metadata
  if (seoData.type === 'article') {
    const articleData = seoData as ArticleSEOData;
    
    const articleMeta = {
      'article:author': articleData.author,
      'article:section': articleData.section,
      'article:published_time': articleData.publishedTime,
      'article:modified_time': articleData.modifiedTime,
      'article:tag': articleData.tags.join(', '),
      'DC.type': 'Text.Article',
    };

    baseMetadata.other = filterDefinedValues({
      ...baseOtherMetadata,
      ...articleMeta,
    });
  }
  // Collection-specific metadata  
  else if (seoData.type === 'collection') {
    const collectionData = seoData as CollectionSEOData;
    
    const collectionMeta = {
      'DC.type': 'Text.Collection',
      'collection:type': collectionData.collectionType,
      'collection:itemCount': collectionData.itemCount.toString(),
      'collection:language': 'ru',
    };

    baseMetadata.other = filterDefinedValues({
      ...baseOtherMetadata,
      ...collectionMeta,
    });
  }
  // Website-specific metadata
  else {
    baseMetadata.other = filterDefinedValues(baseOtherMetadata);
  }

  return baseMetadata;
};

// ===================================================================
// FACTORY FUNCTIONS
// ===================================================================

/**
 * Create SEO data for website pages
 */
export const createWebsiteSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  imageUrl?: string
): WebsiteSEOData => ({
  type: 'website',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale: 'ru_RU',
  siteName: 'EventForMe',
});

/**
 * Create SEO data for article pages
 */
export const createArticleSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  publishedTime: string,
  modifiedTime: string,
  author: string,
  section: string,
  tags: readonly string[],
  imageUrl?: string
): ArticleSEOData => ({
  type: 'article',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale: 'ru_RU',
  siteName: 'EventForMe',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
});

/**
 * Create SEO data for collection pages
 */
export const createCollectionSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  collectionType: string,
  itemCount: number,
  imageUrl?: string
): CollectionSEOData => ({
  type: 'collection',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale: 'ru_RU',
  siteName: 'EventForMe',
  collectionType,
  itemCount,
});

// ===================================================================
// PUBLIC API
// ===================================================================

/**
 * MetadataBuilder - Core component for generating Next.js Metadata
 */
export const MetadataBuilder = {
  build: buildMetadata,
  validate: validateSEOData,
  generate: (seoData: SEOData): Metadata => {
    if (!validateSEOData(seoData)) {
      console.warn('SEO data validation failed, proceeding with available data');
    }
    return buildMetadata(seoData);
  },
};

/**
 * Enhanced metadata generation with validation
 */
export const generateMetadata = (seoData: SEOData): Metadata => {
  return MetadataBuilder.generate(seoData);
};

export default MetadataBuilder;