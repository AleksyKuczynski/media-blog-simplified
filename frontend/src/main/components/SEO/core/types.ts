// src/main/components/SEO/core/types.ts
// ENHANCED: Added types for the new SchemaBuilder system

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
// ENHANCED SCHEMA TYPES
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

export interface ExtendedSchemaData extends BaseSchemaData {
  // Common properties
  publisher?: SchemaReference | OrganizationSchema;
  author?: SchemaReference | PersonSchema | OrganizationSchema;
  breadcrumb?: SchemaReference | BreadcrumbSchema;
  mainEntity?: SchemaReference | ExtendedSchemaData;
  isPartOf?: SchemaReference | WebsiteSchema;
  audience?: AudienceSchema;
  keywords?: string;
  
  // Action-related
  potentialAction?: SearchActionSchema | SearchActionSchema[];
  target?: EntryPointSchema;
  
  // Image-related
  image?: ImageSchema | string;
  logo?: ImageSchema;
  primaryImageOfPage?: ImageSchema;
  
  // Content-related
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  contentLocation?: PlaceSchema;
  
  // Collection-related
  numberOfItems?: number;
  itemListElement?: ListItemSchema[];
  itemListOrder?: string;
  mainEntityOfPage?: SchemaReference | WebPageSchema;
  
  // Contact-related
  contactPoint?: ContactPointSchema | ContactPointSchema[];
  sameAs?: string[];
  areaServed?: PlaceSchema | PlaceSchema[];
  
  // Person-related
  knowsAbout?: string[];
  workLocation?: PlaceSchema;
  affiliation?: SchemaReference | OrganizationSchema;
  worksFor?: SchemaReference | OrganizationSchema;
  
  // Additional properties
  additionalProperty?: PropertyValueSchema[];
  genre?: string;
  foundingDate?: string;
  foundingLocation?: PlaceSchema;
  
  // Allow any additional schema.org properties
  [key: string]: any;
}

// ===================================================================
// SPECIFIC SCHEMA TYPES
// ===================================================================

export interface SchemaReference {
  '@type'?: string;
  '@id': string;
  name?: string;
  url?: string;
}

export interface OrganizationSchema extends ExtendedSchemaData {
  '@type': 'Organization';
  name: string;
  url: string;
  description?: string;
  logo?: ImageSchema;
  contactPoint?: ContactPointSchema;
  sameAs?: string[];
  areaServed?: PlaceSchema[];
  foundingDate?: string;
  foundingLocation?: PlaceSchema;
}

export interface PersonSchema extends ExtendedSchemaData {
  '@type': 'Person';
  name: string;
  url?: string;
  description?: string;
  image?: ImageSchema;
  knowsAbout?: string[];
  workLocation?: PlaceSchema;
  affiliation?: SchemaReference | OrganizationSchema;
  worksFor?: SchemaReference | OrganizationSchema;
}

export interface WebsiteSchema extends ExtendedSchemaData {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: SchemaReference | OrganizationSchema;
  potentialAction?: SearchActionSchema;
  inLanguage: string;
}

export interface WebPageSchema extends ExtendedSchemaData {
  '@type': 'WebPage' | 'CollectionPage' | 'ProfilePage' | 'SearchResultsPage';
  name: string;
  url: string;
  description?: string;
  mainEntity?: SchemaReference | ExtendedSchemaData;
  isPartOf?: SchemaReference | WebsiteSchema;
  breadcrumb?: SchemaReference | BreadcrumbSchema;
  primaryImageOfPage?: ImageSchema;
}

export interface ArticleSchema extends ExtendedSchemaData {
  '@type': 'Article';
  headline: string;
  datePublished: string;
  dateModified: string;
  author: SchemaReference | PersonSchema;
  publisher: SchemaReference | OrganizationSchema;
  image?: ImageSchema;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  mainEntityOfPage?: SchemaReference | WebPageSchema;
  contentLocation?: PlaceSchema;
}

export interface BreadcrumbSchema extends ExtendedSchemaData {
  '@type': 'BreadcrumbList';
  itemListElement: ListItemSchema[];
  numberOfItems?: number;
}

export interface ItemListSchema extends ExtendedSchemaData {
  '@type': 'ItemList';
  name: string;
  description?: string;
  numberOfItems: number;
  itemListElement: ListItemSchema[];
  itemListOrder?: string;
}

// ===================================================================
// COMPONENT SCHEMA TYPES
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
  areaServed?: PlaceSchema;
}

export interface PlaceSchema {
  '@type': 'Place' | 'Country' | 'City';
  name: string;
  address?: string;
}

export interface AudienceSchema {
  '@type': 'Audience';
  geographicArea?: PlaceSchema | PlaceSchema[];
  audienceType?: string;
  suggestedMinAge?: number;
  suggestedMaxAge?: number;
}

export interface SearchActionSchema {
  '@type': 'SearchAction';
  name?: string;
  description?: string;
  target: EntryPointSchema;
  'query-input': PropertyValueSpecificationSchema | string;
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
  item: string | SchemaReference | ExtendedSchemaData;
  url?: string;
}

// ===================================================================
// NAVIGATION SCHEMA TYPES - ENHANCED
// ===================================================================

export interface NavigationElementSchema extends ExtendedSchemaData {
  '@type': 'SiteNavigationElement';
  name: string;
  description?: string;
  url: string;
  position: number;
  audience?: AudienceSchema;
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