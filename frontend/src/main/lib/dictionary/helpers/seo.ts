// src/main/lib/dictionary/helpers/seo.ts
// SEO generation and optimization utilities for Russian market

import { Dictionary, SEOPageType, TemplateVariables, SEOValidationResult } from '../types';
import { generateSEOTitle, generateSEODescription } from './templates';
import { validateSEOContent } from './validation';

// ===================================================================
// SEO CONTENT GENERATION
// ===================================================================

/**
 * Generate processed SEO title for different page types
 * Uses dictionary templates with variable substitution and proper fallbacks
 * Optimized for Russian market and Google/Yandex requirements
 * 
 * @param seoDict - SEO section from dictionary
 * @param pageType - Type of page (home, article, rubric, etc.)
 * @param variables - Template variables for substitution
 * @returns Optimized SEO title
 */
export const getProcessedSEOTitle = (
  seoDict: Dictionary['seo'], 
  pageType: SEOPageType,
  variables: TemplateVariables = {}
): string => {
  const templates = seoDict.titles;
  const fallbackTitle = seoDict.site.name || 'EventForMe';
  
  let template: string;
  
  switch (pageType) {
    case 'home':
      template = `${templates.homePrefix} ${templates.homeSuffix}`;
      break;
    case 'article':
      template = templates.articleTemplate;
      break;
    case 'rubric':
      template = templates.rubricTemplate;
      break;
    case 'author':
      template = templates.authorTemplate;
      break;
    case 'search':
      template = templates.searchTemplate;
      break;
    case 'rubrics-collection':
      template = templates.rubricsListTitle;
      break;
    default:
      template = `{title} — ${fallbackTitle}`;
  }

  const processedTitle = generateSEOTitle(template, variables, fallbackTitle);
  
  // SEO length validation with warning
  if (processedTitle.length > 60) {
    console.warn(`SEO Title length (${processedTitle.length}) exceeds recommended 60 characters for page type: ${pageType}`);
  }
  
  return processedTitle;
};

/**
 * Generate processed SEO description for different page types
 * Uses dictionary templates with length validation and Russian market optimization
 * 
 * @param seoDict - SEO section from dictionary  
 * @param pageType - Type of page
 * @param variables - Template variables for substitution
 * @returns Optimized SEO description (≤160 chars)
 */
export const getProcessedSEODescription = (
  seoDict: Dictionary['seo'],
  pageType: SEOPageType,
  variables: TemplateVariables = {}
): string => {
  const templates = seoDict.descriptions;
  const fallbackDescription = seoDict.site.description || 'EventForMe — медиа-платформа о культуре и событиях';
  
  let template: string;
  
  switch (pageType) {
    case 'home':
      template = templates.home;
      break;
    case 'article':
      template = templates.articleTemplate;
      break;
    case 'rubric':
      template = templates.rubricTemplate;
      break;
    case 'author':
      template = templates.authorTemplate;
      break;
    case 'search':
      template = templates.searchTemplate;
      break;
    case 'rubrics-collection':
      template = templates.rubricsList;
      break;
    default:
      template = fallbackDescription;
  }

  return generateSEODescription(template, variables, fallbackDescription, 160);
};

/**
 * Get relevant keywords for specific page types
 * Combines general keywords with page-specific ones for Russian market optimization
 * Supports both Google and Yandex keyword strategies
 * 
 * @param seoDict - SEO section from dictionary
 * @param pageType - Type of page
 * @param additionalKeywords - Extra keywords to include
 * @returns Comma-separated keyword string
 */
export const getPageTypeKeywords = (
  seoDict: Dictionary['seo'],
  pageType: SEOPageType,
  additionalKeywords: string[] = []
): string => {
  const keywords = seoDict.keywords;
  const generalKeywords = keywords.general;
  
  let pageSpecificKeywords: string;
  
  switch (pageType) {
    case 'home':
      pageSpecificKeywords = generalKeywords;
      break;
    case 'article':
      pageSpecificKeywords = keywords.articles;
      break;
    case 'rubric':
      pageSpecificKeywords = keywords.rubrics;
      break;
    case 'author':
      pageSpecificKeywords = keywords.authors;
      break;
    case 'search':
      pageSpecificKeywords = generalKeywords;
      break;
    case 'rubrics-collection':
      pageSpecificKeywords = keywords.rubricsList;
      break;
    default:
      pageSpecificKeywords = generalKeywords;
  }

  // Combine page-specific keywords with additional ones
  const allKeywords = [pageSpecificKeywords, ...additionalKeywords]
    .filter(Boolean)
    .filter(keyword => keyword.trim().length > 0)
    .join(', ');

  return allKeywords;
};

/**
 * Validate complete SEO metadata for a page
 * Enhanced validation with Russian market-specific checks
 * 
 * @param title - SEO title to validate
 * @param description - SEO description to validate  
 * @param keywords - Keywords string to validate
 * @param pageType - Type of page for specific validation rules
 * @returns Validation result with errors and warnings
 */
export const validateSEOMetadata = (
  title: string,
  description: string,
  keywords: string,
  pageType?: SEOPageType
): SEOValidationResult => {
  // Use existing validation function as base
  const baseValidation = validateSEOContent(
    title, 
    description, 
    keywords, 
    pageType || 'home'
  );

  // Add additional validations specific to Russian market
  const warnings = [...baseValidation.warnings];
  const errors = [...baseValidation.errors];

  // Russian-specific SEO checks
  if (title && !title.match(/[а-яё]/i)) {
    warnings.push('Title should contain Russian text for Russian market optimization');
  }

  if (description && !description.match(/[а-яё]/i)) {
    warnings.push('Description should contain Russian text for Russian market optimization');
  }

  // Check for EventForMe branding  
  if (title && !title.toLowerCase().includes('event') && pageType !== 'home') {
    warnings.push('Consider including EventForMe branding in title for brand recognition');
  }

  // Keyword density check
  if (keywords) {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywordArray.length > 10) {
      warnings.push(`Too many keywords (${keywordArray.length}). Consider focusing on 5-8 primary keywords.`);
    }
    if (keywordArray.length === 0) {
      warnings.push('No keywords found. Add relevant keywords for better SEO.');
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// ===================================================================
// PAGE TYPE UTILITIES  
// ===================================================================

/**
 * Determine page type from URL path
 * Used for automatic SEO optimization based on page context
 * 
 * @param path - URL path to analyze
 * @returns Detected page type
 */
export const getPageTypeFromPath = (path: string): SEOPageType => {
  if (!path || path === '/' || path === '/ru') return 'home';
  
  // Remove language prefix and leading slash for analysis
  const cleanPath = path.replace(/^\/ru\//, '').replace(/^\//, '');
  
  if (cleanPath.startsWith('articles/') || cleanPath.match(/^[^\/]+\/[^\/]+$/)) {
    return 'article';
  }
  if (cleanPath.startsWith('rubrics') && cleanPath !== 'rubrics') {
    return 'rubric';
  }
  if (cleanPath === 'rubrics') {
    return 'rubrics-collection';
  }
  if (cleanPath.startsWith('authors/')) {
    return 'author';
  }
  if (cleanPath.startsWith('search')) {
    return 'search';
  }
  
  return 'home';
};

/**
 * Generate SEO-optimized variables object from page data
 * Creates consistent variable mapping for template processing
 * 
 * @param pageData - Raw page data
 * @returns Formatted template variables
 */
export const createSEOVariables = (pageData: {
  title?: string;
  rubric?: string;
  author?: string;
  query?: string;
  siteName?: string;
}): TemplateVariables => {
  return {
    siteName: pageData.siteName || 'EventForMe',
    title: pageData.title || '',
    rubric: pageData.rubric || '',
    author: pageData.author || '',
    query: pageData.query || '',
  };
};

// ===================================================================
// RUSSIAN MARKET SPECIFIC OPTIMIZATIONS
// ===================================================================

/**
 * Check if content is optimized for Russian search engines
 * Validates content against Yandex and Google.ru requirements
 * 
 * @param title - SEO title
 * @param description - SEO description  
 * @param keywords - Keywords string
 * @returns Optimization status and recommendations
 */
export const validateRussianSEO = (
  title: string,
  description: string,
  keywords: string
): {
  isOptimized: boolean;
  recommendations: string[];
} => {
  const recommendations: string[] = [];
  
  // Cyrillic content check
  const hasRussianTitle = title.match(/[а-яё]/i);
  const hasRussianDescription = description.match(/[а-яё]/i);
  
  if (!hasRussianTitle) {
    recommendations.push('Add Russian text to title for better local search performance');
  }
  
  if (!hasRussianDescription) {
    recommendations.push('Add Russian text to description for better local search performance');
  }
  
  // Yandex-specific checks
  if (keywords) {
    const russianKeywords = keywords.split(',').filter(k => k.match(/[а-яё]/i));
    if (russianKeywords.length === 0) {
      recommendations.push('Include Russian keywords for Yandex optimization');
    }
  }
  
  // Length optimization for Russian text (typically longer)
  if (description.length < 140 && hasRussianDescription) {
    recommendations.push('Russian descriptions can be slightly longer (up to 160 chars) - consider adding more detail');
  }
  
  return {
    isOptimized: recommendations.length === 0,
    recommendations
  };
};