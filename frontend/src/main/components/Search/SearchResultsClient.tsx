// src/main/components/Search/SearchResultsClient.tsx
// SEO-OPTIMIZED: Enhanced semantic structure and accessibility
'use client'

import React from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';

interface SearchResultsClientProps {
  readonly dictionary: Dictionary;
  readonly searchQuery: string;
  readonly allSlugs: ArticleSlugInfo[];
  readonly hasMore: boolean;
  readonly currentPage: number;
  readonly currentSort: string;
}

/**
 * SearchResultsClient - SEO-optimized results display
 * SEMANTIC: Enhanced heading structure and schema markup
 */
export default function SearchResultsClient({
  dictionary,
  searchQuery,
  allSlugs,
  hasMore,
  currentPage,
  currentSort
}: SearchResultsClientProps) {
  const lang: Lang = 'ru';

  if (allSlugs.length === 0) {
    return null;
  }

  return (
    <section 
      className="space-y-6"
      itemScope
      itemType="https://schema.org/SearchResultsPage"
      aria-labelledby="search-results-heading"
    >
      <meta itemProp="query" content={searchQuery} />
      <meta itemProp="numberOfItems" content={allSlugs.length.toString()} />
      
      {/* Results Header with Semantic Structure */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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

        {/* Sorting Control */}
        <aside aria-label={dictionary.filter.accessibility.sortingControl}>
          <SortingControl
            dictionary={dictionary}
            currentSort={currentSort}
            lang={lang}
          />
        </aside>
      </header>

      {/* Results List with Enhanced Semantics */}
      <main role="main" aria-label={dictionary.search.accessibility.searchResultsLabel}>
        <ArticleList
          dictionary={dictionary}
          slugInfos={allSlugs}
          lang={lang}
          className="space-y-6"
          ariaLabel={`${resultsCountText} для "${searchQuery}"`}
        />
      </main>

      {/* Load More Button */}
      {hasMore && (
        <footer className="text-center pt-6">
          <LoadMoreButton
            dictionary={dictionary}
            currentPage={currentPage}
          />
        </footer>
      )}
    </section>
  );
}