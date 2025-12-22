// src/config/i18n/helpers/templates.ts

import Dictionary from "../types";

/**
 * Process template string with variable replacements
 * Language-agnostic - works with any dictionary
 */
export const processTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    template
  );
};

/**
 * Get page title using dictionary template
 * Language-agnostic
 */
export const getPageTitle = (
  dictionary: Dictionary,
  pageTitle: string
): string => {
  return processTemplate(dictionary.seo.templates.pageTitle, {
    title: pageTitle,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get meta description using dictionary template
 * Language-agnostic
 */
export const getMetaDescription = (
  dictionary: Dictionary,
  description: string
): string => {
  return processTemplate(dictionary.seo.templates.metaDescription, {
    description,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get collection page title using dictionary template
 * Language-agnostic
 */
export const getCollectionTitle = (
  dictionary: Dictionary,
  collectionName: string
): string => {
  return processTemplate(dictionary.seo.templates.collectionPage, {
    collection: collectionName,
    siteName: dictionary.seo.site.name,
  });
};