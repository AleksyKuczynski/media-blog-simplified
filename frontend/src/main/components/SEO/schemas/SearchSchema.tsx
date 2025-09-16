// src/main/components/SEO/schemas/SearchSchema.tsx
// STATIC ONLY: Removed query handling, simplified for static SEO

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
// STATIC SEARCH SCHEMA - NO QUERY HANDLING
// ===================================================================

export interface SearchSchemaProps {
  readonly dictionary: Dictionary;
  // REMOVED: query prop - SEO should be static
}

/**
 * Generate static structured data for search functionality
 * STATIC ONLY: No query processing, same schema for all states
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({ dictionary }) => {
  try {
    // Validate dictionary first
    if (!validateSearchDictionary(dictionary)) {
      console.error('SearchSchema: Invalid dictionary structure');
      return null;
    }

    const seoDict = dictionary.seo;
    
    // Static URLs only
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    const searchActionData = generateSearchActionData(dictionary);

    // Create static search page title using dictionary
    const searchPageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
      page: dictionary.search.templates.pageTitle,
      siteName: seoDict.site.name,
    });

    // Create static search page description using dictionary
    const searchPageDescription = processTemplate(dictionary.accessibility.templates.pageDescription, {
      description: dictionary.search.templates.pageDescription,
      siteName: seoDict.site.name,
    });

    // Create static website schema with search functionality
    const websiteSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      description: seoDict.site.description,
      url: baseUrl,
      inLanguage: 'ru',
      
      // Static search capability
      potentialAction: {
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
          valueMinLength: 3,
          valueMaxLength: 100,
        },
      },
      
      // Static organization data
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`,
        name: seoDict.site.name,
        description: seoDict.site.organizationDescription,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
          width: 600,
          height: 60,
        },
        sameAs: seoDict.site.socialProfiles,
      },
      
      // Static audience data
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
        audienceType: 'Russian speakers interested in culture and events',
      },
    };

    return <SchemaBuilder schema={websiteSchema} priority="high" />;
    
  } catch (error) {
    console.error('SearchSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Minimal search schema for lightweight pages
 * STATIC ONLY: Basic search action without full website schema
 */
export const MinimalSearchSchema: React.FC<SearchSchemaProps> = ({ dictionary }) => {
  try {
    if (!validateSearchDictionary(dictionary)) {
      console.warn('MinimalSearchSchema: Invalid dictionary structure');
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
          'https://schema.org/MobileWebPlatform'
        ],
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: dictionary.search.accessibility.searchInputLabel,
        valueRequired: true,
        valueMinLength: 3,
      },
    };

    return <SchemaBuilder schema={actionSchema} priority="normal" />;
    
  } catch (error) {
    console.error('MinimalSearchSchema: Error generating schema', error);
    return null;
  }
};