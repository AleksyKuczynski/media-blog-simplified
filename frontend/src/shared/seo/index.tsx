// frontend/src/shared/seo/index.tsx

import { buildMetadata } from './core/MetadataBuilder';
import { SchemaBuilder } from './core/SchemaBuilder';
import { generateMainNavigationMetadata, generateNavigationMetadata, getNavigationLinkSEO, getNavigationOpenGraphData, validateNavigationMetadata } from './metadata/NavigationMetadata';
import { CompleteNavigationSchema, MinimalNavigationSchema, NavigationSchema } from './schemas/NavigationSchema';

// NEW: Search components imports
import { generateSearchMetadata } from './metadata/SearchMetadata';
import { SearchSchema, MinimalSearchSchema } from './schemas/SearchSchema';

// ===================================================================
// CORE EXPORTS - Foundation components and utilities
// ===================================================================

// Core types
export type {
  SEOData,
  BaseSEOData,
  ArticleSEOData,
  WebsiteSEOData,
  CollectionSEOData,
  BaseSchemaData,
  ExtendedSchemaData,
  NavigationElementSchema,
  WebsiteSchema,
  OrganizationSchema,
  BreadcrumbSchema,
  MetadataResult,
  SEOContext,
} from './core/types';

// Core builders
export {
  buildMetadata,
  generateMetadata,
  validateSEOData,
  createWebsiteSEOData,
  createArticleSEOData,
  createCollectionSEOData,
  MetadataBuilder,
} from './core/MetadataBuilder';

export { SchemaBuilder } from './core/SchemaBuilder';

// ===================================================================
// NAVIGATION EXPORTS - Navigation-specific components
// ===================================================================

// Navigation metadata
export {
  generateNavigationMetadata,
  generateMainNavigationMetadata,
  getNavigationOpenGraphData,
  generateBreadcrumbMetadata,
  getNavigationLinkSEO,
  validateNavigationMetadata,
  getNavigationMetaTags,
} from './metadata/NavigationMetadata';

export type { NavigationMetadataProps } from './metadata/NavigationMetadata';

// Navigation schemas
export {
  NavigationSchema,
  MainNavigationSchema,
  MobileNavigationSchema,
  SearchNavigationSchema,
  BreadcrumbNavigationSchema,
  CompleteNavigationSchema,
  MinimalNavigationSchema,
} from './schemas/NavigationSchema';

export type {
  NavigationSchemaProps,
  BreadcrumbNavigationSchemaProps,
} from './schemas/NavigationSchema';

// ===================================================================
// SEARCH EXPORTS - Search-specific components
// ===================================================================

// Search metadata
export {
  generateSearchMetadata,
} from './metadata/SearchMetadata';

// Search schemas
export {
  SearchSchema,
  MinimalSearchSchema,
} from './schemas/SearchSchema';

// ===================================================================
// CONVENIENCE EXPORTS - High-level utilities for common use cases
// ===================================================================

/**
 * Complete SEO setup for navigation-enhanced pages
 */
export const useNavigationSEO = () => {
  return {
    // Metadata generation
    generateNavigationMetadata,
    generateMainNavigationMetadata,
    getNavigationOpenGraphData,
    
    // Schema generation
    NavigationSchema,
    CompleteNavigationSchema,
    MinimalNavigationSchema,
    
    // Utilities
    validateNavigationMetadata,
    getNavigationLinkSEO,
  };
};

/**
 * Complete SEO setup for search pages
 */
export const useSearchSEO = () => {
  return {
    // Metadata generation
    generateSearchMetadata,
    
    // Schema generation
    SearchSchema,
    MinimalSearchSchema,
  };
};

/**
 * Essential SEO components bundle for any page with navigation
 */
export interface NavigationSEOBundleProps {
  dictionary: any; // Will be properly typed as Dictionary
  currentPath?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
  minimal?: boolean;
}

export const NavigationSEOBundle: React.FC<NavigationSEOBundleProps> = ({
  dictionary,
  currentPath,
  breadcrumbs,
  minimal = false,
}) => {
  const SchemaComponent = minimal ? MinimalNavigationSchema : CompleteNavigationSchema;
  
  return (
    <SchemaComponent
      dictionary={dictionary}
      currentPath={currentPath}
    />
  );
};

/**
 * Essential SEO components bundle for search pages
 */
export interface SearchSEOBundleProps {
  dictionary: any; // Will be properly typed as Dictionary
  minimal?: boolean;
}

export const SearchSEOBundle: React.FC<SearchSEOBundleProps> = ({
  dictionary,
  minimal = false,
}) => {
  const SchemaComponent = minimal ? MinimalSearchSchema : SearchSchema;
  
  return <SchemaComponent dictionary={dictionary} />;
};

// ===================================================================
// DEVELOPMENT UTILITIES - For debugging and testing
// ===================================================================

export const SEODebugUtils = {
  /**
   * Log SEO metadata for debugging
   */
  logMetadata: (metadata: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 SEO Metadata Debug');
      console.log('Title:', metadata.title);
      console.log('Description:', metadata.description);
      console.log('Keywords:', metadata.keywords);
      console.log('Canonical URL:', metadata.alternates?.canonical);
      console.log('Open Graph:', metadata.openGraph);
      console.groupEnd();
    }
  },

  /**
   * Validate schema structure
   */
  validateSchema: (schema: any) => {
    if (process.env.NODE_ENV === 'development') {
      const required = ['@context', '@type'];
      const missing = required.filter(key => !schema[key]);
      
      if (missing.length > 0) {
        console.warn('🚨 Missing required schema properties:', missing);
      }
      
      return missing.length === 0;
    }
    return true;
  },

  /**
   * Check dictionary completeness
   */
  checkDictionary: (dictionary: any) => {
    if (process.env.NODE_ENV === 'development') {
      const paths = [
        'navigation.labels.home',
        'navigation.descriptions.home',
        'seo.site.name', // FIXED: was siteName
        'search.labels.placeholder',
      ];
      
      const missing = paths.filter(path => {
        const value = path.split('.').reduce((obj, key) => obj?.[key], dictionary);
        return !value;
      });
      
      if (missing.length > 0) {
        console.warn('📚 Missing dictionary entries:', missing);
      }
      
      return missing.length === 0;
    }
    return true;
  },
};

// ===================================================================
// EXPORT EVERYTHING FOR EASY IMPORTS
// ===================================================================

// Create named export to avoid eslint error
const SEOComponents = {
  // Core
  buildMetadata,
  SchemaBuilder,
  
  // Navigation
  NavigationSchema,
  generateNavigationMetadata,
  
  // Search  
  SearchSchema,
  generateSearchMetadata,
  
  // Bundles
  NavigationSEOBundle,
  SearchSEOBundle,
  useNavigationSEO,
  useSearchSEO,
  
  // Utils
  SEODebugUtils,
};

// Default export for convenience - fixes eslint error
export default SEOComponents;