import { SchemaBuilder } from "../core/SchemaBuilder";

/**
 * SearchPageSchema - Structured data for search functionality and results
 * Implements WebSite schema with SearchAction for enhanced search visibility
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

  // Main WebSite schema with SearchAction
  const websiteSchema = {
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
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/ru/search?search={search_term_string}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
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

    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: seoDict.site.siteName,
      description: seoDict.site.siteDescription,
      url: baseUrl,
      email: seoDict.site.contactEmail,
      sameAs: seoDict.site.socialProfiles,
    },
  };

  // Search Results Page schema (when search query exists)
  const searchResultsSchema = searchQuery ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
    name: searchDict.templates.resultsFor.replace('{query}', searchQuery),
    description: searchDict.templates.pageDescription,
    url: `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
    inLanguage: seoDict.regional.language,
    
    mainContentOfPage: {
      '@type': 'WebPageElement',
      name: searchDict.accessibility.searchResultsLabel,
      description: `${resultsCount || 0} результатов для запроса "${searchQuery}"`,
    },

    breadcrumb: {
      '@type': 'BreadcrumbList',
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
          name: dictionary.navigation.labels.search,
          item: `${baseUrl}/ru/search`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: searchDict.templates.resultsFor.replace('{query}', searchQuery),
          item: `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery)}`,
        },
      ],
    },
  } : null;

  // ItemList schema for search results
  const itemListSchema = searchResults.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/ru/search?search=${encodeURIComponent(searchQuery || '')}#results`,
    name: `Результаты поиска для "${searchQuery}"`,
    description: `${searchResults.length} найденных результатов`,
    numberOfItems: searchResults.length,
    
    itemListElement: searchResults.map((result, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        '@id': result.url,
        name: result.title,
        description: result.description,
        url: result.url,
        author: result.author ? {
          '@type': 'Person',
          name: result.author,
        } : undefined,
        datePublished: result.datePublished,
        publisher: {
          '@type': 'Organization',
          name: seoDict.site.siteName,
        },
        inLanguage: seoDict.regional.language,
      },
    })),
  } : null;

  return (
    <>
      <SchemaBuilder schema={websiteSchema} priority="high" />
      {searchResultsSchema && (
        <SchemaBuilder schema={searchResultsSchema} priority="normal" />
      )}
      {itemListSchema && (
        <SchemaBuilder schema={itemListSchema} priority="normal" />
      )}
    </>
  );
};