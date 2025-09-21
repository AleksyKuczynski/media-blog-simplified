// src/main/components/SEO/schemas/RubricPageSchema.tsx
// FIXED: Compatible with existing dictionary.ts structure

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
 * FIXED: Uses only existing dictionary structure
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

  // Create CollectionPage schema for the rubric
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    name: name,
    description: description || `Все статьи в рубрике ${name} на ${seo.site.name}`,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    // Main entity reference
    mainEntity: {
      '@type': 'ItemList',
      name: `Статьи в рубрике ${name}`,
      numberOfItems: articleCount,
      description: `Коллекция статей рубрики ${name}`,
    },
    
    // Publisher information
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
    genre: getRubricGenre(slug),
    keywords: getRubricKeywords(slug, name, dictionary),
    
    // Audience targeting
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional.targetMarkets,
      audienceType: 'Русскоязычная аудитория',
    },
    
    // Site relationship
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seo.site.name,
      url: baseUrl,
    },
    
    // Breadcrumb reference
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.href ? `${baseUrl}${crumb.href}` : canonicalUrl,
      })),
    },
  };

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
    
    // Publishing specifics
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
    },
  };

  // Articles List schema if articles are available
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

// ===================================================================
// HELPER FUNCTIONS - FIXED to use existing dictionary
// ===================================================================

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
 * FIXED: Uses only existing dictionary.seo.keywords structure
 */
const getRubricKeywords = (slug: string, name: string, dictionary: Dictionary): string => {
  // Use only existing keywords from dictionary
  const baseKeywords = dictionary.seo.keywords.base;
  const rubricsKeywords = dictionary.seo.keywords.rubrics;
  
  // Build keywords using only available dictionary entries
  return `${name}, ${rubricsKeywords}, ${baseKeywords}`;
};

/**
 * Minimal rubric schema for performance-critical pages
 */
export const MinimalRubricPageSchema: React.FC<Pick<RubricPageSchemaProps, 'dictionary' | 'rubricData'>> = ({
  dictionary,
  rubricData,
}) => {
  const { seo } = dictionary;
  const { name, slug } = rubricData;
  const baseUrl = seo.site.url;
  const canonicalUrl = `${baseUrl}/ru/${slug}`;

  const minimalSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    url: canonicalUrl,
    inLanguage: 'ru',
    publisher: {
      '@type': 'Organization',
      name: seo.site.name,
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(minimalSchema, null, 0),
      }}
    />
  );
};

export default RubricPageSchema;