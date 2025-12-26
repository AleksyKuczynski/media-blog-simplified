// src/shared/seo/schemas/HomePageSchema.tsx

import React from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// HOME PAGE SCHEMA TYPES
// ===================================================================

export interface HomePageSchemaProps {
  dictionary: Dictionary;
  lang: Lang;
  currentPath?: string;
}

// ===================================================================
// MAIN HOME PAGE SCHEMA COMPONENT
// ===================================================================

/**
 * Generate structured data for home page
 * Uses SchemaComposer for standardized generation
 * 
 * Includes:
 * - Organization schema
 * - WebSite schema with search action
 * - ItemList for main sections (articles, rubrics, authors)
 */
export const HomePageSchema: React.FC<HomePageSchemaProps> = ({
  dictionary,
  lang,
  currentPath = '',
}) => {
  try {
    const { seo, navigation } = dictionary;

    if (!seo?.site || !navigation?.labels) {
      console.error('HomePageSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = seo.site.url.replace(/\/$/, '');
    const canonicalUrl = currentPath ? `${baseUrl}${currentPath}` : baseUrl;

    // Create main sections list
    const mainSections = [
      {
        name: navigation.labels.articles,
        url: `${baseUrl}/${lang}/articles`,
        description: navigation.descriptions?.articles || navigation.labels.articles,
      },
      {
        name: navigation.labels.rubrics,
        url: `${baseUrl}/${lang}/rubrics`,
        description: navigation.descriptions?.rubrics || navigation.labels.rubrics,
      },
      {
        name: navigation.labels.authors,
        url: `${baseUrl}/${lang}/authors`,
        description: navigation.descriptions?.authors || navigation.labels.authors,
      },
    ];

    // Use SchemaComposer for standardized schema generation
    const composer = new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization('editorial')
      .addWebsite();

    // Add WebPage schema for home page
    composer.addCustomSchema({
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: dictionary.sections.home.welcomeTitle,
      description: dictionary.sections.home.welcomeDescription,
      url: canonicalUrl,
      
      // Main sections as structured data
      mainEntity: {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#main-sections`,
        name: navigation.accessibility?.primarySectionsLabel || 'Main sections',
        description: seo.site.description,
        numberOfItems: mainSections.length,
        
        itemListElement: mainSections.map((section, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CollectionPage',
            '@id': section.url,
            name: section.name,
            url: section.url,
            description: section.description,
          },
        })),
      },
    });

    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="high"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('HomePageSchema: Error generating schema', error);
    return null;
  }
};

export default HomePageSchema;