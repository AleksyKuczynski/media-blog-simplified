// src/main/lib/dictionary/helpers/templates.ts
// OPTIMIZED: Removed unused template functions, kept essential processTemplate

import { TemplateVariables, TemplateProcessor } from '../types';

/**
 * Process template strings with variable substitution
 * ESSENTIAL: Used throughout the application - keep this
 */
export const processTemplate: TemplateProcessor = (template: string, variables: TemplateVariables): string => {
  if (!template || typeof template !== 'string') {
    return '';
  }

  let result = template;
  
  // Replace all template variables
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value));
    }
  });

  return result;
};

/**
 * Create standardized SEO variables object
 * KEEP: Used by SEO components
 */
export const createSEOVariables = (overrides: Partial<TemplateVariables> = {}): TemplateVariables => ({
  siteName: 'EventForMe',
  year: new Date().getFullYear().toString(),
  ...overrides,
});