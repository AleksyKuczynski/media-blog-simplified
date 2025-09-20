// src/main/components/SEO/schemas/RubricPageSchema.tsx
// FIXED: Updated to work with new dictionary structure and imports

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateBreadcrumbs } from '@/main/lib/dictionary/helpers/seo';

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

/**
 * Generate comprehensive structured data for rubric pages
 * FIXED: Uses new dictionary structure and helper functions
 */
export const RubricPageSchema: React.FC<RubricPageSchemaProps> = ({
  dictionary,
  rubricData,
  currentPath,
}) => {
  const { seo } = dictionary;
  const { name, slug, description, articleCount, articles } = rubricData;
  const baseUrl = seo.site.url;
  const canonicalUrl = `${baseUrl}${currentPath}`;

  // Generate breadcrumbs using helper function
  const breadcrumbs = generateBreadcrumbs(dictionary, ['rubrics', slug]);

  // Create Article schema for the rubric as a content section
  const rubricArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#rubric`,
    headline: `Рубрика ${name} — ${seo.site.name}`,
    name: name,
    description: description || `Все статьи в рубрике ${name} на ${seo.site.name}`,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    // Author and publisher
    author: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: seo.site.name,
      url: baseUrl,
    },
    
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: seo.site.name,
      url: baseUrl,
      description: seo.site.organizationDescription,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 200,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: seo.site.contactEmail,
        contactType: 'customer support',
        availableLanguage: ['ru', 'Russian'],
      },
      sameAs: seo.site.socialProfiles,
    },
    
    // Content classification
    articleSection: name,
    genre: getRubricGenre(slug),
    keywords: getRubricKeywords(slug, name, dictionary),
    
    // Audience targeting
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional.targetMarkets,
      audienceType: 'Русскоязычная аудитория',
    },
    
    // Content metrics
    wordCount: description ? description.length : 100,
    
    // Publication info
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  // Create CollectionPage schema for rubric as a collection
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    name: `Рубрика ${name}`,
    description: description || `Коллекция статей в рубрике ${name}`,
    url: canonicalUrl,
    inLanguage: 'ru',
    numberOfItems: articleCount,
    
    // Main entity - list of articles
    mainEntity: articles && articles.length > 0 ? {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#articles`,
      name: `Статьи в рубрике ${name}`,
      numberOfItems: articleCount,
      itemListElement: articles.slice(0, 10).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          '@id': article.url,
          headline: article.title,
          url: article.url,
          ...(article.publishedAt && {
            datePublished: article.publishedAt,
          }),
        },
      })),
    } : {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#rubric`,
      name: `Рубрика ${name}`,
      numberOfItems: articleCount,
    },
    
    // Publisher and site info
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    
    // Breadcrumb navigation
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}${crumb.href}`,
          url: `${baseUrl}${crumb.href}`,
        },
      })),
    },
    
    // Enhanced properties
    genre: getRubricGenre(slug),
    keywords: getRubricKeywords(slug, name, dictionary),
    
    // Audience and geographic targeting
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional.targetMarkets,
      audienceType: 'Русскоязычная аудитория',
    },
    
    // Accessibility and content features
    accessibilityFeature: ['alternativeText', 'longDescription', 'structuredNavigation'],
    accessibilityHazard: 'none',
    contentRating: 'general',
  };

  // Articles list schema (if articles provided)
  const articlesListSchema = articles && articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#articlesList`,
    name: `Список статей в рубрике ${name}`,
    description: `Все статьи рубрики ${name} на ${seo.site.name}`,
    numberOfItems: articleCount,
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        '@id': article.url,
        headline: article.title,
        url: article.url,
        inLanguage: 'ru',
        articleSection: name,
        ...(article.publishedAt && {
          datePublished: article.publishedAt,
        }),
        publisher: {
          '@id': `${baseUrl}#organization`,
        },
      },
    })),
  } : null;

  // Combine all schemas
  const schemas = [
    collectionPageSchema,
    rubricArticleSchema,
    ...(articlesListSchema ? [articlesListSchema] : []),
  ];

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 2),
      }}
    />
  );
};

// Helper functions

/**
 * Get genre classification for different rubric types
 */
const getRubricGenre = (slug: string): string => {
  const genreMap: Record<string, string> = {
    'music': 'music',
    'muzyka': 'music',
    'culture': 'culture', 
    'kultura': 'culture',
    'events': 'events',
    'sobytiya': 'events',
    'mystic': 'lifestyle',
    'mistika': 'lifestyle',
    'ideas': 'technology',
    'idei': 'technology',
  };
  
  return genreMap[slug] || 'general';
};

/**
 * Generate SEO keywords for specific rubric types
 * FIXED: Uses 'base' instead of 'general' to match new dictionary structure
 */
const getRubricKeywords = (slug: string, name: string, dictionary: Dictionary): string => {
  const baseKeywords = dictionary.seo.keywords.base; // FIXED: Changed from 'general' to 'base'
  
  const specificKeywords: Record<string, string> = {
    'music': dictionary.seo.keywords.music,
    'muzyka': dictionary.seo.keywords.music,
    'culture': dictionary.seo.keywords.culture,
    'kultura': dictionary.seo.keywords.culture,
    'events': dictionary.seo.keywords.events,
    'sobytiya': dictionary.seo.keywords.events,
    'mystic': dictionary.seo.keywords.mystic,
    'mistika': dictionary.seo.keywords.mystic,
  };
  
  const rubricSpecific = specificKeywords[slug] || dictionary.seo.keywords.rubrics;
  return `${name}, ${rubricSpecific}, ${baseKeywords}`;
};

export default RubricPageSchema;