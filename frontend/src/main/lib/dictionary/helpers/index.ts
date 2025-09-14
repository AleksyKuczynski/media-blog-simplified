// src/main/lib/dictionary/helpers/index.ts
// CLEAN EXPORTS ONLY - No implementation mixing

// ===================================================================
// CORE HELPERS - From main implementation files
// ===================================================================

// Template processing
export {
  processTemplate,
  createSEOVariables,
  validateTemplate,
} from './templates';

// SEO optimization  
export {
  getPageTitle,
  getCollectionTitle,
  getMetaDescription,
  getKeywords,
  generateCanonicalUrl,
  validateSEOContent,
} from './seo';

// Content formatting
export {
  formatCount,
  formatTotalCount,
  getIconAlt,
  getLinkTitle,
  getEmptyMessage,
  getItemsInCollection,
} from './content';

// Validation utilities
export {
  validateTemplate as validateTemplateProcessing,
  isValidUrl,
  hasRussianText,
} from './validation';

// ===================================================================
// TYPE EXPORTS
// ===================================================================

export type {
  Dictionary,
  SEOPageType,
  TemplateVariables,
} from '../types';

// ===================================================================
// CONVENIENCE RE-EXPORTS - Main functions only
// ===================================================================

// Most commonly used functions
export {
  // From simplified_dictionary
  getDictionary,
} from '../dictionary';