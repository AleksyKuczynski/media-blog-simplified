// src/main/components/SEO/schemas/SearchSchema.tsx
// Fixed search schema with proper SchemaBuilder import and correct dictionary paths

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { ExtendedSchemaData } from '../core/types';
import { Dictionary } from '@/main/lib/dictionary/types';
import { getCanonicalURL } from '@/main/lib/dictionary/helpers';

interface SearchSchemaProps {
  readonly dictionary: Dictionary;
}

/**
 * Enhanced search schema focused on WebSite SearchAction
 * Uses SchemaBuilder component and correct dictionary paths
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({
  dictionary
}) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  // Core WebSite schema with search capability
  const websiteSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getCanonicalURL('/')}#website`,
    name: seoDict.site.name, // FIXED: was siteName
    description: seoDict.site.description, // FIXED: was siteDescription
    url: getCanonicalURL('/'),
    inLanguage: seoDict.regional.language,
    
    // Search capability definition
    potentialAction: {
      '@type': 'SearchAction',
      name: searchDict.accessibility.searchLabel,
      description: searchDict.schema.searchActionDescription,
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getCanonicalURL('/search')}?search={search_term_string}`,
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
      '@id': `${getCanonicalURL('/')}#organization`,
      name: seoDict.site.name, // FIXED: was siteName
      url: getCanonicalURL('/'),
      description: seoDict.site.description, // FIXED: was siteDescription
      sameAs: seoDict.site.socialProfiles,
      
      contactPoint: {
        '@type': 'ContactPoint',
        email: seoDict.site.contactEmail,
        contactType: 'customer support',
        availableLanguage: ['ru', 'Russian'],
      },
    },
  };

  // Enhanced breadcrumb for search navigation
  const breadcrumbSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${getCanonicalURL('/search')}#breadcrumb`,
    
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dictionary.navigation.labels.home,
        item: {
          '@type': 'WebPage',
          '@id': getCanonicalURL('/'),
          name: dictionary.navigation.labels.home,
          url: getCanonicalURL('/'),
          inLanguage: 'ru',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: searchDict.templates.pageTitle,
        item: {
          '@type': 'WebPage',
          '@id': getCanonicalURL('/search'),
          name: searchDict.templates.pageTitle,
          url: getCanonicalURL('/search'),
          inLanguage: 'ru',
        },
      },
    ],
    
    // Enhanced properties
    numberOfItems: 2,
    name: searchDict.schema.breadcrumbNavigation,
    description: `Навигация: ${dictionary.navigation.labels.home} → ${searchDict.templates.pageTitle}`,
  };

  // WebPage schema for the search interface
  const webPageSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': getCanonicalURL('/search'),
    name: searchDict.templates.pageTitle,
    description: searchDict.templates.pageDescription,
    url: getCanonicalURL('/search'),
    inLanguage: seoDict.regional.language,
    isPartOf: { 
      '@type': 'WebSite',
      '@id': `${getCanonicalURL('/')}#website` 
    },
    
    // Main content describes the search interface
    mainEntity: {
      '@type': 'WebPageElement',
      '@id': `${getCanonicalURL('/search')}#search-interface`,
      name: searchDict.schema.searchInterfaceDescription,
      description: `${searchDict.templates.pageDescription} для поиска статей о культуре и музыке`,
    },
    
    breadcrumb: { 
      '@type': 'BreadcrumbList',
      '@id': `${getCanonicalURL('/search')}#breadcrumb` 
    },

    // Enhanced properties for search page
    audience: {
      '@type': 'Audience',
      name: dictionary.navigation.seo.audience,
      geographicArea: seoDict.regional.targetMarkets,
    },

    // Accessibility features
    accessibilityFeature: [
      'structuralNavigation',
      'ARIA',
      'keyboardNavigation',
      'searchFunctionality'
    ],
    accessibilityControl: ['fullKeyboardControl', 'fullMouseControl', 'fullTouchControl'],
    accessibilityHazard: ['none'],
  };

  // Combine all schemas
  const allSchemas = [websiteSchema, breadcrumbSchema, webPageSchema];

  return <SchemaBuilder schema={allSchemas} priority="high" />;
};

/**
 * Minimal search schema for performance-critical contexts
 */
export const MinimalSearchSchema: React.FC<{ dictionary: Dictionary }> = ({ 
  dictionary 
}) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  const minimalSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getCanonicalURL('/')}#website`,
    name: seoDict.site.name,
    url: getCanonicalURL('/'),
    inLanguage: seoDict.regional.language,
    
    potentialAction: {
      '@type': 'SearchAction',
      name: searchDict.accessibility.searchLabel,
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getCanonicalURL('/search')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <SchemaBuilder schema={minimalSchema} priority="normal" />;
};

/**
 * Search action schema for integration with other components
 */
export const SearchActionSchema: React.FC<{ dictionary: Dictionary }> = ({
  dictionary
}) => {
  const searchDict = dictionary.search;

  const searchActionSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    '@id': `${getCanonicalURL('/search')}#search-action`,
    name: searchDict.accessibility.searchLabel,
    description: searchDict.schema.searchActionDescription,
    
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${getCanonicalURL('/search')}?search={search_term_string}`,
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

    // Enhanced properties
    agent: {
      '@type': 'Organization',
      name: dictionary.seo.site.name,
      url: getCanonicalURL('/'),
    },
  };

  return <SchemaBuilder schema={searchActionSchema} priority="normal" />;
};