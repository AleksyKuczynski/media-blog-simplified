// src/main/components/SEO/schemas/CollectionPageSchema.tsx
// Clean collection schema using new dictionary structure directly

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateBreadcrumbs } from '@/main/lib/dictionary/helpers/seo';

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

/**
 * Generate comprehensive structured data for collection pages
 * Optimized for Google and Yandex with Russian market focus
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

  // Get collection-specific data from dictionary
  const getCollectionData = () => {
    switch (collectionType) {
      case 'rubrics':
        return {
          name: dictionary.sections.rubrics.allRubrics,
          description: dictionary.sections.rubrics.collectionPageDescription,
          genre: 'content-classification',
        };
      case 'authors':
        return {
          name: dictionary.sections.authors.allAuthors,
          description: dictionary.sections.authors.collectionPageDescription,
          genre: 'person-profiles',
        };
      case 'articles':
        return {
          name: dictionary.sections.articles.allArticles,
          description: dictionary.sections.articles.collectionPageDescription,
          genre: 'editorial-content',
        };
      default:
        return {
          name: 'Коллекция',
          description: `Коллекция материалов на ${seo.site.name}`,
          genre: 'general-collection',
        };
    }
  };

  const collectionData = getCollectionData();
  
  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(dictionary, [collectionType]);

  // Create main CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    name: collectionData.name,
    description: collectionData.description,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    // Collection metadata
    numberOfItems: totalCount,
    
    // Publisher and site info
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seo.site.name,
      url: baseUrl,
      description: seo.site.description,
      inLanguage: 'ru',
      
      // Search functionality
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
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
    
    // Main entity list (limited to first 10 for performance)
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
      name: collectionData.name,
      description: collectionData.description,
      numberOfItems: totalCount,
      
      itemListElement: items.slice(0, 10).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.url,
        ...(collectionType === 'rubrics' && item.articleCount && {
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'articleCount',
            value: item.articleCount,
          },
        }),
      })),
    },
    
    // Publisher organization
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
      areaServed: seo.site.geographicAreas,
    },
    
    // Content classification
    genre: collectionData.genre,
    keywords: getCollectionKeywords(collectionType, dictionary),
    
    // Audience targeting for Russian market
    audience: {
      '@type': 'Audience',
      geographicArea: seo.regional.targetMarkets,
      audienceType: 'Русскоязычная аудитория',
    },
    
    // Accessibility and content features
    accessibilityFeature: ['alternativeText', 'longDescription', 'structuredNavigation'],
    accessibilityHazard: 'none',
    contentRating: 'general',
    
    // Publication info
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    
    // Featured flag if applicable
    ...(featured && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'featured',
        value: true,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(collectionPageSchema, null, 2),
      }}
    />
  );
};

// Helper functions

/**
 * Generate SEO keywords for specific collection types using dictionary
 */
const getCollectionKeywords = (collectionType: string, dictionary: Dictionary): string => {
  const baseKeywords = dictionary.seo.keywords.base;
  
  const specificKeywords: Record<string, string> = {
    'rubrics': dictionary.seo.keywords.rubrics,
    'authors': dictionary.seo.keywords.authors,
    'articles': dictionary.seo.keywords.articles,
  };
  
  const collectionSpecific = specificKeywords[collectionType] || '';
  return collectionSpecific ? `${collectionSpecific}, ${baseKeywords}` : baseKeywords;
};

export default CollectionPageSchema;