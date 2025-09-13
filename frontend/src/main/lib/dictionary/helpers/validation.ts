// src/main/lib/dictionary/helpers/validation.ts
// Content validation and error checking utilities

import { SEOValidationResult, SEOPageType } from '../types';

// ===================================================================
// SEO CONTENT VALIDATION
// ===================================================================

/**
 * Validate SEO content according to best practices
 * Comprehensive validation for Google and Yandex optimization
 * 
 * @param title - SEO title to validate
 * @param description - SEO description to validate
 * @param keywords - Keywords string to validate
 * @param pageType - Page type for specific validation rules
 * @returns Detailed validation results
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
    // Length recommendations
    if (title.length > 60) {
      warnings.push(`Title length is ${title.length} characters (recommended: ≤60)`);
    }
    if (title.length < 30) {
      warnings.push(`Title length is ${title.length} characters (recommended: ≥30)`);
    }
    
    // Content quality checks
    if (title.split(' ').length < 3) {
      warnings.push('Title should contain at least 3 words for better SEO');
    }
    
    // Russian market specific
    if (!title.match(/[а-яё]/i) && pageType !== 'search') {
      warnings.push('Title should contain Russian text for local market optimization');
    }
  }

  // Description validation
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else {
    // Length recommendations (optimized for Russian text)
    if (description.length > 160) {
      warnings.push(`Description length is ${description.length} characters (recommended: ≤160)`);
    }
    if (description.length < 120) {
      warnings.push(`Description length is ${description.length} characters (recommended: ≥120)`);
    }
    
    // Content quality
    if (description === title) {
      errors.push('Description should be different from title');
    }
    
    if (!description.match(/[а-яё]/i) && pageType !== 'search') {
      warnings.push('Description should contain Russian text for local market optimization');
    }
  }

  // Keywords validation
  if (!keywords || keywords.trim().length === 0) {
    warnings.push('Keywords are recommended for better SEO');
  } else {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (keywordArray.length > 10) {
      warnings.push(`Too many keywords (${keywordArray.length}). Focus on 5-8 primary keywords.`);
    }
    
    if (keywordArray.length < 3) {
      warnings.push('Consider adding more keywords for broader search coverage');
    }
    
    // Check for keyword stuffing in title/description
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const repeatedKeywords = keywordArray.filter(keyword => {
      const keywordLower = keyword.toLowerCase();
      return (titleLower.split(keywordLower).length - 1) + (descLower.split(keywordLower).length - 1) > 2;
    });
    
    if (repeatedKeywords.length > 0) {
      warnings.push(`Avoid keyword stuffing: "${repeatedKeywords.join(', ')}" appears too frequently`);
    }
  }

  // Page type specific validation
  switch (pageType) {
    case 'article':
      if (title && !title.includes('—') && !title.includes('|') && !title.includes(' - ')) {
        warnings.push('Article titles should include site name separator (— or |)');
      }
      break;
      
    case 'home':
      if (title && !title.toLowerCase().includes('eventforme')) {
        warnings.push('Home page title should include site name');
      }
      break;
      
    case 'author':
      if (description && !description.includes('автор') && !description.includes('статьи')) {
        warnings.push('Author descriptions should mention their role or articles');
      }
      break;
      
    case 'rubric':
      if (keywords && !keywords.toLowerCase().includes('рубрика') && !keywords.toLowerCase().includes('категория')) {
        warnings.push('Rubric keywords should include "рубрика" or related terms');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// ===================================================================
// CONTENT QUALITY VALIDATION
// ===================================================================

/**
 * Validate content quality for readability and engagement
 * Checks beyond SEO requirements for user experience
 * 
 * @param content - Content to validate
 * @returns Quality assessment with recommendations
 */
export const validateContentQuality = (content: {
  title: string;
  description: string;
  body?: string;
}): {
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  const { title, description, body } = content;

  // Title quality
  if (title.length < 30) {
    issues.push('Title is too short for optimal engagement');
    score -= 15;
  }
  
  if (title.toUpperCase() === title) {
    issues.push('Avoid using ALL CAPS in titles');
    score -= 10;
  }
  
  if (!title.match(/[.!?]$/) && title.split(' ').length > 10) {
    recommendations.push('Consider adding punctuation to long titles for clarity');
  }

  // Description quality  
  if (description.length < 120) {
    issues.push('Description could be more detailed for better user understanding');
    score -= 10;
  }
  
  if (description === title.toLowerCase() || description === title) {
    issues.push('Description should provide additional information beyond the title');
    score -= 20;
  }

  // Russian language quality
  const hasRussianTitle = title.match(/[а-яё]/i);
  const hasRussianDesc = description.match(/[а-яё]/i);
  
  if (!hasRussianTitle || !hasRussianDesc) {
    issues.push('Content should be in Russian for target audience');
    score -= 25;
  }

  // Engagement factors
  if (!title.match(/[?!]/) && !title.includes(':') && title.split(' ').length > 5) {
    recommendations.push('Consider adding engagement elements (questions, colons, exclamation)');
  }
  
  if (body && body.length < 500) {
    recommendations.push('Longer content generally performs better for SEO (aim for 800+ words)');
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
};

// ===================================================================
// TECHNICAL VALIDATION
// ===================================================================

/**
 * Validate technical SEO requirements
 * Checks for technical issues that affect search indexing
 * 
 * @param data - Technical data to validate
 * @returns Technical validation results
 */
export const validateTechnicalSEO = (data: {
  canonicalUrl?: string;
  imageUrl?: string;
  lastModified?: string;
  language?: string;
}): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // URL validation
  if (data.canonicalUrl) {
    if (!isValidUrl(data.canonicalUrl)) {
      errors.push('Invalid canonical URL format');
    } else if (!data.canonicalUrl.startsWith('https://')) {
      warnings.push('Canonical URL should use HTTPS');
    }
  } else {
    warnings.push('Canonical URL is recommended for better SEO');
  }

  // Image validation
  if (data.imageUrl) {
    if (!isValidUrl(data.imageUrl)) {
      errors.push('Invalid image URL format');
    } else if (!data.imageUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {
      warnings.push('Image should be in optimized format (WebP, JPG, PNG)');
    }
  }

  // Date validation
  if (data.lastModified) {
    const date = new Date(data.lastModified);
    if (isNaN(date.getTime())) {
      errors.push('Invalid last modified date format');
    }
  }

  // Language validation
  if (data.language && data.language !== 'ru') {
    warnings.push('Content language should be "ru" for Russian market');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Check if URL is valid
 * Simple URL validation utility
 * 
 * @param url - URL to validate
 * @returns True if URL is valid
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
 * Combine multiple validation results
 * Merges validation results from different sources
 * 
 * @param results - Array of validation results
 * @returns Combined validation result
 */
export const combineValidationResults = (
  results: SEOValidationResult[]
): SEOValidationResult => {
  const allWarnings = results.flatMap(r => r.warnings);
  const allErrors = results.flatMap(r => r.errors);
  
  return {
    isValid: allErrors.length === 0,
    warnings: [...new Set(allWarnings)], // Remove duplicates
    errors: [...new Set(allErrors)], // Remove duplicates
  };
};