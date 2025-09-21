// src/main/components/SEO/schemas/SearchSchema.tsx
// FIXED: Compatible with existing dictionary.ts structure

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

// ===================================================================
// SEARCH SCHEMA TYPES
// ===================================================================

export interface SearchSchemaProps {
  readonly dictionary: Dictionary;
  readonly query?: string;
  readonly resultCount?: number;
}

// ===================================================================
// MAIN SEARCH SCHEMA COMPONENT
// ===================================================================

/**
 * Generate structured data for search functionality
 * FIXED: Uses only existing dictionary entries
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({ 
  dictionary, 
  query,
  resultCount 
}) => {
  try {
    const seoDict = dictionary.seo;
    
    // Validate dictionary structure
    if (!seoDict?.site || !dictionary.search?.templates) {
      console.error('SearchSchema: Invalid dictionary structure');
      return null;
    }

    // Generate URLs using helper
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    // Create search page title using dictionary
    const searchPageTitle = processTemplate(dictionary.navigation.templates.pageTitle, {
      page: dictionary.search.templates.pageTitle,
      siteName: seoDict.site.name,
    });

    // Create main search schema
    const searchPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${searchUrl}#searchpage`,
      name: searchPageTitle,
      description: `${dictionary.search.templates.pageDescription} на ${seoDict.site.name}`,
      url: query ? 
        `${searchUrl}?q=${encodeURIComponent(query)}` : searchUrl,
      inLanguage: 'ru',
      
      // Search functionality
      potentialAction: {
        '@type': 'SearchAction',
        // FIXED: Use existing dictionary.search.templates.pageTitle instead of non-existent searchAction
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
          // FIXED: Use existing dictionary.search.labels.placeholder instead of non-existent queryTerm
          description: dictionary.search.labels.placeholder,
          valueRequired: true,
          valueMinLength: 2,
          valueMaxLength: 100,
        },
      },
    };

    // Add search results data if query exists
    if (query && resultCount !== undefined) {
      const resultsTitle = processTemplate(dictionary.search.templates.resultsFor, { query });
      
      searchPageSchema.name = processTemplate(dictionary.navigation.templates.pageTitle, {
        page: resultsTitle,
        siteName: seoDict.site.name,
      });
      
      // Add result count to description using existing dictionary entry
      searchPageSchema.description = `Найдено ${resultCount} ${dictionary.common.count.results.toLowerCase()} по запросу "${query}"`;
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchPageSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('SearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// NO RESULTS SCHEMA - FIXED to use existing dictionary
// ===================================================================

export const NoResultsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
}> = ({ dictionary, query }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site || !query) {
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const noResultsSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${searchUrl}?q=${encodeURIComponent(query)}#noresults`,
      name: processTemplate(dictionary.navigation.templates.pageTitle, {
        page: `${dictionary.search.labels.noResults}: ${query}`,
        siteName: seoDict.site.name,
      }),
      description: `По запросу "${query}" ${dictionary.search.labels.noResults.toLowerCase()}`,
      url: `${searchUrl}?q=${encodeURIComponent(query)}`,
      inLanguage: 'ru',
      
      // Simplified search action using existing dictionary entries
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
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(noResultsSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('NoResultsSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH RESULTS WITH ITEMS SCHEMA
// ===================================================================

export const SearchResultsWithItemsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
  results: Array<{
    title: string;
    description: string;
    url: string;
    type: 'Article' | 'Author' | 'Rubric';
  }>;
}> = ({ dictionary, query, results }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site || !query || !results.length) {
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const searchResultsSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${searchUrl}?q=${encodeURIComponent(query)}#results`,
      name: processTemplate(dictionary.navigation.templates.pageTitle, {
        page: processTemplate(dictionary.search.templates.resultsFor, { query }),
        siteName: seoDict.site.name,
      }),
      description: `Найдено ${results.length} ${dictionary.common.count.results.toLowerCase()} по запросу "${query}"`,
      url: `${searchUrl}?q=${encodeURIComponent(query)}`,
      inLanguage: 'ru',
      
      // Results list
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
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchResultsSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('SearchResultsWithItemsSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// CONVENIENCE COMPONENTS
// ===================================================================

/**
 * Minimal search schema for basic search pages
 */
export const MinimalSearchSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    return <SearchSchema dictionary={dictionary} />;
  } catch (error) {
    console.error('MinimalSearchSchema: Error rendering search schema', error);
    return null;
  }
};

/**
 * Complete search schema with all search functionality
 */
export const CompleteSearchSchema: React.FC<SearchSchemaProps> = (props) => {
  try {
    return <SearchSchema {...props} />;
  } catch (error) {
    console.error('CompleteSearchSchema: Error rendering complete search schema', error);
    return null;
  }
};

export default SearchSchema;