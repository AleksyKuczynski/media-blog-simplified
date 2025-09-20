// src/main/lib/dictionary/helpers/templates.ts
// Clean template processing functions for the new dictionary structure

import { TemplateVariables, TemplateProcessor } from '../types';

/**
 * Process template strings with variable substitution
 * @example processTemplate("{title} — {siteName}", { title: "Музыка", siteName: "EventForMe" })
 * @returns "Музыка — EventForMe"
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
 */
export const createSEOVariables = (overrides: Partial<TemplateVariables> = {}): TemplateVariables => ({
  siteName: 'EventForMe',
  year: new Date().getFullYear().toString(),
  ...overrides,
});

/**
 * Validate template for required variables
 */
export const validateTemplate = (template: string, requiredVars: string[]): boolean => {
  return requiredVars.every(varName => template.includes(`{${varName}}`));
};

/**
 * Extract variables from template string
 */
export const extractTemplateVariables = (template: string): string[] => {
  const matches = template.match(/\{([^}]+)\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
};

/**
 * Safe template processing with fallbacks
 */
export const processTemplateSafe = (
  template: string, 
  variables: TemplateVariables, 
  fallback: string = ''
): string => {
  try {
    const result = processTemplate(template, variables);
    return result || fallback;
  } catch (error) {
    console.warn('Template processing failed:', error);
    return fallback;
  }
};

/**
 * Create template variables for collection pages
 */
export const createCollectionVariables = (
  collectionType: 'rubrics' | 'authors' | 'articles',
  count: number,
  siteName: string = 'EventForMe'
): TemplateVariables => {
  const countLabels = {
    rubrics: 'рубрик',
    authors: 'авторов', 
    articles: 'статей',
  };

  return createSEOVariables({
    section: collectionType,
    collection: collectionType,
    count: count.toString(),
    countLabel: countLabels[collectionType],
    siteName,
  });
};

/**
 * Create template variables for item pages
 */
export const createItemVariables = (
  itemName: string,
  itemType: 'article' | 'rubric' | 'author',
  siteName: string = 'EventForMe'
): TemplateVariables => {
  return createSEOVariables({
    item: itemName,
    title: itemName,
    siteName,
  });
};