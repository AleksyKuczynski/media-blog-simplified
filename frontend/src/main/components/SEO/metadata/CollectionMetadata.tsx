// src/main/components/SEO/metadata/CollectionMetadata.tsx
// Clean collection metadata using new dictionary structure directly

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateCollectionSEO, validateSEOContent } from '@/main/lib/dictionary/helpers/seo';

export interface CollectionMetadataProps {
  dictionary: Dictionary;
  collectionType: 'rubrics' | 'authors' | 'articles';
  items: Array<{
    name: string;
    slug: string;
    description?: string;
  }>;
  totalCount: number;
  currentPath: string;
  featured?: boolean;
}

/**
 * Generate clean metadata for collection pages using new dictionary structure
 */
export const generateCollectionMetadata = async (
  props: CollectionMetadataProps
): Promise<Metadata> => {
  const { dictionary, collectionType, items, totalCount, currentPath, featured = false } = props;
  
  // Extract item names for keywords
  const itemNames = items.slice(0, 5).map(item => item.name);
  
  // Generate SEO data using dictionary helpers
  const seoData = generateCollectionSEO(
    dictionary,
    collectionType,
    totalCount,
    currentPath,
    itemNames
  );
  
  // Validate SEO content
  const validation = validateSEOContent({
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
  });
  
  if (!validation.isValid) {
    console.warn('Collection SEO validation warnings:', validation.warnings);
  }
  
  // Build metadata object with proper types
  const metadata: Metadata = {
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
      siteName: dictionary.seo.site.name,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: seoData.imageUrl,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: [seoData.imageUrl],
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

    // Additional metadata with proper types
    other: {
      'collection:type': collectionType,
      'collection:itemCount': totalCount.toString(),
      'collection:featured': featured.toString(),
      'DC.type': 'Text.Collection',
      'DC.language': 'ru',
      'DC.coverage': dictionary.seo.regional.region,
      'geo.region': dictionary.seo.regional.region,
      'geo.placename': dictionary.seo.regional.targetMarkets.join(', '),
    },
  };

  return metadata;
};

/**
 * Validation helper for collection metadata
 */
export const validateCollectionMetadata = (
  metadata: Metadata, 
  props: CollectionMetadataProps
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Basic validation
  if (!metadata.title) errors.push('Collection title is required');
  if (!metadata.description) errors.push('Collection description is required');
  
  // Collection-specific validation
  if (props.totalCount < 0) errors.push('Total count cannot be negative');
  if (props.items.length === 0 && props.totalCount > 0) {
    warnings.push('Item count mismatch: totalCount > 0 but no items provided');
  }
  
  // Content validation
  const contentValidation = validateSEOContent({
    title: metadata.title as string,
    description: metadata.description as string,
    keywords: metadata.keywords as string,
  });
  
  warnings.push(...contentValidation.warnings);
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export default generateCollectionMetadata;