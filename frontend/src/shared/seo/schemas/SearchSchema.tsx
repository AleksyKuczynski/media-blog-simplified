// frontend/src/shared/seo/schemas/SearchSchema.tsx

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { generateCanonicalUrl } from '@/config/i18n/helpers/seo';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// SEARCH SCHEMA TYPES
// ===================================================================

export interface SearchSchemaProps {
  readonly dictionary: Dictionary;
  readonly query?: string;
  readonly resultCount?: number;
}

export interface SearchResultItem {
  title: string;
  description: string;
  url: string;
  type: 'Article' | 'Author' | 'Rubric';
}

// ===================================================================
// MAIN SEARCH SCHEMA COMPONENT - REFACTORED
// ===================================================================

/**
 * Generate structured data for search functionality
 * REFACTORED: Uses SchemaComposer for standardized generation
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({ 
  dictionary, 
  query,
  resultCount 
}) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site || !dictionary.search?.templates) {
      console.error('SearchSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    const currentUrl = query ? `${searchUrl}?q=${encodeURIComponent(query)}` : searchUrl;

    // Create search page title using existing templates
    let pageTitle: string;
    let pageDescription: string;

    if (query && resultCount !== undefined) {
      // Results page
      const resultsTitle = processTemplate(dictionary.search.templates.resultsFor, { query });
      pageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
        page: resultsTitle,
        siteName: seoDict.site.name,
      });
      pageDescription = `Найдено ${resultCount} ${dictionary.common.count.results.toLowerCase()} по запросу "${query}"`;
    } else {
      // Default search page
      pageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
        page: dictionary.search.templates.pageTitle,
        siteName: seoDict.site.name,
      });
      pageDescription = `${dictionary.search.templates.pageDescription} на ${seoDict.site.name}`;
    }

    // Use SchemaComposer for standardized search schema
    const schema = new SchemaComposer(dictionary, currentUrl)
      .addCustomSchema({
        '@type': 'SearchResultsPage',
        '@id': `${currentUrl}#searchpage`,
        name: pageTitle,
        description: pageDescription,
        url: currentUrl,
        
        // Enhanced search functionality
        potentialAction: {
          '@type': 'SearchAction',
          name: dictionary.search.templates.pageTitle,
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${searchUrl}?q={search_term_string}`,
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          'query-input': {
            '@type': 'PropertyValueSpecification',
            valueName: 'search_term_string',
            description: dictionary.search.labels.placeholder,
            valueRequired: true,
            valueMinLength: 2,
            valueMaxLength: 100,
          },
        },
      })
      .build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="normal"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('SearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// NO RESULTS SCHEMA - REFACTORED
// ===================================================================

export const NoResultsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
}> = ({ dictionary, query }) => {
  try {
    if (!query || !dictionary.seo?.site) {
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);
    const searchUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);
    const currentUrl = `${searchUrl}?q=${encodeURIComponent(query)}`;

    const pageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
      page: `${dictionary.search.labels.noResults}: ${query}`,
      siteName: dictionary.seo.site.name,
    });

    const schema = new SchemaComposer(dictionary, currentUrl)
      .addCustomSchema({
        '@type': 'SearchResultsPage',
        '@id': `${currentUrl}#noresults`,
        name: pageTitle,
        description: `По запросу "${query}" ${dictionary.search.labels.noResults.toLowerCase()}`,
        url: currentUrl,
        
        // Search functionality for trying again
        potentialAction: {
          '@type': 'SearchAction',
          name: dictionary.search.templates.pageTitle,
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${searchUrl}?q={search_term_string}`,
          },
          'query-input': {
            '@type': 'PropertyValueSpecification',
            valueName: 'search_term_string',
            description: dictionary.search.labels.placeholder,
            valueRequired: true,
            valueMinLength: 2,
            valueMaxLength: 100,
          },
        },
      })
      .build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        enableOptimization={true}
      />
    );
  } catch (error) {
    console.error('NoResultsSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH RESULTS WITH ITEMS SCHEMA - REFACTORED
// ===================================================================

export const SearchResultsWithItemsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
  results: SearchResultItem[];
}> = ({ dictionary, query, results }) => {
  try {
    if (!query || !results.length || !dictionary.seo?.site) {
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);
    const searchUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);
    const currentUrl = `${searchUrl}?q=${encodeURIComponent(query)}`;

    const resultsTitle = processTemplate(dictionary.search.templates.resultsFor, { query });
    const pageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
      page: resultsTitle,
      siteName: dictionary.seo.site.name,
    });

    // Use SchemaComposer with custom ItemList
    const schema = new SchemaComposer(dictionary, currentUrl)
      .addCustomSchema({
        '@type': 'SearchResultsPage',
        '@id': `${currentUrl}#results`,
        name: pageTitle,
        description: `Найдено ${results.length} ${dictionary.common.count.results.toLowerCase()} по запросу "${query}"`,
        url: currentUrl,
        
        // Results list using standard ItemList pattern
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: results.length,
          itemListElement: results.map((result, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': result.type,
              name: result.title,
              description: result.description,
              url: result.url,
            },
          })),
        },
      })
      .build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        enableOptimization={true}
      />
    );
  } catch (error) {
    console.error('SearchResultsWithItemsSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// CONVENIENCE COMPONENTS - SIMPLIFIED
// ===================================================================

/**
 * Minimal search schema for basic search pages
 * REFACTORED: Uses simplified SearchSchema
 */
export const MinimalSearchSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  return <SearchSchema dictionary={dictionary} />;
};

/**
 * Complete search schema with all search functionality
 * REFACTORED: Maintains same interface but with enhanced internals
 */
export const CompleteSearchSchema: React.FC<SearchSchemaProps> = (props) => {
  return <SearchSchema {...props} />;
};

export default SearchSchema;