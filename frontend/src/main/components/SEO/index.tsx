// src/main/components/SEO/index.tsx
// Clean public API for new SEO component system

import { NavigationSchema } from '../Navigation/NavigationSchema';
import { buildMetadata } from './core/MetadataBuilder';
import { SchemaBuilder } from './core/SchemaBuilder';
import { generateMainNavigationMetadata, generateNavigationMetadata, getNavigationLinkSEO, getNavigationOpenGraphData, validateNavigationMetadata } from './metadata/NavigationMetadata';
import { CompleteNavigationSchema, MinimalNavigationSchema } from './schemas/NavigationSchema';

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

export {
  SchemaBuilder,
  createNavigationElementSchema,
  createWebsiteSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
  createCollectionPageSchema,
  createNavigationSchema,
  combineSchemas,
  getSchemaScript,
  sanitizeSchema,
} from './core/SchemaBuilder';

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
// CONVENIENCE EXPORTS - High-level utilities for common use cases
// ===================================================================

/**
 * Complete SEO setup for navigation-enhanced pages
 * This is the main entry point for most use cases
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
      breadcrumbs={breadcrumbs}
    />
  );
};

// ===================================================================
// MIGRATION HELPERS - For gradual transition from old system
// ===================================================================

/**
 * Legacy compatibility wrapper
 * Helps migrate from old SEO components to new system
 */
export const LegacyNavigationSEOWrapper: React.FC<{
  lang: 'ru';
  translations: any; // Old translation format
  currentPath?: string;
}> = ({ lang, translations, currentPath }) => {
  // This component helps bridge old and new systems during migration
  // It accepts old translation format and converts to new dictionary structure
  
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'LegacyNavigationSEOWrapper is deprecated. Please migrate to new dictionary system.'
    );
  }
  
  // For now, return null - implement conversion logic during migration
  return null;
};

/**
 * Validation helper for migration
 * Helps ensure new components work correctly
 */
export const validateMigration = (
  oldTranslations: any,
  newDictionary: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Add validation logic to compare old vs new structure
  // This helps ensure nothing is lost during migration
  
  return {
    isValid: errors.length === 0,
    errors,
  };
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
        'seo.site.siteName',
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

// Default export for convenience
export default {
  // Core
  buildMetadata,
  SchemaBuilder,
  
  // Navigation
  NavigationSchema,
  generateNavigationMetadata,
  
  // Bundles
  NavigationSEOBundle,
  useNavigationSEO,
  
  // Utils
  SEODebugUtils,
};