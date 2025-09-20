// src/main/lib/dictionary/helpers/navigation.ts
// Navigation helpers optimized for new dictionary structure and SEO

import { Dictionary } from '../types';
import { processTemplate } from './templates';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from './seo';

// ===================================================================
// NAVIGATION TITLE & DESCRIPTION HELPERS
// ===================================================================

/**
 * Get navigation page title using dictionary template
 * @example getNavigationPageTitle(dictionary, 'Рубрики') => "Рубрики — EventForMe"
 */
export const getNavigationPageTitle = (dictionary: Dictionary, page: string): string => {
  return processTemplate(dictionary.navigation.templates.pageTitle, {
    page,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get navigation section description using dictionary template
 * @example getNavigationSectionDescription(dictionary, 'Изучить', 'рубрики') => "Изучить рубрики на EventForMe"
 */
export const getNavigationSectionDescription = (
  dictionary: Dictionary,
  action: string,
  section: string
): string => {
  return processTemplate(dictionary.navigation.templates.sectionDescription, {
    action,
    section,
    siteName: dictionary.seo.site.name,
  });
};

/**
 * Get breadcrumb text with proper separator
 * @example getBreadcrumbText(dictionary, ['Главная', 'Рубрики']) => "Главная → Рубрики"
 */
export const getBreadcrumbText = (dictionary: Dictionary, items: string[]): string => {
  return items.join(` ${dictionary.navigation.templates.breadcrumbSeparator} `);
};

// ===================================================================
// NAVIGATION ACCESSIBILITY HELPERS
// ===================================================================

/**
 * Get all navigation accessibility labels
 */
export const getNavigationAccessibilityLabels = (dictionary: Dictionary) => {
  return dictionary.navigation.accessibility;
};

/**
 * Validate navigation accessibility completeness
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
    const value = accessibility[key as keyof typeof accessibility];
    return value && typeof value === 'string' && value.trim().length > 0;
  });
};

/**
 * Get skip links data for accessibility
 */
export const getSkipLinksData = (dictionary: Dictionary) => {
  const { accessibility } = dictionary.navigation;
  return [
    {
      href: '#main-content',
      text: accessibility.skipToContent,
    },
    {
      href: '#main-navigation',
      text: accessibility.skipToNavigation,
    },
  ];
};

/**
 * Get skip links accessibility attributes
 */
export const getSkipLinksAccessibility = (dictionary: Dictionary) => {
  return {
    'aria-label': dictionary.navigation.accessibility.primarySectionsLabel,
    role: 'navigation',
  };
};

// ===================================================================
// NAVIGATION ELEMENTS GENERATION
// ===================================================================

/**
 * Generate navigation elements data using dictionary
 */
export const generateNavigationElements = (dictionary: Dictionary) => {
  const baseUrl = dictionary.seo.site.url;
  const { labels, descriptions } = dictionary.navigation;
  
  return [
    {
      name: labels.home,
      description: descriptions.home,
      url: baseUrl,
      path: '/ru',
    },
    {
      name: labels.articles,
      description: descriptions.articles,
      url: `${baseUrl}/ru/articles`,
      path: '/ru/articles',
    },
    {
      name: labels.rubrics,
      description: descriptions.rubrics,
      url: `${baseUrl}/ru/rubrics`,
      path: '/ru/rubrics',
    },
    {
      name: labels.authors,
      description: descriptions.authors,
      url: `${baseUrl}/ru/authors`,
      path: '/ru/authors',
    },
    {
      name: labels.search,
      description: descriptions.search,
      url: `${baseUrl}/ru/search`,
      path: '/ru/search',
    },
  ];
};

/**
 * Get navigation link data for specific section
 */
export const getNavigationLinkData = (
  dictionary: Dictionary,
  section: 'home' | 'articles' | 'rubrics' | 'authors' | 'search'
) => {
  const elements = generateNavigationElements(dictionary);
  return elements.find(element => element.path.includes(section === 'home' ? '' : section));
};

/**
 * Get navigation links configuration for UI components
 */
export const getNavigationLinksConfig = (dictionary: Dictionary) => {
  const elements = generateNavigationElements(dictionary);
  
  return {
    main: elements.slice(0, 4), // Home, Articles, Rubrics, Authors
    secondary: elements.slice(4), // Search
    accessibility: getNavigationAccessibilityLabels(dictionary),
  };
};

// ===================================================================
// BREADCRUMB GENERATION
// ===================================================================

/**
 * Generate breadcrumb data using dictionary
 * @example generateBreadcrumbs(dictionary, ['rubrics', 'music']) => 
 * [{ name: 'Главная', href: '/ru' }, { name: 'Рубрики', href: '/ru/rubrics' }, ...]
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
  
  pathSegments.forEach((segment, index) => {
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
        // For dynamic segments (like specific rubric names), keep as is
        name = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    
    breadcrumbs.push({ name, href: currentPath });
  });
  
  return breadcrumbs;
};

// ===================================================================
// NAVIGATION SEO HELPERS
// ===================================================================

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
  const keywords = getKeywords(dictionary, 'base'); // Use base keywords for navigation
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
    locale: 'ru_RU',
    type: 'website' as const,
  };
};

// ===================================================================
// NAVIGATION VALIDATION
// ===================================================================

/**
 * Validate navigation dictionary structure
 */
export const validateNavigationDictionary = (dictionary: Dictionary): boolean => {
  try {
    // Check labels
    const hasLabels = !!(
      dictionary.navigation?.labels?.home &&
      dictionary.navigation?.labels?.articles &&
      dictionary.navigation?.labels?.rubrics &&
      dictionary.navigation?.labels?.authors &&
      dictionary.navigation?.labels?.search
    );
    
    // Check templates
    const hasTemplates = !!(
      dictionary.navigation?.templates?.pageTitle &&
      dictionary.navigation?.templates?.sectionDescription &&
      dictionary.navigation?.templates?.breadcrumbSeparator
    );
    
    // Check descriptions
    const hasDescriptions = !!(
      dictionary.navigation?.descriptions?.home &&
      dictionary.navigation?.descriptions?.articles &&
      dictionary.navigation?.descriptions?.rubrics &&
      dictionary.navigation?.descriptions?.authors &&
      dictionary.navigation?.descriptions?.search
    );
    
    // Check accessibility
    const hasAccessibility = validateNavigationAccessibility(dictionary);
    
    return hasLabels && hasTemplates && hasDescriptions && hasAccessibility;
  } catch (error) {
    console.warn('Navigation dictionary validation failed:', error);
    return false;
  }
};

// ===================================================================
// MOBILE NAVIGATION HELPERS
// ===================================================================

/**
 * Get mobile navigation configuration
 */
export const getMobileNavigationConfig = (dictionary: Dictionary) => {
  const { accessibility } = dictionary.navigation;
  
  return {
    menuButton: {
      openText: accessibility.openMenu,
      closeText: accessibility.closeMenu,
      ariaLabel: accessibility.menuTitle,
    },
    menu: {
      title: accessibility.menuTitle,
      description: accessibility.menuDescription,
      ariaLabel: accessibility.mainNavigation,
    },
    elements: generateNavigationElements(dictionary),
  };
};