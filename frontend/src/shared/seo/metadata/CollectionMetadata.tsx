// frontend/src/shared/seo/metadata/CollectionMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { validateSEOContent } from '@/config/i18n/helpers/validation';
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

export const generateCollectionMetadata = async (
  props: CollectionMetadataProps
): Promise<Metadata> => {
  const { dictionary, collectionType, items, totalCount, currentPath, featured = false } = props;
  
  const sectionLabel = dictionary.sections.labels[collectionType];
  const collectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, {
    section: sectionLabel,
  });
  
  const finalTitle = processTemplate(dictionary.seo.templates.collectionPage, {
    collection: collectionTitle,
    siteName: dictionary.seo.site.name,
  });

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

  const itemNames = items.slice(0, 5).map(item => item.name);
  const customKeywords = itemNames.length > 0 ? itemNames.join(', ') : '';
  
  const keywords = [
    customKeywords,
    dictionary.seo.keywords[collectionType],
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  const canonicalUrl = `${dictionary.seo.site.url}${currentPath}`;
  const finalImageUrl = `${dictionary.seo.site.url}/og-${collectionType}-collection.jpg`;

  const seoData = createCollectionSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    dictionary.locale,
    collectionType,
    totalCount,
    finalImageUrl
  );

  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for collection:', collectionType);
  }

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

export const generateCollectionNotFoundMetadata = (
  dictionary: Dictionary,
  collectionType: 'rubrics' | 'authors' | 'articles'
): Metadata => {
  const notFoundMeta = dictionary.metadata.notFound.page;
  
  return {
    title: processTemplate(dictionary.seo.templates.pageTitle, {
      title: notFoundMeta.title,
      siteName: dictionary.seo.site.name
    }),
    description: notFoundMeta.description,
    robots: {
      index: false,
      follow: true,
    },
  };
};

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

  if (!metadata.title) errors.push('Collection title is required');
  if (!metadata.description) errors.push('Collection description is required');

  if (totalCount < 0) errors.push('Total count cannot be negative');
  if (items.length === 0 && totalCount > 0) {
    warnings.push('No items provided but totalCount > 0');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export default generateCollectionMetadata;