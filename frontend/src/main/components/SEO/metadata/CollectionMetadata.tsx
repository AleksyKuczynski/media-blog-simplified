// src/main/components/SEO/metadata/CollectionMetadata.tsx
// FIXED: Collection metadata with correct dictionary structure and types

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { buildMetadata, createCollectionSEOData } from '../core/MetadataBuilder';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from '@/main/lib/dictionary/helpers';

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
 * FIXED: Generate metadata for collection pages with correct dictionary access
 */
export const generateCollectionMetadata = async (props: CollectionMetadataProps): Promise<Metadata> => {
  const { dictionary, collectionType, items, totalCount, currentPath, featured = false } = props;
  
  // FIXED: Use correct dictionary structure
  let title: string;
  let description: string;
  let keywords: string;

  switch (collectionType) {
    case 'rubrics':
      title = getPageTitle(dictionary, dictionary.sections.rubrics.allRubrics);
      description = dictionary.sections.rubrics.collectionPageDescription;
      keywords = getKeywords(dictionary, 'rubrics', items.map(item => item.name).join(', '));
      break;

    case 'authors':
      title = getPageTitle(dictionary, dictionary.sections.authors.allAuthors);
      description = dictionary.sections.authors.collectionPageDescription;
      keywords = getKeywords(dictionary, 'authors', items.map(item => item.name).join(', '));
      break;

    case 'articles':
      title = getPageTitle(dictionary, dictionary.sections.articles.allArticles);
      description = dictionary.sections.articles.collectionPageDescription;
      keywords = getKeywords(dictionary, 'articles', items.map(item => item.name).join(', '));
      break;

    default:
      title = dictionary.seo.site.name;
      description = dictionary.seo.site.description;
      keywords = dictionary.seo.keywords.base;
  }
  
  // Add count information to description
  const enhancedDescription = `${description} Найдите среди ${totalCount} ${collectionType === 'rubrics' ? 'рубрик' : collectionType === 'authors' ? 'авторов' : 'статей'} то, что вам интересно.`;
  
  // Generate canonical URL
  const canonicalUrl = generateCanonicalUrl(currentPath, dictionary.seo.site.url);
  
  // Generate image URL
  const imageUrl = `${dictionary.seo.site.url}/og-${collectionType}.jpg`;
  
  // Create SEO data structure
  const seoData = createCollectionSEOData(
    title,
    enhancedDescription,
    keywords,
    canonicalUrl,
    collectionType,
    totalCount,
    imageUrl
  );
  
  // Build final metadata using core builder
  const metadata = buildMetadata(seoData);
  
  // FIXED: Add collection-specific enhancements with correct types
  return {
    ...metadata,
    category: collectionType,
    
    // Enhanced Open Graph for collections
    openGraph: {
      ...metadata.openGraph,
      type: 'website', // FIXED: Use correct literal type
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // FIXED: Ensure other field has correct types (no undefined values)
    other: {
      ...metadata.other,
      'collection:type': collectionType,
      'collection:itemCount': totalCount.toString(),
      'collection:featured': featured.toString(),
      'DC.type': 'Text.Collection',
      'DC.subject': collectionType === 'rubrics' ? 'рубрики' : collectionType === 'authors' ? 'авторы' : 'статьи',
    },
  };
};

/**
 * Validation helper for collection metadata
 */
export const validateCollectionMetadata = (metadata: Metadata, props: CollectionMetadataProps): {
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
  
  // SEO length validation
  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length > 60) {
    warnings.push(`Title too long: ${metadata.title.length} chars (recommended: ≤60)`);
  }
  
  if (metadata.description && metadata.description.length > 160) {
    warnings.push(`Description too long: ${metadata.description.length} chars (recommended: ≤160)`);
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export default generateCollectionMetadata;