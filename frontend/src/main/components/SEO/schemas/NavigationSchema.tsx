// src/main/components/SEO/schemas/NavigationSchema.tsx
// FIXED: Updated to work with new dictionary structure and correct imports

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
 * FIXED: Uses correct helper functions and dictionary structure
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
      
      // Add search capability
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
      name: `Главная навигация ${seoDict.site.name}`,
      description: `Основная навигация по сайту ${seoDict.site.name}`,
      url: baseUrl,
      inLanguage: 'ru',
      
      audience: {
        '@type': 'Audience',
        name: `Аудитория ${seoDict.site.name}`,
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
        audienceType: 'Русскоязычная аудитория',
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
    const navDict = dictionary.navigation;
    
    if (!seoDict?.site || !navDict?.accessibility) {
      console.error('MobileNavigationSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);

    const mobileNavigationSchema = {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      '@id': `${baseUrl}#mobile-navigation`,
      name: `${seoDict.site.name} Mobile Navigation`,
      applicationCategory: 'WebApplication',
      operatingSystem: ['iOS', 'Android', 'Windows'],
      
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB',
      },
      
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
// SEARCH NAVIGATION SCHEMA
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
        name: 'Поиск по сайту',
        description: `Поиск материалов на ${seoDict.site.name}`,
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
          description: 'Поисковый запрос',
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
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site || !breadcrumbs.length) {
      return null;
    }

    const baseUrl = seoDict.site.url;

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage',
          '@id': `${baseUrl}${crumb.href}`,
          url: `${baseUrl}${crumb.href}`,
        },
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
export const CompleteNavigationSchema: React.FC<{
  dictionary: Dictionary;
  currentPath?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
}> = ({ dictionary, currentPath, breadcrumbs }) => {
  try {
    return (
      <>
        <NavigationSchema dictionary={dictionary} currentPath={currentPath} />
        <SearchNavigationSchema dictionary={dictionary} />
        {breadcrumbs && <BreadcrumbNavigationSchema dictionary={dictionary} breadcrumbs={breadcrumbs} />}
      </>
    );
  } catch (error) {
    console.error('CompleteNavigationSchema: Error rendering navigation schemas', error);
    return null;
  }
};

/**
 * Minimal navigation schema for basic pages
 */
export const MinimalNavigationSchema: React.FC<{
  dictionary: Dictionary;
  currentPath?: string;
}> = ({ dictionary, currentPath }) => {
  try {
    return (
      <>
        <NavigationSchema dictionary={dictionary} currentPath={currentPath} />
        <SearchNavigationSchema dictionary={dictionary} />
      </>
    );
  } catch (error) {
    console.error('MinimalNavigationSchema: Error rendering minimal navigation schemas', error);
    return null;
  }
};

export default NavigationSchema;