// src/main/lib/dictionary/helpers/templates.ts
// Template processing utilities - works with simplified dictionary structure

import { TemplateVariables } from '../types';

/**
 * Process template with variables - simple and reliable
 * @example processTemplate('Все {section}', { section: 'рубрики' }) => "Все рубрики"
 */
export const processTemplate = (template: string, variables: TemplateVariables): string => {
  if (!template || typeof template !== 'string') {
    return '';
  }

  let result = template;
  
  // Replace all variable placeholders
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const patterns = [
        new RegExp(`\\{${key}\\}`, 'gi'),
        new RegExp(`\\{${key.toUpperCase()}\\}`, 'gi'),
        new RegExp(`\\{${key.toLowerCase()}\\}`, 'gi'),
      ];

      patterns.forEach(pattern => {
        result = result.replace(pattern, String(value));
      });
    }
  });

  // Clean up any remaining unreplaced placeholders
  result = result.replace(/\{[^}]+\}/g, '').trim();
  
  // Clean up multiple spaces and normalize punctuation
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s*—\s*/g, ' — ')
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/\s*-\s*/g, ' - ')
    .trim();

  return result;
};

/**
 * Create template variables object from various data sources
 * Normalizes data for consistent template processing
 */
export const createSEOVariables = (data: Record<string, any>): TemplateVariables => {
  return {
    siteName: data.siteName || 'EventForMe',
    title: data.title || '',
    page: data.page || '',
    section: data.section || '',
    collection: data.collection || '',
    item: data.item || '',
    author: data.author || '',
    query: data.query || '',
    count: data.count?.toString() || '0',
    countLabel: data.countLabel || '',
    action: data.action || '',
    description: data.description || '',
  };
};

/**
 * Validate template for common issues
 * Helps catch template errors during development
 */
export const validateTemplate = (template: string): {
  isValid: boolean;
  warnings: string[];
  variables: string[];
} => {
  const warnings: string[] = [];
  const variables: string[] = [];

  if (!template || typeof template !== 'string') {
    return {
      isValid: false,
      warnings: ['Template is empty or invalid'],
      variables: [],
    };
  }

  // Extract all variable placeholders
  const variableMatches = template.match(/\{([^}]+)\}/g);
  if (variableMatches) {
    variableMatches.forEach(match => {
      const variable = match.slice(1, -1); // Remove { }
      variables.push(variable);
    });
  }

  // Check for common issues
  if (template.length > 200) {
    warnings.push('Template is very long and may produce excessive metadata');
  }

  if (template.includes('{{') || template.includes('}}')) {
    warnings.push('Template contains double braces which may cause issues');
  }

  if (variables.length === 0) {
    warnings.push('Template has no variables - consider if this is intentional');
  }

  if (variables.length > 10) {
    warnings.push('Template has many variables - ensure all are needed');
  }

  // Check for Russian content
  const hasRussianText = template.match(/[а-яё]/i);
  if (!hasRussianText && template.length > 10) {
    warnings.push('Template appears to lack Russian content');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    variables: [...new Set(variables)], // Remove duplicates
  };
};

/**
 * Truncate text at word boundaries
 * Respects Russian text patterns
 */
export const smartTruncate = (
  text: string, 
  maxLength: number = 120
): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength);
  
  // Find last space or punctuation for clean break
  const lastSpace = truncated.lastIndexOf(' ');
  const lastPunct = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf(','),
    truncated.lastIndexOf(';'),
    truncated.lastIndexOf(':')
  );
  
  const breakPoint = Math.max(lastSpace, lastPunct);
  
  // Only break at word/sentence boundary if it's not too short
  if (breakPoint > maxLength * 0.7) {
    return truncated.substring(0, breakPoint).trim() + '...';
  } else {
    return truncated.trim() + '...';
  }
};

// Fix default export - assign to variable first
const templateHelpers = {
  processTemplate,
  createSEOVariables,
  validateTemplate,
  smartTruncate,
};

export default templateHelpers;