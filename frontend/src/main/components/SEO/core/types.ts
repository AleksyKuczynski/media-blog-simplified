// src/main/components/SEO/core/types.ts
// Fixed type definitions for SEO components

import { Metadata } from 'next';

// ===================================================================
// CORE SEO TYPES
// ===================================================================

export interface BaseSEOData {
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly canonicalUrl: string;
  readonly imageUrl?: string;
  readonly locale: string;
  readonly siteName: string;
}

export interface ArticleSEOData extends BaseSEOData {
  readonly type: 'article';
  readonly publishedTime: string;
  readonly modifiedTime: string;
  readonly author: string;
  readonly section: string;
  readonly tags: readonly string[];
}

export interface WebsiteSEOData extends BaseSEOData {
  readonly type: 'website';
}

export interface CollectionSEOData extends BaseSEOData {
  readonly type: 'collection';
  readonly itemCount: number;
  readonly collectionType: string;
}

export type SEOData = WebsiteSEOData | ArticleSEOData | CollectionSEOData;

// ===================================================================
// STRUCTURED DATA TYPES - FIXED
// ===================================================================

export interface BaseSchemaData {
  readonly '@context': 'https://schema.org';
  readonly '@type': string;
  readonly '@id': string;
  readonly name: string;
  readonly description?: string;
  readonly url: string;
  readonly inLanguage: string;
}

// Make BaseSchemaData more flexible for different schema types
export interface ExtendedSchemaData extends Partial<BaseSchemaData> {
  readonly '@context': 'https://schema.org';
  readonly '@type': string;
  readonly '@id'?: string;
  readonly name?: string;
  readonly url?: string;
  readonly inLanguage?: string;
  [key: string]: any; // Allow additional properties for specific schema types
}

export interface NavigationElementSchema extends BaseSchemaData {
  readonly '@type': 'SiteNavigationElement';
  readonly position: number;
  readonly audience?: {
    readonly '@type': 'Audience';
    readonly geographicArea: readonly string[];
  };
}

// Fixed WebsiteSchema - make potentialAction optional and mutable
export interface WebsiteSchema extends BaseSchemaData {
  readonly '@type': 'WebSite';
  potentialAction?: SearchActionSchema; // Remove readonly to allow assignment
}

export interface SearchActionSchema {
  readonly '@type': 'SearchAction';
  readonly name?: string;
  readonly target: {
    readonly '@type': 'EntryPoint';
    readonly urlTemplate: string;
    readonly actionPlatform?: readonly string[];
  };
  readonly 'query-input': string | {
    readonly '@type'?: 'PropertyValueSpecification';
    readonly valueName?: string;
    readonly description?: string;
    readonly valueRequired?: boolean;
    readonly valueMinLength?: number;
    readonly valueMaxLength?: number;
  };
}

export interface OrganizationSchema extends BaseSchemaData {
  readonly '@type': 'Organization';
  readonly email?: string;
  readonly sameAs?: readonly string[];
  readonly areaServed?: readonly string[];
}

// Fixed BreadcrumbSchema - extend from ExtendedSchemaData to avoid inLanguage requirement
export interface BreadcrumbSchema extends ExtendedSchemaData {
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: readonly BreadcrumbItemSchema[];
  readonly numberOfItems?: number;
}

export interface BreadcrumbItemSchema {
  readonly '@type': 'ListItem';
  readonly position: number;
  readonly name: string;
  readonly item: string | {
    readonly '@type': string;
    readonly '@id': string;
    readonly name: string;
    readonly url: string;
    readonly inLanguage?: string;
  };
}

// ===================================================================
// COMPONENT PROPS TYPES
// ===================================================================

export interface MetadataBuilderProps {
  readonly seoData: SEOData;
  readonly additionalMeta?: Record<string, string>;
}

// Fixed SchemaBuilderProps to accept both BaseSchemaData and ExtendedSchemaData
export interface SchemaBuilderProps {
  readonly schema: BaseSchemaData | ExtendedSchemaData | (BaseSchemaData | ExtendedSchemaData)[];
  readonly priority?: 'high' | 'normal' | 'low';
}

// ===================================================================
// VALIDATION TYPES
// ===================================================================

export interface SEOValidationError {
  readonly field: string;
  readonly message: string;
  readonly severity: 'error' | 'warning';
}

export interface SEOValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly SEOValidationError[];
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export type MetadataResult = Metadata;

export interface SEOContext {
  readonly baseUrl: string;
  readonly defaultImageUrl: string;
  readonly siteName: string;
  readonly locale: string;
  readonly region: string;
}

// Fixed CustomMetaTags type to avoid conflicts with Next.js Metadata
export interface CustomMetaTags {
  [key: string]: string | number | undefined;
}