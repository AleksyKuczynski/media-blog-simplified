// src/features/search/page/SearchResultsHeader.tsx
'use client'

import SortingControl from '@/features/navigation/Filter/SortingControl';
import { Dictionary, Lang } from '@/config/i18n';
import { getLocalizedCount } from '@/config/i18n/helpers/content';
import { SEARCH_PAGE_STYLES } from '../search.styles';
import { FILTER_BUTTON_STYLES } from '@/features/navigation/Filter/styles';

interface SearchResultsHeaderProps {
  readonly dictionary: Dictionary;
  readonly searchQuery: string;
  readonly resultsCount: number;
  readonly currentSort: string;
  readonly lang: Lang;
}

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
      
      <div>
        <h1 
          id="search-results-heading"
          className={SEARCH_PAGE_STYLES.header.title}
          itemProp="headline"
        >
          {dictionary.search.templates.pageTitle}: <span className={SEARCH_PAGE_STYLES.header.span}>{searchQuery}</span>
        </h1>
        <p 
          className={SEARCH_PAGE_STYLES.results.count}
          aria-live="polite"
          itemProp="description"
        >
          {resultsCountText}
        </p>
      </div>

      <aside aria-label={dictionary.filter.accessibility.sortingControl}>
        <SortingControl
          dictionary={dictionary}
          currentSort={currentSort}
          variant="search"
        />
      </aside>
    </header>
  );
}