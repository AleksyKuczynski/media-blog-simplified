// src/main/components/SEO/metadata/NavigationMetadata.tsx
// Navigation-specific metadata generation using new dictionary - FINAL FIX

import { Metadata } from 'next';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  getProcessedSEOTitle,
  getProcessedSEODescription,
  getPageTypeKeywords,
  getCanonicalURL,
  validateSEOMetadata 
} from '@/main/lib/dictionary/helpers';

// ===================================================================
// NAVIGATION METADATA PROPS
// ===================================================================

export interface NavigationMetadataProps {
  readonly dictionary: Dictionary;
  readonly currentPath?: string;
  readonly imageUrl?: string;
  readonly additionalKeywords?: readonly string[];
}

// ===================================================================
// NAVIGATION METADATA GENERATION
// ===================================================================

/**
 * Generate metadata for navigation-enhanced pages
 * This is used by pages that have enhanced navigation SEO requirements
 */
export const generateNavigationMetadata = ({
  dictionary,
  currentPath = '',
  imageUrl,
  additionalKeywords = [],
}: NavigationMetadataProps): Metadata => {
  const seoDict = dictionary.seo;
  const canonicalUrl = getCanonicalURL(currentPath);
  
  // Determine page type from path
  const getPageTypeFromPath = (path: string) => {
    if (!path || path === '/') return 'home';
    if (path.startsWith('/articles')) return 'article';
    if (path.startsWith('/rubrics')) return 'rubrics-collection';
    if (path.startsWith('/authors')) return 'author';
    if (path.startsWith('/search')) return 'search';
    return 'home';
  };

  const pageType = getPageTypeFromPath(currentPath);
  
  // Build SEO content
  const title = getProcessedSEOTitle(seoDict, pageType as any);
  const description = getProcessedSEODescription(seoDict, pageType as any);
  const keywords = getPageTypeKeywords(
    seoDict, 
    pageType as any, 
    additionalKeywords as string[]
  );

  // Validate SEO content
  const validation = validateSEOMetadata(title, description, keywords);
  if (!validation.isValid) {
    console.warn('Navigation SEO validation errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('Navigation SEO warnings:', validation.warnings);
  }

  // Create SEO data
  const seoData = createWebsiteSEOData(
    title,
    description,
    keywords,
    canonicalUrl,
    imageUrl
  );

  // Validate and build metadata
  if (!validateSEOData(seoData)) {
    console.error('Invalid SEO data for navigation metadata');
  }

  // FIXED: Use proper type for additionalMeta
  const additionalMeta: Record<string, string | number | undefined> = {
    'navigation:enhanced': 'true',
    'navigation:path': currentPath,
    'navigation:type': pageType,
  };

  return buildMetadata(seoData, {}, additionalMeta);
};

/**
 * Generate metadata specifically for the main navigation component
 * This includes schema.org markup for the navigation itself
 */
export const generateMainNavigationMetadata = (
  dictionary: Dictionary
): Record<string, string> => {
  const navDict = dictionary.navigation;
  
  return {
    'navigation:title': navDict.seo.navigationTitle,
    'navigation:description': navDict.seo.navigationDescription,
    'navigation:audience': navDict.seo.audience,
    'navigation:geographic-areas': navDict.seo.geographicAreas.join(', '),
  };
};

/**
 * Get navigation-specific Open Graph data
 */
export const getNavigationOpenGraphData = (
  dictionary: Dictionary,
  currentPath: string = ''
) => {
  const seoDict = dictionary.seo;
  const navigationDict = dictionary.navigation;
  
  return {
    type: 'website' as const,
    locale: 'ru_RU',
    siteName: seoDict.site.siteName,
    images: [
      {
        url: 'https://event4me.eu/og-navigation.jpg',
        width: 1200,
        height: 630,
        alt: navigationDict.seo.navigationTitle,
      },
    ],
  };
};

/**
 * Generate breadcrumb metadata for navigation
 */
export const generateBreadcrumbMetadata = (
  dictionary: Dictionary,
  breadcrumbs: Array<{ name: string; href: string }>
): Record<string, string> => {
  const breadcrumbData = breadcrumbs.map((crumb, index) => ({
    position: index + 1,
    name: crumb.name,
    url: getCanonicalURL(crumb.href),
  }));

  return {
    'breadcrumb:count': breadcrumbs.length.toString(),
    'breadcrumb:current': breadcrumbs[breadcrumbs.length - 1]?.name || '',
    'breadcrumb:path': breadcrumbs.map(b => b.name).join(' > '),
  };
};

// ===================================================================
// UTILITY FUNCTIONS FOR NAVIGATION SEO
// ===================================================================

/**
 * Get navigation link SEO data
 */
export const getNavigationLinkSEO = (
  dictionary: Dictionary,
  route: keyof typeof dictionary.navigation.labels
) => {
  const navDict = dictionary.navigation;
  
  return {
    label: navDict.labels[route],
    description: navDict.descriptions[route],
    url: getCanonicalURL(
      route === 'home' ? '/' : `/${route}`
    ),
    ariaLabel: navDict.accessibility.logoMainPageLabel,
  };
};

/**
 * Validate navigation metadata completeness
 */
export const validateNavigationMetadata = (dictionary: Dictionary): boolean => {
  const required = [
    'navigation.labels.home',
    'navigation.descriptions.home',
    'navigation.seo.navigationTitle',
    'seo.site.siteName',
  ];

  const missing = required.filter(path => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], dictionary as any);
    return !value || (typeof value === 'string' && value.trim().length === 0);
  });

  if (missing.length > 0) {
    console.warn('Missing required navigation metadata:', missing);
    return false;
  }

  return true;
};

/**
 * Get enhanced meta tags for navigation pages - FIXED
 */
export const getNavigationMetaTags = (
  dictionary: Dictionary,
  route: string
): Record<string, string | number | undefined> => {
  const navDict = dictionary.navigation;
  const seoDict = dictionary.seo;

  return {
    // Dublin Core for navigation
    'DC.relation.isPartOf': getCanonicalURL('/'),
    'DC.relation.hasFormat': 'application/html',
    'DC.audience': navDict.seo.audience,
    
    // Navigation-specific
    'navigation:section': route,
    'navigation:priority': route === 'home' ? '1' : '2',
    'navigation:language': seoDict.regional.language,
    
    // Yandex-specific for navigation
    'yandex:navigation': 'true',
    'yandex:audience': navDict.seo.audience,
  };
};