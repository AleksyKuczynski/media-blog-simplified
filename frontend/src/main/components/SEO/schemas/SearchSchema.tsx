// src/main/components/SEO/schemas/SearchSchema.tsx
// FIXED: Updated to work with new dictionary structure and correct imports

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
 * FIXED: Works with new dictionary structure and helper functions
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
      url: query ? `${searchUrl}?search=${encodeURIComponent(query)}` : searchUrl,
      inLanguage: 'ru',
      
      // Main entity - the search itself
      mainEntity: {
        '@type': 'SearchAction',
        '@id': `${searchUrl}#search`,
        name: dictionary.search.templates.pageTitle,
        description: dictionary.search.templates.pageDescription,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
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
        ...(query && {
          object: {
            '@type': 'Thing',
            name: query,
            description: `Поисковый запрос: ${query}`,
          },
        }),
      },

      // Publisher organization
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`,
        name: seoDict.site.name,
        url: baseUrl,
        description: seoDict.site.organizationDescription,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
          width: 200,
          height: 200,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: seoDict.site.contactEmail,
          contactType: 'customer support',
          availableLanguage: ['ru', 'Russian'],
        },
        sameAs: seoDict.site.socialProfiles,
      },

      // Audience targeting
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
        audienceType: 'Русскоязычная аудитория',
      },

      // Search interface features
      accessibilityFeature: ['searchInterface', 'keyboardAccessible', 'voiceSearch'],
      accessibilityHazard: 'none',
      
      // Add result count if provided
      ...(typeof resultCount === 'number' && {
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'resultCount',
          value: resultCount,
        },
      }),
    };

    // Create WebSite schema with search functionality
    const websiteSearchSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website-search`,
      name: seoDict.site.name,
      url: baseUrl,
      description: seoDict.site.description,
      inLanguage: 'ru',
      
      potentialAction: {
        '@type': 'SearchAction',
        name: dictionary.search.templates.pageTitle,
        description: dictionary.search.templates.pageDescription,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    // Combine schemas
    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [searchPageSchema, websiteSearchSchema],
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('SearchSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH RESULTS SCHEMA
// ===================================================================

export const SearchResultsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
  results: Array<{
    title: string;
    url: string;
    description?: string;
    type?: string;
  }>;
  totalCount: number;
}> = ({ dictionary, query, results, totalCount }) => {
  try {
    const seoDict = dictionary.seo;
    const baseUrl = seoDict.site.url;
    const searchUrl = generateCanonicalUrl('/search', baseUrl);
    const currentUrl = `${searchUrl}?search=${encodeURIComponent(query)}`;

    const searchResultsSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${currentUrl}#results`,
      name: processTemplate(dictionary.search.templates.resultsFor, { query }),
      description: `Найдено ${totalCount} результатов по запросу "${query}"`,
      url: currentUrl,
      inLanguage: 'ru',
      
      mainEntity: {
        '@type': 'ItemList',
        '@id': `${currentUrl}#list`,
        name: `Результаты поиска: ${query}`,
        numberOfItems: totalCount,
        
        itemListElement: results.slice(0, 10).map((result, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': result.type || 'WebPage',
            '@id': result.url,
            name: result.title,
            description: result.description,
            url: result.url,
            inLanguage: 'ru',
          },
        })),
      },

      // Search action that led to these results
      potentialAction: {
        '@type': 'SearchAction',
        query,
        actionStatus: 'CompletedActionStatus',
        result: {
          '@type': 'SearchResultsPage',
          '@id': currentUrl,
        },
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
    console.error('SearchResultsSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// NO RESULTS SCHEMA
// ===================================================================

export const NoResultsSchema: React.FC<{
  dictionary: Dictionary;
  query: string;
}> = ({ dictionary, query }) => {
  try {
    const seoDict = dictionary.seo;
    const baseUrl = seoDict.site.url;
    const searchUrl = generateCanonicalUrl('/search', baseUrl);
    const currentUrl = `${searchUrl}?search=${encodeURIComponent(query)}`;

    const noResultsSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      '@id': `${currentUrl}#noresults`,
      name: `${dictionary.search.labels.noResults}: ${query}`,
      description: `По запросу "${query}" ничего не найдено`,
      url: currentUrl,
      inLanguage: 'ru',
      
      mainEntity: {
        '@type': 'SearchAction',
        '@id': `${currentUrl}#action`,
        query,
        actionStatus: 'FailedActionStatus',
        error: {
          '@type': 'Thing',
          name: dictionary.search.labels.noResults,
          description: `По запросу "${query}" результаты не найдены`,
        },
      },

      // Suggest alternative actions
      potentialAction: {
        '@type': 'SearchAction',
        name: 'Повторить поиск',
        description: 'Попробуйте изменить поисковый запрос',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
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