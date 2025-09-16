// src/main/components/SEO/core/types.ts
// FIXED: Next.js compatible type definitions

import { Metadata } from 'next';

// ===================================================================
// BASE SEO TYPES
// ===================================================================

export interface BaseSEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  imageUrl?: string;
  locale?: string;
  siteName?: string;
}

// ===================================================================
// SPECIFIC SEO TYPES
// ===================================================================

export interface WebsiteSEOData extends BaseSEOData {
  type: 'website';
}

export interface ArticleSEOData extends BaseSEOData {
  type: 'article';
  publishedTime: string;
  modifiedTime: string;
  author: string;
  section: string;
  tags: readonly string[];
}

export interface CollectionSEOData extends BaseSEOData {
  type: 'collection';
  collectionType: string;
  itemCount: number;
}

/**
 * Union type for all SEO data variants
 */
export type SEOData = WebsiteSEOData | ArticleSEOData | CollectionSEOData;

// ===================================================================
// SCHEMA TYPES - FIXED for JSON-LD compatibility
// ===================================================================

export interface BaseSchemaData {
  '@context': 'https://schema.org';
  '@type': string;
  '@id'?: string;
  name: string;
  description?: string;
  url: string;
}

// FIXED: More flexible schema type that allows any JSON-LD properties
export interface ExtendedSchemaData extends BaseSchemaData {
  publisher?: Record<string, any>;
  author?: Record<string, any>;
  breadcrumb?: Record<string, any>;
  mainEntity?: Record<string, any>;
  isPartOf?: string;
  inLanguage?: string;
  audience?: Record<string, any>;
  keywords?: string;
  potentialAction?: Record<string, any>; // FIXED: Added missing property
  target?: Record<string, any>; // FIXED: Added missing property
  [key: string]: any; // FIXED: Allow any additional schema.org properties
}

// ===================================================================
// NAVIGATION SCHEMA TYPES
// ===================================================================

export interface NavigationElementSchema {
  '@type': 'SiteNavigationElement';
  '@id': string;
  name: string;
  description?: string;
  url: string;
  position: number;
}

export interface WebsiteSchema extends ExtendedSchemaData {
  '@type': 'WebSite';
  publisher: OrganizationSchema;
  potentialAction?: Record<string, any>;
}

export interface OrganizationSchema {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  description?: string;
  logo?: Record<string, any>;
  contactPoint?: Record<string, any>;
  sameAs?: string[];
}

export interface BreadcrumbSchema extends BaseSchemaData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: {
      '@type': string;
      '@id': string;
      url: string;
    };
  }>;
}

// ===================================================================
// METADATA RESULT TYPES
// ===================================================================

export interface MetadataResult {
  metadata: Metadata;
  warnings: string[];
  errors: string[];
  isValid: boolean;
}

export interface SEOContext {
  pageType: 'home' | 'article' | 'collection' | 'author' | 'search';
  lang: string;
  path: string;
  isRussianMarket: boolean;
  googleOptimized: boolean;
  yandexOptimized: boolean;
}

// ===================================================================
// VALIDATION TYPES
// ===================================================================

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SEOContentValidation {
  title: {
    isValid: boolean;
    length: number;
    hasRussianContent: boolean;
  };
  description: {
    isValid: boolean;
    length: number;
    hasRussianContent: boolean;
  };
  keywords: {
    isValid: boolean;
    count: number;
  };
}

// ===================================================================
// HELPER TYPES
// ===================================================================

export type SEOPageType = 'home' | 'article' | 'collection' | 'author' | 'rubric' | 'search';

export interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

// ===================================================================
// COLLECTION SPECIFIC TYPES
// ===================================================================

export interface CollectionItem {
  name: string;
  slug: string;
  description?: string;
  url?: string;
  articleCount?: number;
}

export interface CollectionMetadata {
  type: 'rubrics' | 'authors' | 'articles';
  items: CollectionItem[];
  totalCount: number;
  featured: boolean;
  currentPath: string;
}

// ===================================================================
// TYPE GUARDS
// ===================================================================

export const isArticleSEOData = (data: SEOData): data is ArticleSEOData => {
  return data.type === 'article';
};

export const isWebsiteSEOData = (data: SEOData): data is WebsiteSEOData => {
  return data.type === 'website';
};

export const isCollectionSEOData = (data: SEOData): data is CollectionSEOData => {
  return data.type === 'collection';
};

// ===================================================================
// DEFAULT VALUES
// ===================================================================

export const DEFAULT_SEO_LOCALE = 'ru_RU';
export const DEFAULT_SITE_NAME = 'EventForMe';
export const DEFAULT_IMAGE_WIDTH = 1200;
export const DEFAULT_IMAGE_HEIGHT = 630;