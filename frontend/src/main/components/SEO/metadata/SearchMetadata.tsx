// src/main/components/SEO/metadata/SearchMetadata.tsx - OPTIMIZED VERSION

import { Dictionary } from "@/main/lib/dictionary/types";
import { Metadata } from "next";

interface SearchMetadataProps {
  readonly dictionary: Dictionary;
  readonly searchQuery?: string;
  readonly resultsCount?: number;
  readonly currentPage?: number;
}

/**
 * SearchMetadata - Enhanced metadata generation for search pages
 * Optimized for static rendering with proper Google/Yandex support
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
 * Generate optimized search page metadata
 * Handles both static (no query) and dynamic (with query) states
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

  // IMPROVED: Better title generation for static vs dynamic states
  const generateTitle = (): string => {
    if (!searchQuery) {
      // Static page accessed via footer link
      return `${searchDict.templates.pageTitle} - ${seoDict.site.siteName}`;
    }

    // Dynamic search results
    const baseTitle = searchDict.templates.resultsFor.replace('{query}', `"${searchQuery}"`);
    const pagePart = currentPage > 1 ? ` - Страница ${currentPage}` : '';
    return `${baseTitle}${pagePart} - ${seoDict.site.siteName}`;
  };

  // IMPROVED: Context-aware description
  const generateDescription = (): string => {
    if (!searchQuery) {
      // Static page description optimized for footer link traffic
      return `${searchDict.templates.pageDescription} Найдите интересующие вас статьи о культуре, музыке и современных идеях на EventForMe.`;
    }

    // Dynamic search results description
    const baseDesc = `Результаты поиска по запросу "${searchQuery}" на EventForMe`;
    
    if (resultsCount !== undefined) {
      if (resultsCount === 0) {
        return `${baseDesc}. Результатов не найдено. Попробуйте изменить поисковый запрос или воспользуйтесь рубриками для навигации.`;
      }
      return `${baseDesc}. Найдено ${resultsCount} ${getResultsWord(resultsCount)} о культуре, музыке и событиях.`;
    }

    return `${baseDesc}. Поиск среди статей о культуре, музыке и современных идеях.`;
  };

  // Helper for Russian pluralization
  const getResultsWord = (count: number): string => {
    if (count % 10 === 1 && count % 100 !== 11) return 'результат';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'результата';
    return 'результатов';
  };

  // IMPROVED: Canonical URL handling
  const generateCanonicalUrl = (): string => {
    const basePath = `${baseUrl}/ru/search`;
    
    // For static page (no search), use clean URL
    if (!searchQuery) {
      return basePath;
    }

    // For search results, include parameters
    const params = new URLSearchParams();
    params.set('search', searchQuery);
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    return `${basePath}?${params.toString()}`;
  };

  // IMPROVED: Better keyword generation
  const generateKeywords = (): string => {
    const baseKeywords = seoDict.keywords.general;
    
    if (!searchQuery) {
      return `${baseKeywords}, поиск статей, поиск контента, найти информацию, поиск по сайту`;
    }

    // Include search query in keywords for better relevance
    return `${baseKeywords}, поиск "${searchQuery}", результаты поиска, найти статьи, ${searchQuery}`;
  };

  const title = generateTitle();
  const description = generateDescription();
  const canonicalUrl = generateCanonicalUrl();
  const keywords = generateKeywords();

  // IMPROVED: Dynamic Open Graph images
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
    
    // Enhanced Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: seoDict.site.siteName,
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
    
    // Twitter optimization
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

    // ENHANCED: Better metadata for Russian market
    other: {
      // Search engine verification
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
      'google-site-verification': process.env.GOOGLE_VERIFICATION || '',
      
      // Regional optimization
      'content-language': seoDict.regional.language,
      'geo.region': seoDict.regional.region,
      'geo.placename': seoDict.regional.geographicCoverage,
      
      // IMPROVED: Smart robots directives
      'robots': searchQuery 
        ? 'index, follow, max-snippet:-1, max-image-preview:large'
        : 'index, follow, max-snippet:160, max-image-preview:standard',
      'googlebot': 'index, follow',
      
      // Enhanced Dublin Core
      'DC.title': title,
      'DC.description': description,
      'DC.language': seoDict.regional.language,
      'DC.creator': seoDict.site.siteName,
      'DC.publisher': seoDict.site.siteName,
      'DC.type': searchQuery ? 'Text.SearchResultsPage' : 'Text.SearchPage',
      'DC.identifier': canonicalUrl,
      'DC.coverage': seoDict.regional.geographicCoverage,
      'DC.rights': 'Copyright EventForMe',
      
      // Search-specific metadata
      'search:query': searchQuery || '',
      'search:results_count': resultsCount?.toString() || '',
      'search:page': currentPage.toString(),
      'search:type': searchQuery ? 'results' : 'interface',
      
      // IMPROVED: Footer link optimization
      ...(!searchQuery && {
        'navigation:source': 'footer_link',
        'page:purpose': 'search_interface',
        'accessibility:entry_point': 'footer_navigation',
      }),
      
      // Pagination metadata
      ...(currentPage > 1 && {
        'page:number': currentPage.toString(),
        'page:type': 'search_results',
      }),
    },

    // IMPROVED: Better robots configuration
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': searchQuery ? -1 : 160,
        'max-image-preview': searchQuery ? 'large' : 'standard',
        'max-video-preview': -1,
      },
    },
  };
};