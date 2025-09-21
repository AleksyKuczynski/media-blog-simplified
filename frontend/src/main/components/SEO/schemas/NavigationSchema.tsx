// src/main/components/SEO/schemas/NavigationSchema.tsx
// FIXED: Compatible with existing dictionary.ts structure

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';
import { generateNavigationElements } from '@/main/lib/dictionary/helpers/navigation';

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
// MAIN NAVIGATION SCHEMA COMPONENT
// ===================================================================

/**
 * Generate structured data for site navigation
 * FIXED: Uses existing dictionary structure only
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
    
    // Use existing helper function
    const navigationElements = generateNavigationElements(dictionary);

    // Create individual navigation schemas
    const navigationSchemas = navigationElements.map((element, index) => ({
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      '@id': `${element.url}#navigation-${index}`,
      name: element.name,
      description: element.description,
      url: element.url,
      inLanguage: 'ru',
      position: index + 1,
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },
    }));

    // Create website schema with search functionality
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seoDict.site.name,
      description: seoDict.site.description,
      url: baseUrl,
      inLanguage: 'ru',
      
      // Add search capability using existing dictionary entries
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform'
          ],
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueName: 'search_term_string',
          valueRequired: true,
          valueMinLength: 2,
          valueMaxLength: 100,
        },
      },
    };

    // Combine all schemas
    const allSchemas = [websiteSchema, ...navigationSchemas];

    // Create combined schema with @graph
    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': allSchemas,
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
    console.error('NavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// MAIN NAVIGATION SCHEMA - Simplified version
// ===================================================================

export const MainNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('MainNavigationSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);

    const mainNavigationSchema = {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      '@id': `${baseUrl}#main-navigation`,
      name: dictionary.navigation.accessibility.mainNavigation,
      description: dictionary.navigation.accessibility.mainNavigation,
      url: baseUrl,
      inLanguage: 'ru',
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mainNavigationSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('MainNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// MOBILE NAVIGATION SCHEMA
// ===================================================================

export const MobileNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('MobileNavigationSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);

    const mobileNavigationSchema = {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      '@id': `${baseUrl}#mobile-navigation`,
      name: dictionary.navigation.accessibility.mainNavigation,
      description: dictionary.navigation.accessibility.mainNavigation,
      url: baseUrl,
      inLanguage: 'ru',
      audience: {
        '@type': 'Audience',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mobileNavigationSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('MobileNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH NAVIGATION SCHEMA - FIXED to use existing dictionary
// ===================================================================

export const SearchNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('SearchNavigationSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const searchSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#search`,
      name: seoDict.site.name,
      url: baseUrl,
      inLanguage: 'ru',
      
      potentialAction: {
        '@type': 'SearchAction',
        // FIXED: Use existing dictionary.search.templates.pageTitle instead of non-existent searchAction
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
          // FIXED: Use existing dictionary.search.labels.placeholder instead of non-existent queryTerm
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
          __html: JSON.stringify(searchSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('SearchNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// BREADCRUMB NAVIGATION SCHEMA
// ===================================================================

export const BreadcrumbNavigationSchema: React.FC<BreadcrumbNavigationSchemaProps> = ({
  dictionary,
  breadcrumbs,
}) => {
  try {
    if (!breadcrumbs.length || !dictionary.seo?.site) {
      return null;
    }

    const baseUrl = dictionary.seo.site.url;
    const currentUrl = breadcrumbs[breadcrumbs.length - 1]?.href;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}${currentUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.href}`,
      })),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2),
        }}
      />
    );
    
  } catch (error) {
    console.error('BreadcrumbNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// CONVENIENCE COMPONENTS
// ===================================================================

/**
 * Complete navigation schema with all components
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
 */
export const MinimalNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  return <MainNavigationSchema dictionary={dictionary} />;
};

export default NavigationSchema;