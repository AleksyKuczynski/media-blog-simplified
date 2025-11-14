// src/main/components/SEO/metadata/CollectionMetadata.tsx
// Collection metadata generation following established patterns

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { 
  buildMetadata, 
  createCollectionSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';

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
 * Generate comprehensive metadata for collection pages following established patterns
 */
export const generateCollectionMetadata = async (
  props: CollectionMetadataProps
): Promise<Metadata> => {
  const { dictionary, collectionType, items, totalCount, currentPath, featured = false } = props;
  
  // Generate title using dictionary templates and established pattern
  const sectionLabel = dictionary.sections.labels[collectionType];
  const collectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, {
    section: sectionLabel,
  });
  
  const finalTitle = processTemplate(dictionary.seo.templates.collectionPage, {
    collection: collectionTitle,
    siteName: dictionary.seo.site.name,
  });

  // Generate description using dictionary templates
  const baseDescription = dictionary.sections[collectionType].collectionPageDescription;
  const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
    count: totalCount.toString(),
    countLabel: dictionary.common.count[collectionType],
  });
  
  const metaDescription = `${baseDescription} ${countInfo}`;
  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  // Generate keywords using established pattern
  const itemNames = items.slice(0, 5).map(item => item.name);
  const customKeywords = itemNames.length > 0 ? itemNames.join(', ') : '';
  
  const keywords = [
    customKeywords,
    dictionary.seo.keywords[collectionType],
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  // Generate canonical URL using established pattern
  const canonicalUrl = `${dictionary.seo.site.url}${currentPath}`;

  // Generate Open Graph image URL
  const finalImageUrl = `${dictionary.seo.site.url}/og-${collectionType}-collection.jpg`;

  // Create SEO data using established pattern
  const seoData = createCollectionSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    collectionType,
    totalCount,
    finalImageUrl
  );

  // Validate SEO data
  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for collection:', collectionType);
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('Collection SEO content validation warnings:', contentValidation.warnings);
  }

  return buildMetadata(seoData);
};

/**
 * Generate metadata for collection not found cases
 */
export const generateCollectionNotFoundMetadata = (
  dictionary: Dictionary,
  collectionType: 'rubrics' | 'authors' | 'articles'
): Metadata => {
  const notFoundMeta = dictionary.metadata.notFound.page;
  
  const collectionName = dictionary.sections.labels[collectionType];
  const title = `${collectionName} не найдены`;
  
  return {
    title: processTemplate(dictionary.seo.templates.pageTitle, {
      title,
      siteName: dictionary.seo.site.name
    }),
    description: notFoundMeta.description,
    robots: {
      index: false,
      follow: true,
    },
  };
};

/**
 * Validation helper for collection metadata following established pattern
 */
export const validateCollectionMetadata = (
  metadata: Metadata,
  props: CollectionMetadataProps
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const { collectionType, totalCount, items } = props;
  const warnings: string[] = [];
  const errors: string[] = [];

  // Basic validation
  if (!metadata.title) errors.push('Collection title is required');
  if (!metadata.description) errors.push('Collection description is required');

  // Collection-specific validation
  if (totalCount < 0) errors.push('Total count cannot be negative');
  if (!['rubrics', 'authors', 'articles'].includes(collectionType)) {
    errors.push('Invalid collection type');
  }
  if (items.some(item => !item.name || !item.slug)) {
    errors.push('All collection items must have name and slug');
  }

  // Content validation using established pattern
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