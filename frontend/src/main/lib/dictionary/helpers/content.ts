// src/main/lib/dictionary/helpers/content.ts
// FIXED: Correct parameter order and simplified count formatting

import { Dictionary } from '../types';
import { processTemplate } from './templates';

/**
 * Format count with appropriate label - no pluralization needed
 * @example formatCount(dictionary, 5, 'articles') => "Статей: 5"
 */
export const formatCount = (dictionary: Dictionary, count: number, type: keyof Dictionary['common']['count']): string => {
  const label = dictionary.common.count[type];
  return `${label} ${count}`;
};

/**
 * Format total count using template
 * @example formatTotalCount(dictionary, 15, 'статей') => "Всего: 15 статей"
 */
export const formatTotalCount = (dictionary: Dictionary, count: number, countLabel: string): string => {
  return processTemplate(dictionary.sections.templates.totalCount, {
    count: count.toString(),
    countLabel,
  });
};

/**
 * Generate icon alt text using accessibility template or fallback
 * @example getIconAlt(dictionary, 'рубрика') => "Иконка рубрика"
 */
export const getIconAlt = (dictionary: Dictionary, item: string): string => {
  // Use template if available, otherwise create simple text
  if (dictionary.accessibility?.templates?.iconAlt) {
    return processTemplate(dictionary.accessibility.templates.iconAlt, { item });
  }
  return `${dictionary.accessibility.iconDescription} ${item}`;
};

/**
 * Generate link title using accessibility template or fallback
 * @example getLinkTitle(dictionary, 'Изучить', 'рубрику') => "Изучить рубрику"
 */
export const getLinkTitle = (dictionary: Dictionary, action: string, item: string): string => {
  if (dictionary.accessibility?.templates?.linkTitle) {
    return processTemplate(dictionary.accessibility.templates.linkTitle, { action, item });
  }
  return `${action} ${item}`;
};

/**
 * Get empty message for collections
 * @example getEmptyMessage(dictionary, 'рубриках', 'статей') => "В рубриках пока нет статей"
 */
export const getEmptyMessage = (dictionary: Dictionary, collection: string, items: string): string => {
  return processTemplate(dictionary.sections.templates.emptyCollection, {
    collection,
    items,
  });
};

/**
 * Generate "items in collection" text
 * @example getItemsInCollection(dictionary, 'статья', 'рубрике') => "статья в рубрике"
 */
export const getItemsInCollection = (dictionary: Dictionary, item: string, collection: string): string => {
  return processTemplate(dictionary.sections.templates.itemInCollection, {
    item,
    collection,
  });
};

/**
 * Localized count for Russian - simple numeric display without complex pluralization
 * @example getLocalizedCount(5) => "5" (just returns the number, let templates handle text)
 */
export const getLocalizedCount = (count: number): string => {
  return count.toString();
};

/**
 * FIXED: Get localized article count label with correct parameter order
 * @example getLocalizedArticleCount(dictionary, 5) => "Статей: 5"
 */
export const getLocalizedArticleCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'articles');
};

/**
 * Get localized rubric count label - reuses existing dictionary entries
 * @example getLocalizedRubricCount(dictionary, 3) => "Рубрик: 3"
 */
export const getLocalizedRubricCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'rubrics');
};

/**
 * Get localized author count label - reuses existing dictionary entries  
 * @example getLocalizedAuthorCount(dictionary, 12) => "Авторов: 12"
 */
export const getLocalizedAuthorCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'authors');
};

/**
 * Enhanced description truncation with word boundary respect
 * @example truncateDescription("Very long description text...", 100) => "Very long description..."
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
 * Validate count parameters to prevent errors
 * @example validateCount(5) => true, validateCount(-1) => false
 */
export const validateCount = (count: number): boolean => {
  return typeof count === 'number' && count >= 0 && !isNaN(count);
};

/**
 * Safe count formatting with error handling
 * Fallback for when dictionary entries might be missing
 */
export const safeFormatCount = (dictionary: Dictionary, count: number, type: keyof Dictionary['common']['count']): string => {
  try {
    if (!validateCount(count)) {
      return '0';
    }
    
    if (!dictionary?.common?.count?.[type]) {
      // Fallback when dictionary entry is missing
      const fallbacks = {
        articles: 'Статей:',
        rubrics: 'Рубрик:',
        authors: 'Авторов:',
        results: 'Результатов:',
        items: 'Элементов:'
      };
      const label = fallbacks[type] || 'Элементов:';
      return `${label} ${count}`;
    }
    
    return formatCount(dictionary, count, type);
  } catch (error) {
    console.warn('Error formatting count:', error);
    return count.toString();
  }
};