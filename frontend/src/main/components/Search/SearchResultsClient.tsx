// src/main/components/Search/SearchResultsClient.tsx
// FIXED: Uses totalCount instead of allSlugs.length

'use client'

import { Dictionary, Lang } from '@/main/lib/dictionary';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleList from '@/main/components/Main/ArticleList';
import Pagination from '@/main/components/Main/Pagination';
import SortingControl from '../Navigation/Filter/SortingControl';

interface SearchResultsClientProps {
  readonly dictionary: Dictionary;
  readonly allSlugs: ArticleSlugInfo[];
  readonly lang: Lang;
  readonly searchQuery: string;
  readonly currentPage: number;
  readonly currentSort: string;
  readonly totalCount: number; // FIXED: Added totalCount
  readonly totalPages: number;
  readonly isEmptyState: boolean;
  readonly isResultsState: boolean;
  readonly isNoResultsState: boolean;
  readonly hasInvalidQuery: boolean;
}

export default function SearchResultsClient({
  dictionary,
  allSlugs,
  lang,
  searchQuery,
  currentPage,
  currentSort,
  totalCount, // FIXED
  totalPages,
  isEmptyState,
  isNoResultsState,
  hasInvalidQuery,
}: SearchResultsClientProps) {
  
  if (isEmptyState) {
    return (
      <div 
        className="text-center py-12"
        role="status"
        aria-label={dictionary.search.accessibility.openSearch}
      >
        <h1 className="text-2xl font-bold mb-4 text-on-sf">
          {dictionary.search.labels.title}
        </h1>
        <p className="text-on-sf-var">
          {dictionary.search.accessibility.openSearch}
        </p>
      </div>
    );
  }

  if (hasInvalidQuery) {
    return (
      <div 
        className="text-center py-12"
        role="alert"
        aria-live="polite"
      >
        <h1 className="text-2xl font-bold mb-4 text-on-sf">
          {dictionary.search.labels.results}
        </h1>
        <p className="text-on-sf-var">
          {dictionary.search.labels.minCharacters}
        </p>
      </div>
    );
  }

  if (isNoResultsState) {
    return (
      <div 
        className="text-center py-12"
        role="status"
        aria-live="polite"
      >
        <h1 className="text-2xl font-bold mb-4 text-on-sf">
          {dictionary.search.labels.noResults}
        </h1>
        <p className="text-on-sf-var">
          {dictionary.search.labels.noResults}
        </p>
      </div>
    );
  }

  // FIXED: Use totalCount instead of allSlugs.length
  const resultsCountText = `${dictionary.common.count.results} ${totalCount}`;

  return (
    <section 
      className="space-y-6"
      role="region"
      aria-label={dictionary.search.accessibility.searchResultsLabel}
    >
      {/* Search Results Header */}
      <header className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-on-sf">
            {dictionary.search.labels.results}
          </h1>
          <p 
            className="text-sm text-on-sf-var"
            role="status"
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
            lang={lang}
          />
        </aside>
      </header>

      {/* Results List */}
      <main role="main" aria-label={dictionary.search.accessibility.searchResultsLabel}>
        <ArticleList
          dictionary={dictionary}
          slugInfos={allSlugs}
          lang={lang}
          className="space-y-6"
          ariaLabel={`${resultsCountText} для "${searchQuery}"`}
        />
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <footer className="pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            dictionary={dictionary}
          />
        </footer>
      )}
    </section>
  );
}