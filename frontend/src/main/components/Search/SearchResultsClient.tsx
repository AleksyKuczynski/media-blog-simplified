// src/main/components/Search/SearchResultsClient.tsx
// Fixed prop interfaces to match component expectations
'use client'

import React, { Suspense } from 'react';
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
 * Client component for search results rendering
 * FIXED: Props now match child component interfaces exactly
 */
export default function SearchResultsClient({
  dictionary,
  searchQuery,
  allSlugs,
  hasMore,
  currentPage,
  currentSort
}: SearchResultsClientProps) {
  const lang: Lang = 'ru'; // Type-safe Lang instead of string

  return (
    <>
      {/* Results Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-txcolor-primary mb-2">
            {dictionary.search.templates.resultsFor.replace('{query}', `"${searchQuery}"`)}
          </h1>
          <p className="text-txcolor-secondary">
            {allSlugs.length > 0 
              ? `${dictionary.search.pluralization.result.many}: ${allSlugs.length}`
              : dictionary.search.labels.noResults
            }
          </p>
        </div>

        {/* MIGRATED: SortingControl with full dictionary */}
        {allSlugs.length > 0 && (
          <SortingControl
            dictionary={dictionary}         // MIGRATED: Full dictionary
            currentSort={currentSort}       // ✅ Correct
            lang={lang}                     // ✅ Proper Lang type
          />
        )}
      </div>

      {/* MIGRATED: Results List with dictionary prop */}
      {allSlugs.length > 0 ? (
        <Suspense fallback={<div className="text-center py-8">{dictionary.search.labels.searching}</div>}>
          <ArticleList
            slugInfos={allSlugs}  // ✅ Correct prop name
            lang={lang}           // ✅ Proper Lang type
            dictionary={dictionary} // MIGRATED: Pass dictionary to ArticleList
          />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <p className="text-txcolor-secondary text-lg mb-4">
            {dictionary.search.labels.noResults}
          </p>
          <p className="text-txcolor-secondary">
            {dictionary.search.messages.tryFollowing}
          </p>
          <ul className="text-txcolor-secondary text-sm mt-2 space-y-1">
            <li>• {dictionary.search.messages.checkSpelling}</li>
            <li>• {dictionary.search.messages.useGeneralTerms}</li>
            <li>• {dictionary.search.messages.trySynonyms}</li>
          </ul>
        </div>
      )}

      {/* FIXED: LoadMoreButton with correct props only */}
      {allSlugs.length > 0 && hasMore && (
        <div className="flex justify-center mt-8">
          <LoadMoreButton
            currentPage={currentPage}                    // ✅ Correct
            loadMoreText={dictionary.common.loadMore}    // FIXED: Added required loadMoreText
          />
        </div>
      )}
    </>
  );
}