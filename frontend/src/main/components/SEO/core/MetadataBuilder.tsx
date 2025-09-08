// src/main/components/SEO/core/MetadataBuilder.tsx
// Pure metadata logic for Next.js Metadata generation

import { Metadata } from 'next';
import { 
  SEOData, 
  MetadataBuilderProps, 
  MetadataResult,
  SEOContext 
} from './types';

// ===================================================================
// METADATA BUILDER - Pure functions for metadata generation
// ===================================================================

/**
 * Default SEO context for the site
 */
const DEFAULT_SEO_CONTEXT: SEOContext = {
  baseUrl: 'https://event4me.eu',
  defaultImageUrl: 'https://event4me.eu/og-default.jpg',
  siteName: 'EventForMe',
  locale: 'ru_RU',
  region: 'RU',
};

/**
 * Build Next.js Metadata from SEO data
 */
export const buildMetadata = (
  seoData: SEOData,
  context: Partial<SEOContext> = {},
  additionalMeta: Record<string, string> = {}
): MetadataResult => {
  const ctx = { ...DEFAULT_SEO_CONTEXT, ...context };
  
  const baseMetadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    
    // Canonical URL
    alternates: {
      canonical: seoData.canonicalUrl,
      languages: {
        'ru': seoData.canonicalUrl,
        'x-default': seoData.canonicalUrl,
      },
    },

    // Open Graph base
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonicalUrl,
      siteName: seoData.siteName,
      locale: seoData.locale,
      type: seoData.type === 'article' ? 'article' : 'website',
      images: [
        {
          url: seoData.imageUrl || ctx.defaultImageUrl,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: [seoData.imageUrl || ctx.defaultImageUrl],
    },

    // Russian market specific meta tags
    other: {
      // Language and region
      'content-language': 'ru',
      'geo.region': ctx.region,
      'geo.placename': 'Russia',
      
      // SEO directives
      'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'googlebot': 'index, follow',
      
      // Yandex optimization
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
      
      // Dublin Core metadata
      'DC.title': seoData.title,
      'DC.description': seoData.description,
      'DC.language': 'ru',
      'DC.creator': seoData.siteName,
      'DC.publisher': seoData.siteName,
      'DC.identifier': seoData.canonicalUrl,
      'DC.coverage': 'Russia',
      'DC.rights': 'Copyright EventForMe',
      
      // Additional custom meta
      ...additionalMeta,
    },
  };

  // Article-specific metadata
  if (seoData.type === 'article') {
    const articleData = seoData;
    
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: articleData.publishedTime,
      modifiedTime: articleData.modifiedTime,
      section: articleData.section,
      tags: articleData.tags as string[],
    };

    baseMetadata.other = {
      ...baseMetadata.other,
      'article:author': articleData.author,
      'article:section': articleData.section,
      'article:published_time': articleData.publishedTime,
      'article:modified_time': articleData.modifiedTime,
      'article:tag': articleData.tags.join(', '),
      'DC.type': 'Text.Article',
    };
  }

  // Collection-specific metadata
  if (seoData.type === 'collection') {
    const collectionData = seoData;
    
    baseMetadata.other = {
      ...baseMetadata.other,
      'DC.type': 'Text.Collection',
      'collection:type': collectionData.collectionType,
      'collection:itemCount': collectionData.itemCount.toString(),
      'collection:language': 'ru',
    };
  }

  return baseMetadata;
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

  // Length recommendations
  if (seoData.title.length > 60) {
    console.warn(`SEO: Title length is ${seoData.title.length} characters (recommended: ≤60)`);
  }
  
  if (seoData.description.length > 160) {
    console.warn(`SEO: Description length is ${seoData.description.length} characters (recommended: ≤160)`);
  }

  return true;
};

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
 * Create SEO data for different page types
 */
export const createWebsiteSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  imageUrl?: string
): SEOData => ({
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
): SEOData => ({
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
  itemCount: number,
  collectionType: string,
  imageUrl?: string
): SEOData => ({
  type: 'collection',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale: 'ru_RU',
  siteName: 'EventForMe',
  itemCount,
  collectionType,
});

/**
 * React component wrapper for metadata building
 */
export const MetadataBuilder = ({ seoData, additionalMeta = {} }: MetadataBuilderProps) => {
  // This is a utility component - it doesn't render anything
  // Metadata is handled by Next.js generateMetadata functions
  return null;
};

// Export the main building function for use in generateMetadata
export { buildMetadata as generateMetadata };