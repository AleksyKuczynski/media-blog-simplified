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

/**
 * Generate navigation link data for NavLinks component
 * Uses existing dictionary structure - no expansion needed
 */
export const getNavigationLinkData = (
  dictionary: Dictionary,
  linkKey: 'articles' | 'rubrics' | 'authors'
) => {
  // Use existing dictionary properties
  const label = dictionary.navigation.labels[linkKey];
  const description = dictionary.navigation.descriptions[linkKey];
  
  return {
    label,
    description,
    // Create SEO-friendly title using existing pattern
    title: `${label} — ${dictionary.seo.site.name}`,
    // Use description for aria-label
    ariaLabel: description,
  };
};

/**
 * Generate navigation links configuration using existing dictionary
 * NO EXPANSION - works with current structure
 */
export const getNavigationLinksConfig = (dictionary: Dictionary) => {
  const links = [
    {
      key: 'articles' as const,
      href: '/articles',
      priority: 1,
      ...getNavigationLinkData(dictionary, 'articles'),
    },
    {
      key: 'rubrics' as const,
      href: '/rubrics', 
      priority: 2,
      ...getNavigationLinkData(dictionary, 'rubrics'),
    },
    {
      key: 'authors' as const,
      href: '/authors',
      priority: 3,
      ...getNavigationLinkData(dictionary, 'authors'),
    },
  ];

  return links;
};

/**
 * Get skip links data using existing dictionary properties
 * Uses only properties that actually exist, static text for others
 */
export const getSkipLinksData = (dictionary: Dictionary) => {
  return {
    // Use existing properties
    skipToContent: {
      href: '#main-content',
      label: dictionary.navigation.accessibility.skipToContent,
    },
    skipToNavigation: {
      href: '#main-navigation', 
      label: dictionary.navigation.accessibility.skipToNavigation,
    },
    // Static text for missing properties (no dictionary expansion)
    skipToSearch: {
      href: '#site-search',
      label: 'Перейти к поиску', // Static, no expansion
    },
    skipToFooter: {
      href: '#site-footer',
      label: 'Перейти к подвалу', // Static, no expansion
    },
  };
};

/**
 * Get accessibility labels for skip links
 * Uses existing properties where possible, static fallbacks
 */
export const getSkipLinksAccessibility = (dictionary: Dictionary) => {
  return {
    // Use existing main navigation label
    navigationLabel: dictionary.navigation.accessibility.mainNavigation,
    // Static fallback for missing property
    keyboardNavigationLabel: 'Быстрая навигация', // Static, no expansion
  };
};