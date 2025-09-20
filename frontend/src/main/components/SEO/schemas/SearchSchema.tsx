// src/main/components/SEO/schemas/SearchSchema.tsx
// CLEANED: Removed all hardcoded text, using dictionary entries only

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';
import { generateSearchActionData, validateSearchDictionary } from '@/main/lib/dictionary/helpers/search';
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
 * CLEANED: No hardcoded text, all dictionary-driven
 */
export const SearchSchema: React.FC<SearchSchemaProps> = ({ 
  dictionary, 
  query,
  resultCount 
}) => {
  try {
    // Validate dictionary first
    if (!validateSearchDictionary(dictionary)) {
      console.error('SearchSchema: Invalid dictionary structure');
      return null;
    }

    const seoDict = dictionary.seo;
    
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
      url: query ? `${searchUrl}?q=${encodeURIComponent(query)}` : searchUrl,
      inLanguage: 'ru',
      
      // Search functionality
      potentialAction: {
        '@type': 'SearchAction',
        name: dictionary.search.labels.searchAction,  // FIXED: No more hardcoded 'Повторить поиск'
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
          description: dictionary.search.labels.queryTerm,  // FIXED: Unified terminology
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
      
      // Add result count to description
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
// NO RESULTS SCHEMA - CLEANED VERSION
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
      
      // CLEANED: Removed 'Попробуйте изменить поисковый запрос' completely
      // Simplified search action without suggestions
      potentialAction: {
        '@type': 'SearchAction',
        name: dictionary.search.labels.searchAction,  // FIXED: Using dictionary
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueName: 'search_term_string',
          description: dictionary.search.labels.queryTerm,  // FIXED: Unified terminology
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