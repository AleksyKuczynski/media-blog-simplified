// src/features/search/page/SearchResultsHeader.tsx
'use client'

import SortingControl from '@/features/navigation/Filter/SortingControl';
import { Dictionary } from '@/config/i18n';
import { SEARCH_RESULTS_HEADER_STYLES } from '../search.styles';
import { processTemplate } from '@/config/i18n/helpers/templates';

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
    parts.push(`${dictionary.common.count.articles}: ${articlesCount}`);
  }
  if (authorsCount > 0) {
    parts.push(`${dictionary.common.count.authors}: ${authorsCount}`);
  }
  if (categoriesCount > 0) {
    parts.push(`${dictionary.common.count.categories}: ${categoriesCount}`);  
  }

  const resultsText = parts.length > 0 
    ? parts.join(', ')
    : processTemplate(dictionary.sections.templates.totalCount, {
        count: resultsCount.toString(),
        countLabel: dictionary.common.count.results,
      });

  return (
    <section 
      className={SEARCH_RESULTS_HEADER_STYLES.container}
      itemScope
      itemType="https://schema.org/SearchResultsPage"
    >
      <meta itemProp="query" content={searchQuery} />
      <meta itemProp="numberOfItems" content={resultsCount.toString()} />
      
      <div className={SEARCH_RESULTS_HEADER_STYLES.textContainer}>
        <h2 
          id="search-results-heading"
          className={SEARCH_RESULTS_HEADER_STYLES.title}
          itemProp="headline"
        >
          {processTemplate(dictionary.search.templates.resultsFor, { query: searchQuery })}
        </h2>
        <p 
          className={SEARCH_RESULTS_HEADER_STYLES.count}
          aria-live="polite"
          itemProp="description"
        >
          {resultsText}
        </p>
      </div>

      <aside 
        aria-label={dictionary.filter.accessibility.sortingControl}
        className={SEARCH_RESULTS_HEADER_STYLES.sortContainer}
      >
        <SortingControl
          dictionary={dictionary}
          currentSort={currentSort}
          variant="search"
        />
      </aside>
    </section>
  );
}