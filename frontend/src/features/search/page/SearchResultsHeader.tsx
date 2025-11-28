// src/main/components/Search/SearchResultsHeader.tsx
// CLIENT COMPONENT: Handles only search results header UI (title, count, sorting)
// DOES NOT render ArticleList - that stays in server component
'use client'

import SortingControl from '@/features/navigation/Filter/SortingControl';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { getLocalizedCount } from '@/main/lib/dictionary/helpers/content';

interface SearchResultsHeaderProps {
  readonly dictionary: Dictionary;
  readonly searchQuery: string;
  readonly resultsCount: number;
  readonly currentSort: string;
  readonly lang: Lang;
}

/**
 * SearchResultsHeader - Client component for search results UI controls
 * 
 * ARCHITECTURE DECISION:
 * This component handles only the client-side interactive elements:
 * - Results heading with query display
 * - Results count display
 * - Sorting control (client interactivity)
 * 
 * The actual ArticleList rendering happens in the server component (SearchPage)
 * to maintain the ability to use async server components (ArticleCard).
 * 
 * SEO: Maintains semantic structure with proper schema markup
 */
export default function SearchResultsHeader({
  dictionary,
  searchQuery,
  resultsCount,
  currentSort,
  lang
}: SearchResultsHeaderProps) {
  const resultsCountText = getLocalizedCount(dictionary, resultsCount, 'results');

  return (
    <header 
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"
      itemScope
      itemType="https://schema.org/SearchResultsPage"
    >
      <meta itemProp="query" content={searchQuery} />
      <meta itemProp="numberOfItems" content={resultsCount.toString()} />
      
      {/* Results Title and Count */}
      <div>
        <h1 
          id="search-results-heading"
          className="text-lg font-semibold text-txcolor-primary mb-2"
          itemProp="headline"
        >
          {dictionary.search.templates.pageTitle}: <span className="font-normal">{searchQuery}</span>
        </h1>
        <p 
          className="text-txcolor-secondary"
          aria-live="polite"
          itemProp="description"
        >
          {resultsCountText}
        </p>
      </div>

      {/* Sorting Control - Client Interactivity */}
      <aside aria-label={dictionary.filter.accessibility.sortingControl}>
        <SortingControl
          dictionary={dictionary}
          currentSort={currentSort}
          lang={lang}
        />
      </aside>
    </header>
  );
}