// src/main/components/SEO/schemas/SearchPageSchema.tsx 

import React from 'react';
import { SchemaBuilder } from "../core/SchemaBuilder";
import { Dictionary } from "@/main/lib/dictionary/types";
import { ExtendedSchemaData } from "../core/types";

interface StaticSearchPageSchemaProps {
  readonly dictionary: Dictionary;
}

/**
 * SearchPageSchema - SIMPLIFIED for static generation only
 * Creates only generic WebSite schema with SearchAction - no dynamic results
 */
export const SearchPageSchema: React.FC<StaticSearchPageSchemaProps> = ({
  dictionary
}) => {
  const baseUrl = 'https://event4me.eu';
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  // SIMPLIFIED: Only static WebSite schema with SearchAction
  const websiteSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: seoDict.site.siteName,
    description: seoDict.site.siteDescription,
    url: baseUrl,
    inLanguage: seoDict.regional.language,
    
    // Static SearchAction for SEO
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

    // Static publisher info
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

  // SIMPLIFIED: Only return static schema
  return <SchemaBuilder schema={websiteSchema} priority="high" />;
};