// src/main/components/SEO/schemas/NavigationSchema.tsx
// Fixed navigation structured data - corrected dictionary paths

import React from 'react';
import { SchemaBuilder, createNavigationSchema, createWebsiteSchema } from '../core/SchemaBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { getCanonicalURL } from '@/main/lib/dictionary/helpers';
import { ExtendedSchemaData } from '../core/types';

// ===================================================================
// NAVIGATION SCHEMA PROPS
// ===================================================================

export interface NavigationSchemaProps {
  readonly dictionary: Dictionary;
  readonly currentPath?: string;
}

// ===================================================================
// NAVIGATION SCHEMA COMPONENT - FIXED
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
  
  // Define navigation elements using correct dictionary paths
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

  // Create navigation schemas - use correct geographic data from SEO section
  const navigationSchemas = createNavigationSchema(
    navigationElements,
    seoDict.regional.targetMarkets // FIXED: was navDict.seo.geographicAreas
  );

  // Create website schema with search functionality - use correct property names
  const websiteSchema = createWebsiteSchema(
    seoDict.site.name, // FIXED: was siteName
    getCanonicalURL('/'),
    seoDict.site.description, // FIXED: was siteDescription
    getCanonicalURL('/search')
  );

  // Combine all schemas
  const allSchemas = [websiteSchema, ...navigationSchemas];

  return <SchemaBuilder schema={allSchemas} priority="high" />;
};

// ===================================================================
// SPECIFIC NAVIGATION SCHEMAS - FIXED
// ===================================================================

/**
 * Schema for main site navigation element
 */
export const MainNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const navDict = dictionary.navigation;
  const seoDict = dictionary.seo;

  const mainNavigationSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${getCanonicalURL('/')}#main-navigation`,
    name: `Навигация ${seoDict.site.name}`, // Create title from available data
    description: `Основная навигация по сайту ${seoDict.site.name}`,
    url: getCanonicalURL('/'),
    inLanguage: 'ru',
    
    // Enhanced properties for main navigation using available data
    audience: {
      '@type': 'Audience',
      name: `Аудитория ${seoDict.site.name}`,
      geographicArea: seoDict.regional.targetMarkets, // Use available geographic data
    },
    
    // Part of website
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getCanonicalURL('/')}#website`,
      name: seoDict.site.name, // FIXED: use correct property
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
  const seoDict = dictionary.seo;

  const mobileNavigationSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${getCanonicalURL('/')}#mobile-navigation`,
    name: `${seoDict.site.name} (мобильная версия)`, // FIXED: use available data
    description: `Мобильная навигация по сайту ${seoDict.site.name}`,
    url: getCanonicalURL('/'),
    inLanguage: 'ru',
    
    // Mobile-specific properties
    audience: {
      '@type': 'Audience',
      name: 'Пользователи мобильных устройств',
      geographicArea: seoDict.regional.targetMarkets, // Use available data
    },
    
    // Enhanced accessibility for mobile
    accessibilityControl: ['fullTouchControl', 'fullKeyboardControl'],
    accessibilityFeature: ['touchNavigation', 'mobileOptimized', 'ARIA'],
    accessibilityHazard: ['none'],
  };

  return <SchemaBuilder schema={mobileNavigationSchema} priority="normal" />;
};

/**
 * Schema for search functionality - FIXED
 */
export const SearchNavigationSchema: React.FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;

  const searchSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getCanonicalURL('/')}#search`,
    name: seoDict.site.name,
    url: getCanonicalURL('/'),
    inLanguage: 'ru',
    
    potentialAction: {
      '@type': 'SearchAction',
      name: searchDict.labels.submit, // Use available search label
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getCanonicalURL('/search')}?search={search_term_string}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueName: 'search_term_string',
        description: searchDict.labels.placeholder, // Use available description
        valueRequired: true,
        valueMinLength: 3,
        valueMaxLength: 100,
      },
    },
  };

  return <SchemaBuilder schema={searchSchema} priority="high" />;
};

/**
 * Schema for breadcrumb navigation - FIXED
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

  const breadcrumbSchema: ExtendedSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${getCanonicalURL(breadcrumbs[breadcrumbs.length - 1]?.href || '/')}#breadcrumb`,
    
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
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
// UTILITY COMPONENTS - FIXED
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