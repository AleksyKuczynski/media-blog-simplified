// src/main/components/SEO/core/SchemaBuilder.tsx
// Fixed schema logic for JSON-LD structured data generation

import React from 'react';
import { 
  BaseSchemaData,
  ExtendedSchemaData,
  SchemaBuilderProps,
  NavigationElementSchema,
  WebsiteSchema,
  OrganizationSchema,
  BreadcrumbSchema 
} from './types';

// ===================================================================
// SCHEMA VALIDATION - FIXED
// ===================================================================

/**
 * Validate schema data structure - more flexible validation
 */
const validateSchema = (schema: BaseSchemaData | ExtendedSchemaData): boolean => {
  if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
    console.warn('Schema: @context must be "https://schema.org"');
    return false;
  }
  
  if (!schema['@type'] || typeof schema['@type'] !== 'string') {
    console.warn('Schema: @type is required and must be a string');
    return false;
  }
  
  // Only validate required fields if they exist in the schema type
  if ('name' in schema && (!schema.name || typeof schema.name !== 'string')) {
    console.warn('Schema: name is required and must be a string');
    return false;
  }
  
  if ('url' in schema && schema.url && !isValidUrl(schema.url)) {
    console.warn('Schema: url must be a valid URL if provided');
    return false;
  }

  return true;
};

/**
 * Helper function to validate URLs
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ===================================================================
// SCHEMA BUILDER COMPONENT - FIXED
// ===================================================================

/**
 * Renders JSON-LD structured data script tags
 */
export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ 
  schema, 
  priority = 'normal' 
}) => {
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  // Validate all schemas in development
  if (process.env.NODE_ENV === 'development') {
    schemas.forEach((s, index) => {
      if (!validateSchema(s)) {
        console.warn(`Schema validation failed for schema at index ${index}:`, s);
      }
    });
  }

  return (
    <>
      {schemas.map((schemaData, index) => (
        <script
          key={`schema-${schemaData['@type']}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData, null, process.env.NODE_ENV === 'development' ? 2 : 0)
          }}
          {...(priority === 'high' && { 'data-priority': 'high' })}
        />
      ))}
    </>
  );
};

// ===================================================================
// SCHEMA FACTORY FUNCTIONS - FIXED
// ===================================================================

/**
 * Create navigation element schema
 */
export const createNavigationElementSchema = (
  name: string,
  url: string,
  description: string,
  position: number,
  geographicAreas: readonly string[] = ['Russia']
): NavigationElementSchema => ({
  '@context': 'https://schema.org',
  '@type': 'SiteNavigationElement',
  '@id': `${url}#navigation-${position}`,
  name,
  description,
  url,
  inLanguage: 'ru',
  position,
  audience: {
    '@type': 'Audience',
    geographicArea: geographicAreas as string[],
  },
});

/**
 * Create website schema with search functionality - FIXED
 */
export const createWebsiteSchema = (
  name: string,
  url: string,
  description?: string,
  searchUrl?: string
): WebsiteSchema => {
  // Create schema with all properties upfront to avoid readonly issues
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name,
    url,
    inLanguage: 'ru',
    description,
    // Add potentialAction conditionally during creation
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      }
    }),
  };

  return schema;
};

/**
 * Create organization schema
 */
export const createOrganizationSchema = (
  name: string,
  url: string,
  description: string,
  email?: string,
  socialProfiles?: readonly string[],
  areaServed?: readonly string[]
): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${url}#organization`,
  name,
  description,
  url,
  inLanguage: 'ru',
  email,
  sameAs: socialProfiles as string[],
  areaServed: areaServed as string[],
});

/**
 * Create breadcrumb schema - FIXED to use ExtendedSchemaData
 */
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${items[items.length - 1]?.url || '/'}#breadcrumb`,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url, // Simplified - just use URL string
  })),
  numberOfItems: items.length,
});

/**
 * Create collection page schema - FIXED
 */
export const createCollectionPageSchema = (
  name: string,
  url: string,
  description: string,
  itemCount: number,
  collectionType: string,
  items?: Array<{ name: string; url: string }>
): ExtendedSchemaData => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${url}#collection`,
  name,
  description,
  url,
  inLanguage: 'ru',
  mainEntity: {
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: itemCount,
    itemListElement: items?.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })) || [],
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'collectionType',
      value: collectionType,
    },
    {
      '@type': 'PropertyValue',
      name: 'language',
      value: 'ru',
    },
  ],
});

// ===================================================================
// UTILITY FUNCTIONS - FIXED
// ===================================================================

/**
 * Combine multiple schemas into a single array
 */
export const combineSchemas = (...schemas: (BaseSchemaData | ExtendedSchemaData | (BaseSchemaData | ExtendedSchemaData)[])[]): (BaseSchemaData | ExtendedSchemaData)[] => {
  return schemas.flat().filter(Boolean);
};

/**
 * Get schema script content as string (for server-side rendering)
 */
export const getSchemaScript = (schema: BaseSchemaData | ExtendedSchemaData): string => {
  return JSON.stringify(schema, null, 0);
};

/**
 * Validate and sanitize schema data - FIXED
 */
export const sanitizeSchema = (schema: BaseSchemaData | ExtendedSchemaData): BaseSchemaData | ExtendedSchemaData => {
  // Create a new object with validated properties
  const sanitized: any = { ...schema };
  
  // Ensure required properties
  if (!sanitized['@context']) {
    sanitized['@context'] = 'https://schema.org';
  }
  
  // Validate URLs - only remove if invalid and optional
  if (sanitized.url && !isValidUrl(sanitized.url)) {
    console.warn('Invalid URL in schema, removing:', sanitized.url);
    // Create new object without url instead of using delete
    const { url, ...rest } = sanitized;
    return rest as BaseSchemaData | ExtendedSchemaData;
  }
  
  return sanitized;
};

/**
 * Create navigation schema for multiple elements
 */
export const createNavigationSchema = (
  elements: Array<{
    name: string;
    url: string;
    description: string;
  }>,
  geographicAreas: readonly string[] = ['Russia']
): NavigationElementSchema[] => {
  return elements.map((element, index) =>
    createNavigationElementSchema(
      element.name,
      element.url,
      element.description,
      index + 1,
      geographicAreas
    )
  );
};