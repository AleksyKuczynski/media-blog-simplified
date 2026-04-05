// frontend/src/shared/seo/schemas/CollectionPageSchema.tsx

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// COLLECTION SCHEMA TYPES
// ===================================================================

export interface CollectionPageSchemaProps {
  dictionary: Dictionary;
  collectionType: 'rubrics' | 'authors' | 'articles' | 'illustrators';
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
    const collectionLabel = collectionType === 'illustrators' 
      ? dictionary.sections.illustrators?.ourIllustrators
      : dictionary.sections.labels[collectionType as 'rubrics' | 'authors' | 'articles'];

    const collectionTitle = collectionType === 'illustrators'
      ? collectionLabel
      : processTemplate(dictionary.sections.templates.collectionTitle, {
          section: collectionLabel,
    });

    // Get collection description using helper
    const getCollectionDescription = (): string => {
      const sectionData = dictionary.sections[collectionType as keyof typeof dictionary.sections];
      return (sectionData as any)?.collectionPageDescription ||
        processTemplate(dictionary.sections.templates.collectionOf, {
          items: collectionLabel,
        });
    };

    // Generate breadcrumbs
    const lang = currentPath.split('/')[1] || getLang(dictionary);

    const breadcrumbs = [
      { name: dictionary.navigation.labels.home, href: `/${lang}` },
      { name: collectionTitle, href: currentPath },
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
        description: item.description || processTemplate(dictionary.seo.templates.metaDescription, { description: item.name, siteName: seo.site.name }),
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

const getLang = (dictionary: Dictionary) => dictionary.locale.split('-')[0];

export const MinimalCollectionPageSchema: React.FC<Pick<CollectionPageSchemaProps, 'dictionary' | 'collectionType' | 'totalCount'> & { lang?: string }> = ({
  dictionary,
  collectionType,
  totalCount,
  lang
}) => {
  const resolvedLang = lang ?? getLang(dictionary);
  return (
    <CollectionPageSchema
      dictionary={dictionary}
      collectionType={collectionType}
      items={[]}
      totalCount={totalCount}
      currentPath={`/${resolvedLang}/${collectionType}`}
    />
  );
};

export default CollectionPageSchema;