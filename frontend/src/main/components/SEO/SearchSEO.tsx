// src/main/components/SEO/SearchSEO.tsx
// FIXED: Proper integration with fixed SearchSchema and consistent imports

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { SearchSchema } from './schemas/SearchSchema';
import { generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';

interface SearchSEOProps {
  readonly dictionary: Dictionary;
  readonly query?: string;
}

/**
 * Complete SEO solution for search page
 * FIXED: Uses properly integrated SearchSchema with SchemaBuilder
 */
export const SearchSEO: React.FC<SearchSEOProps> = ({
  dictionary,
  query
}) => {
  // Generate canonical URL using helper
  const canonicalUrl = generateCanonicalUrl('/search', dictionary.seo.site.url);
  
  return (
    <>
      {/* Fixed Structured Data using SchemaBuilder */}
      <SearchSchema dictionary={dictionary} query={query} />
      
      {/* Essential SEO meta tags */}
      <link 
        rel="canonical" 
        href={canonicalUrl}
      />
      
      {/* Preconnect to improve search performance */}
      <link 
        rel="preconnect" 
        href={dictionary.seo.site.url}
      />
      
      {/* Enhanced meta tags for search engines */}
      {process.env.GOOGLE_SITE_VERIFICATION && (
        <meta 
          name="google-site-verification" 
          content={process.env.GOOGLE_SITE_VERIFICATION} 
        />
      )}
      
      {process.env.YANDEX_VERIFICATION && (
        <meta 
          name="yandex-verification" 
          content={process.env.YANDEX_VERIFICATION} 
        />
      )}
      
      {/* Robots meta for search page indexing */}
      <meta 
        name="robots" 
        content="index,follow,max-snippet:-1,max-image-preview:large" 
      />
      
      {/* Search functionality hints for crawlers */}
      <meta name="search-functionality" content="enabled" />
      <meta name="content-language" content="ru" />
      
      {/* Open Graph meta tags */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={dictionary.seo.site.name} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Additional search-specific meta tags */}
      <meta name="search:target" content={`${canonicalUrl}?search={search_term_string}`} />
      <meta name="search:placeholder" content={dictionary.search.labels.placeholder} />
    </>
  );
};

export default SearchSEO;