// src/main/lib/dictionary/helpers/templates.ts
// Template processing and variable substitution utilities

import { TemplateVariables, TemplateProcessor } from '../types';

// ===================================================================
// CORE TEMPLATE PROCESSING
// ===================================================================

/**
 * Process template strings with variable substitution
 * Replaces {variableName} patterns with actual values
 * 
 * @param template - Template string with {variable} placeholders
 * @param variables - Object containing replacement values
 * @returns Processed string with variables replaced
 * 
 * @example
 * processTemplate('{title} — {siteName}', { title: 'Article', siteName: 'EventForMe' })
 * // Returns: 'Article — EventForMe'
 */
export const processTemplate: TemplateProcessor = (template: string, variables: TemplateVariables): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key as keyof TemplateVariables];
    return value ?? match; // Return original if no replacement found
  });
};

/**
 * Generate SEO title with proper fallbacks and validation
 * Processes template and ensures fallback if template variables are missing
 * 
 * @param template - Title template with variables
 * @param variables - Template variables object
 * @param fallback - Fallback title if processing fails
 * @returns Processed title or fallback
 */
export const generateSEOTitle = (
  template: string, 
  variables: TemplateVariables,
  fallback: string
): string => {
  const processed = processTemplate(template, variables);
  // Return fallback if template still contains unreplaced variables
  return processed.includes('{') ? fallback : processed;
};

/**
 * Generate SEO description with length validation and truncation
 * Processes template and ensures proper length for search engines
 * 
 * @param template - Description template with variables
 * @param variables - Template variables object  
 * @param fallback - Fallback description if processing fails
 * @param maxLength - Maximum allowed length (default: 160 for Google/Yandex)
 * @returns Processed description within length limits
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
  
  // Truncate at word boundary for better readability
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// ===================================================================
// TEMPLATE VALIDATION UTILITIES
// ===================================================================

/**
 * Check if template string has valid variable syntax
 * Validates that template uses proper {variable} format
 * 
 * @param template - Template string to validate
 * @returns Array of found variables or empty array if none
 */
export const extractTemplateVariables = (template: string): string[] => {
  const matches = template.match(/\{(\w+)\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
};

/**
 * Validate that all required variables are provided
 * Ensures template can be fully processed with given variables
 * 
 * @param template - Template string
 * @param variables - Available variables
 * @returns Object with validation results
 */
export const validateTemplateVariables = (
  template: string, 
  variables: TemplateVariables
): { 
  isValid: boolean; 
  missing: string[]; 
  provided: string[] 
} => {
  const required = extractTemplateVariables(template);
  const provided = Object.keys(variables);
  const missing = required.filter(variable => !(variable in variables));
  
  return {
    isValid: missing.length === 0,
    missing,
    provided: provided.filter(key => required.includes(key))
  };
};

// ===================================================================
// CONTENT TRUNCATION UTILITIES
// ===================================================================

/**
 * Truncate text with language-aware word boundaries
 * Handles Russian text properly and maintains readability
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 * @param suffix - String to append when truncated (default: '...')
 * @returns Truncated text or original if within limit
 */
export const smartTruncate = (
  text: string, 
  maxLength: number = 120, 
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If we can't find a space, just cut at the limit
  if (lastSpace === -1) {
    return truncated + suffix;
  }
  
  return truncated.substring(0, lastSpace) + suffix;
};

/**
 * Clean and normalize text for template processing
 * Removes extra whitespace and normalizes line endings
 * 
 * @param text - Text to clean
 * @returns Cleaned text
 */
export const cleanTemplateText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n') // Normalize line breaks
    .trim();
};