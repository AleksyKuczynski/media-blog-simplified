// src/main/components/SEO/metadata/SearchMetadata.tsx

import { Dictionary } from "@/main/lib/dictionary/types"; // FIXED: Use new dictionary types
import { Metadata } from "next";

interface SearchMetadataProps {
  readonly dictionary: Dictionary;
  readonly searchQuery?: string;
  readonly resultsCount?: number;
  readonly currentPage?: number;
}

/**
 * SearchMetadata - Generates comprehensive metadata for search pages
 * Optimized for both Google and Yandex search engines
 */
export const SearchMetadata: React.FC<SearchMetadataProps> = ({
  dictionary,
  searchQuery,
  resultsCount,
  currentPage = 1
}) => {
  const metadata = generateSearchMetadata(dictionary, searchQuery, resultsCount, currentPage);
  return null;
};

/**
 * Generate search page metadata
 */
export const generateSearchMetadata = (
  dictionary: Dictionary,
  searchQuery?: string,
  resultsCount?: number,
  currentPage: number = 1
): Metadata => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  const baseUrl = 'https://event4me.eu';

  // Generate dynamic title based on search state
  const generateTitle = (): string => {
    if (!searchQuery) {
      return seoDict.titles.searchTemplate.replace('{query}', '');
    }

    const queryPart = ` "${searchQuery}"`;
    const pagePart = currentPage > 1 ? ` - Страница ${currentPage}` : '';
    return seoDict.titles.searchTemplate.replace('{query}', queryPart) + pagePart;
  };

  // Generate dynamic description
  const generateDescription = (): string => {
    if (!searchQuery) {
      return searchDict.templates.pageDescription;
    }

    const baseDesc = seoDict.descriptions.searchTemplate.replace('{query}', ` по запросу "${searchQuery}"`);
    
    if (resultsCount !== undefined) {
      if (resultsCount === 0) {
        return `${baseDesc}. Результатов не найдено. Попробуйте изменить поисковый запрос.`;
      }
      return `${baseDesc}. Найдено ${resultsCount} результатов.`;
    }

    return baseDesc;
  };

  // Generate canonical URL
  const generateCanonicalUrl = (): string => {
    const basePath = `${baseUrl}/ru/search`;
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Generate keywords based on search context
  const generateKeywords = (): string => {
    const baseKeywords = seoDict.keywords.general;
    
    if (!searchQuery) {
      return `${baseKeywords}, поиск статей, поиск авторов, поиск рубрик`;
    }

    return `${baseKeywords}, поиск "${searchQuery}", результаты поиска, найти статьи`;
  };

  const title = generateTitle();
  const description = generateDescription();
  const canonicalUrl = generateCanonicalUrl();
  const keywords = generateKeywords();

  // Open Graph image based on search state
  const ogImage = searchQuery 
    ? `${baseUrl}/og-search-results.jpg`
    : `${baseUrl}/og-search.jpg`;

  return {
    title,
    description,
    keywords,
    
    // Core SEO
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph optimization for social sharing
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: seoDict.site.siteName, // FIXED: Correct path
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter Card optimization  
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

    // Enhanced metadata for Russian market
    other: {
      // Search engines verification
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
      'google-site-verification': process.env.GOOGLE_VERIFICATION || '',
      
      // Language and region optimization
      'content-language': seoDict.regional.language, // FIXED: Correct path
      'geo.region': seoDict.regional.region, // FIXED: Correct path
      'geo.placename': seoDict.regional.geographicCoverage, // FIXED: Correct path
      
      // SEO directives for search pages
      'robots': searchQuery 
        ? 'index, follow, max-snippet:-1, max-image-preview:large'
        : 'index, follow, max-snippet:120, max-image-preview:standard',
      'googlebot': 'index, follow',
      
      // Dublin Core metadata for better semantic understanding
      'DC.title': title,
      'DC.description': description,
      'DC.language': seoDict.regional.language, // FIXED: Correct path
      'DC.creator': seoDict.site.siteName, // FIXED: Correct path
      'DC.publisher': seoDict.site.siteName, // FIXED: Correct path
      'DC.type': 'Text.SearchPage',
      'DC.identifier': canonicalUrl,
      'DC.coverage': seoDict.regional.geographicCoverage, // FIXED: Correct path
      'DC.rights': 'Copyright EventForMe',
      
      // Search-specific metadata
      'search:query': searchQuery || '',
      'search:results_count': resultsCount?.toString() || '',
      'search:page': currentPage.toString(),
      'search:language': seoDict.regional.language, // FIXED: Correct path
      
      // Pagination metadata for multi-page results
      ...(currentPage > 1 && {
        'page:number': currentPage.toString(),
        'page:type': 'search_results',
      }),
    },

    // Robot directives for search result pages
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': searchQuery ? -1 : 120,
        'max-image-preview': searchQuery ? 'large' : 'standard',
        'max-video-preview': -1,
      },
    },
  };
};