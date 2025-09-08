// src/main/lib/dictionary/helpers.ts
// Utility functions for dictionary operations

import { 
  TemplateVariables, 
  SEOPageType, 
  NavigationRoute,
  Dictionary,
  SEODictionary 
} from './types';

// ===================================================================
// TEMPLATE PROCESSING
// ===================================================================

/**
 * Process template strings with variable substitution
 * Example: processTemplate("Hello {name}!", { name: "World" }) => "Hello World!"
 */
export const processTemplate = (
  template: string, 
  variables: TemplateVariables = {}
): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key as keyof TemplateVariables];
    return value || match; // Return original if no substitution found
  });
};

/**
 * Get processed SEO title for any page type
 */
export const getProcessedSEOTitle = (
  seoDict: SEODictionary,
  pageType: SEOPageType,
  variables: TemplateVariables = {}
): string => {
  const templates = {
    home: seoDict.titles.homePrefix,
    article: seoDict.titles.articleTemplate,
    rubric: seoDict.titles.rubricTemplate,
    author: seoDict.titles.authorTemplate,
    search: seoDict.titles.searchTemplate,
    'rubrics-collection': seoDict.titles.rubricsListTitle,
  };

  const template = templates[pageType] || templates.home;
  return processTemplate(template, {
    siteName: seoDict.site.siteName,
    ...variables,
  });
};

/**
 * Get processed SEO description for any page type
 */
export const getProcessedSEODescription = (
  seoDict: SEODictionary,
  pageType: SEOPageType,
  variables: TemplateVariables = {}
): string => {
  const templates = {
    home: seoDict.descriptions.home,
    article: seoDict.descriptions.articleTemplate,
    rubric: seoDict.descriptions.rubricTemplate,
    author: seoDict.descriptions.authorTemplate,
    search: seoDict.descriptions.searchTemplate,
    'rubrics-collection': seoDict.descriptions.rubricsList,
  };

  const template = templates[pageType] || templates.home;
  return processTemplate(template, {
    siteName: seoDict.site.siteName,
    ...variables,
  });
};

// ===================================================================
// KEYWORD MANAGEMENT
// ===================================================================

/**
 * Get relevant keywords for a page type
 */
export const getPageTypeKeywords = (
  seoDict: SEODictionary,
  pageType: SEOPageType,
  additionalKeywords?: string[]
): string => {
  const keywordMap = {
    home: seoDict.keywords.general,
    article: seoDict.keywords.articles,
    rubric: seoDict.keywords.rubrics,
    author: seoDict.keywords.authors,
    search: seoDict.keywords.general,
    'rubrics-collection': seoDict.keywords.rubricsList,
  };

  const baseKeywords = keywordMap[pageType] || seoDict.keywords.general;
  
  if (additionalKeywords && additionalKeywords.length > 0) {
    return `${baseKeywords}, ${additionalKeywords.join(', ')}`;
  }
  
  return baseKeywords;
};

/**
 * Get category-specific keywords
 */
export const getCategoryKeywords = (
  seoDict: SEODictionary,
  category: string
): string => {
  const categoryMap: Record<string, string> = {
    music: seoDict.keywords.music,
    culture: seoDict.keywords.culture,
    events: seoDict.keywords.events,
    mystic: seoDict.keywords.mystic,
  };

  return categoryMap[category.toLowerCase()] || seoDict.keywords.general;
};

// ===================================================================
// URL UTILITIES
// ===================================================================

/**
 * Get canonical URL for a route
 */
export const getCanonicalURL = (path: string = ''): string => {
  const baseURL = 'https://event4me.eu';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}/ru${cleanPath}`;
};

/**
 * Get navigation URL for a route
 */
export const getNavigationURL = (route: NavigationRoute): string => {
  const routeMap: Record<NavigationRoute, string> = {
    home: '/',
    articles: '/articles',
    rubrics: '/rubrics',
    authors: '/authors',
    search: '/search',
  };

  return getCanonicalURL(routeMap[route]);
};

// ===================================================================
// VALIDATION UTILITIES
// ===================================================================

/**
 * Validate SEO metadata length requirements
 */
export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateSEOMetadata = (
  title: string,
  description: string,
  keywords?: string
): SEOValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 60) {
    warnings.push(`Title is ${title.length} characters (recommended: ≤60)`);
  } else if (title.length < 30) {
    warnings.push(`Title is ${title.length} characters (recommended: ≥30)`);
  }

  // Description validation
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.length > 160) {
    warnings.push(`Description is ${description.length} characters (recommended: ≤160)`);
  } else if (description.length < 120) {
    warnings.push(`Description is ${description.length} characters (recommended: ≥120)`);
  }

  // Keywords validation
  if (keywords) {
    const keywordCount = keywords.split(',').length;
    if (keywordCount > 10) {
      warnings.push(`${keywordCount} keywords found (recommended: ≤10)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ===================================================================
// ACCESSIBILITY UTILITIES
// ===================================================================

/**
 * Generate accessibility-friendly text for navigation elements
 */
export const getNavigationA11yText = (
  dict: Dictionary,
  route: NavigationRoute,
  isCurrentPage: boolean = false
): string => {
  const label = dict.navigation.labels[route];
  const description = dict.navigation.descriptions[route];
  
  const baseText = `${label} - ${description}`;
  
  if (isCurrentPage) {
    return `${baseText} (${dict.navigation.accessibility.currentPage})`;
  }
  
  return baseText;
};

/**
 * Generate ARIA labels for search elements
 */
export const getSearchA11yLabels = (dict: Dictionary) => {
  return {
    searchInput: dict.search.accessibility.searchInputLabel,
    searchButton: dict.search.accessibility.searchButtonLabel,
    searchResults: dict.search.accessibility.searchResultsLabel,
    noResults: dict.search.accessibility.noResultsAnnouncement,
    searching: dict.search.accessibility.searchingAnnouncement,
  };
};

// ===================================================================
// DEVELOPMENT UTILITIES
// ===================================================================

/**
 * Debug utility to check dictionary completeness
 */
export const validateDictionaryCompleteness = (dict: Dictionary): boolean => {
  const requiredKeys = {
    'navigation.labels': ['home', 'articles', 'rubrics', 'authors', 'search'],
    'navigation.descriptions': ['home', 'articles', 'rubrics', 'authors', 'search'],
    'search.labels': ['placeholder', 'submit', 'results', 'noResults'],
    'seo.titles': ['homePrefix', 'articleTemplate', 'rubricTemplate'],
  };

  let isComplete = true;
  
  Object.entries(requiredKeys).forEach(([path, keys]) => {
    const obj = path.split('.').reduce((o, k) => o?.[k], dict as any);
    keys.forEach(key => {
      if (!obj?.[key]) {
        console.warn(`Missing dictionary key: ${path}.${key}`);
        isComplete = false;
      }
    });
  });

  return isComplete;
};

/**
 * Get all available social profile URLs
 */
export const getSocialProfiles = (seoDict: SEODictionary): Record<string, string> => {
  const profiles: Record<string, string> = {};
  
  seoDict.site.socialProfiles.forEach(url => {
    if (url.includes('vk.com')) profiles.vk = url;
    else if (url.includes('t.me')) profiles.telegram = url;
    else if (url.includes('instagram.com')) profiles.instagram = url;
    else if (url.includes('youtube.com')) profiles.youtube = url;
  });

  return profiles;
};