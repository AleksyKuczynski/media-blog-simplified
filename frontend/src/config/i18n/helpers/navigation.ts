// src/main/lib/dictionary/helpers/navigation.ts

import Dictionary, { Lang } from "../types";


export interface NavigationItem {
  name: string;
  description: string;
  url: string;
  path: string;
  href: string;
  label: string;
  key: string;
}

/**
 * Generate navigation items using dictionary
 * Now accepts lang parameter for proper URL generation
 */
export const getNavigationItems = (
  dictionary: Dictionary,
  lang: Lang
): NavigationItem[] => {
  const { labels, descriptions } = dictionary.navigation;
  const baseUrl = dictionary.seo.site.url;

  return [
    {
      name: labels.home,
      description: descriptions.home,
      url: `${baseUrl}/${lang}`,
      path: `/${lang}`,
      href: `/${lang}`,
      label: labels.home,
      key: 'home',
    },
    {
      name: labels.articles,
      description: descriptions.articles,
      url: `${baseUrl}/${lang}/articles`,
      path: `/${lang}/articles`,
      href: `/${lang}/articles`,
      label: labels.articles,
      key: 'articles',
    },
    {
      name: labels.rubrics,
      description: descriptions.rubrics,
      url: `${baseUrl}/${lang}/rubrics`,
      path: `/${lang}/rubrics`,
      href: `/${lang}/rubrics`,
      label: labels.rubrics,
      key: 'rubrics',
    },
    {
      name: labels.authors,
      description: descriptions.authors,
      url: `${baseUrl}/${lang}/authors`,
      path: `/${lang}/authors`,
      href: `/${lang}/authors`,
      label: labels.authors,
      key: 'authors',
    },
    {
      name: labels.search,
      description: descriptions.search,
      url: `${baseUrl}/${lang}/search`,
      path: `/${lang}/search`,
      href: `/${lang}/search`,
      label: labels.search,
      key: 'search',
    },
  ];
};

/**
 * Generate navigation elements for schema markup
 * This is essentially an alias for getNavigationItems for semantic clarity
 * Uses DEFAULT_LANG for schema generation (schemas are language-neutral)
 */
export const generateNavigationElements = (dictionary: Dictionary): NavigationItem[] => {
  // For schema markup, we use 'en' as default since schemas should be language-neutral
  // But in reality, we should pass the actual lang from the component
  // This is a limitation of the current schema system that assumes single language
  const { DEFAULT_LANG } = require('@/config/constants/constants');
  return getNavigationItems(dictionary, DEFAULT_LANG);
};

/**
 * Generate breadcrumb data using dictionary
 * Now accepts lang parameter
 */
export const generateBreadcrumbs = (
  dictionary: Dictionary,
  pathSegments: string[],
  lang: Lang
): Array<{ name: string; href: string }> => {
  const breadcrumbs = [
    {
      name: dictionary.navigation.labels.home,
      href: `/${lang}`,
    },
  ];
  
  let currentPath = `/${lang}`;
  
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Map path segments to dictionary labels
    let name = segment;
    switch (segment) {
      case 'articles':
        name = dictionary.navigation.labels.articles;
        break;
      case 'rubrics':
        name = dictionary.navigation.labels.rubrics;
        break;
      case 'authors':
        name = dictionary.navigation.labels.authors;
        break;
      case 'search':
        name = dictionary.navigation.labels.search;
        break;
      default:
        // Keep original segment for dynamic routes
        name = segment;
    }
    
    breadcrumbs.push({
      name,
      href: currentPath,
    });
  });
  
  return breadcrumbs;
};

/**
 * Get skip links data for accessibility navigation
 */
export const getSkipLinksData = (dictionary: Dictionary) => {
  return {
    skipToContent: {
      href: '#main-content',
      label: dictionary.navigation.accessibility.skipToContent,
    },
    skipToNavigation: {
      href: '#main-navigation',
      label: dictionary.navigation.accessibility.skipToNavigation,
    },
    skipToSearch: {
      href: '#site-search',
      label: dictionary.search.accessibility.searchLabel,
    },
    skipToFooter: {
      href: '#site-footer',
      label: dictionary.footer.accessibility.skipToFooter,
    },
  };
};

/**
 * Get skip links accessibility labels
 */
export const getSkipLinksAccessibility = (dictionary: Dictionary) => {
  return {
    skipLinksDescription: dictionary.navigation.accessibility.mainNavigation,
    keyboardNavigationLabel: dictionary.navigation.accessibility.mainMenuLabel,
  };
};