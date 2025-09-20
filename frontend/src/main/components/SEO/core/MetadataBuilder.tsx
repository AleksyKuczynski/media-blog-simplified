// src/main/components/SEO/core/MetadataBuilder.tsx
// FIXED: Only the Next.js Metadata type issue, nothing else

import { Metadata } from 'next';
import { 
  SEOData, 
  ArticleSEOData, 
  WebsiteSEOData, 
  CollectionSEOData,
} from './types';

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
 * FIXED: Filter undefined values and ensure proper Next.js Metadata types
 */
const filterDefinedValues = (obj: Record<string, any>): Record<string, string | number | (string | number)[]> => {
  const result: Record<string, string | number | (string | number)[]> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string' || typeof value === 'number') {
        result[key] = value;
      } else if (Array.isArray(value)) {
        result[key] = value.filter(v => v !== undefined && v !== null);
      } else {
        result[key] = String(value);
      }
    }
  }
  
  return result;
};

/**
 * Validate SEO data before building metadata
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

  return true;
};

/**
 * Core metadata building function
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

  // FIXED: Build other metadata properly to avoid Next.js type issues
  const otherMetadata: Record<string, string | number | (string | number)[]> = {
    'DC.language': 'ru',
    'DC.coverage': 'Russia',
    'geo.region': 'RU',
    'geo.placename': 'Russia',
  };

  // Article-specific metadata
  if (seoData.type === 'article') {
    const articleData = seoData as ArticleSEOData;
    
    otherMetadata['article:author'] = articleData.author;
    otherMetadata['article:section'] = articleData.section;
    otherMetadata['article:published_time'] = articleData.publishedTime;
    otherMetadata['article:modified_time'] = articleData.modifiedTime;
    otherMetadata['article:tag'] = articleData.tags.join(', ');
    otherMetadata['DC.type'] = 'Text.Article';
  }
  // Collection-specific metadata  
  else if (seoData.type === 'collection') {
    const collectionData = seoData as CollectionSEOData;
    
    otherMetadata['DC.type'] = 'Text.Collection';
    otherMetadata['collection:type'] = collectionData.collectionType;
    otherMetadata['collection:itemCount'] = collectionData.itemCount.toString();
    otherMetadata['collection:language'] = 'ru';
  }

  // FIXED: Assign filtered metadata to avoid type issues
  baseMetadata.other = filterDefinedValues(otherMetadata);

  return baseMetadata;
};

// Factory functions
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

// Public API
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

export const generateMetadata = (seoData: SEOData): Metadata => {
  return MetadataBuilder.generate(seoData);
};

export default MetadataBuilder;