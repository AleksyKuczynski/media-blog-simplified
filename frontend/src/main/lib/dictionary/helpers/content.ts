// src/main/lib/dictionary/helpers/content.ts
// Content formatting helpers for simplified dictionary structure

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
 * Generate icon alt text using accessibility template
 * @example getIconAlt(dictionary, 'рубрика') => "Иконка рубрика"
 */
export const getIconAlt = (dictionary: Dictionary, item: string): string => {
  return processTemplate(dictionary.accessibility.templates.iconAlt, { item });
};

/**
 * Generate link title using accessibility template  
 * @example getLinkTitle(dictionary, 'Изучить', 'рубрику') => "Изучить рубрику"
 */
export const getLinkTitle = (dictionary: Dictionary, action: string, item: string): string => {
  return processTemplate(dictionary.accessibility.templates.linkTitle, { action, item });
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
 * Get localized article count label - reuses existing dictionary entries
 */
export const getLocalizedArticleCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'articles');
};

/**
 * Get localized rubric count label - reuses existing dictionary entries
 */
export const getLocalizedRubricCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'rubrics');
};

/**
 * Get localized author count label - reuses existing dictionary entries  
 */
export const getLocalizedAuthorCount = (dictionary: Dictionary, count: number): string => {
  return formatCount(dictionary, count, 'authors');
};