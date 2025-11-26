// src/main/components/Search/page/IntegratedSearchBar.tsx
// Static search bar integrated into search page design
// Links to search results on form submit

import Link from 'next/link';
import { SearchIcon } from '../../Interface';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface IntegratedSearchBarProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly currentQuery?: string;
  readonly className?: string;
}

/**
 * IntegratedSearchBar - Static search bar for search hub page
 * 
 * Features:
 * - Static display (no JavaScript needed)
 * - Form submits to /search?search={query}
 * - SEO-friendly with proper schema markup
 * - Visually consistent with interactive search
 * 
 * Usage on search page:
 * - When no query: prominent display
 * - With results: less prominent, still accessible
 */
export default function IntegratedSearchBar({
  dictionary,
  lang,
  currentQuery = '',
  className = ''
}: IntegratedSearchBarProps) {
  const searchUrl = `/${lang}/search`;

  return (
    <search 
      className={`w-full ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}${searchUrl}?search={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <form 
        action={searchUrl}
        method="GET"
        className="w-full"
        role="search"
      >
        <div className="
          relative flex items-center gap-3
          bg-sf-hi rounded-lg shadow-md
          hover:shadow-lg
          focus-within:ring-2
          focus-within:ring-pr-fix
          focus-within:ring-offset-2
          transition-all duration-200
          px-4 py-3
        ">
          {/* Search Icon */}
          <div className="text-on-sf-var pointer-events-none flex-shrink-0">
            <SearchIcon className="w-6 h-6" />
          </div>
          
          {/* Search Input */}
          <input
            type="search"
            name="search"
            defaultValue={currentQuery}
            placeholder={dictionary.search.labels.placeholder}
            aria-label={dictionary.search.accessibility.searchInputLabel}
            aria-describedby="integrated-search-description"
            className="
              flex-1
              bg-transparent
              text-on-sf placeholder-on-sf-var
              focus:outline-none
              border-0
              text-base
            "
            minLength={3}
            maxLength={100}
            autoComplete="off"
            spellCheck="false"
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            aria-label={dictionary.search.accessibility.searchButtonLabel}
            className="
              flex-shrink-0
              px-4 py-2
              bg-pr-cont hover:bg-pr-fix
              text-on-pr
              rounded-lg
              font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2
            "
          >
            {dictionary.search.labels.searchButton || dictionary.search.labels.placeholder.split(' ')[0]}
          </button>
        </div>

        {/* Hidden Description for Screen Readers */}
        <p id="integrated-search-description" className="sr-only">
          {dictionary.search.accessibility.searchDescription}
        </p>
      </form>
    </search>
  );
}