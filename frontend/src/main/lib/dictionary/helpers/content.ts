// src/main/lib/dictionary/helpers/content.ts
// Content formatting and display utilities

import { Dictionary } from '../types';
import { processTemplate } from './templates';

/**
 * Format count with simple label - no pluralization
 * @example formatCount(5, 'Статей:') => "Статей: 5"
 */
export const formatCount = (count: number, label: string): string => {
  return `${label} ${count}`;
};

/**
 * Format total count using template
 * @example formatTotalCount(dictionary, 5, 'articles') => "Всего: 5 Статей:"
 */
export const formatTotalCount = (
  dictionary: Dictionary, 
  count: number, 
  type: keyof Dictionary['common']['count']
): string => {
  return processTemplate(dictionary.sections.templates.totalCount, {
    count: count.toString(),
    countLabel: dictionary.common.count[type],
  });
};

/**
 * Generate accessible icon alt text
 * @example getIconAlt(dictionary, 'рубрики') => "Иконка рубрики"
 */
export const getIconAlt = (dictionary: Dictionary, item: string): string => {
  return processTemplate(dictionary.accessibility.templates.iconAlt, { item });
};

/**
 * Generate accessible link title
 * @example getLinkTitle(dictionary, 'Изучить', 'рубрику') => "Изучить рубрику"
 */
export const getLinkTitle = (dictionary: Dictionary, action: string, item: string): string => {
  return processTemplate(dictionary.accessibility.templates.linkTitle, { action, item });
};

/**
 * Generate empty state message using template
 * @example getEmptyMessage(dictionary, 'рубрике', 'статей') => "В рубрике пока нет статей"
 */
export const getEmptyMessage = (dictionary: Dictionary, collection: string, items: string): string => {
  return processTemplate(dictionary.sections.templates.emptyCollection, {
    collection,
    items,
  });
};

/**
 * Generate "items in collection" text  
 * @example getItemsInCollection(dictionary, 'Статьи', 'рубрике') => "Статьи в рубрике"
 */
export const getItemsInCollection = (dictionary: Dictionary, item: string, collection: string): string => {
  return processTemplate(dictionary.sections.templates.itemInCollection, {
    item,
    collection,
  });
};

/**
 * Generate breadcrumb text for navigation
 * @example getBreadcrumbText(dictionary, 'home') => "Главная"
 */
export const getBreadcrumbText = (dictionary: Dictionary, key: keyof Dictionary['navigation']['labels']): string => {
  return dictionary.navigation.labels[key];
};

/**
 * Generate status message
 * @example getStatusMessage(dictionary, 'loading') => "Загрузка..."
 */
export const getStatusMessage = (dictionary: Dictionary, status: keyof Dictionary['common']['status']): string => {
  return dictionary.common.status[status];
};

/**
 * Generate action label
 * @example getActionLabel(dictionary, 'loadMore') => "Загрузить еще"
 */
export const getActionLabel = (dictionary: Dictionary, action: keyof Dictionary['common']['actions']): string => {
  return dictionary.common.actions[action];
};

/**
 * Generate section label
 * @example getSectionLabel(dictionary, 'articles') => "статьи"
 */
export const getSectionLabel = (dictionary: Dictionary, section: keyof Dictionary['sections']['labels']): string => {
  return dictionary.sections.labels[section];
};

/**
 * Truncate text with Russian-aware word boundaries
 * @example truncateText('Длинный текст статьи...', 50) => "Длинный текст статьи..."
 */
export const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // Only truncate at word boundary if it's not too short
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace).trim() + '...';
  } else {
    return truncated.trim() + '...';
  }
};

/**
 * Generate page heading with consistent formatting
 * @example getPageHeading(dictionary, 'Все рубрики') => "Все рубрики"
 */
export const getPageHeading = (dictionary: Dictionary, title: string, withSiteName: boolean = false): string => {
  if (withSiteName) {
    return processTemplate(dictionary.seo.templates.pageTitle, {
      title,
      siteName: dictionary.seo.site.name,
    });
  }
  return title;
};

// Fix default export - assign to variable first
const contentHelpers = {
  formatCount,
  formatTotalCount,
  getIconAlt,
  getLinkTitle,
  getEmptyMessage,
  getItemsInCollection,
  getBreadcrumbText,
  getStatusMessage,
  getActionLabel,
  getSectionLabel,
  truncateText,
  getPageHeading,
};

export default contentHelpers;