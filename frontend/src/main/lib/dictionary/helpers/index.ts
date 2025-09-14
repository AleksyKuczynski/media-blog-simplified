// src/main/lib/dictionary/helpers/index.ts
// UPDATED: Clean exports for navigation-enhanced dictionary

import { Dictionary } from '../types';

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
  generateSEOMetadata,
} from './seo';

// Content formatting - UPDATED with navigation helpers
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
  // Navigation-specific helpers
  getNavigationPageTitle,
  getNavigationSectionDescription,
  getBreadcrumbText,
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
  SEODictionary,
} from '../types';

// ===================================================================
// CONVENIENCE RE-EXPORTS - Main functions only
// ===================================================================

// Most commonly used functions
export {
  getDictionary,
} from '../dictionary';

// ===================================================================
// NAVIGATION-SPECIFIC UTILITIES
// ===================================================================

/**
 * Get all navigation accessibility labels for a dictionary
 * Useful for validation and testing
 */
export const getNavigationAccessibilityLabels = (dictionary: Dictionary) => {
  return dictionary.navigation.accessibility;
};

/**
 * Validate that navigation dictionary has all required accessibility properties
 */
export const validateNavigationAccessibility = (dictionary: Dictionary): boolean => {
  const required = [
    'mainNavigation',
    'menuTitle', 
    'menuDescription',
    'openMenu',
    'closeMenu',
    'logoAlt',
    'logoMainPageLabel',
    'primarySectionsLabel',
    'mainMenuLabel',
    'searchAndSettingsLabel',
    'siteSearchLabel',
    'skipToContent',
    'skipToNavigation',
  ];

  const accessibility = dictionary.navigation.accessibility;
  
  return required.every(key => {
    const hasProperty = key in accessibility;
    const hasValue = accessibility[key as keyof typeof accessibility]?.trim().length > 0;
    return hasProperty && hasValue;
  });
};