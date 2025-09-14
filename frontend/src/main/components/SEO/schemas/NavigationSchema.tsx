// src/main/components/SEO/schemas/NavigationSchema.tsx
// DRY: Uses existing helpers instead of self-contained functions

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { ExtendedSchemaData } from '../core/types';
import {
  generateCanonicalUrl,
  generateNavigationElements,
} from '@/main/lib/dictionary/helpers';

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
// MAIN NAVIGATION SCHEMA COMPONENT - DRY
// ===================================================================

/**
 * Generate structured data for site navigation
 * NO DUPLICATION - uses existing helper functions
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
    
    // Use existing helper function - NO DUPLICATION
    const navigationElements = generateNavigationElements(dictionary);

    // Create individual navigation schemas
    const navigationSchemas: ExtendedSchemaData[] = navigationElements.map((element, index) => ({
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

    // Create website schema with search functionality - using existing helper
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);
    
    const websiteSchema: ExtendedSchemaData = {
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
          valueMinLength: 3,
          valueMaxLength: 100,
        },
      },
    };

    // Combine all schemas
    const allSchemas = [websiteSchema, ...navigationSchemas];

    return <SchemaBuilder schema={allSchemas} priority="high" />;
    
  } catch (error) {
    console.error('NavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// MAIN NAVIGATION SCHEMA - DRY
// ===================================================================

export const MainNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('MainNavigationSchema: Invalid dictionary structure');
      return null;
    }

    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);

    const mainNavigationSchema: ExtendedSchemaData = {
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
      },
      
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}#website`,
        name: seoDict.site.name,
        url: baseUrl,
      },
      
      accessibilityControl: ['fullKeyboardControl', 'fullMouseControl'],
      accessibilityFeature: ['structuralNavigation', 'ARIA'],
      accessibilityHazard: ['none'],
    };

    return <SchemaBuilder schema={mainNavigationSchema} priority="high" />;
    
  } catch (error) {
    console.error('MainNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// MOBILE NAVIGATION SCHEMA - DRY
// ===================================================================

export const MobileNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('MobileNavigationSchema: Invalid dictionary structure');
      return null;
    }

    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);

    const mobileNavigationSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      '@id': `${baseUrl}#mobile-navigation`,
      name: `${seoDict.site.name} (мобильная навигация)`,
      description: `Мобильная навигация по сайту ${seoDict.site.name}`,
      url: baseUrl,
      inLanguage: 'ru',
      
      audience: {
        '@type': 'Audience',
        name: 'Пользователи мобильных устройств',
        geographicArea: seoDict.regional?.targetMarkets || ['Russia'],
      },
      
      accessibilityControl: ['fullTouchControl', 'fullKeyboardControl'],
      accessibilityFeature: ['touchNavigation', 'mobileOptimized', 'ARIA'],
      accessibilityHazard: ['none'],
    };

    return <SchemaBuilder schema={mobileNavigationSchema} priority="normal" />;
    
  } catch (error) {
    console.error('MobileNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// SEARCH NAVIGATION SCHEMA - DRY
// ===================================================================

export const SearchNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  try {
    const seoDict = dictionary.seo;
    
    if (!seoDict?.site) {
      console.error('SearchNavigationSchema: Invalid dictionary structure');
      return null;
    }

    // Use existing helper - NO DUPLICATION
    const baseUrl = generateCanonicalUrl('/', seoDict.site.url);
    const searchUrl = generateCanonicalUrl('/search', seoDict.site.url);

    const searchSchema: ExtendedSchemaData = {
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

    return <SchemaBuilder schema={searchSchema} priority="high" />;
    
  } catch (error) {
    console.error('SearchNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// BREADCRUMB NAVIGATION SCHEMA - DRY
// ===================================================================

export const BreadcrumbNavigationSchema: React.FC<BreadcrumbNavigationSchemaProps> = ({
  dictionary,
  breadcrumbs,
}) => {
  try {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return null;
    }

    // Validate breadcrumbs structure
    const validBreadcrumbs = breadcrumbs.filter(crumb => 
      crumb.name && crumb.href && typeof crumb.name === 'string'
    );

    if (validBreadcrumbs.length === 0) {
      return null;
    }

    // Use existing helper for URL generation - NO DUPLICATION
    const baseUrl = dictionary.seo.site.url;
    const lastCrumbUrl = generateCanonicalUrl(
      validBreadcrumbs[validBreadcrumbs.length - 1]?.href || '/', 
      baseUrl
    );

    const breadcrumbSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${lastCrumbUrl}#breadcrumb`,
      
      itemListElement: validBreadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage',
          '@id': generateCanonicalUrl(crumb.href, baseUrl),
          name: crumb.name,
          url: generateCanonicalUrl(crumb.href, baseUrl),
          inLanguage: 'ru',
        },
      })),
      
      numberOfItems: validBreadcrumbs.length,
      name: 'Навигационная цепочка',
      description: `Путь навигации: ${validBreadcrumbs.map(b => b.name).join(' > ')}`,
    };

    return <SchemaBuilder schema={breadcrumbSchema} priority="normal" />;
    
  } catch (error) {
    console.error('BreadcrumbNavigationSchema: Error generating schema', error);
    return null;
  }
};

// ===================================================================
// UTILITY COMPONENTS - DRY
// ===================================================================

/**
 * Complete navigation schema bundle - NO DUPLICATION
 */
export const CompleteNavigationSchema: React.FC<{
  dictionary: Dictionary;
  currentPath?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
  includeMobile?: boolean;
}> = ({
  dictionary,
  currentPath,
  breadcrumbs = [],
  includeMobile = true,
}) => {
  try {
    return (
      <>
        <NavigationSchema dictionary={dictionary} currentPath={currentPath} />
        <MainNavigationSchema dictionary={dictionary} />
        <SearchNavigationSchema dictionary={dictionary} />
        
        {includeMobile && <MobileNavigationSchema dictionary={dictionary} />}
        
        {breadcrumbs.length > 0 && (
          <BreadcrumbNavigationSchema 
            dictionary={dictionary} 
            breadcrumbs={breadcrumbs} 
          />
        )}
      </>
    );
  } catch (error) {
    console.error('CompleteNavigationSchema: Error rendering navigation schemas', error);
    return null;
  }
};

/**
 * Minimal navigation schema - NO DUPLICATION
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