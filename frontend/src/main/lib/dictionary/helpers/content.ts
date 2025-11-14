// src/main/lib/dictionary/helpers/content.ts

import { Dictionary } from '../dictionary';
import { processTemplate } from './templates';

/**
 * Get localized count with proper label from dictionary
 * ESSENTIAL: Base function for count formatting
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
 * ESSENTIAL: Used in page components (src/app/ru/[rubric]/page.tsx)
 */
export const getLocalizedArticleCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'articles');
};

/**
 * Get localized rubric count
 * ESSENTIAL: Used in page components (src/app/ru/rubrics/page.tsx)
 */
export const getLocalizedRubricCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'rubrics');
};

/**
 * Get localized author count
 * KEEP: May be used in author pages
 */
export const getLocalizedAuthorCount = (dictionary: Dictionary, count: number): string => {
  return getLocalizedCount(dictionary, count, 'authors');
};

/**
 * Format total count using dictionary template
 * KEEP: Used for detailed count displays
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
 * Get icon alt text using dictionary
 * KEEP: Used for accessibility in components
 */
export const getIconAlt = (dictionary: Dictionary, itemName: string): string => {
  return processTemplate(dictionary.sections.rubrics.rubricIcon, { 
    item: itemName
  });
};

// Common action getters - keep as they're used in UI components
export const getLoadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.loadMore;
};

export const getExploreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.explore;
};

export const getViewAllText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.viewAll;
};

export const getReadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.readMore;
};

// Common status getters - keep as they're used for UI states
export const getLoadingMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.loading;
};

export const getErrorMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.error;
};

export const getNotFoundMessage = (dictionary: Dictionary): string => {
  return dictionary.common.status.notFound;
};

// REMOVED: formatCount, getLinkTitle, getEmptyMessage, getItemsInCollection,
// getItemsByAuthor, getEmptyStateMessage, getRetryMessage, getShowMoreText,
// getShowLessText, getBackToText, validateContentDictionary, 
// getContentTypeLabels, getCollectionTitle
// These are either simple utilities or not used in actual components