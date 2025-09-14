// src/main/components/SEO/schemas/SearchSchema.tsx
// DRY: Uses existing helpers, no dictionary expansion

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { ExtendedSchemaData } from '../core/types';
import {
  generateCanonicalUrl,
  generateNavigationElements,
} from '@/main/lib/dictionary/helpers';
import {
  generateSearchActionData,
  validateSearchDictionary,
} from '@/main/lib/dictionary/helpers/search';

// ===================================================================
// SEARCH SCHEMA TYPES
// ===================================================================

export interface SearchSchemaProps {
  readonly dictionary: Dictionary;
  readonly query?: string;
}

// ===================================================================
// MAIN SEARCH SCHEMA COMPONENT - DRY
// ===================================================================

/**
 * Generate structured data for search functionality
 * NO DUPLICATION - uses existing helpers
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({
  dictionary,
  query,
}) => {
  try {
    // Validate dictionary first
    if (!validateSearchDictionary(dictionary)) {
      console.error('SearchSchema: Invalid dictionary structure');
      return null;
    }

    const seoDict = dictionary.seo;
    
    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    const searchActionData = generateSearchActionData(dictionary);

    // Create website schema with search functionality - using existing pattern
    const websiteSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      description: seoDict.site.description,
      url: baseUrl,
      inLanguage: 'ru',
      
      // Search capability using existing helper data
      potentialAction: {
        '@type': 'SearchAction',
        name: searchActionData.name,
        description: searchActionData.description,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchActionData.queryTemplate,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform'
          ],
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueName: 'search_term_string',
          description: dictionary.search.placeholder,
          valueRequired: true,
          valueMinLength: 2,
          valueMaxLength: 100,
        },
      },
    };

    // Create search page schema
    const searchPageSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': searchUrl,
      name: `Поиск — ${seoDict.site.name}`,
      description: `Поиск материалов на ${seoDict.site.name}`,
      url: searchUrl,
      inLanguage: 'ru',
      isPartOf: { 
        '@type': 'WebSite',
        '@id': `${baseUrl}#website` 
      },
      
      // Main content describes the search interface - NO EXPANSION
      mainEntity: {
        '@type': 'WebPageElement',
        '@id': `${searchUrl}#search-interface`,
        name: 'Интерфейс поиска',
        description: `Поиск статей и материалов на ${seoDict.site.name}`,
      },
      
      // Enhanced properties using existing data
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },

      // Accessibility features - static, no expansion needed
      accessibilityFeature: [
        'structuralNavigation',
        'ARIA', 
        'keyboardNavigation',
        'searchFunctionality'
      ],
      accessibilityControl: ['fullKeyboardControl', 'fullMouseControl', 'fullTouchControl'],
      accessibilityHazard: ['none'],
    };

    // Combine schemas
    const allSchemas = [websiteSchema, searchPageSchema];

    return <SchemaBuilder schema={allSchemas} priority="high" />;
    
  } catch (error) {
    console.error('SearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// MINIMAL SEARCH SCHEMA - DRY
// ===================================================================

/**
 * Minimal search schema for performance-critical contexts
 * NO DUPLICATION - uses existing helpers
 */
export const MinimalSearchSchema: React.FC<{ dictionary: Dictionary }> = ({ 
  dictionary 
}) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('MinimalSearchSchema: Invalid dictionary structure');
      return null;
    }

    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const minimalSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      url: baseUrl,
      inLanguage: 'ru',
      
      potentialAction: {
        '@type': 'SearchAction',
        name: `Поиск по ${seoDict.site.name}`,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    return <SchemaBuilder schema={minimalSchema} priority="normal" />;
    
  } catch (error) {
    console.error('MinimalSearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH ACTION SCHEMA - DRY
// ===================================================================

/**
 * Search action schema for integration with other components
 * NO DUPLICATION - uses existing helpers
 */
export const SearchActionSchema: React.FC<{ dictionary: Dictionary }> = ({
  dictionary
}) => {
  try {
    // Use existing helper - NO DUPLICATION
    const searchActionData = generateSearchActionData(dictionary);
    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);

    const searchActionSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'SearchAction',
      '@id': `${searchActionData.targetUrl}#search-action`,
      name: searchActionData.name,
      description: searchActionData.description,
      
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchActionData.queryTemplate,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform'
        ],
      },
      
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: dictionary.search.placeholder,
        valueRequired: true,
        valueMinLength: 2,
        valueMaxLength: 100,
      },

      // Enhanced properties using existing data
      agent: {
        '@type': 'Organization',
        name: dictionary.seo.site.name,
        url: baseUrl,
      },
    };

    return <SchemaBuilder schema={searchActionSchema} priority="normal" />;
    
  } catch (error) {
    console.error('SearchActionSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH BREADCRUMB SCHEMA - DRY
// ===================================================================

/**
 * Breadcrumb schema for search pages using existing helpers
 * NO DUPLICATION - reuses navigation helpers
 */
export const SearchBreadcrumbSchema: React.FC<{ dictionary: Dictionary }> = ({
  dictionary
}) => {
  try {
    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);
    const searchUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);

    const breadcrumbSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${searchUrl}#breadcrumb`,
      
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: dictionary.navigation.labels.home,
          item: {
            '@type': 'WebPage',
            '@id': baseUrl,
            name: dictionary.navigation.labels.home,
            url: baseUrl,
            inLanguage: 'ru',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Поиск', // Static, no expansion needed
          item: {
            '@type': 'WebPage',
            '@id': searchUrl,
            name: 'Поиск',
            url: searchUrl,
            inLanguage: 'ru',
          },
        },
      ],
      
      numberOfItems: 2,
      name: 'Навигация к поиску',
      description: `${dictionary.navigation.labels.home} → Поиск`,
    };

    return <SchemaBuilder schema={breadcrumbSchema} priority="normal" />;
    
  } catch (error) {
    console.error('SearchBreadcrumbSchema: Error generating schema', error);
    return null;
  }
};