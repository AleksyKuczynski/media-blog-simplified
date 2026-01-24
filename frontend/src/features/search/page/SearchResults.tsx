// src/features/search/page/SearchResults.tsx
import { Suspense } from 'react';
import Pagination from '@/shared/ui/Pagination';
import SearchResultsHeader from './SearchResultsHeader';
import { Dictionary, Lang } from '@/config/i18n';
import { ArticleSlugInfo } from '@/api/directus';
import Section from '@/features/layout/Section';
import ArticleList from '@/features/article-display/ArticleList';
import { SEARCH_PAGE_STYLES } from '../search.styles';

interface SearchResultsProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly searchQuery: string;
  readonly slugs: ArticleSlugInfo[];
  readonly totalCount: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly currentSort: string;
  readonly mode: 'results' | 'no-results' | 'invalid-query';
}

export default function SearchResults({
  dictionary,
  lang,
  searchQuery,
  slugs,
  totalCount,
  totalPages,
  currentPage,
  currentSort,
  mode,
}: SearchResultsProps) {
  if (mode === 'invalid-query') {
    return (
      <div 
        className={SEARCH_PAGE_STYLES.results.invalidState}
        role="alert"
        aria-live="polite"
      >
        <p className={SEARCH_PAGE_STYLES.results.stateText}>
          {dictionary.search.labels.minCharacters}
        </p>
      </div>
    );
  }

  if (mode === 'no-results') {
    return (
      <div 
        className={SEARCH_PAGE_STYLES.results.emptyState}
        role="status"
        aria-live="polite"
      >
        <h2 className={SEARCH_PAGE_STYLES.results.emptyTitle}>
          {dictionary.search.labels.noResults}
        </h2>
        <p className={SEARCH_PAGE_STYLES.results.emptyDescription}>
          {dictionary.search.hub.noResultsSuggestion}
        </p>
      </div>
    );
  }

  return (
    <Section
      ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      className={SEARCH_PAGE_STYLES.results.section}
      hasNextSectionTitle={true}
    >
      <SearchResultsHeader
        dictionary={dictionary}
        searchQuery={searchQuery}
        resultsCount={totalCount}
        currentSort={currentSort}
        lang={lang}
      />

      <Suspense fallback={<div>{dictionary.common.status.loading}</div>}>
        <ArticleList
          dictionary={dictionary}
          slugInfos={slugs}
          lang={lang}
          className={SEARCH_PAGE_STYLES.results.list}
        />
      </Suspense>

      {totalPages > 1 && (
        <div className={SEARCH_PAGE_STYLES.results.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            dictionary={dictionary}
          />
        </div>
      )}
    </Section>
  );
}