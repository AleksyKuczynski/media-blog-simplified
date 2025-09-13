// src/main/lib/dictionary/helpers/index.ts
// Clean public API for all dictionary helper functions
// Provides organized re-exports from modular helper files

import { calculateRussianReadingTime, extractRussianWords, formatRussianDate, formatRussianReadingTime, generateRussianSlug, getLocalizedArticleCount, getRelativeTimeRussian, getRubricIconAlt, getRubricIconDescription, hasRussianText, pluralizeRussian, truncateDescription } from './localization';
import { createSEOVariables, getPageTypeFromPath, getPageTypeKeywords, getProcessedSEODescription, getProcessedSEOTitle, validateRussianSEO, validateSEOMetadata } from './seo';
import { cleanTemplateText, extractTemplateVariables, generateSEODescription, generateSEOTitle, processTemplate, smartTruncate, validateTemplateVariables } from './templates';
import { analyzeSEOUrl, cleanPath, generateArticleUrl, generateAuthorUrl, generateCanonicalUrl, generateRubricUrl, generateSearchUrl, generateSharingUrls, getPathSegments, isHttpsUrl, isInternalUrl, isValidUrl, joinPaths } from './urls';
import { combineValidationResults, validateContentQuality, validateSEOContent, validateTechnicalSEO } from './validation';

// ===================================================================
// TEMPLATE PROCESSING - Template & variable substitution
// ===================================================================

export {
  processTemplate,
  generateSEOTitle,
  generateSEODescription,
  extractTemplateVariables,
  validateTemplateVariables,
  smartTruncate,
  cleanTemplateText,
} from './templates';

// ===================================================================
// SEO OPTIMIZATION - Russian market SEO functions
// ===================================================================

export {
  getProcessedSEOTitle,
  getProcessedSEODescription,
  getPageTypeKeywords,
  validateSEOMetadata,
  getPageTypeFromPath,
  createSEOVariables,
  validateRussianSEO,
} from './seo';

// ===================================================================
// VALIDATION - Content validation & error checking
// ===================================================================

export {
  validateSEOContent,
  validateContentQuality,
  validateTechnicalSEO,
  combineValidationResults,
  // isValidUrl is re-exported from urls for convenience
} from './validation';

// ===================================================================
// LOCALIZATION - Russian language utilities
// ===================================================================

export {
  getLocalizedArticleCount,
  pluralizeRussian,
  getRubricIconAlt,
  getRubricIconDescription,
  truncateDescription,
  hasRussianText,
  extractRussianWords,
  calculateRussianReadingTime,
  formatRussianReadingTime,
  formatRussianDate,
  getRelativeTimeRussian,
  generateRussianSlug,
} from './localization';

export type { RussianPlurals } from './localization';

// ===================================================================
// URL UTILITIES - URL generation & path handling
// ===================================================================

export {
  SITE_BASE_URL,
  generateCanonicalUrl,
  getCanonicalURL,
  isValidUrl,
  isHttpsUrl,
  isInternalUrl,
  cleanPath,
  joinPaths,
  getPathSegments,
  generateArticleUrl,
  generateRubricUrl,
  generateAuthorUrl,
  generateSearchUrl,
  generateSharingUrls,
  analyzeSEOUrl,
} from './urls';

// ===================================================================
// CONVENIENCE BUNDLES - Common combinations for easy use
// ===================================================================

/**
 * Complete SEO utilities bundle
 * All functions needed for SEO optimization in one import
 */
export const SEOHelpers = {
  // Title & description generation
  getProcessedSEOTitle,
  getProcessedSEODescription,
  getPageTypeKeywords,
  
  // Validation
  validateSEOMetadata,
  validateRussianSEO,
  
  // URL utilities
  generateCanonicalUrl,
  getPageTypeFromPath,
  
  // Variables
  createSEOVariables,
} as const;

/**
 * Russian localization utilities bundle
 * All functions needed for Russian language support
 */
export const LocalizationHelpers = {
  // Pluralization
  getLocalizedArticleCount,
  pluralizeRussian,
  
  // Text processing
  hasRussianText,
  extractRussianWords,
  generateRussianSlug,
  
  // Dates and time
  formatRussianDate,
  getRelativeTimeRussian,
  formatRussianReadingTime,
  calculateRussianReadingTime,
  
  // Content
  getRubricIconAlt,
  getRubricIconDescription,
  truncateDescription,
} as const;

/**
 * Template processing utilities bundle
 * All functions needed for template variable substitution
 */
export const TemplateHelpers = {
  processTemplate,
  generateSEOTitle,
  generateSEODescription,
  extractTemplateVariables,
  validateTemplateVariables,
  smartTruncate,
  cleanTemplateText,
} as const;

/**
 * URL utilities bundle
 * All functions needed for URL generation and validation
 */
export const URLHelpers = {
  // Generation
  generateCanonicalUrl,
  generateArticleUrl,
  generateRubricUrl,
  generateAuthorUrl,
  generateSearchUrl,
  generateSharingUrls,
  
  // Validation
  isValidUrl,
  isHttpsUrl,
  isInternalUrl,
  analyzeSEOUrl,
  
  // Path manipulation
  cleanPath,
  joinPaths,
  getPathSegments,
} as const;

// ===================================================================
// TYPE RE-EXPORTS - For easy importing
// ===================================================================

export type {
  Dictionary,
  SEOPageType,
  TemplateVariables,
  TemplateProcessor,
  SEOValidationResult,
} from '../types';

// ===================================================================
// DEFAULT EXPORT - Main helpers object for convenience
// ===================================================================

/**
 * Default export with all helper functions organized by category
 * Use this for comprehensive access to all utilities
 * 
 * @example
 * import helpers from '@/lib/dictionary/helpers';
 * 
 * const title = helpers.seo.getProcessedSEOTitle(seoDict, 'article', variables);
 * const count = helpers.localization.getLocalizedArticleCount(5, plurals);
 * const url = helpers.urls.generateArticleUrl('music', 'concert-review');
 */
export default {
  seo: SEOHelpers,
  localization: LocalizationHelpers,
  templates: TemplateHelpers,
  urls: URLHelpers,
    
  // Direct access to validation (commonly used)
  validation: {
    validateSEOContent,
    validateContentQuality,
    validateTechnicalSEO,
    combineValidationResults,
  },
} as const;