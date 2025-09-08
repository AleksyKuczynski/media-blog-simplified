// src/main/components/SEO/core/types.ts
// Clean type definitions for SEO components

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
// STRUCTURED DATA TYPES
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

export interface NavigationElementSchema extends BaseSchemaData {
  readonly '@type': 'SiteNavigationElement';
  readonly position: number;
  readonly audience?: {
    readonly '@type': 'Audience';
    readonly geographicArea: readonly string[];
  };
}

export interface WebsiteSchema extends BaseSchemaData {
  readonly '@type': 'WebSite';
  readonly potentialAction?: SearchActionSchema;
}

export interface SearchActionSchema {
  readonly '@type': 'SearchAction';
  readonly target: {
    readonly '@type': 'EntryPoint';
    readonly urlTemplate: string;
  };
  readonly 'query-input': string;
}

export interface OrganizationSchema extends BaseSchemaData {
  readonly '@type': 'Organization';
  readonly email?: string;
  readonly sameAs?: readonly string[];
  readonly areaServed?: readonly string[];
}

export interface BreadcrumbSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'BreadcrumbList';
  readonly itemListElement: readonly BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
  readonly '@type': 'ListItem';
  readonly position: number;
  readonly name: string;
  readonly item: string;
}

// ===================================================================
// COMPONENT PROPS TYPES
// ===================================================================

export interface MetadataBuilderProps {
  readonly seoData: SEOData;
  readonly additionalMeta?: Record<string, string>;
}

export interface SchemaBuilderProps {
  readonly schema: BaseSchemaData | BaseSchemaData[];
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