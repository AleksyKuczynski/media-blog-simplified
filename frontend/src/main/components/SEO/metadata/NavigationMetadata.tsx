// src/main/components/SEO/metadata/NavigationMetadata.tsx
// MIGRATION EXAMPLE: Clean, granular navigation-specific metadata

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  getPageTitle, 
  getMetaDescription, 
  generateCanonicalUrl,
  getKeywords, 
  getBreadcrumbText
} from '@/main/lib/dictionary/helpers';

// ===================================================================
// TYPES - Clean and focused on navigation
// ===================================================================

export interface NavigationMetadataProps {
  dictionary: Dictionary;
  currentPath: string;
  pageType?: 'main' | 'section' | 'breadcrumb';
  customTitle?: string;
  customDescription?: string;
}

export interface NavigationSEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  structuredData?: Record<string, any>;
}

// ===================================================================
// CORE NAVIGATION METADATA FUNCTIONS
// ===================================================================

/**
 * Generate navigation-specific metadata using new dictionary structure
 * This replaces old SEOManager navigation logic
 */
export const generateNavigationMetadata = async ({
  dictionary,
  currentPath,
  pageType = 'main',
  customTitle,
  customDescription,
}: NavigationMetadataProps): Promise<Metadata> => {
  // Clean path for canonical URL
  const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  // Generate title using template system
  const title = customTitle || getPageTitle(dictionary, dictionary.navigation.labels.home);
  
  // Generate description using templates
  const description = customDescription || getMetaDescription(
    dictionary, 
    dictionary.seo.site.description
  );

  // Generate canonical URL
  const canonicalUrl = generateCanonicalUrl(cleanPath);
  
  // Get appropriate keywords
  const keywords = getKeywords(dictionary, 'navigation');

  // Build metadata object
  const metadata: Metadata = {
    title,
    description,
    keywords,
    
    // OpenGraph for navigation
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: dictionary.seo.site.name,
      locale: 'ru_RU',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary',
      title,
      description,
    },

    // Additional meta tags for navigation
    other: {
      'DC.title': title,
      'DC.description': description,
      'DC.language': 'ru',
      'DC.type': 'Text.Navigation',
      'navigation:type': pageType,
      'navigation:path': cleanPath,
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
  };

  return metadata;
};

/**
 * Generate metadata for main site navigation
 * Used by main navigation components
 */
export const generateMainNavigationMetadata = async (
  dictionary: Dictionary,
  currentPath: string = '/'
): Promise<Metadata> => {
  return generateNavigationMetadata({
    dictionary,
    currentPath,
    pageType: 'main',
  });
};

/**
 * Generate OpenGraph data specifically for navigation
 * Separated for reuse in different contexts
 */
export const getNavigationOpenGraphData = (
  dictionary: Dictionary,
  title: string,
  description: string,
  canonicalUrl: string
) => {
  return {
    title,
    description,
    url: canonicalUrl,
    siteName: dictionary.seo.site.name,
    locale: 'ru_RU',
    type: 'website' as const,
    
    // Navigation-specific OG properties
    images: [
      {
        url: `${dictionary.seo.site.url}/og-navigation.jpg`,
        width: 1200,
        height: 630,
        alt: dictionary.navigation.accessibility.logoAlt,
      },
    ],
  };
};

/**
 * Generate breadcrumb metadata for navigation
 * Clean implementation using navigation utils
 */
export const generateBreadcrumbMetadata = (
  dictionary: Dictionary,
  breadcrumbs: Array<{ name: string; href: string }>
): Record<string, string> => {
  if (breadcrumbs.length === 0) return {};

  const breadcrumbText = getBreadcrumbText(
    dictionary, 
    breadcrumbs.map(item => item.name)
  );

  return {
    'breadcrumb:navigation': breadcrumbText,
    'breadcrumb:count': breadcrumbs.length.toString(),
    'DC.relation': breadcrumbs[breadcrumbs.length - 1]?.name || '',
  };
};

/**
 * Get navigation link SEO attributes
 * For individual navigation links
 */
export const getNavigationLinkSEO = (
  dictionary: Dictionary,
  linkText: string,
  href: string
) => {
  return {
    title: `${linkText} — ${dictionary.seo.site.name}`,
    'aria-label': linkText,
    href,
    // For structured data
    'data-navigation-link': linkText.toLowerCase(),
  };
};

/**
 * Validate navigation metadata
 * Ensures all required properties are present
 */
export const validateNavigationMetadata = (metadata: Metadata): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (!metadata.title) errors.push('Navigation title is required');
  if (!metadata.description) errors.push('Navigation description is required');
  if (!metadata.alternates?.canonical) errors.push('Canonical URL is required');

  // Check title length
  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length > 60) {
    errors.push('Navigation title too long (>60 chars)');
  }

  // Check description length  
  if (metadata.description && metadata.description.length > 160) {
    errors.push('Navigation description too long (>160 chars)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get navigation meta tags for HTML head
 * Returns clean array of meta tag objects
 */
export const getNavigationMetaTags = (
  dictionary: Dictionary,
  seoData: NavigationSEOData
) => {
  return [
    { name: 'title', content: seoData.title },
    { name: 'description', content: seoData.description },
    { name: 'keywords', content: seoData.keywords },
    { property: 'og:title', content: seoData.title },
    { property: 'og:description', content: seoData.description },
    { property: 'og:url', content: seoData.canonicalUrl },
    { property: 'og:site_name', content: dictionary.seo.site.name },
    { name: 'twitter:title', content: seoData.title },
    { name: 'twitter:description', content: seoData.description },
    // Navigation-specific tags
    { name: 'navigation:site', content: dictionary.seo.site.name },
    { name: 'DC.type', content: 'Text.Navigation' },
    { name: 'DC.language', content: 'ru' },
  ];
};