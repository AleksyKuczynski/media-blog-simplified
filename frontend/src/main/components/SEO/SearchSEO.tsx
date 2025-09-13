// src/main/components/SEO/SearchSEO.tsx
// Updated to use fixed SearchSchema with proper imports

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { SearchSchema } from './schemas/SearchSchema';
import { getCanonicalURL } from '@/main/lib/dictionary/helpers';

interface SearchSEOProps {
  readonly dictionary: Dictionary;
}

/**
 * Complete SEO solution for static search page
 * Now uses fixed SearchSchema with SchemaBuilder
 */
export const SearchSEO: React.FC<SearchSEOProps> = ({
  dictionary
}) => {
  return (
    <>
      {/* Fixed Structured Data using SchemaBuilder */}
      <SearchSchema dictionary={dictionary} />
      
      {/* Additional SEO enhancements */}
      <link 
        rel="canonical" 
        href={getCanonicalURL('/search')}
      />
      
      {/* Preconnect to improve search performance */}
      <link 
        rel="preconnect" 
        href="https://event4me.eu" 
      />
      
      {/* Enhanced meta tags for search engines */}
      <meta 
        name="google-site-verification" 
        content={process.env.GOOGLE_SITE_VERIFICATION || ''} 
      />
      <meta 
        name="yandex-verification" 
        content={process.env.YANDEX_VERIFICATION || ''} 
      />
      
      {/* Robots meta for search page indexing */}
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
      
      {/* Search functionality hints for crawlers */}
      <meta name="search-functionality" content="enabled" />
      <meta name="content-language" content="ru" />
    </>
  );
};

export default SearchSEO;