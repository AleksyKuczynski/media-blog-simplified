// src/main/lib/dictionary/helpers/validation.ts
// COMPLETE: Validation utilities for dictionary and content validation

import { Dictionary } from '../types';

// ===================================================================
// URL VALIDATION
// ===================================================================

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate URL format for specific protocols
 */
export const isValidHttpUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// ===================================================================
// TEXT VALIDATION
// ===================================================================

/**
 * Check if text contains Russian characters
 */
export const hasRussianText = (text: string): boolean => {
  return /[а-яё]/i.test(text);
};

/**
 * Check if text is not empty and meaningful
 */
export const isValidText = (text: string): boolean => {
  return typeof text === 'string' && text.trim().length > 0;
};

/**
 * Validate text length for SEO purposes
 */
export const validateTextLength = (
  text: string,
  type: 'title' | 'description' | 'keywords'
): { isValid: boolean; message?: string } => {
  const limits = {
    title: { min: 10, max: 60 },
    description: { min: 50, max: 160 },
    keywords: { min: 10, max: 200 },
  };
  
  const { min, max } = limits[type];
  const length = text.length;
  
  if (length < min) {
    return {
      isValid: false,
      message: `${type} too short: ${length} chars (minimum: ${min})`,
    };
  }
  
  if (length > max) {
    return {
      isValid: false,
      message: `${type} too long: ${length} chars (maximum: ${max})`,
    };
  }
  
  return { isValid: true };
};

// ===================================================================
// TEMPLATE VALIDATION
// ===================================================================

/**
 * Validate template for required variables
 */
export const validateTemplate = (template: string, requiredVars: string[]): boolean => {
  if (!isValidText(template)) return false;
  
  return requiredVars.every(varName => {
    const regex = new RegExp(`\\{${varName}\\}`, 'g');
    return regex.test(template);
  });
};

/**
 * Check if template has valid syntax
 */
export const hasValidTemplateSyntax = (template: string): boolean => {
  // Check for unmatched braces
  const openBraces = (template.match(/\{/g) || []).length;
  const closeBraces = (template.match(/\}/g) || []).length;
  
  return openBraces === closeBraces;
};

/**
 * Extract variables from template
 */
export const extractTemplateVariables = (template: string): string[] => {
  const matches = template.match(/\{([^}]+)\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
};

// ===================================================================
// DICTIONARY STRUCTURE VALIDATION
// ===================================================================

/**
 * Check if object has all required properties
 */
export const hasRequiredProperties = (
  obj: any,
  requiredProps: string[]
): { isValid: boolean; missing: string[] } => {
  const missing = requiredProps.filter(prop => {
    const value = prop.split('.').reduce((current, key) => current?.[key], obj);
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  });
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};

/**
 * Validate navigation dictionary structure
 */
export const validateNavigationStructure = (navigation: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  const requiredLabels = ['home', 'articles', 'rubrics', 'authors', 'search'];
  const requiredTemplates = ['pageTitle', 'sectionDescription', 'breadcrumbSeparator'];
  const requiredDescriptions = ['home', 'articles', 'rubrics', 'authors', 'search'];
  const requiredAccessibility = [
    'mainNavigation', 'menuTitle', 'menuDescription',
    'openMenu', 'closeMenu', 'logoAlt'
  ];
  
  // Check labels
  const labelsCheck = hasRequiredProperties(navigation?.labels, requiredLabels);
  if (!labelsCheck.isValid) {
    errors.push(`Missing navigation labels: ${labelsCheck.missing.join(', ')}`);
  }
  
  // Check templates
  const templatesCheck = hasRequiredProperties(navigation?.templates, requiredTemplates);
  if (!templatesCheck.isValid) {
    errors.push(`Missing navigation templates: ${templatesCheck.missing.join(', ')}`);
  }
  
  // Check descriptions
  const descriptionsCheck = hasRequiredProperties(navigation?.descriptions, requiredDescriptions);
  if (!descriptionsCheck.isValid) {
    errors.push(`Missing navigation descriptions: ${descriptionsCheck.missing.join(', ')}`);
  }
  
  // Check accessibility
  const accessibilityCheck = hasRequiredProperties(navigation?.accessibility, requiredAccessibility);
  if (!accessibilityCheck.isValid) {
    errors.push(`Missing navigation accessibility: ${accessibilityCheck.missing.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate SEO dictionary structure
 */
export const validateSEOStructure = (seo: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  const requiredSiteProps = ['name', 'description', 'url', 'contactEmail'];
  const requiredTemplates = ['pageTitle', 'metaDescription', 'collectionPage'];
  const requiredKeywords = ['base', 'rubrics', 'articles', 'authors'];
  
  // Check site info
  const siteCheck = hasRequiredProperties(seo?.site, requiredSiteProps);
  if (!siteCheck.isValid) {
    errors.push(`Missing SEO site info: ${siteCheck.missing.join(', ')}`);
  }
  
  // Check templates
  const templatesCheck = hasRequiredProperties(seo?.templates, requiredTemplates);
  if (!templatesCheck.isValid) {
    errors.push(`Missing SEO templates: ${templatesCheck.missing.join(', ')}`);
  }
  
  // Check keywords
  const keywordsCheck = hasRequiredProperties(seo?.keywords, requiredKeywords);
  if (!keywordsCheck.isValid) {
    errors.push(`Missing SEO keywords: ${keywordsCheck.missing.join(', ')}`);
  }
  
  // Validate URL
  if (seo?.site?.url && !isValidHttpUrl(seo.site.url)) {
    errors.push('Invalid site URL format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate search dictionary structure
 */
export const validateSearchStructure = (search: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  const requiredLabels = ['placeholder', 'results', 'noResults', 'searching', 'submit'];
  const requiredTemplates = ['resultsFor', 'pageTitle', 'pageDescription'];
  const requiredAccessibility = ['searchLabel', 'searchButtonLabel', 'searchInputLabel'];
  
  // Check labels
  const labelsCheck = hasRequiredProperties(search?.labels, requiredLabels);
  if (!labelsCheck.isValid) {
    errors.push(`Missing search labels: ${labelsCheck.missing.join(', ')}`);
  }
  
  // Check templates
  const templatesCheck = hasRequiredProperties(search?.templates, requiredTemplates);
  if (!templatesCheck.isValid) {
    errors.push(`Missing search templates: ${templatesCheck.missing.join(', ')}`);
  }
  
  // Check accessibility
  const accessibilityCheck = hasRequiredProperties(search?.accessibility, requiredAccessibility);
  if (!accessibilityCheck.isValid) {
    errors.push(`Missing search accessibility: ${accessibilityCheck.missing.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===================================================================
// COMPLETE DICTIONARY VALIDATION
// ===================================================================

/**
 * Validate complete dictionary structure
 */
export const validateCompleteDictionary = (dictionary: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check main sections exist
  const mainSections = ['navigation', 'common', 'sections', 'seo', 'search'];
  const mainSectionsCheck = hasRequiredProperties(dictionary, mainSections);
  
  if (!mainSectionsCheck.isValid) {
    errors.push(`Missing main sections: ${mainSectionsCheck.missing.join(', ')}`);
    return { isValid: false, errors, warnings };
  }
  
  // Validate each section
  const navigationValidation = validateNavigationStructure(dictionary.navigation);
  if (!navigationValidation.isValid) {
    errors.push(...navigationValidation.errors);
  }
  
  const seoValidation = validateSEOStructure(dictionary.seo);
  if (!seoValidation.isValid) {
    errors.push(...seoValidation.errors);
  }
  
  const searchValidation = validateSearchStructure(dictionary.search);
  if (!searchValidation.isValid) {
    errors.push(...searchValidation.errors);
  }
  
  // Check for Russian content in key fields
  const russianContentFields = [
    dictionary.navigation?.labels?.home,
    dictionary.seo?.site?.name,
    dictionary.search?.labels?.placeholder,
  ];
  
  const hasRussianContent = russianContentFields.some(field => 
    field && hasRussianText(field)
  );
  
  if (!hasRussianContent) {
    warnings.push('Dictionary appears to lack Russian content');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ===================================================================
// CONTENT VALIDATION - COMPLETE
// ===================================================================

/**
 * Validate content for SEO requirements
 * COMPLETE: This is the function used by RubricMetadata
 */
export const validateSEOContent = (content: {
  title: string;
  description: string;
  keywords?: string;
}): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Validate title
  const titleValidation = validateTextLength(content.title, 'title');
  if (!titleValidation.isValid) {
    warnings.push(titleValidation.message!);
  }
  
  // Validate description
  const descriptionValidation = validateTextLength(content.description, 'description');
  if (!descriptionValidation.isValid) {
    warnings.push(descriptionValidation.message!);
  }
  
  // Check for Russian content
  const hasRussian = hasRussianText(content.title + content.description);
  if (!hasRussian) {
    warnings.push('No Russian text detected in title or description');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

/**
 * Validate collection data
 */
export const validateCollectionData = (data: {
  items: any[];
  totalCount: number;
  collectionType: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.totalCount < 0) {
    errors.push('Total count cannot be negative');
  }
  
  if (data.items.length === 0 && data.totalCount > 0) {
    errors.push('Item count mismatch: totalCount > 0 but no items provided');
  }
  
  if (!['rubrics', 'authors', 'articles'].includes(data.collectionType)) {
    errors.push('Invalid collection type');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};