// src/main/components/SEO/schemas/SearchPageSchema.tsx - OPTIMIZED VERSION

import React from 'react';
import { SchemaBuilder } from "../core/SchemaBuilder";
import { Dictionary } from "@/main/lib/dictionary/types";
import { ExtendedSchemaData } from "../core/types";
import { processTemplate } from '@/main/lib/dictionary/helpers';

interface SearchPageSchemaProps {
  readonly dictionary: Dictionary;
  readonly searchQuery?: string;
  readonly resultsCount?: number;
  readonly searchResults?: SearchResult[];
}

interface SearchResult {
  readonly title: string;
  readonly url: string;
  readonly description: string;
  readonly author?: string;
  readonly datePublished?: string;
}

/**
 * SearchPageSchema - Enhanced structured data for search functionality
 * Optimized for static rendering with proper footer link support
 */
export const SearchPageSchema: React.FC<SearchPageSchemaProps> = ({
  dictionary,
  searchQuery,
  resultsCount,
  searchResults = []
}) => {
  const baseUrl = 'https://event4me.eu';
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  // ENHANCED: Core WebSite schema with optimized SearchAction
  const websiteSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: seoDict.site.siteName,
    description: seoDict.site.siteDescription,
    url: baseUrl,
    inLanguage: seoDict.regional.language,
    
    potentialAction: {
      '@type': 'SearchAction',
      name: searchDict.accessibility.searchLabel,
      description: searchDict.accessibility.searchDescription,
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/ru/search?search={search_term_string}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
          'https://schema.org/TabletWebPlatform'
        ],
        description: searchDict.schema.searchActionDescription,
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: searchDict.accessibility.searchDescription,
        valueRequired: true,
        valueMinLength: 3,
        valueMaxLength: 100,
        valuePattern: '[а-яёa-z0-9\\s\\-]+',
      },
    },

    // Publisher information using dictionary
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: seoDict.site.siteName,
      description: seoDict.site.siteDescription,
      url: baseUrl,
      email: seoDict.site.contactEmail,
      sameAs: seoDict.site.socialProfiles,
      
      // IMPROVED: Add logo for better rich snippets
      logo: {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#logo`,
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 279,
        caption: seoDict.site.siteName,
      },
      
      // ENHANCED: Service area for regional targeting
      areaServed: {
        '@type': 'Country',
        name: 'Russia',
        alternateName: 'Россия',
      },
    },

    // NEW: Add mainEntity for better search page understanding
   mainEntity: {
      '@type': 'WebPageElement',
      '@id': `${baseUrl}/ru/search#main-content`,
      name: searchQuery 
        ? processTemplate(searchDict.templates.resultsFor, { query: searchQuery })
        : searchDict.templates.pageTitle,
      description: searchQuery
        ? `${searchDict.accessibility.searchDescription} "${searchQuery}"`
        : searchDict.templates.pageDescription,
    },
  };

  // IMPROVED: Breadcrumb schema with footer link context
  const breadcrumbSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/ru/search#breadcrumbs`,
    name: searchDict.schema.breadcrumbNavigation,
    
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.labels.home,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/ru`,
          url: `${baseUrl}/ru`,
          name: dictionary.navigation.labels.home,
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dictionary.navigation.labels.search,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/ru/search`,
          url: `${baseUrl}/ru/search`,
          name: dictionary.navigation.labels.search,
          // ... rest unchanged
        },
      },
      // Add search query breadcrumb if present
      ...(searchQuery ? [{
        '@type': 'ListItem',
        position: 3,
        name: searchDict.templates.resultsFor.replace('{query}', searchQuery),
        item: {
          '@type': 'SearchResultsPage',
          '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
          url: `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
          name: searchDict.templates.resultsFor.replace('{query}', searchQuery),
        },
      }] : []),
    ],
  };

  // ENHANCED: Search Results Page schema (only when search query exists)
  const searchResultsSchema: ExtendedSchemaData | null = searchQuery ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
    name: processTemplate(searchDict.templates.resultsFor, { query: searchQuery }),
    description: `${searchDict.schema.searchResultsDescription} для "${searchQuery}"`,
    url: `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
    inLanguage: seoDict.regional.language,
    
    mainContentOfPage: {
      '@type': 'WebPageElement',
      '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}#results`,
      name: searchDict.accessibility.searchResultsLabel,
      description: resultsCount !== undefined
        ? `${resultsCount} ${searchDict.schema.searchResultsFound} для запроса "${searchQuery}"`
        : `${searchDict.labels.results} для "${searchQuery}"`,
      
      ...(resultsCount !== undefined && {
        numberOfItems: resultsCount,
        itemListOrder: 'Descending',
      }),
    },

    about: {
      '@type': 'Thing',
      name: searchQuery,
      description: `${searchDict.messages.searchQuery}: ${searchQuery}`,
    },

    hasPart: {
      '@type': 'WebPageElement',
      name: searchDict.accessibility.searchLabel,
      description: searchDict.schema.searchInterfaceDescription,
    },
  } : null;

  // ItemList schema using dictionary
  const itemListSchema: ExtendedSchemaData | null = searchResults.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery || '')}#results`,
    name: processTemplate(searchDict.templates.resultsFor, { query: searchQuery }),
    description: `${searchResults.length} ${searchDict.schema.searchResultsFound}`,
    numberOfItems: searchResults.length,
    inLanguage: seoDict.regional.language,
    
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    
    itemListElement: searchResults.map((result: SearchResult, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        '@id': result.url,
        name: result.title,
        description: result.description,
        url: result.url,
        headline: result.title,
        
        ...(result.author && {
          author: {
            '@type': 'Person',
            name: result.author,
            url: `${baseUrl}/ru/authors/${encodeURIComponent(result.author.toLowerCase().replace(/\s+/g, '-'))}`,
          },
        }),
        
        ...(result.datePublished && {
          datePublished: result.datePublished,
          dateModified: result.datePublished,
        }),
        
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: seoDict.site.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        
        inLanguage: seoDict.regional.language,
        
        mentions: {
          '@type': 'Thing',
          name: searchQuery,
          description: `${searchDict.schema.mentionedInSearch}: ${searchQuery}`,
        },
      },
    })),
  } : null;

  return (
    <>
      <SchemaBuilder schema={websiteSchema} priority="high" />
      <SchemaBuilder schema={breadcrumbSchema} priority="high" />
      {searchResultsSchema && (
        <SchemaBuilder schema={searchResultsSchema} priority="normal" />
      )}
      {itemListSchema && (
        <SchemaBuilder schema={itemListSchema} priority="normal" />
      )}
    </>
  );
};