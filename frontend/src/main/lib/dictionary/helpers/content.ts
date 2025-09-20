// src/main/lib/dictionary/helpers/content.ts
// FIXED: Content formatting helpers using correct TemplateVariables

import { Dictionary } from '../types';
import { processTemplate } from './templates';

// ===================================================================
// COUNT FORMATTING - Clean, simple functions
// ===================================================================

/**
 * Get localized count with proper label from dictionary
 */
export const getLocalizedCount = (
  dictionary: Dictionary,
  count: number,
  type: 'articles' | 'rubrics' | 'authors' | 'results' | 'items'
): string => {
  const label = dictionary.common.count[type];
  return `${label} ${count}`;
};

/**
 * Get localized article count
 */
export const getLocalizedArticleCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'articles');
};

/**
 * Get localized rubric count
 */
export const getLocalizedRubricCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'rubrics');
};

/**
 * Get localized author count
 */
export const getLocalizedAuthorCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'authors');
};

/**
 * Format total count using dictionary template
 */
export const formatTotalCount = (
  dictionary: Dictionary,
  count: number,
  countLabel: string
): string => {
  return processTemplate(dictionary.sections.templates.totalCount, {
    count: count.toString(),
    countLabel,
  });
};

/**
 * Simple count formatting without labels
 */
export const formatCount = (count: number): string => {
  return count.toString();
};

// ===================================================================
// CONTENT DESCRIPTION HELPERS - FIXED: Using correct template variables
// ===================================================================

/**
 * Get icon alt text using dictionary - FIXED: Using 'item' instead of 'name'
 */
export const getIconAlt = (dictionary: Dictionary, itemName: string): string => {
  return processTemplate(dictionary.sections.rubrics.rubricIcon, { 
    item: itemName  // FIXED: Use 'item' instead of 'name'
  });
};

/**
 * Get link title for accessibility - FIXED: Using correct variables
 */
export const getLinkTitle = (
  dictionary: Dictionary,
  itemName: string,
  itemType: 'rubric' | 'article' | 'author'
): string => {
  const action = dictionary.common.actions.explore;
  const typeLabel = itemType === 'rubric' ? 'рубрику' : 
                   itemType === 'article' ? 'статью' : 'автора';
  return `${action} ${typeLabel} ${itemName}`;
};

/**
 * Get empty state message using dictionary templates
 */
export const getEmptyMessage = (
  dictionary: Dictionary,
  collection: string,
  items: string
): string => {
  return processTemplate(dictionary.sections.templates.emptyCollection, {
    collection,
    items,
  });
};

// ===================================================================
// RELATIONSHIP FORMATTERS
// ===================================================================

/**
 * Format item in collection relationship
 */
export const getItemsInCollection = (
  dictionary: Dictionary,
  item: string,
  collection: string
): string => {
  return processTemplate(dictionary.sections.templates.itemInCollection, {
    item,
    collection,
  });
};

/**
 * Format item by author relationship
 */
export const getItemsByAuthor = (
  dictionary: Dictionary,
  item: string,
  author: string
): string => {
  return processTemplate(dictionary.sections.templates.itemByAuthor, {
    item,
    author,
  });
};

// ===================================================================
// CONTENT STATE HELPERS - Simple dictionary access
// ===================================================================

export const getLoadingMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.loading;
};

export const getErrorMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.error;
};

export const getNotFoundMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.notFound;
};

export const getEmptyStateMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.empty;
};

export const getRetryMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.retry;
};

// ===================================================================
// ACTION HELPERS - Simple dictionary access
// ===================================================================

export const getLoadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.loadMore;
};

export const getShowMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.showMore;
};

export const getShowLessText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.showLess;
};

export const getReadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.readMore;
};

export const getExploreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.explore;
};

export const getViewAllText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.viewAll;
};

export const getBackToText = (dictionary: Dictionary, target: string): string => {
  return `${dictionary.common.actions.backTo} ${target}`;
};

// ===================================================================
// VALIDATION HELPERS
// ===================================================================

export const validateContentDictionary = (dictionary: Dictionary): boolean => {
  try {
    return !!(
      dictionary.common?.count &&
      dictionary.common?.actions &&
      dictionary.common?.status &&
      dictionary.sections?.templates?.totalCount &&
      dictionary.sections?.templates?.emptyCollection &&
      dictionary.sections?.templates?.itemInCollection
    );
  } catch (error) {
    console.warn('Content dictionary validation failed:', error);
    return false;
  }
};

export const getContentTypeLabels = (dictionary: Dictionary) => {
  return dictionary.sections.labels;
};

export const getCollectionTitle = (dictionary: Dictionary, section: string): string => {
  return processTemplate(dictionary.sections.templates.collectionTitle, { section });
};