// src/main/components/SEO/core/SchemaBuilder.tsx
// All TypeScript errors resolved

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary';
import { generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';
import { 
  ExtendedSchemaData,
  SchemaBuilderProps
} from './types';

// ===================================================================
// ENHANCED SCHEMA FACTORIES - Russian Market Optimized
// ===================================================================

/**
 * Create standardized Organization schema from dictionary
 * Proper handling of readonly arrays
 */
export const createStandardOrganizationSchema = (
  dictionary: Dictionary,
  contactType: 'editorial' | 'customer support' = 'editorial'
): ExtendedSchemaData => {
  const { seo } = dictionary;
  const baseUrl = seo.site.url.replace(/\/$/, '');
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: seo.site.name,
    url: baseUrl,
    description: seo.site.organizationDescription,
    inLanguage: 'ru',
    
    // Standard logo configuration
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 200,
      height: 80,
      caption: seo.site.name,
    },
    
    // Contact information
    contactPoint: {
      '@type': 'ContactPoint',
      email: seo.site.contactEmail,
      contactType,
      availableLanguage: ['ru', 'Russian'],
      areaServed: {
        '@type': 'Country',
        name: 'Россия',
      },
    },
    
    // Convert readonly string[] to string[]
    ...(seo.site.socialProfiles.length > 0 && {
      sameAs: [...seo.site.socialProfiles], // Convert readonly to mutable
    }),
    
    // Geographic targeting
    areaServed: seo.site.geographicAreas.map(area => ({
      '@type': 'Country' as const,
      name: area,
    })),
    
    // Founding information
    foundingDate: '2023',
    foundingLocation: {
      '@type': 'Country' as const,
      name: 'Россия',
    },
  };
};

/**
 * Create standardized Website schema with search functionality
 */
export const createStandardWebsiteSchema = (
  dictionary: Dictionary,
  currentPath?: string
): ExtendedSchemaData => {
  const { seo } = dictionary;
  const baseUrl = generateCanonicalUrl('/', seo.site.url);
  const searchUrl = generateCanonicalUrl('/search', seo.site.url);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: seo.site.name,
    url: baseUrl,
    description: seo.site.description,
    inLanguage: 'ru',
    
    // Publisher reference
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    
    // Search functionality
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}?q={search_term_string}`,
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
    
    // Geographic targeting
    audience: createRussianAudienceSchema(dictionary),
  };
};

/**
 * Create standardized Breadcrumb schema from dictionary
 * Return type can be null, so use ExtendedSchemaData | null
 */
export const createStandardBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; href?: string }>,
  canonicalUrl: string,
  baseUrl: string
): ExtendedSchemaData | null => {
  if (!breadcrumbs.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    numberOfItems: breadcrumbs.length,
    
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: {
        '@type': 'WebPage',
        '@id': index === breadcrumbs.length - 1 
          ? canonicalUrl 
          : crumb.href 
            ? `${baseUrl}${crumb.href}`
            : canonicalUrl,
        url: index === breadcrumbs.length - 1 
          ? canonicalUrl 
          : crumb.href 
            ? `${baseUrl}${crumb.href}`
            : canonicalUrl,
      },
    })),
  };
};

/**
 * Create Russian audience targeting schema
 * Literal type for '@type'
 */
export const createRussianAudienceSchema = (dictionary: Dictionary) => ({
  '@type': 'Audience' as const, // Use literal type
  geographicArea: dictionary.seo.regional.targetMarkets.map(market => ({
    '@type': 'Country' as const,
    name: market,
  })),
  audienceType: 'Русскоязычная аудитория',
  suggestedMinAge: 16,
  suggestedMaxAge: 65,
});

/**
 * Create standard ItemList schema for collections
 */
export const createStandardItemListSchema = (
  id: string,
  name: string,
  description: string,
  items: Array<{
    name: string;
    url: string;
    description?: string;
    type?: string;
    additionalData?: Record<string, any>;
  }>
): ExtendedSchemaData => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': id,
  name,
  description,
  numberOfItems: items.length,
  inLanguage: 'ru',
  
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    description: item.description,
    item: {
      '@type': item.type || 'Thing',
      '@id': item.url,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description }),
      ...item.additionalData,
    },
  })),
});

// ===================================================================
// SCHEMA COMPOSER CLASS - Fluent API for Complex Schemas
// ===================================================================

export class SchemaComposer {
  private schemas: ExtendedSchemaData[] = [];
  private dictionary: Dictionary;
  private baseUrl: string;
  private canonicalUrl: string;

  constructor(dictionary: Dictionary, canonicalUrl: string) {
    this.dictionary = dictionary;
    this.baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
    this.canonicalUrl = canonicalUrl;
  }

  /**
   * Add standard organization schema
   */
  addOrganization(contactType?: 'editorial' | 'customer support'): this {
    this.schemas.push(createStandardOrganizationSchema(this.dictionary, contactType));
    return this;
  }

  /**
   * Add standard website schema
   */
  addWebsite(): this {
    this.schemas.push(createStandardWebsiteSchema(this.dictionary));
    return this;
  }

  /**
   * Add breadcrumb schema
   * Handle null return value
   */
  addBreadcrumbs(breadcrumbs: Array<{ name: string; href?: string }>): this {
    const breadcrumbSchema = createStandardBreadcrumbSchema(
      breadcrumbs, 
      this.canonicalUrl, 
      this.baseUrl
    );
    if (breadcrumbSchema) {
      this.schemas.push(breadcrumbSchema);
    }
    return this;
  }

  /**
   * Add custom schema with automatic common properties injection
   */
  addCustomSchema(schema: Partial<ExtendedSchemaData>): this {
    const enhancedSchema: ExtendedSchemaData = {
      '@context': 'https://schema.org',
      '@type': schema['@type'] || 'Thing', // Ensure @type is always present
      inLanguage: 'ru',
      audience: createRussianAudienceSchema(this.dictionary),
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${this.baseUrl}#website`,
      },
      publisher: {
        '@id': `${this.baseUrl}#organization`,
      },
      ...schema,
    };
    
    this.schemas.push(enhancedSchema);
    return this;
  }

  /**
   * Add Article schema with standard properties
   */
  addArticle(data: {
    title: string;
    description: string;
    author: { name: string; slug?: string };
    publishedAt: string;
    modifiedAt: string;
    imageUrl?: string;
    section?: string;
    tags?: string[];
    wordCount?: number;
    readingTime?: number;
  }): this {
    this.addCustomSchema({
      '@type': 'Article',
      '@id': `${this.canonicalUrl}#article`,
      headline: data.title,
      name: data.title,
      description: data.description,
      url: this.canonicalUrl,
      datePublished: data.publishedAt,
      dateModified: data.modifiedAt,
      
      // Proper author schema with required @context
      author: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': data.author.slug 
          ? `${this.baseUrl}/ru/authors/${data.author.slug}#person`
          : undefined,
        name: data.author.name,
        ...(data.author.slug && {
          url: `${this.baseUrl}/ru/authors/${data.author.slug}`,
        }),
      },
      
      // Image information
      ...(data.imageUrl && {
        image: {
          '@type': 'ImageObject',
          url: data.imageUrl,
          width: 1200,
          height: 630,
          caption: data.title,
        },
      }),
      
      // Content metadata
      ...(data.section && { articleSection: data.section }),
      ...(data.tags && data.tags.length > 0 && { keywords: data.tags.join(', ') }),
      ...(data.wordCount && { wordCount: data.wordCount }),
      ...(data.readingTime && { timeRequired: `PT${data.readingTime}M` }),
      
      // Content location
      contentLocation: {
        '@type': 'Country',
        name: 'Россия',
      },
      
      // Main entity reference
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.canonicalUrl}#webpage`,
      },
    });

    return this;
  }

  /**
   * Add CollectionPage schema
   */
  addCollectionPage(data: {
    name: string;
    description: string;
    itemCount: number;
    collectionType: string;
    items?: Array<{ name: string; url: string; description?: string }>;
  }): this {
    this.addCustomSchema({
      '@type': 'CollectionPage',
      '@id': `${this.canonicalUrl}#collection`,
      name: data.name,
      description: data.description,
      url: this.canonicalUrl,
      
      // Main entity list
      mainEntity: data.items 
        ? createStandardItemListSchema(
            `${this.canonicalUrl}#itemlist`,
            data.name,
            data.description,
            data.items.map(item => ({ ...item, type: 'Article' }))
          )
        : {
            '@type': 'ItemList',
            name: data.name,
            numberOfItems: data.itemCount,
            description: data.description,
          },
          
      // Collection metadata
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'collectionType',
          value: data.collectionType,
        },
        {
          '@type': 'PropertyValue',
          name: 'totalItems',
          value: data.itemCount,
        },
      ],
    });

    return this;
  }

  /**
   * Build and combine all schemas
   */
  build(): ExtendedSchemaData {
    if (this.schemas.length === 0) {
      throw new Error('No schemas added to compose');
    }

    if (this.schemas.length === 1) {
      return this.schemas[0];
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@graph': this.schemas,
    };
  }

  /**
   * Get individual schemas array
   */
  getSchemas(): ExtendedSchemaData[] {
    return [...this.schemas];
  }

  /**
   * Clear all schemas
   */
  clear(): this {
    this.schemas = [];
    return this;
  }
}

// ===================================================================
// ENHANCED SCHEMA BUILDER COMPONENT
// ===================================================================

/**
 * Enhanced SchemaBuilder with better error handling and optimization
 */
export const SchemaBuilder: React.FC<SchemaBuilderProps & {
  dictionary?: Dictionary;
  enableValidation?: boolean;
  enableOptimization?: boolean;
}> = ({ 
  schema, 
  priority = 'normal',
  dictionary,
  enableValidation = true,
  enableOptimization = true,
}) => {
  try {
    const schemas = Array.isArray(schema) ? schema : [schema];
    
    // Validate schemas in development
    if (process.env.NODE_ENV === 'development' && enableValidation) {
      schemas.forEach((s, index) => {
        if (!validateEnhancedSchema(s, dictionary)) {
          console.warn(`Enhanced schema validation failed for schema at index ${index}:`, s);
        }
      });
    }

    // Optimize schemas for production
    const optimizedSchemas = enableOptimization 
      ? schemas.map(optimizeSchema)
      : schemas;

    // Determine formatting based on environment
    const indent = process.env.NODE_ENV === 'development' ? 2 : 0;

    return (
      <>
        {optimizedSchemas.map((schemaData, index) => (
          <script
            key={`enhanced-schema-${schemaData['@type']}-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemaData, null, indent)
            }}
            {...(priority === 'high' && { 'data-priority': 'high' })}
            data-schema-type={schemaData['@type']}
          />
        ))}
      </>
    );
    
  } catch (error) {
    console.error('SchemaBuilder: Error rendering schemas', error);
    
    // Return minimal fallback schema in production
    if (process.env.NODE_ENV === 'production' && dictionary) {
      const fallbackSchema = createStandardWebsiteSchema(dictionary);
      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(fallbackSchema, null, 0)
          }}
          data-schema-fallback="true"
        />
      );
    }
    
    return null;
  }
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Enhanced schema validation with Russian market checks
 */
const validateEnhancedSchema = (
  schema: ExtendedSchemaData, 
  dictionary?: Dictionary
): boolean => {
  // Basic validation
  if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
    console.warn('Schema: @context must be "https://schema.org"');
    return false;
  }
  
  if (!schema['@type'] || typeof schema['@type'] !== 'string') {
    console.warn('Schema: @type is required and must be a string');
    return false;
  }

  // Russian market validation
  if (dictionary && schema.inLanguage !== 'ru') {
    console.warn('Schema: inLanguage should be "ru" for Russian market');
  }

  // URL validation
  if (schema.url && !isValidUrl(schema.url)) {
    console.warn('Schema: Invalid URL format:', schema.url);
    return false;
  }

  return true;
};

/**
 * Optimize schema for production
 */
const optimizeSchema = (schema: ExtendedSchemaData): ExtendedSchemaData => {
  // Remove empty properties
  const optimized: any = {};
  
  Object.entries(schema).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value) && value.length === 0) {
        return; // Skip empty arrays
      }
      optimized[key] = value;
    }
  });
  
  return optimized;
};

/**
 * URL validation helper
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
// LEGACY COMPATIBILITY EXPORTS
// ===================================================================

// Keep existing exports for backward compatibility
export const validateSchema = validateEnhancedSchema;
export const createNavigationElementSchema = (
  name: string,
  url: string,
  description: string,
  position: number,
  geographicAreas: readonly string[] = ['Russia']
) => ({
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
    geographicArea: geographicAreas.map(area => ({ '@type': 'Country', name: area })),
  },
});

export const createWebsiteSchema = createStandardWebsiteSchema;
export const createOrganizationSchema = createStandardOrganizationSchema;
export const createBreadcrumbSchema = createStandardBreadcrumbSchema;

// ===================================================================
// CONVENIENCE EXPORTS
// ===================================================================

/**
 * Quick schema generation for common page types
 */
export const createQuickSchema = {
  article: (dictionary: Dictionary, canonicalUrl: string, data: any) => 
    new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization()
      .addWebsite()
      .addArticle(data)
      .build(),
      
  collection: (dictionary: Dictionary, canonicalUrl: string, data: any) =>
    new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization()
      .addWebsite()
      .addCollectionPage(data)
      .build(),
      
  authorProfile: (dictionary: Dictionary, canonicalUrl: string, data: any) =>
    new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization()
      .addWebsite()
      .addCustomSchema({
        '@type': 'ProfilePage',
        '@id': `${canonicalUrl}#profile`,
        ...data,
      })
      .build(),
};

export default SchemaBuilder;