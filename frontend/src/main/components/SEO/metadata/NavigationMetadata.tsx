// src/main/components/SEO/metadata/NavigationMetadata.tsx
// Navigation-specific metadata generation - FIXED imports and dictionary paths

import { Metadata } from 'next';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  getCanonicalURL,
  getProcessedSEOTitle,
  getProcessedSEODescription,
  getPageTypeKeywords,
  validateSEOMetadata,
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
  
  // Build SEO content using imported helper functions
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

  // Additional metadata for navigation pages
  const additionalMeta: Record<string, string | number | undefined> = {
    'navigation:enhanced': 'true',
    'navigation:path': currentPath,
    'navigation:type': pageType,
  };

  return buildMetadata(seoData, {}, additionalMeta);
};

/**
 * Generate metadata specifically for the main navigation component
 * Uses correct dictionary paths
 */
export const generateMainNavigationMetadata = (
  dictionary: Dictionary
): Record<string, string> => {
  // Use available dictionary properties - no navigation.seo section
  const navDict = dictionary.navigation;
  const seoDict = dictionary.seo;
  
  return {
    'navigation:title': `${navDict.labels.home} - ${seoDict.site.name}`,
    'navigation:description': `Навигация по сайту ${seoDict.site.name}`,
    'navigation:audience': seoDict.regional.targetMarkets.join(', '),
    'navigation:geographic-areas': seoDict.regional.targetMarkets.join(', '),
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
  
  return {
    type: 'website' as const,
    locale: 'ru_RU',
    siteName: seoDict.site.name, // FIXED: was siteName
    images: [
      {
        url: 'https://event4me.eu/og-navigation.jpg',
        width: 1200,
        height: 630,
        alt: `Навигация ${seoDict.site.name}`, // Use available data
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
    url: getCanonicalURL(route === 'home' ? '/' : `/${route}`),
  };
};

/**
 * Validate navigation metadata completeness
 * Uses correct dictionary paths that actually exist
 */
export const validateNavigationMetadata = (dictionary: Dictionary): boolean => {
  const required = [
    'navigation.labels.home',
    'navigation.descriptions.home',
    'seo.site.name', // FIXED: was siteName
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
 * Get enhanced meta tags for navigation pages
 * Uses available dictionary properties
 */
export const getNavigationMetaTags = (
  dictionary: Dictionary,
  route: string
): Record<string, string | number | undefined> => {
  const seoDict = dictionary.seo;

  return {
    // Dublin Core for navigation
    'DC.relation.isPartOf': getCanonicalURL('/'),
    'DC.relation.hasFormat': 'application/html',
    'DC.audience': seoDict.regional.targetMarkets.join(', '),
    
    // Navigation-specific
    'navigation:section': route,
    'navigation:priority': route === 'home' ? '1' : '2',
    'navigation:language': seoDict.regional.language,
    
    // Yandex-specific for navigation
    'yandex:navigation': 'true',
    'yandex:audience': seoDict.regional.targetMarkets.join(', '),
  };
};