// src/main/lib/dictionary/helpers.ts
// Template processing and validation utilities for the new dictionary system

import { TemplateVariables, TemplateProcessor, SEOValidationResult, SEOPageType } from './types';

// ===================================================================
// TEMPLATE PROCESSING
// ===================================================================

/**
 * Process template strings with variable substitution
 * Replaces {variableName} patterns with actual values
 */
export const processTemplate: TemplateProcessor = (template: string, variables: TemplateVariables): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key as keyof TemplateVariables];
    return value ?? match; // Return original if no replacement found
  });
};

/**
 * Generate SEO title with proper fallbacks
 */
export const generateSEOTitle = (
  template: string, 
  variables: TemplateVariables,
  fallback: string
): string => {
  const processed = processTemplate(template, variables);
  return processed.includes('{') ? fallback : processed;
};

/**
 * Generate SEO description with length validation
 */
export const generateSEODescription = (
  template: string,
  variables: TemplateVariables,
  fallback: string,
  maxLength: number = 160
): string => {
  const processed = processTemplate(template, variables);
  const description = processed.includes('{') ? fallback : processed;
  
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate at word boundary
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// ===================================================================
// CONTENT VALIDATION
// ===================================================================

/**
 * Validate SEO content according to best practices
 */
export const validateSEOContent = (
  title: string,
  description: string,
  keywords: string,
  pageType: SEOPageType
): SEOValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else {
    if (title.length > 60) {
      warnings.push(`Title length is ${title.length} characters (recommended: ≤60)`);
    }
    if (title.length < 30) {
      warnings.push(`Title length is ${title.length} characters (recommended: ≥30)`);
    }
  }

  // Description validation
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else {
    if (description.length > 160) {
      warnings.push(`Description length is ${description.length} characters (recommended: ≤160)`);
    }
    if (description.length < 120) {
      warnings.push(`Description length is ${description.length} characters (recommended: ≥120)`);
    }
  }

  // Keywords validation
  if (!keywords || keywords.trim().length === 0) {
    warnings.push('Keywords are recommended for better SEO');
  }

  // Page type specific validation
  if (pageType === 'article') {
    if (!title.includes('—') && !title.includes('|')) {
      warnings.push('Article titles should include site name separator');
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// ===================================================================
// LOCALIZATION HELPERS - Language-agnostic
// ===================================================================

/**
 * Get article count with proper pluralization using dictionary
 */
export const getLocalizedArticleCount = (count: number, articlePlurals: { one: string, few: string, many: string }): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${articlePlurals.one}`;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} ${articlePlurals.few}`;
  } else {
    return `${count} ${articlePlurals.many}`;
  }
};

/**
 * Generate accessibility label for rubric icons using dictionary
 */
export const getRubricIconAlt = (rubricName: string, iconDescriptionTemplate: string): string => {
  return `${iconDescriptionTemplate} ${rubricName}`;
};

/**
 * Generate detailed accessibility description for rubric icons
 */
export const getRubricIconDescription = (rubricName: string, template: string): string => {
  return template.replace('{rubricName}', rubricName);
};

/**
 * Truncate description with language-aware word boundaries
 */
export const truncateDescription = (description: string, maxLength: number = 120): string => {
  if (description.length <= maxLength) return description;
  
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// ===================================================================
// URL AND PATH HELPERS
// ===================================================================

/**
 * Generate canonical URL for Russian pages
 */
export const generateCanonicalUrl = (path: string): string => {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  return `https://event4me.eu/ru${basePath}`;
};

/**
 * Get canonical URL (alias for consistency)
 */
export const getCanonicalURL = generateCanonicalUrl;

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ===================================================================
// COMPATIBILITY HELPERS - For migration from old dictionary system
// ===================================================================

/**
 * Get dictionary section with fallback (for migration compatibility)
 */
export const getDictionarySection = (dictionary: any, sectionPath: string, fallback: any = null) => {
  return sectionPath.split('.').reduce((obj, key) => obj?.[key], dictionary) || fallback;
};

/**
 * Merge old dictionary format with new format during migration
 */
export const mergeDictionaryFormats = (oldDict: any, newDict: any): any => {
  // This helper assists during migration to ensure no data is lost
  // Implementation can be enhanced as needed during the migration process
  return { ...oldDict, ...newDict };
};