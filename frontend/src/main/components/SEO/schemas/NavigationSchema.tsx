// src/main/components/SEO/schemas/NavigationSchema.tsx
// Navigation structured data using new dictionary and core builders

import React from 'react';
import { SchemaBuilder, createNavigationSchema, createWebsiteSchema } from '../core/SchemaBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { getCanonicalURL } from '@/main/lib/dictionary/helpers';

// ===================================================================
// NAVIGATION SCHEMA PROPS
// ===================================================================

export interface NavigationSchemaProps {
  readonly dictionary: Dictionary;
  readonly currentPath?: string;
}

// ===================================================================
// NAVIGATION SCHEMA COMPONENT
// ===================================================================

/**
 * Generate structured data for site navigation
 * Creates both SiteNavigationElement and WebSite schemas
 */
export const NavigationSchema: React.FC<NavigationSchemaProps> = ({
  dictionary,
  currentPath = '',
}) => {
  const navDict = dictionary.navigation;
  const seoDict = dictionary.seo;
  
  // Define navigation elements
  const navigationElements = [
    {
      name: navDict.labels.home,
      url: getCanonicalURL('/'),
      description: navDict.descriptions.home,
    },
    {
      name: navDict.labels.articles,
      url: getCanonicalURL('/articles'),
      description: navDict.descriptions.articles,
    },
    {
      name: navDict.labels.rubrics,
      url: getCanonicalURL('/rubrics'),
      description: navDict.descriptions.rubrics,
    },
    {
      name: navDict.labels.authors,
      url: getCanonicalURL('/authors'),
      description: navDict.descriptions.authors,
    },
  ];

  // Create navigation schemas
  const navigationSchemas = createNavigationSchema(
    navigationElements,
    navDict.seo.geographicAreas
  );

  // Create website schema with search functionality
  const websiteSchema = createWebsiteSchema(
    seoDict.site.siteName,
    getCanonicalURL('/'),
    seoDict.site.siteDescription,
    getCanonicalURL('/search')
  );

  // Combine all schemas
  const allSchemas = [websiteSchema, ...navigationSchemas];

  return <SchemaBuilder schema={allSchemas} priority="high" />;
};

// ===================================================================
// SPECIFIC NAVIGATION SCHEMAS
// ===================================================================

/**
 * Schema for main site navigation element
 */
export const MainNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const navDict = dictionary.navigation;
  const seoDict = dictionary.seo;

  const mainNavigationSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'SiteNavigationElement' as const,
    '@id': `${getCanonicalURL('/')}#main-navigation`,
    name: navDict.seo.navigationTitle,
    description: navDict.seo.navigationDescription,
    url: getCanonicalURL('/'),
    inLanguage: 'ru' as const,
    
    // Enhanced properties for main navigation
    audience: {
      '@type': 'Audience',
      name: navDict.seo.audience,
      geographicArea: navDict.seo.geographicAreas,
    },
    
    // Part of website
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getCanonicalURL('/')}#website`,
      name: seoDict.site.siteName,
      url: getCanonicalURL('/'),
    },
    
    // Accessibility information
    accessibilityControl: ['fullKeyboardControl', 'fullMouseControl'],
    accessibilityFeature: ['structuralNavigation', 'ARIA'],
    accessibilityHazard: ['none'],
  };

  return <SchemaBuilder schema={mainNavigationSchema} priority="high" />;
};

/**
 * Schema for mobile navigation
 */
export const MobileNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const navDict = dictionary.navigation;

  const mobileNavigationSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'SiteNavigationElement' as const,
    '@id': `${getCanonicalURL('/')}#mobile-navigation`,
    name: `${navDict.seo.navigationTitle} (мобильная версия)`,
    description: `${navDict.seo.navigationDescription} Адаптировано для мобильных устройств.`,
    url: getCanonicalURL('/'),
    inLanguage: 'ru' as const,
    
    // Mobile-specific properties
    audience: {
      '@type': 'Audience',
      name: 'Пользователи мобильных устройств',
      geographicArea: navDict.seo.geographicAreas,
    },
    
    // Enhanced accessibility for mobile
    accessibilityControl: ['fullTouchControl', 'fullKeyboardControl'],
    accessibilityFeature: ['touchNavigation', 'mobileOptimized', 'ARIA'],
    accessibilityHazard: ['none'],
  };

  return <SchemaBuilder schema={mobileNavigationSchema} priority="normal" />;
};

/**
 * Schema for search functionality
 */
export const SearchNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  const searchSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    '@id': `${getCanonicalURL('/')}#search`,
    name: seoDict.site.siteName,
    url: getCanonicalURL('/'),
    
    potentialAction: {
      '@type': 'SearchAction' as const,
      name: searchDict.accessibility.searchLabel,
      target: {
        '@type': 'EntryPoint' as const,
        urlTemplate: `${getCanonicalURL('/search')}?search={search_term_string}`,
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
  };

  return <SchemaBuilder schema={searchSchema} priority="high" />;
};

/**
 * Schema for breadcrumb navigation
 */
export interface BreadcrumbNavigationSchemaProps {
  dictionary: Dictionary;
  breadcrumbs: Array<{ name: string; href: string }>;
}

export const BreadcrumbNavigationSchema: React.FC<BreadcrumbNavigationSchemaProps> = ({
  dictionary,
  breadcrumbs,
}) => {
  if (breadcrumbs.length === 0) return null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    '@id': `${getCanonicalURL(breadcrumbs[breadcrumbs.length - 1]?.href || '/')}#breadcrumb`,
    
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: crumb.name,
      item: {
        '@type': 'WebPage',
        '@id': getCanonicalURL(crumb.href),
        name: crumb.name,
        url: getCanonicalURL(crumb.href),
        inLanguage: 'ru',
      },
    })),
    
    // Enhanced properties
    numberOfItems: breadcrumbs.length,
    name: 'Навигационная цепочка',
    description: `Путь навигации: ${breadcrumbs.map(b => b.name).join(' > ')}`,
  };

  return <SchemaBuilder schema={breadcrumbSchema} priority="normal" />;
};

// ===================================================================
// UTILITY COMPONENTS
// ===================================================================

/**
 * Complete navigation schema bundle
 * Includes all navigation-related structured data
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
};

/**
 * Minimal navigation schema for performance-critical pages
 */
export const MinimalNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  return (
    <>
      <NavigationSchema dictionary={dictionary} />
      <SearchNavigationSchema dictionary={dictionary} />
    </>
  );
};