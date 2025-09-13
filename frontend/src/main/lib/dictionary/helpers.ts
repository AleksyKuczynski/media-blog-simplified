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
// RUSSIAN-SPECIFIC HELPERS
// ===================================================================

/**
 * Russian pluralization helper for article counts
 */
export const getRussianArticleCount = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} статья`;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} статьи`;
  } else {
    return `${count} статей`;
  }
};

/**
 * Generate Russian-specific accessibility labels
 */
export const getRubricIconAlt = (rubricName: string): string => {
  return `Иконка рубрики ${rubricName}`;
};

export const getRubricIconDescription = (rubricName: string): string => {
  return `Визуальный индикатор для рубрики "${rubricName}"`;
};

/**
 * Truncate description with Russian-aware word boundaries
 */
export const truncateRussianDescription = (description: string, maxLength: number = 120): string => {
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