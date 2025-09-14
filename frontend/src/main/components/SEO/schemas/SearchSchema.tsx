// src/main/components/SEO/schemas/SearchSchema.tsx
// FIXED: Removed all hardcoded Russian text, uses dictionary entries only

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { ExtendedSchemaData } from '../core/types';
import {
  generateCanonicalUrl,
} from '@/main/lib/dictionary/helpers/seo';
import {
  generateSearchActionData,
  validateSearchDictionary,
} from '@/main/lib/dictionary/helpers/search';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

// ===================================================================
// SEARCH SCHEMA TYPES
// ===================================================================

export interface SearchSchemaProps {
  readonly dictionary: Dictionary;
  readonly query?: string;
}

// ===================================================================
// MAIN SEARCH SCHEMA COMPONENT - FIXED
// ===================================================================

/**
 * Generate structured data for search functionality
 * FIXED: Uses dictionary entries only, no hardcoded text
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
    
    // Use existing helper - NO HARDCODED TEXT
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    const searchActionData = generateSearchActionData(dictionary);

    // Create search page title using dictionary
    const searchPageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
      page: dictionary.search.templates.pageTitle,
      siteName: seoDict.site.name,
    });

    // Create search page description using dictionary
    const searchPageDescription = processTemplate(dictionary.accessibility.templates.pageDescription, {
      description: dictionary.search.templates.pageDescription,
      siteName: seoDict.site.name,
    });

    // Create website schema with search functionality - using dictionary
    const websiteSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      description: seoDict.site.description,
      url: baseUrl,
      inLanguage: 'ru',
      
      // Search capability using dictionary data
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
          description: dictionary.search.accessibility.searchDescription,
          valueRequired: true,
          valueMinLength: 2,
          valueMaxLength: 100,
        },
      },
    };

    // Create search page schema using dictionary
    const searchPageSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': searchUrl,
      name: searchPageTitle,
      description: searchPageDescription,
      url: searchUrl,
      inLanguage: 'ru',
      isPartOf: { 
        '@type': 'WebSite',
        '@id': `${baseUrl}#website` 
      },
      
      // Main content describes the search interface - using dictionary
      mainEntity: {
        '@type': 'WebPageElement',
        '@id': `${searchUrl}#search-interface`,
        name: dictionary.search.accessibility.searchLabel,
        description: dictionary.search.accessibility.searchDescription,
      },
      
      // Enhanced properties using dictionary data
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },

      // Accessibility features - using static data (no expansion needed)
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
// MINIMAL SEARCH SCHEMA - FIXED
// ===================================================================

/**
 * Minimal search schema for performance-critical contexts
 * FIXED: Uses dictionary entries only
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

    // Use dictionary helpers - NO HARDCODED TEXT
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const minimalSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${searchUrl}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    return <SchemaBuilder schema={minimalSchema} priority="low" />;
    
  } catch (error) {
    console.error('MinimalSearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH ACTION SCHEMA - New component for action-specific schema
// ===================================================================

/**
 * Dedicated search action schema component
 * Uses dictionary entries for all text content
 */
export const SearchActionSchema: React.FC<{ dictionary: Dictionary }> = ({ 
  dictionary 
}) => {
  try {
    if (!validateSearchDictionary(dictionary)) {
      console.warn('SearchActionSchema: Invalid dictionary structure');
      return null;
    }

    const searchActionData = generateSearchActionData(dictionary);
    
    const actionSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'SearchAction',
      name: searchActionData.name,
      description: searchActionData.description,
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchActionData.queryTemplate,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
          'https://schema.org/IOSPlatform',
          'https://schema.org/AndroidPlatform'
        ],
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: dictionary.search.accessibility.searchInputLabel,
        valueRequired: true,
        valueMinLength: 2,
        valueMaxLength: 100,
      },
      agent: {
        '@type': 'Organization',
        name: dictionary.seo.site.name,
        url: dictionary.seo.site.url,
      },
    };

    return <SchemaBuilder schema={actionSchema} priority="normal" />;
    
  } catch (error) {
    console.error('SearchActionSchema: Error generating schema', error);
    return null;
  }
};