// src/main/lib/dictionary/helpers/navigation.ts
// Enhanced navigation helpers with missing functions for NavLinks and SkipLinks

import { DEFAULT_LANG } from '../../constants/constants';
import { Dictionary } from '../dictionary';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from './seo';

// ===================================================================
// TYPES - Navigation helper interfaces
// ===================================================================

export interface NavigationLink {
  key: string;
  href: string;
  label: string;
  title: string;
  ariaLabel: string;
  priority: number;
  description: string;
}

export interface SkipLink {
  href: string;
  label: string;
}

export interface SkipLinksData {
  skipToContent: SkipLink;
  skipToNavigation: SkipLink;
  skipToSearch: SkipLink;
  skipToFooter: SkipLink;
}

export interface SkipLinksAccessibility {
  keyboardNavigationLabel: string;
  skipLinksDescription: string;
}

// ===================================================================
// MISSING HELPER FUNCTIONS - Now implemented
// ===================================================================

/**
 * Get navigation links configuration for NavLinks component
 */
export const getNavigationLinksConfig = (dictionary: Dictionary): NavigationLink[] => {
  const { labels, descriptions } = dictionary.navigation;

  return [
    {
      key: 'articles',
      href: '/articles',
      label: labels.articles,
      title: descriptions.articles,
      ariaLabel: `${labels.articles} - ${descriptions.articles}`,
      priority: 1,
      description: descriptions.articles,
    },
    {
      key: 'rubrics', 
      href: '/rubrics',
      label: labels.rubrics,
      title: descriptions.rubrics,
      ariaLabel: `${labels.rubrics} - ${descriptions.rubrics}`,
      priority: 2,
      description: descriptions.rubrics,
    },
    {
      key: 'authors',
      href: '/authors', 
      label: labels.authors,
      title: descriptions.authors,
      ariaLabel: `${labels.authors} - ${descriptions.authors}`,
      priority: 3,
      description: descriptions.authors,
    },
  ];
};

/**
 * Get skip links data for SkipLinks component  
 */
export const getSkipLinksData = (dictionary: Dictionary): SkipLinksData => {
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
      label: 'Перейти к подвалу сайта', // This could be added to dictionary.footer.accessibility if needed
    },
  };
};

/**
 * Get skip links accessibility data
 */
export const getSkipLinksAccessibility = (dictionary: Dictionary): SkipLinksAccessibility => {
  return {
    keyboardNavigationLabel: 'Быстрая навигация с клавиатуры',
    skipLinksDescription: 'Ссылки для быстрого перехода к основным разделам страницы',
  };
};

// ===================================================================
// EXISTING FUNCTIONS - Preserved for compatibility
// ===================================================================

/**
 * Generate navigation elements data for components
 */
export const generateNavigationElements = (dictionary: Dictionary) => {
  const { labels, descriptions } = dictionary.navigation;
  const baseUrl = dictionary.seo.site.url;

  return [
    {
      name: labels.home,
      description: descriptions.home,
      url: `${baseUrl}/ru`,
      path: `/${DEFAULT_LANG}`,
      href: `/${DEFAULT_LANG}`,
      label: labels.home,
      key: 'home',
    },
    {
      name: labels.articles,
      description: descriptions.articles,
      url: `${baseUrl}/ru/articles`,
      path: `/${DEFAULT_LANG}/articles`,
      href: `/${DEFAULT_LANG}/articles`,
      label: labels.articles,
      key: 'articles',
    },
    {
      name: labels.rubrics,
      description: descriptions.rubrics,
      url: `${baseUrl}/${DEFAULT_LANG}/rubrics`,
      path: `/${DEFAULT_LANG}/rubrics`,
      href: `/${DEFAULT_LANG}/rubrics`,
      label: labels.rubrics,
      key: 'rubrics',
    },
    {
      name: labels.authors,
      description: descriptions.authors,
      url: `${baseUrl}/${DEFAULT_LANG}/authors`,
      path: `/${DEFAULT_LANG}/authors`,
      href: `/${DEFAULT_LANG}/authors`,
      label: labels.authors,
      key: 'authors',
    },
    {
      name: labels.search,
      description: descriptions.search,
      url: `${baseUrl}/${DEFAULT_LANG}/search`,
      path: `/${DEFAULT_LANG}/search`,
      href: `/${DEFAULT_LANG}/search`,
      label: labels.search,
      key: 'search',
    },
  ];
};

/**
 * Generate breadcrumb data using dictionary
 */
export const generateBreadcrumbs = (
  dictionary: Dictionary,
  pathSegments: string[]
): Array<{ name: string; href: string }> => {
  const breadcrumbs = [
    {
      name: dictionary.navigation.labels.home,
      href: `/${DEFAULT_LANG}`,
    },
  ];
  
  let currentPath = `/${DEFAULT_LANG}`;
  
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
 */
export const getBreadcrumbText = (dictionary: Dictionary, items: string[]): string => {
  return items.join(` ${dictionary.navigation.templates.breadcrumbSeparator} `);
};

/**
 * Generate complete navigation SEO data
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
    locale: dictionary.locale,
    type: 'website' as const,
  };
};