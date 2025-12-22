// frontend/src/shared/seo/schemas/NavigationSchema.tsx

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { generateCanonicalUrl } from '@/config/i18n/helpers/seo';
import { generateNavigationElements } from '@/config/i18n/helpers/navigation';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// NAVIGATION SCHEMA TYPES
// ===================================================================

export interface NavigationSchemaProps {
  readonly dictionary: Dictionary;
  readonly currentPath?: string;
}

export interface BreadcrumbNavigationSchemaProps {
  readonly dictionary: Dictionary;
  readonly breadcrumbs: Array<{ name: string; href: string }>;
}

// ===================================================================
// MAIN NAVIGATION SCHEMA COMPONENT - REFACTORED
// ===================================================================

/**
 * Generate structured data for site navigation
 * REFACTORED: Uses SchemaComposer for standardized generation
 */
export const NavigationSchema: React.FC<NavigationSchemaProps> = ({
  dictionary,
  currentPath = '',
}) => {
  try {
    const seoDict = dictionary.seo;
    
    // Validate dictionary structure
    if (!dictionary.navigation?.labels || !dictionary.navigation?.descriptions || !seoDict?.site) {
      console.error('NavigationSchema: Invalid dictionary structure');
      return null;
    }
    
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const navigationElements = generateNavigationElements(dictionary);

    // Use SchemaComposer for standardized navigation schema
    const composer = new SchemaComposer(dictionary, baseUrl)
      .addWebsite(); // Automatically includes search functionality

    // Add individual navigation elements
    navigationElements.forEach((element, index) => {
      composer.addCustomSchema({
        '@type': 'SiteNavigationElement',
        '@id': `${element.url}#navigation-${index}`,
        name: element.name,
        description: element.description,
        url: element.url,
        position: index + 1,
      });
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
    console.error('NavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SIMPLIFIED NAVIGATION COMPONENTS - REFACTORED
// ===================================================================

/**
 * Main navigation schema - simplified with SchemaComposer
 */
export const MainNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);

    const schema = new SchemaComposer(dictionary, baseUrl)
      .addCustomSchema({
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}#main-navigation`,
        name: dictionary.navigation.accessibility.mainNavigation,
        description: dictionary.navigation.accessibility.mainNavigation,
        url: baseUrl,
        position: 1,
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
    console.error('MainNavigationSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Mobile navigation schema - simplified with SchemaComposer
 */
export const MobileNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const baseUrl = generateCanonicalUrl('/', dictionary.seo.site.url);

    const schema = new SchemaComposer(dictionary, baseUrl)
      .addCustomSchema({
        '@type': 'SiteNavigationElement',
        '@id': `${baseUrl}#mobile-navigation`,
        name: dictionary.navigation.accessibility.mainNavigation,
        description: dictionary.navigation.accessibility.mainNavigation,
        url: baseUrl,
        position: 1,
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
    console.error('MobileNavigationSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Search navigation schema - simplified with SchemaComposer
 */
export const SearchNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const schema = new SchemaComposer(dictionary, baseUrl)
      .addCustomSchema({
        '@type': 'WebSite',
        '@id': `${baseUrl}#search`,
        name: seoDict.site.name,
        url: baseUrl,
        
        potentialAction: {
          '@type': 'SearchAction',
          name: dictionary.search.templates.pageTitle,
          description: `${dictionary.search.templates.pageDescription} на ${seoDict.site.name}`,
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
    console.error('SearchNavigationSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Breadcrumb navigation schema - using standard SchemaComposer
 */
export const BreadcrumbNavigationSchema: React.FC<BreadcrumbNavigationSchemaProps> = ({
  dictionary,
  breadcrumbs,
}) => {
  try {
    if (!breadcrumbs.length || !dictionary.seo?.site) {
      return null;
    }

    const baseUrl = dictionary.seo.site.url;
    const currentUrl = breadcrumbs[breadcrumbs.length - 1]?.href || '/';

    const schema = new SchemaComposer(dictionary, `${baseUrl}${currentUrl}`)
      .addBreadcrumbs(breadcrumbs)
      .build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        enableOptimization={true}
      />
    );
  } catch (error) {
    console.error('BreadcrumbNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// CONVENIENCE COMPONENTS - SIMPLIFIED
// ===================================================================

/**
 * Complete navigation schema with all components
 * REFACTORED: Much simpler composition
 */
export const CompleteNavigationSchema: React.FC<NavigationSchemaProps> = (props) => {
  return (
    <>
      <NavigationSchema {...props} />
      <SearchNavigationSchema dictionary={props.dictionary} />
    </>
  );
};

/**
 * Minimal navigation schema for performance-critical pages
 * REFACTORED: Uses simplified MainNavigationSchema
 */
export const MinimalNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  return <MainNavigationSchema dictionary={dictionary} />;
};

export default NavigationSchema;