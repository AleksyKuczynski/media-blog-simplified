// src/main/lib/dictionary/helpers/navigation.ts

import { Dictionary, Lang } from "..";

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