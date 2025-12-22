// src/config/i18n/helpers/content.ts
import Dictionary from '../types';
import { processTemplate } from './templates';

/**
 * Get localized count with proper label from dictionary
 * Language-agnostic
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
export const getLocalizedArticleCount = (
  dictionary: Dictionary,
  count: number
): string => {
  return getLocalizedCount(dictionary, count, 'articles');
};

/**
 * Get localized rubric count
 */
export const getLocalizedRubricCount = (
  dictionary: Dictionary,
  count: number
): string => {
  return getLocalizedCount(dictionary, count, 'rubrics');
};

/**
 * Get localized author count
 */
export const getLocalizedAuthorCount = (
  dictionary: Dictionary,
  count: number
): string => {
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
 * Get icon alt text using dictionary
 */
export const getIconAlt = (dictionary: Dictionary, itemName: string): string => {
  return processTemplate(dictionary.sections.rubrics.rubricIcon, { 
    item: itemName
  });
};

// Common action getters
export const getLoadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.loadMore;
};

export const getExploreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.explore;
};

export const getReadMoreText = (dictionary: Dictionary): string => {
  return dictionary.common.actions.readMore;
};