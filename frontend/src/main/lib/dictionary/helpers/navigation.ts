// src/main/lib/dictionary/helpers/navigation.ts
// OPTIMIZED: Kept only functions used by NavigationMetadata and components

import { Dictionary } from '../types';
import { processTemplate } from './templates';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from './seo';

/**
 * Generate navigation elements data for components
 * KEEP: Used by navigation components
 */
export const generateNavigationElements = (dictionary: Dictionary) => {
  const { labels, descriptions } = dictionary.navigation;
  const baseUrl = dictionary.seo.site.url;

  return [
    {
      name: labels.home,
      description: descriptions.home,
      url: `${baseUrl}/ru`,
      path: '/ru',
      href: '/ru',
      label: labels.home,
      key: 'home',
    },
    {
      name: labels.articles,
      description: descriptions.articles,
      url: `${baseUrl}/ru/articles`,
      path: '/ru/articles',
      href: '/ru/articles',
      label: labels.articles,
      key: 'articles',
    },
    {
      name: labels.rubrics,
      description: descriptions.rubrics,
      url: `${baseUrl}/ru/rubrics`,
      path: '/ru/rubrics',
      href: '/ru/rubrics',
      label: labels.rubrics,
      key: 'rubrics',
    },
    {
      name: labels.authors,
      description: descriptions.authors,
      url: `${baseUrl}/ru/authors`,
      path: '/ru/authors',
      href: '/ru/authors',
      label: labels.authors,
      key: 'authors',
    },
    {
      name: labels.search,
      description: descriptions.search,
      url: `${baseUrl}/ru/search`,
      path: '/ru/search',
      href: '/ru/search',
      label: labels.search,
      key: 'search',
    },
  ];
};

/**
 * Generate breadcrumb data using dictionary
 * KEEP: Used for breadcrumb generation
 */
export const generateBreadcrumbs = (
  dictionary: Dictionary,
  pathSegments: string[]
): Array<{ name: string; href: string }> => {
  const breadcrumbs = [
    {
      name: dictionary.navigation.labels.home,
      href: '/ru',
    },
  ];
  
  let currentPath = '/ru';
  
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Map path segments to dictionary labels
    let name = segment;
    switch (segment) {
      case 'rubrics':
        name = dictionary.navigation.labels.rubrics;
        break;
      case 'authors':
        name = dictionary.navigation.labels.authors;
        break;
      case 'articles':
        name = dictionary.navigation.labels.articles;
        break;
      case 'search':
        name = dictionary.navigation.labels.search;
        break;
      default:
        name = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    
    breadcrumbs.push({ name, href: currentPath });
  });
  
  return breadcrumbs;
};

/**
 * Get breadcrumb text with proper separator
 * ESSENTIAL: Used by NavigationMetadata component
 */
export const getBreadcrumbText = (dictionary: Dictionary, items: string[]): string => {
  return items.join(` ${dictionary.navigation.templates.breadcrumbSeparator} `);
};

/**
 * Generate complete navigation SEO data
 * ESSENTIAL: Used by NavigationMetadata component
 */
export const generateNavigationSEOData = (
  dictionary: Dictionary,
  pageTitle: string,
  currentPath: string,
  pageType: 'main' | 'section' | 'breadcrumb' = 'main'
) => {
  const title = getPageTitle(dictionary, pageTitle);
  const description = getMetaDescription(
    dictionary,
    dictionary.navigation.descriptions.home
  );
  const keywords = getKeywords(dictionary, 'base');
  const canonicalUrl = generateCanonicalUrl(currentPath, dictionary.seo.site.url);
  
  return {
    title,
    description,
    keywords,
    canonicalUrl,
    pageType,
  };
};

/**
 * Get navigation Open Graph data
 * KEEP: Used by navigation metadata generation
 */
export const getNavigationOpenGraphData = (
  dictionary: Dictionary,
  title: string,
  description: string,
  currentPath: string
) => {
  return {
    title,
    description,
    url: generateCanonicalUrl(currentPath, dictionary.seo.site.url),
    siteName: dictionary.seo.site.name,
    locale: 'ru_RU',
    type: 'website' as const,
  };
};

// REMOVED: getSkipLinksData, getSkipLinksAccessibility, getNavigationAccessibilityLabels,
// getNavigationLinkData, getNavigationLinksConfig, getCompleteNavigationConfig,
// getNavigationPageTitle, getNavigationSectionDescription, validateNavigationDictionary
// These functions are not used by actual components