// src/main/components/SEO/schemas/CollectionPageSchema.tsx
// FIXED: Structured data with correct dictionary access and type safety

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';

export interface CollectionPageSchemaProps {
  dictionary: Dictionary;
  collectionType: 'rubrics' | 'authors' | 'articles';
  items: Array<{
    name: string;
    slug: string;
    description?: string;
    url?: string;
    articleCount?: number;
  }>;
  totalCount: number;
  currentPath: string;
  featured?: boolean;
}

/**
 * FIXED: Generate comprehensive structured data with safe dictionary access
 */
export const CollectionPageSchema: React.FC<CollectionPageSchemaProps> = ({
  dictionary,
  collectionType,
  items,
  totalCount,
  currentPath,
  featured = false,
}) => {
  const { seo } = dictionary;
  const baseUrl = seo.site.url;
  const canonicalUrl = `${baseUrl}${currentPath}`;
  
  // FIXED: Safe collection name access with proper typing
  const getCollectionName = (type: typeof collectionType): string => {
    switch (type) {
      case 'rubrics':
        return dictionary.sections.rubrics.allRubrics;
      case 'authors':
        return dictionary.sections.authors.allAuthors;
      case 'articles':
        return dictionary.sections.articles.allArticles;
      default:
        return 'Коллекция';
    }
  };
  
  // FIXED: Safe collection description access
  const getCollectionDescription = (type: typeof collectionType): string => {
    switch (type) {
      case 'rubrics':
        return dictionary.sections.rubrics.collectionPageDescription;
      case 'authors':
        return dictionary.sections.authors.collectionPageDescription;
      case 'articles':
        return dictionary.sections.articles.collectionPageDescription;
      default:
        return `Все ${type} на ${seo.site.name}`;
    }
  };

  const collectionName = getCollectionName(collectionType);
  const collectionDescription = getCollectionDescription(collectionType);

  // Main CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    name: `${collectionName} — ${seo.site.name}`,
    description: collectionDescription,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    // Main entity - the collection itself
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
      name: collectionName,
      description: collectionDescription,
      numberOfItems: totalCount,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      
      // Generate list items with safe access
      itemListElement: items.map((item, index) => {
        const itemUrl = item.url || `${baseUrl}/ru/${collectionType === 'rubrics' ? item.slug : `${collectionType.slice(0, -1)}/${item.slug}`}`;
        
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          description: item.description,
          url: itemUrl,
          item: {
            '@type': getItemType(collectionType),
            '@id': `${itemUrl}#${collectionType.slice(0, -1)}`,
            name: item.name,
            description: item.description,
            url: itemUrl,
            ...(item.articleCount && { 
              mainEntityOfPage: {
                '@type': 'WebPage',
                url: itemUrl,
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: Math.min(5, Math.max(3, 3 + (item.articleCount / 10))),
                reviewCount: item.articleCount,
              }
            }),
          },
        };
      }),
    },

    // Publisher info
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
    
    // Breadcrumb navigation with safe access
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dictionary.navigation.labels?.home || 'Главная',
          item: {
            '@type': 'WebPage',
            '@id': baseUrl,
            url: baseUrl,
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collectionName,
          item: {
            '@type': 'CollectionPage',
            '@id': canonicalUrl,
            url: canonicalUrl,
          },
        },
      ],
    },
    
    // Enhanced properties
    genre: getCollectionGenre(collectionType),
    keywords: getCollectionKeywords(collectionType, dictionary),
    
    // Audience and geographic targeting
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional?.targetMarkets || ['Russia'],
      audienceType: 'Русскоязычная аудитория',
    },
    
    // Accessibility and content features
    accessibilityFeature: ['alternativeText', 'longDescription', 'structuredNavigation'],
    accessibilityHazard: 'none',
    contentRating: 'general',
    
    // Additional collection metadata
    ...(featured && { isPartOf: `${baseUrl}#website` }),
    significantLink: items.slice(0, 3).map(item => 
      item.url || `${baseUrl}/ru/${collectionType === 'rubrics' ? item.slug : `${collectionType.slice(0, -1)}/${item.slug}`}`
    ),
  };

  // Website schema for context
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: seo.site.name,
    url: baseUrl,
    description: seo.site.description,
    inLanguage: 'ru',
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Combine all schemas
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, collectionPageSchema],
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
 * Get appropriate schema.org type for collection items
 */
const getItemType = (collectionType: string): string => {
  const typeMap: Record<string, string> = {
    'rubrics': 'Thing',
    'authors': 'Person',
    'articles': 'Article',
  };
  
  return typeMap[collectionType] || 'Thing';
};

/**
 * Get genre classification for different collection types
 */
const getCollectionGenre = (collectionType: string): string => {
  const genreMap: Record<string, string> = {
    'rubrics': 'directory',
    'authors': 'biography',
    'articles': 'journalism',
  };
  
  return genreMap[collectionType] || 'general';
};

/**
 * FIXED: Generate SEO keywords with safe dictionary access
 */
const getCollectionKeywords = (collectionType: string, dictionary: Dictionary): string => {
  const baseKeywords = dictionary.seo.keywords?.base || 'культурные события, музыка, искусство';
  
  const getSpecificKeywords = (type: string): string => {
    switch (type) {
      case 'rubrics':
        return dictionary.seo.keywords?.rubrics || 'рубрики, категории, темы';
      case 'authors':
        return dictionary.seo.keywords?.authors || 'авторы, эксперты, писатели';
      case 'articles':
        return dictionary.seo.keywords?.articles || 'статьи, публикации, материалы';
      default:
        return '';
    }
  };
  
  const collectionSpecific = getSpecificKeywords(collectionType);
  return collectionSpecific ? `${collectionSpecific}, ${baseKeywords}` : baseKeywords;
};

export default CollectionPageSchema;