// src/main/components/SEO/schemas/SearchSchema.tsx
// Minimal schema focused on search capability, not results

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';

interface SearchSchemaProps {
  readonly dictionary: Dictionary;
}

/**
 *  search schema focused on WebSite SearchAction
 * No dynamic search results - just site search capability
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({
  dictionary
}) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  const baseUrl = 'https://event4me.eu';

  // Core WebSite schema with search capability
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: seoDict.site.siteName,
    description: seoDict.site.siteDescription,
    url: baseUrl,
    inLanguage: seoDict.regional.language,
    
    // Search capability definition
    potentialAction: {
      '@type': 'SearchAction',
      name: searchDict.accessibility.searchLabel,
      description: searchDict.schema.searchActionDescription,
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/ru/search?search={search_term_string}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform'
        ],
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: searchDict.accessibility.searchDescription,
        valueRequired: true,
        valueMinLength: 3,
        valueMaxLength: 100,
      },
    },

    // Publisher information
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: seoDict.site.siteName,
      url: baseUrl,
      description: seoDict.site.siteDescription,
      sameAs: seoDict.site.socialProfiles,
      
      contactPoint: {
        '@type': 'ContactPoint',
        email: seoDict.site.contactEmail,
        contactType: 'customer support',
        availableLanguage: ['ru', 'Russian'],
      },
    },
  };

  // Simple breadcrumb for footer → search navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${baseUrl}/ru/search#breadcrumb`,
    
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
        name: searchDict.templates.pageTitle,
        item: `${baseUrl}/ru/search`,
      },
    ],
  };

  // WebPage schema for the search interface
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/ru/search`,
    name: searchDict.templates.pageTitle,
    description: searchDict.templates.pageDescription,
    url: `${baseUrl}/ru/search`,
    inLanguage: seoDict.regional.language,
    isPartOf: { '@id': `${baseUrl}/#website` },
    
    // Main content describes the search interface
    mainEntity: {
      '@type': 'WebPageElement',
      '@id': `${baseUrl}/ru/search#search-interface`,
      name: searchDict.schema.searchInterfaceDescription,
      description: `${searchDict.templates.pageDescription} для поиска статей о культуре и музыке`,
    },
    
    breadcrumb: { '@id': `${baseUrl}/ru/search#breadcrumb` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema, null, 0),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 0),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema, null, 0),
        }}
      />
    </>
  );
};