// src/main/lib/dictionary/helpers/index.ts
// CONSOLIDATED: Clean DRY exports with no duplication

import { Dictionary } from '../types';

// ===================================================================
// TEMPLATE PROCESSING - Core logic
// ===================================================================

export {
  processTemplate,
  createSEOVariables,
  validateTemplate,
} from './templates';

// ===================================================================
// SEO FUNCTIONS - Single source of truth for SEO operations
// ===================================================================

export {
  getPageTitle,
  getCollectionTitle,
  getMetaDescription,
  getKeywords,
  generateCanonicalUrl, // MAIN URL function - use everywhere
  validateSEOContent,
  generateSEOMetadata,
} from './seo';

// Create alias for consistency
export { generateCanonicalUrl as getCanonicalURL } from './seo';

// ===================================================================
// CONTENT FORMATTING - No navigation duplicates
// ===================================================================

export {
  formatCount,
  formatTotalCount,
  getIconAlt,
  getLinkTitle,
  getEmptyMessage,
  getItemsInCollection,
  getLocalizedCount,
  getLocalizedArticleCount,
  getLocalizedRubricCount,
  getLocalizedAuthorCount,
} from './content';

// ===================================================================
// NAVIGATION FUNCTIONS - Single source of truth
// ===================================================================

export {
  getNavigationPageTitle,
  getNavigationSectionDescription,
  getBreadcrumbText,
  getNavigationAccessibilityLabels,
  validateNavigationAccessibility,
  generateNavigationElements,
  generateNavigationSEOData,
  getNavigationLinkData,
  getNavigationLinksConfig,
  getSkipLinksData,
  getSkipLinksAccessibility,
} from './navigation';

// ===================================================================
// SEARCH FUNCTIONS - NEW: Search-specific helpers
// ===================================================================

export {
  getSearchPageTitle,
  getSearchPageDescription,
  getSearchKeywords,
  generateSearchSEOData,
  generateSearchActionData,
  validateSearchDictionary,
} from './search';

// ===================================================================
// FILTER FUNCTIONS - NEW: Filter-specific helpers
// ===================================================================

export {
  getFilterLabels,
  getSortingOptions,
  generateCategoryDropdownItems,
  generateFilterUrls,
  getCurrentCategoryInfo,
  generateFilterStateData,
  validateFilterDictionary,
  getFilterAccessibilityData,
} from './filter';

// ===================================================================
// VALIDATION UTILITIES
// ===================================================================

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
  SEODictionary,
} from '../types';

// ===================================================================
// CONVENIENCE EXPORTS
// ===================================================================

export {
  getDictionary,
} from '../dictionary';