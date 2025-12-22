// frontend/src/shared/seo/schemas/RubricPageSchema.tsx

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// RUBRIC SCHEMA TYPES
// ===================================================================

export interface RubricPageSchemaProps {
  dictionary: Dictionary;
  rubricData: {
    name: string;
    slug: string;
    description?: string;
    articleCount: number;
    articles?: Array<{
      title: string;
      slug: string;
      url: string;
      publishedAt?: string;
    }>;
  };
  currentPath: string;
}

// ===================================================================
// MAIN RUBRIC SCHEMA COMPONENT - REFACTORED
// ===================================================================

/**
 * Generate structured data for rubric pages
 * REFACTORED: Uses SchemaComposer for standardized generation
 */
export const RubricPageSchema: React.FC<RubricPageSchemaProps> = ({
  dictionary,
  rubricData,
  currentPath,
}) => {
  try {
    const { name, slug, description, articleCount, articles = [] } = rubricData;
    const { seo } = dictionary;

    if (!seo?.site) {
      console.error('RubricPageSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = seo.site.url.replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}${currentPath}`;

    // Generate breadcrumbs for rubric page
    const breadcrumbs = [
      {
        name: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        name: dictionary.sections.labels.rubrics,
        href: '/ru/rubrics',
      },
      {
        name: name,
        href: currentPath,
      },
    ];

    // Use SchemaComposer for standardized schema generation
    const composer = new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization('editorial')
      .addWebsite()
      .addBreadcrumbs(breadcrumbs);

    // Add CollectionPage for the rubric
    composer.addCollectionPage({
      name,
      description: description || processTemplate(dictionary.sections.templates.itemsInCollectionDescription, {
        items: dictionary.sections.labels.articles,
        collection: name,
        siteName: seo.site.name,
      }),
      itemCount: articleCount,
      collectionType: 'rubrics',
      items: articles.map(article => ({
        name: article.title,
        url: article.url,
        description: `${article.title} в рубрике ${name}`,
      })),
    });

    // Add ItemList for articles if available
    if (articles.length > 0) {
      composer.addCustomSchema({
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#articlesList`,
        name: processTemplate(dictionary.sections.templates.itemInCollection, {
          items: dictionary.sections.labels.articles,
          collection: name,
        }),
        description: processTemplate(dictionary.sections.templates.itemsInCollectionDescription, {
          items: dictionary.sections.labels.articles,
          collection: name,
          siteName: seo.site.name,
        }),
        numberOfItems: articleCount,
        itemListElement: articles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            '@id': article.url,
            headline: article.title,
            url: article.url,
            articleSection: name,
            ...(article.publishedAt && {
              datePublished: article.publishedAt,
            }),
          },
        })),
      });
    }

    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="normal"
        enableValidation={true}
        enableOptimization={true}
      />
    );

  } catch (error) {
    console.error('RubricPageSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Minimal rubric schema for performance-critical pages
 */
export const MinimalRubricPageSchema: React.FC<Pick<RubricPageSchemaProps, 'dictionary' | 'rubricData'>> = ({
  dictionary,
  rubricData,
}) => {
  return <RubricPageSchema dictionary={dictionary} rubricData={rubricData} currentPath="" />;
};

export default RubricPageSchema;