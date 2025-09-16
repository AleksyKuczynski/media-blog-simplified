// src/main/components/Search/SearchResultsClient.tsx
// SIMPLIFIED: Only shows results, no empty/not-found states handled here

'use client'

import React from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { formatCount } from '@/main/lib/dictionary/helpers/content';

interface SearchResultsClientProps {
  readonly dictionary: Dictionary;
  readonly searchQuery: string;
  readonly allSlugs: ArticleSlugInfo[];
  readonly hasMore: boolean;
  readonly currentPage: number;
  readonly currentSort: string;
}

/**
 * SearchResultsClient - SIMPLIFIED: Only handles results display
 * Empty and not-found states are handled by the parent Search page
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

  // This component only renders when there are results
  if (allSlugs.length === 0) {
    return null;
  }

  // Generate results count using dictionary count helper
  const resultsCountText = formatCount(dictionary, allSlugs.length, 'results');

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-txcolor-primary mb-2">
            {dictionary.search.templates.pageTitle}: {searchQuery}
          </h2>
          <p className="text-txcolor-secondary">
            {resultsCountText}
          </p>
        </div>

        {/* Sorting Control */}
        <SortingControl
          dictionary={dictionary}
          currentSort={currentSort}
          lang={lang}
        />
      </div>

      {/* Results List */}
      <ArticleList
        dictionary={dictionary}
        slugInfos={allSlugs}
        lang={lang}
        className="space-y-6"
      />

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <LoadMoreButton
            dictionary={dictionary}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}