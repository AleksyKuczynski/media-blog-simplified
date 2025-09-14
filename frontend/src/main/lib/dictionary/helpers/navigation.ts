// src/main/lib/dictionary/helpers/navigationUtils.ts
// Navigation-specific utilities - separate from main helpers

import { Dictionary } from '../types';
import { getCanonicalURL, getKeywords, getMetaDescription, getPageTitle } from './seo';
import { processTemplate } from './templates';

/**
 * Get page title for navigation
 * @example getNavigationPageTitle(dictionary, 'рубрики') => "Рубрики — EventForMe"
 */
export const getNavigationPageTitle = (dictionary: Dictionary, page: string): string => {
  return processTemplate(dictionary.navigation.templates.pageTitle, {
    page,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get section description for navigation
 * @example getNavigationSectionDescription(dictionary, 'Изучить', 'рубрики') => "Изучить рубрики на EventForMe"
 */
export const getNavigationSectionDescription = (dictionary: Dictionary, action: string, section: string): string => {
  return processTemplate(dictionary.navigation.templates.sectionDescription, {
    action,
    section,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get breadcrumb navigation text with proper separator
 * @example getBreadcrumbText(dictionary, ['Главная', 'Рубрики']) => "Главная → Рубрики"
 */
export const getBreadcrumbText = (dictionary: Dictionary, items: string[]): string => {
  return items.join(` ${dictionary.navigation.templates.breadcrumbSeparator} `);
};

/**
 * Get all navigation accessibility labels for a dictionary
 * Useful for validation and testing
 */
export const getNavigationAccessibilityLabels = (dictionary: Dictionary) => {
  return dictionary.navigation.accessibility;
};

/**
 * Validate that navigation dictionary has all required accessibility properties
 */
export const validateNavigationAccessibility = (dictionary: Dictionary): boolean => {
  const required = [
    'mainNavigation',
    'menuTitle', 
    'menuDescription',
    'openMenu',
    'closeMenu',
    'logoAlt',
    'logoMainPageLabel',
    'primarySectionsLabel',
    'mainMenuLabel',
    'searchAndSettingsLabel',
    'siteSearchLabel',
    'skipToContent',
    'skipToNavigation',
  ];

  const accessibility = dictionary.navigation.accessibility;
  
  return required.every(key => {
    const hasProperty = key in accessibility;
    const hasValue = accessibility[key as keyof typeof accessibility]?.trim().length > 0;
    return hasProperty && hasValue;
  });
};

// ===================================================================
// COMPOSITE HELPER FUNCTIONS - Using existing functions
// ===================================================================

/**
 * Generate complete navigation metadata using existing helpers
 * Combines existing SEO and navigation functions - no duplication
 */
export const generateNavigationSEOData = (
  dictionary: Dictionary,
  pageTitle: string,
  currentPath: string,
  pageType: 'main' | 'section' | 'breadcrumb' = 'main'
) => {
  // Use existing functions
  const title = getPageTitle(dictionary, pageTitle);
  const description = getMetaDescription(dictionary, dictionary.seo.site.description);
  const keywords = getKeywords(dictionary, 'navigation');
  const canonicalUrl = getCanonicalURL(currentPath, dictionary.seo.site.url);
  
  return {
    title,
    description,
    keywords,
    canonicalUrl,
    pageType,
  };
};

/**
 * Generate navigation elements data using existing helpers
 * Reuses existing navigation functions
 */
export const generateNavigationElements = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  
  return [
    {
      name: dictionary.navigation.labels.home,
      url: getCanonicalURL('/', baseUrl),
      description: dictionary.navigation.descriptions.home,
    },
    {
      name: dictionary.navigation.labels.articles,
      url: getCanonicalURL('/articles', baseUrl),
      description: dictionary.navigation.descriptions.articles,
    },
    {
      name: dictionary.navigation.labels.rubrics,
      url: getCanonicalURL('/rubrics', baseUrl),
      description: dictionary.navigation.descriptions.rubrics,
    },
    {
      name: dictionary.navigation.labels.authors,
      url: getCanonicalURL('/authors', baseUrl),
      description: dictionary.navigation.descriptions.authors,
    },
  ];
};