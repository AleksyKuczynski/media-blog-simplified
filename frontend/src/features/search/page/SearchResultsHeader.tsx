// src/features/search/page/SearchResultsHeader.tsx
'use client'

import SortingControl from '@/features/navigation/Filter/SortingControl';
import { Dictionary, Lang } from '@/config/i18n';
import { SEARCH_PAGE_STYLES } from '../search.styles';

interface SearchResultsHeaderProps {
  readonly dictionary: Dictionary;
  readonly searchQuery: string;
  readonly resultsCount: number;
  readonly articlesCount?: number;
  readonly authorsCount?: number;
  readonly categoriesCount?: number;
  readonly currentSort: string;
}

export default function SearchResultsHeader({
  dictionary,
  searchQuery,
  resultsCount,
  articlesCount = 0,
  authorsCount = 0,
  categoriesCount = 0,
  currentSort,
}: SearchResultsHeaderProps) {
  // Build results text
  const parts: string[] = [];
  if (articlesCount > 0) {
    parts.push(`${articlesCount} ${dictionary.common.count.articles}`);
  }
  if (authorsCount > 0) {
    parts.push(`${authorsCount} ${dictionary.sections.labels.authors.toLowerCase()}`);
  }
  if (categoriesCount > 0) {
    parts.push(`${categoriesCount} ${dictionary.sections.labels.categories.toLowerCase()}`);
  }

  const resultsText = parts.length > 0 
    ? `${dictionary.search.labels.results}: ${parts.join(', ')}`
    : `${resultsCount} ${dictionary.common.count.results}`;

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
          {resultsText}
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