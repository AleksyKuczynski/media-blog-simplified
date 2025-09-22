// src/main/components/SEO/core/types.ts
// FIXED: More flexible type definitions to prevent TypeScript errors

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';

// ===================================================================
// BASE SEO TYPES - UNCHANGED
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

export type SEOData = WebsiteSEOData | ArticleSEOData | CollectionSEOData;

// ===================================================================
// FLEXIBLE SCHEMA TYPES - FIXED
// ===================================================================

export interface BaseSchemaData {
  '@context': 'https://schema.org';
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  inLanguage?: string;
}

// FIXED: More flexible schema type that prevents type errors
export interface ExtendedSchemaData extends BaseSchemaData {
  // Common properties - made more flexible
  publisher?: SchemaReference | Record<string, any>;
  author?: SchemaReference | Record<string, any>;
  breadcrumb?: SchemaReference | Record<string, any>;
  mainEntity?: SchemaReference | Record<string, any>;
  isPartOf?: SchemaReference | Record<string, any>;
  audience?: Record<string, any>; // FIXED: More flexible audience type
  keywords?: string;
  
  // Action-related
  potentialAction?: Record<string, any> | Record<string, any>[];
  target?: Record<string, any>;
  
  // Image-related
  image?: Record<string, any> | string;
  logo?: Record<string, any>;
  primaryImageOfPage?: Record<string, any>;
  
  // Content-related
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  contentLocation?: Record<string, any>;
  
  // Collection-related
  numberOfItems?: number;
  itemListElement?: Record<string, any>[];
  itemListOrder?: string;
  mainEntityOfPage?: SchemaReference | Record<string, any>;
  
  // Contact-related
  contactPoint?: Record<string, any> | Record<string, any>[];
  sameAs?: string[]; // FIXED: Allow mutable string arrays
  areaServed?: Record<string, any> | Record<string, any>[];
  
  // Person-related
  knowsAbout?: string[];
  workLocation?: Record<string, any>;
  affiliation?: SchemaReference | Record<string, any>;
  worksFor?: SchemaReference | Record<string, any>;
  
  // Additional properties
  additionalProperty?: Record<string, any>[];
  genre?: string;
  foundingDate?: string;
  foundingLocation?: Record<string, any>;
  
  // Allow any additional schema.org properties
  [key: string]: any;
}

// ===================================================================
// SPECIFIC SCHEMA TYPES - SIMPLIFIED
// ===================================================================

export interface SchemaReference {
  '@type'?: string;
  '@id': string;
  name?: string;
  url?: string;
}

// FIXED: Simplified schema types that are easier to work with
export interface OrganizationSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  description?: string;
  logo?: Record<string, any>;
  contactPoint?: Record<string, any>;
  sameAs?: string[];
  areaServed?: Record<string, any>[];
  foundingDate?: string;
  foundingLocation?: Record<string, any>;
}

export interface PersonSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url?: string;
  description?: string;
  image?: Record<string, any>;
  knowsAbout?: string[];
  workLocation?: Record<string, any>;
  affiliation?: SchemaReference | Record<string, any>;
  worksFor?: SchemaReference | Record<string, any>;
}

export interface WebsiteSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: SchemaReference | Record<string, any>;
  potentialAction?: Record<string, any>;
  inLanguage: string;
}

export interface WebPageSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'WebPage' | 'CollectionPage' | 'ProfilePage' | 'SearchResultsPage';
  name: string;
  url: string;
  description?: string;
  mainEntity?: SchemaReference | Record<string, any>;
  isPartOf?: SchemaReference | Record<string, any>;
  breadcrumb?: SchemaReference | Record<string, any>;
  primaryImageOfPage?: Record<string, any>;
}

export interface ArticleSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  datePublished: string;
  dateModified: string;
  author: SchemaReference | Record<string, any>;
  publisher: SchemaReference | Record<string, any>;
  image?: Record<string, any>;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  mainEntityOfPage?: SchemaReference | Record<string, any>;
  contentLocation?: Record<string, any>;
}

export interface BreadcrumbSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Record<string, any>[];
  numberOfItems?: number;
}

export interface ItemListSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  name: string;
  description?: string;
  numberOfItems: number;
  itemListElement: Record<string, any>[];
  itemListOrder?: string;
}

// ===================================================================
// COMPONENT SCHEMA TYPES - SIMPLIFIED
// ===================================================================

export interface ImageSchema {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
  contentUrl?: string;
}

export interface ContactPointSchema {
  '@type': 'ContactPoint';
  email?: string;
  telephone?: string;
  contactType: string;
  availableLanguage?: string[];
  areaServed?: Record<string, any>;
}

export interface PlaceSchema {
  '@type': 'Place' | 'Country' | 'City';
  name: string;
  address?: string;
}

// FIXED: Literal type for @type
export interface AudienceSchema {
  '@type': 'Audience';
  geographicArea?: Record<string, any> | Record<string, any>[];
  audienceType?: string;
  suggestedMinAge?: number;
  suggestedMaxAge?: number;
}

export interface SearchActionSchema {
  '@type': 'SearchAction';
  name?: string;
  description?: string;
  target: Record<string, any>;
  'query-input': Record<string, any> | string;
}

export interface EntryPointSchema {
  '@type': 'EntryPoint';
  urlTemplate: string;
  actionPlatform?: string[];
}

export interface PropertyValueSpecificationSchema {
  '@type': 'PropertyValueSpecification';
  valueName: string;
  description?: string;
  valueRequired?: boolean;
  valueMinLength?: number;
  valueMaxLength?: number;
}

export interface PropertyValueSchema {
  '@type': 'PropertyValue';
  name: string;
  value: string | number;
  description?: string;
}

export interface ListItemSchema {
  '@type': 'ListItem';
  position: number;
  name?: string;
  description?: string;
  item: string | SchemaReference | Record<string, any>;
  url?: string;
}

// ===================================================================
// NAVIGATION SCHEMA TYPES - SIMPLIFIED
// ===================================================================

export interface NavigationElementSchema extends Record<string, any> {
  '@context': 'https://schema.org';
  '@type': 'SiteNavigationElement';
  name: string;
  description?: string;
  url: string;
  position: number;
  audience?: Record<string, any>;
}

// ===================================================================
// SCHEMA BUILDER TYPES
// ===================================================================

export interface SchemaBuilderProps {
  schema: ExtendedSchemaData | ExtendedSchemaData[];
  priority?: 'low' | 'normal' | 'high';
}

export interface EnhancedSchemaBuilderProps extends SchemaBuilderProps {
  dictionary?: Dictionary;
  enableValidation?: boolean;
  enableOptimization?: boolean;
}

// ===================================================================
// SCHEMA COMPOSER TYPES
// ===================================================================

export interface ArticleSchemaData {
  title: string;
  description: string;
  author: {
    name: string;
    slug?: string;
  };
  publishedAt: string;
  modifiedAt: string;
  imageUrl?: string;
  section?: string;
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
}

export interface CollectionSchemaData {
  name: string;
  description: string;
  itemCount: number;
  collectionType: string;
  items?: Array<{
    name: string;
    url: string;
    description?: string;
    type?: string;
    additionalData?: Record<string, any>;
  }>;
}

export interface AuthorSchemaData {
  name: string;
  slug?: string;
  bio?: string;
  imageUrl?: string;
  articleCount?: number;
  socialProfiles?: string[];
  expertise?: string[];
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SchemaOptimizationResult {
  original: ExtendedSchemaData;
  optimized: ExtendedSchemaData;
  sizeDifference: number;
  optimizations: string[];
}

export interface RussianMarketConfig {
  language: 'ru';
  region: 'Russia';
  currency: 'RUB';
  targetMarkets: string[];
  searchEngines: ('google' | 'yandex')[];
  socialPlatforms: ('vk' | 'telegram' | 'odnoklassniki')[];
}

// ===================================================================
// METADATA RESULT TYPES
// ===================================================================

export interface MetadataResult {
  metadata: Metadata;
  schemas: ExtendedSchemaData[];
  validation: SchemaValidationResult;
}

export interface SEOContext {
  dictionary: Dictionary;
  currentPath: string;
  pageType: 'article' | 'collection' | 'author' | 'search' | 'home';
  russianMarketConfig: RussianMarketConfig;
}

// ===================================================================
// FACTORY FUNCTION TYPES
// ===================================================================

export type SchemaFactory<T extends ExtendedSchemaData> = (
  dictionary: Dictionary,
  ...args: any[]
) => T;

export type QuickSchemaBuilder = {
  article: (dictionary: Dictionary, canonicalUrl: string, data: ArticleSchemaData) => ExtendedSchemaData;
  collection: (dictionary: Dictionary, canonicalUrl: string, data: CollectionSchemaData) => ExtendedSchemaData;
  authorProfile: (dictionary: Dictionary, canonicalUrl: string, data: AuthorSchemaData) => ExtendedSchemaData;
};

// ===================================================================
// LEGACY COMPATIBILITY TYPES
// ===================================================================

// Keep existing types for backward compatibility
export type { OrganizationSchema as LegacyOrganizationSchema };
export type { BreadcrumbSchema as LegacyBreadcrumbSchema };
export type { WebsiteSchema as LegacyWebsiteSchema };