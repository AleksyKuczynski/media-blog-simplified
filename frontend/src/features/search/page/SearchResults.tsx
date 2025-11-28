// src/main/components/Search/page/SearchResults.tsx
import { Suspense } from 'react';
import Pagination from '@/shared/ui/Pagination';
import SearchResultsHeader from './SearchResultsHeader';
import { Dictionary, Lang } from '@/config/i18n';
import { ArticleSlugInfo } from '@/api/directus';
import Section from '@/features/layout/Section';
import ArticleList from '@/features/article-display/ArticleList';

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
  // Invalid query state
  if (mode === 'invalid-query') {
    return (
      <div 
        className="text-center py-8 mb-8 bg-sf-hi rounded-lg"
        role="alert"
        aria-live="polite"
      >
        <p className="text-on-sf-var">
          {dictionary.search.labels.minCharacters}
        </p>
      </div>
    );
  }

  // No results state
  if (mode === 'no-results') {
    return (
      <div 
        className="text-center py-8 mb-8 bg-sf-hi rounded-lg"
        role="status"
        aria-live="polite"
      >
        <h2 className="text-xl font-bold mb-2 text-on-sf">
          {dictionary.search.labels.noResults}
        </h2>
        <p className="text-on-sf-var">
          {dictionary.search.hub?.noResultsSuggestion || ''}
        </p>
      </div>
    );
  }

  // Results state
  return (
    <Section
      ariaLabel={dictionary.search.accessibility.searchResultsLabel}
      className="mb-12"
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
          className="space-y-6 mt-6"
        />
      </Suspense>

      {totalPages > 1 && (
        <div className="mt-8">
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