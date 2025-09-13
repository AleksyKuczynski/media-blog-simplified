// src/main/components/SEO/metadata/SearchMetadata.tsx
//  metadata focused on static search page content

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';

interface SearchMetadataProps {
  readonly dictionary: Dictionary;
}

/**
 * Generate static search page metadata
 * Focuses on search interface capability, not dynamic results
 */
export const generateSearchMetadata = (
  dictionary: Dictionary
): Metadata => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  const baseUrl = 'https://event4me.eu';
  
  // Static title focused on search capability
  const title = `${searchDict.templates.pageTitle} - ${seoDict.site.siteName}`;
  
  // Static description optimized for footer link traffic
  const description = `${searchDict.templates.pageDescription}. Найдите интересующие статьи о культуре, музыке и современных идеях на ${seoDict.site.siteName}.`;
  
  // Keywords focused on search functionality and content categories
  const keywords = `${seoDict.keywords.general}, поиск статей, поиск по сайту, ${seoDict.keywords.culture}, ${seoDict.keywords.music}`;

  return {
    title,
    description,
    keywords,
    
    // Canonical URL for search page
    alternates: {
      canonical: `${baseUrl}/ru/search`,
    },
    
    // Open Graph for social sharing (static)
    openGraph: {
      title: searchDict.templates.pageTitle,
      description,
      url: `${baseUrl}/ru/search`,
      siteName: seoDict.site.siteName,
      locale: 'ru_RU',
      type: 'website',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary',
      title: searchDict.templates.pageTitle,
      description,
    },
    
    // Robots directives for search page
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
    
    // Language and regional targeting
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
};