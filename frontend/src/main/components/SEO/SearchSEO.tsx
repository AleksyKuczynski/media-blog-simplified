// src/main/components/SEO/SearchSEO.tsx
// Combined component for  search SEO

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { SearchSchema } from './schemas/SearchSchema';

interface SearchSEOProps {
  readonly dictionary: Dictionary;
}

/**
 * Complete SEO solution for static search page
 * Focuses on search interface, not dynamic results
 */
export const SearchSEO: React.FC<SearchSEOProps> = ({
  dictionary
}) => {
  return (
    <>
      {/* Structured Data */}
      <SearchSchema dictionary={dictionary} />
      
      {/* Additional SEO enhancements */}
      <link 
        rel="canonical" 
        href="https://event4me.eu/ru/search" 
      />
      
      {/* Preconnect to improve search performance */}
      <link 
        rel="preconnect" 
        href="https://event4me.eu" 
      />
    </>
  );
};

export default SearchSEO;