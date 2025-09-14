// src/main/components/SEO/schemas/RubricPageSchema.tsx
// Structured data for individual rubric pages

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';

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
 * Optimized for Google and Yandex with Russian market focus
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
    wordCount: description ? description.split(' ').length : 50,
    
    // Enhanced properties for search engines
    about: [
      {
        '@type': 'Thing',
        name: name,
        description: description || `Тематическая рубрика ${name}`,
      },
      {
        '@type': 'Topic',
        name: 'Культурные события',
        description: 'Культурные события и современные идеи',
      },
    ],
    
    // Mentions related topics
    mentions: articles?.slice(0, 5).map(article => ({
      '@type': 'Article',
      '@id': `${baseUrl}${article.url}`,
      name: article.title,
      url: `${baseUrl}${article.url}`,
    })) || [],
  };

  // Create ItemList schema for articles in this rubric
  const articlesListSchema = articles && articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#articles`,
    name: `Статьи в рубрике ${name}`,
    description: `Все статьи рубрики ${name} на ${seo.site.name}`,
    url: canonicalUrl,
    numberOfItems: articleCount,
    itemListOrder: 'https://schema.org/ItemListOrderDescending', // Newest first
    
    // Enhanced properties
    inLanguage: 'ru',
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional.targetMarkets,
    },
    
    // Article items
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: article.title,
      url: `${baseUrl}${article.url}`,
      
      item: {
        '@type': 'Article',
        '@id': `${baseUrl}${article.url}`,
        headline: article.title,
        name: article.title,
        url: `${baseUrl}${article.url}`,
        inLanguage: 'ru',
        articleSection: name,
        
        // Publisher reference
        publisher: {
          '@id': `${baseUrl}#organization`,
        },
        
        // Publication date if available
        ...(article.publishedAt && {
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
        }),
      },
    })),
    
    // Provider organization
    provider: {
      '@id': `${baseUrl}#organization`,
    },
  } : null;

  // Create CollectionPage schema for the rubric page itself
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': canonicalUrl,
    name: `Рубрика ${name} — ${seo.site.name}`,
    description: description || `Все статьи в рубрике ${name} на ${seo.site.name}`,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    // Main content reference
    mainEntity: articles && articles.length > 0 ? {
      '@id': `${canonicalUrl}#articles`,
    } : {
      '@id': `${canonicalUrl}#rubric`,
    },
    
    // Publisher and site info
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    
    // Breadcrumb navigation
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dictionary.navigation.labels.home,
          item: {
            '@type': 'WebPage',
            '@id': baseUrl,
            url: baseUrl,
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dictionary.sections.rubrics.allRubrics,
          item: {
            '@type': 'CollectionPage',
            '@id': `${baseUrl}/ru/rubrics`,
            url: `${baseUrl}/ru/rubrics`,
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: name,
          item: {
            '@type': 'CollectionPage',
            '@id': canonicalUrl,
            url: canonicalUrl,
          },
        },
      ],
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
 */
const getRubricKeywords = (slug: string, name: string, dictionary: Dictionary): string => {
  const baseKeywords = dictionary.seo.keywords.general;
  
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