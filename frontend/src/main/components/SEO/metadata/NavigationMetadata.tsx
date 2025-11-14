// src/main/components/SEO/metadata/NavigationMetadata.tsx

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { generateNavigationSEOData, getBreadcrumbText } from '@/main/lib/dictionary/helpers/navigation';

// ===================================================================
// TYPES - Clean and focused
// ===================================================================

export interface NavigationMetadataProps {
  dictionary: Dictionary;
  currentPath: string;
  pageType?: 'main' | 'section' | 'breadcrumb';
  customTitle?: string;
  customDescription?: string;
  imageUrl?: string;
}

export interface NavigationSEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  structuredData?: Record<string, any>;
}

// ===================================================================
// MAIN NAVIGATION METADATA FUNCTIONS - DRY
// ===================================================================

/**
 * Generate navigation-specific metadata using existing helpers
 */
export const generateNavigationMetadata = async ({
  dictionary,
  currentPath,
  pageType = 'main',
  customTitle,
  customDescription,
  imageUrl,
}: NavigationMetadataProps): Promise<Metadata> => {
  
  // Determine page title based on context
  let pageTitle = dictionary.navigation.labels.home;
  switch (pageType) {
    case 'section':
      pageTitle = 'Навигация';
      break;
    case 'breadcrumb':
      pageTitle = 'Навигация по сайту';
      break;
  }
  
  // Use existing composite helper - NO DUPLICATION
  const seoData = generateNavigationSEOData(
    dictionary,
    customTitle || pageTitle,
    currentPath,
    pageType
  );

  // Override description if custom provided
  const description = customDescription || seoData.description;

  // Create SEO data object using existing function
  const websiteSEOData = createWebsiteSEOData(
    seoData.title,
    description,
    seoData.keywords,
    seoData.canonicalUrl,
    imageUrl || `${dictionary.seo.site.url}/og-navigation.jpg`
  );

  // Validate using existing function
  if (!validateSEOData(websiteSEOData)) {
    console.error('NavigationMetadata: Invalid SEO data');
  }

  // Additional navigation-specific metadata
  const additionalMeta: Record<string, string | number | undefined> = {
    'navigation:type': pageType,
    'navigation:path': currentPath,
    'DC.type': 'Text.Navigation',
    'DC.language': 'ru',
    'DC.relation.isPartOf': dictionary.seo.site.url,
  };

  // Use existing MetadataBuilder - NO DUPLICATION
  const metadata = buildMetadata(websiteSEOData);

  return metadata;
};

/**
 * Generate main navigation metadata - uses existing function
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
 * Generate OpenGraph data for navigation - uses existing helpers
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
 * Generate breadcrumb metadata - uses existing helper
 */
export const generateBreadcrumbMetadata = (
  dictionary: Dictionary,
  breadcrumbs: Array<{ name: string; href: string }>
): Record<string, string> => {
  if (breadcrumbs.length === 0) return {};

  // Use existing helper function - NO DUPLICATION
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
 * Get navigation link SEO attributes - reuses existing patterns
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
    'data-navigation-link': linkText.toLowerCase(),
  };
};

/**
 * Validate navigation metadata - reuses existing validation patterns
 */
export const validateNavigationMetadata = (
  metadata: Metadata
): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (!metadata.title) errors.push('Navigation title is required');
  if (!metadata.description) errors.push('Navigation description is required');
  if (!metadata.alternates?.canonical) errors.push('Canonical URL is required');

  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length > 60) {
    errors.push('Navigation title too long (>60 chars)');
  }

  if (metadata.description && metadata.description.length > 160) {
    errors.push('Navigation description too long (>160 chars)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get navigation meta tags - reuses existing SEO data patterns
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
    { name: 'navigation:site', content: dictionary.seo.site.name },
    { name: 'DC.type', content: 'Text.Navigation' },
    { name: 'DC.language', content: 'ru' },
  ];
};