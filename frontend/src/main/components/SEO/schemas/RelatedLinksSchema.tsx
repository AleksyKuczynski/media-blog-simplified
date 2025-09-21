// src/main/components/Article/RelatedLinksSchema.tsx
// Separate schema component for RelatedLinks SEO enhancement

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

interface RelatedLinksSchemaProps {
  dictionary: Dictionary;
  rubric: {
    slug: string;
    name: string;
  };
  categories?: Array<{
    slug: string;
    name: string;
  }>;
  currentArticleUrl: string;
}

/**
 * Structured data schema for RelatedLinks component
 * Uses dictionary templates for consistent schema generation
 * Optimized for Google and Yandex SEO
 */
export default function RelatedLinksSchema({
  dictionary,
  rubric,
  categories = [],
  currentArticleUrl
}: RelatedLinksSchemaProps): React.ReactElement {
  const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
  
  // Generate breadcrumb list schema
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${currentArticleUrl}#related-breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.labels.home,
        item: `${baseUrl}/ru`,
      },
      {
        '@type': 'ListItem', 
        position: 2,
        name: rubric.name,
        item: `${baseUrl}/ru/${rubric.slug}`,
      },
    ],
  };

  // Generate collection page schema using dictionary templates
  const articlesCollectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, { 
    section: dictionary.sections.labels.articles 
  });

  const collectionDescription = processTemplate(dictionary.sections.templates.itemInCollection, {
    item: articlesCollectionTitle,
    collection: rubric.name
  });

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/ru/${rubric.slug}#collection`,
    name: rubric.name,
    description: collectionDescription,
    url: `${baseUrl}/ru/${rubric.slug}`,
    inLanguage: 'ru',
    
    // Enhanced metadata for Russian market
    audience: {
      '@type': 'Audience',
      geographicArea: {
        '@type': 'Country',
        name: 'Россия',
      },
    },
    
    // Site relationship
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: dictionary.seo.site.name,
      url: baseUrl,
    },
    
    // Content organization
    about: {
      '@type': 'Thing',
      name: rubric.name,
      description: collectionDescription,
    },
  };

  // Category schemas if available
  const categorySchemas = categories.map((category, index) => ({
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${baseUrl}/ru/categories/${category.slug}#term`,
    name: category.name,
    url: `${baseUrl}/ru/categories/${category.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: dictionary.sections.rubrics.readMoreAbout,
      url: `${baseUrl}/ru/categories`,
    },
  }));

  // Combine all schemas
  const schemas = [
    breadcrumbList,
    collectionSchema,
    ...categorySchemas,
  ];

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 0),
      }}
    />
  );
}