// src/main/lib/dictionary/helpers/content.ts
// COMPLETELY FIXED: All helper functions with correct signatures and error handling

import { Dictionary } from '../types';
import { processTemplate } from './templates';

// ===================================================================
// CORE COUNT FORMATTING FUNCTIONS
// ===================================================================

/**
 * MAIN HELPER: Format count with appropriate label
 * This is the primary function that should be used throughout the app
 * @example formatCount(dictionary, 5, 'articles') => "Статей: 5"
 */
export const formatCount = (
  dictionary: Dictionary, 
  count: number, 
  type: keyof Dictionary['common']['count']
): string => {
  try {
    const label = dictionary.common.count[type];
    if (!label) {
      throw new Error(`Missing dictionary entry for common.count.${type}`);
    }
    return `${label} ${count}`;
  } catch (error) {
    console.warn(`Dictionary error in formatCount: ${error}`);
    
    // Robust fallbacks
    const fallbacks: Record<string, string> = {
      articles: 'Статей:',
      rubrics: 'Рубрик:',
      authors: 'Авторов:',
      results: 'Результатов:',
      items: 'Элементов:'
    };
    
    const label = fallbacks[type] || fallbacks.items || 'Элементов:';
    return `${label} ${count}`;
  }
};

/**
 * Validate count parameters to prevent runtime errors
 */
const validateCount = (count: number): boolean => {
  return typeof count === 'number' && count >= 0 && !isNaN(count);
};

/**
 * Safe wrapper for formatCount with comprehensive error handling
 */
const safeFormatCount = (
  dictionary: Dictionary, 
  count: number, 
  type: keyof Dictionary['common']['count']
): string => {
  if (!validateCount(count)) {
    console.warn('Invalid count provided:', count, 'using 0 instead');
    count = 0;
  }
  
  return formatCount(dictionary, count, type);
};

// ===================================================================
// LEGACY COMPATIBILITY - Specific count functions
// These maintain backward compatibility with existing code
// ===================================================================

/**
 * LEGACY COMPATIBILITY: Get localized article count
 * Maintains existing function signature for backward compatibility
 * @example getLocalizedArticleCount(dictionary, 5) => "Статей: 5"
 */
export const getLocalizedArticleCount = (dictionary: Dictionary, count: number): string => {
  return safeFormatCount(dictionary, count, 'articles');
};

/**
 * LEGACY COMPATIBILITY: Get localized rubric count
 * @example getLocalizedRubricCount(dictionary, 3) => "Рубрик: 3"
 */
export const getLocalizedRubricCount = (dictionary: Dictionary, count: number): string => {
  return safeFormatCount(dictionary, count, 'rubrics');
};

/**
 * LEGACY COMPATIBILITY: Get localized author count
 * @example getLocalizedAuthorCount(dictionary, 12) => "Авторов: 12"
 */
export const getLocalizedAuthorCount = (dictionary: Dictionary, count: number): string => {
  return safeFormatCount(dictionary, count, 'authors');
};

/**
 * LEGACY COMPATIBILITY: Get localized results count
 * @example getLocalizedResultsCount(dictionary, 0) => "Результатов: 0"
 */
export const getLocalizedResultsCount = (dictionary: Dictionary, count: number): string => {
  return safeFormatCount(dictionary, count, 'results');
};

// ===================================================================
// TEMPLATE PROCESSING FUNCTIONS
// ===================================================================

/**
 * Format total count using template if available
 * @example formatTotalCount(dictionary, 15, 'статей') => "Всего: 15 статей"
 */
export const formatTotalCount = (
  dictionary: Dictionary, 
  count: number, 
  countLabel: string
): string => {
  try {
    if (dictionary.sections?.templates?.totalCount) {
      return processTemplate(dictionary.sections.templates.totalCount, {
        count: count.toString(),
        countLabel,
      });
    }
  } catch (error) {
    console.warn('Template processing error:', error);
  }
  
  // Robust fallback
  return `Всего: ${count} ${countLabel}`;
};

/**
 * Generate icon alt text using accessibility template
 */
export const getIconAlt = (dictionary: Dictionary, item: string): string => {
  try {
    if (dictionary.accessibility?.templates?.iconAlt) {
      return processTemplate(dictionary.accessibility.templates.iconAlt, { item });
    }
  } catch (error) {
    console.warn('Template processing error for icon alt:', error);
  }
  
  return `Иконка ${item}`;
};

/**
 * Generate link title using accessibility template
 */
export const getLinkTitle = (dictionary: Dictionary, action: string, item: string): string => {
  try {
    if (dictionary.accessibility?.templates?.linkTitle) {
      return processTemplate(dictionary.accessibility.templates.linkTitle, { action, item });
    }
  } catch (error) {
    console.warn('Template processing error for link title:', error);
  }
  
  return `${action} ${item}`;
};

// ===================================================================
// COLLECTION HELPERS
// ===================================================================

/**
 * Get empty message for collections
 */
export const getEmptyMessage = (
  dictionary: Dictionary, 
  collection: string, 
  items: string
): string => {
  try {
    if (dictionary.sections?.templates?.emptyCollection) {
      return processTemplate(dictionary.sections.templates.emptyCollection, {
        collection,
        items,
      });
    }
  } catch (error) {
    console.warn('Template processing error for empty message:', error);
  }
  
  return `В ${collection} пока нет ${items}`;
};

/**
 * Generate "items in collection" text
 */
export const getItemsInCollection = (
  dictionary: Dictionary, 
  item: string, 
  collection: string
): string => {
  try {
    if (dictionary.sections?.templates?.itemInCollection) {
      return processTemplate(dictionary.sections.templates.itemInCollection, {
        item,
        collection,
      });
    }
  } catch (error) {
    console.warn('Template processing error for items in collection:', error);
  }
  
  return `${item} в ${collection}`;
};

// ===================================================================
// TEXT PROCESSING UTILITIES
// ===================================================================

/**
 * Enhanced description truncation with word boundary respect
 */
export const truncateDescription = (description: string, maxLength: number = 100): string => {
  if (!description || description.length <= maxLength) {
    return description;
  }
  
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Respect word boundaries
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

/**
 * Simple localized count for display (just the number)
 */
export const getLocalizedCount = (count: number): string => {
  return validateCount(count) ? count.toString() : '0';
};