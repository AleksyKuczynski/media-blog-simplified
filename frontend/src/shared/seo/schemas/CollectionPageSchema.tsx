// src/main/components/SEO/schemas/CollectionPageSchema.tsx
// REFACTORED: Using SchemaComposer - Reduced from 120+ to 35 lines

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// COLLECTION SCHEMA TYPES
// ===================================================================

export interface CollectionPageSchemaProps {
  dictionary: Dictionary;
  collectionType: 'rubrics' | 'authors' | 'articles';
  items: Array<{
    name: string;
    slug: string;
    url: string;
    description?: string;
    articleCount?: number;
  }>;
  totalCount: number;
  currentPath: string;
  featured?: boolean;
}

// ===================================================================
// MAIN COLLECTION SCHEMA COMPONENT - REFACTORED
// ===================================================================

/**
 * Generate structured data for collection pages
 * REFACTORED: Uses SchemaComposer for standardized generation
 */
export const CollectionPageSchema: React.FC<CollectionPageSchemaProps> = ({
  dictionary,
  collectionType,
  items,
  totalCount,
  currentPath,
  featured = false,
}) => {
  try {
    const { seo } = dictionary;

    if (!seo?.site || !dictionary.sections?.labels) {
      console.error('CollectionPageSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = seo.site.url.replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}${currentPath}`;

    // Get collection data from dictionary
    const collectionLabel = dictionary.sections.labels[collectionType];
    const collectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, {
      section: collectionLabel,
    });

    // Get collection description using helper
    const getCollectionDescription = (): string => {
      const sectionData = dictionary.sections[collectionType];
      return sectionData?.collectionPageDescription || 
             processTemplate(dictionary.sections.templates.collectionOf, {
               items: collectionLabel,
             }) + ` на ${seo.site.name}`;
    };

    // Generate breadcrumbs
    const breadcrumbs = [
      {
        name: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        name: collectionTitle,
        href: currentPath,
      },
    ];

    // Use SchemaComposer for standardized schema generation
    const composer = new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization('editorial')
      .addWebsite()
      .addBreadcrumbs(breadcrumbs);

    // Add CollectionPage schema using the built-in method
    composer.addCollectionPage({
      name: collectionTitle,
      description: getCollectionDescription(),
      itemCount: totalCount,
      collectionType,
      items: items.slice(0, 10).map(item => ({
        name: item.name,
        url: item.url,
        description: item.description || `${item.name} на ${seo.site.name}`,
      })),
    });

    // Add featured flag if applicable
    if (featured) {
      composer.addCustomSchema({
        '@type': 'PropertyValue',
        '@id': `${canonicalUrl}#featured`,
        name: 'featured',
        value: true,
      });
    }

    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="high"
        enableValidation={true}
        enableOptimization={true}
      />
    );

  } catch (error) {
    console.error('CollectionPageSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Minimal collection schema for performance-critical pages
 */
export const MinimalCollectionPageSchema: React.FC<Pick<CollectionPageSchemaProps, 'dictionary' | 'collectionType' | 'totalCount'>> = ({
  dictionary,
  collectionType,
  totalCount,
}) => {
  return (
    <CollectionPageSchema
      dictionary={dictionary}
      collectionType={collectionType}
      items={[]}
      totalCount={totalCount}
      currentPath=""
    />
  );
};

export default CollectionPageSchema;