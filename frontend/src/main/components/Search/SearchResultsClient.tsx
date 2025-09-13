// src/main/components/Search/SearchResultsClient.tsx
'use client'

import React, { Suspense } from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import { Dictionary } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';

interface SearchResultsClientProps {
  dictionary: Dictionary;
  searchQuery: string;
  allSlugs: ArticleSlugInfo[];
  hasMore: boolean;
  currentPage: number;
  currentSort: string;
}

/**
 * Client component for search results rendering
 * Handles client-side interactions like sorting and load more
 */
export default function SearchResultsClient({
  dictionary,
  searchQuery,
  allSlugs,
  hasMore,
  currentPage,
  currentSort
}: SearchResultsClientProps) {
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

        {/* Sorting Control */}
        {allSlugs.length > 0 && (
          <SortingControl
            currentSort={currentSort}
            searchQuery={searchQuery}
            lang="ru"
          />
        )}
      </div>

      {/* Results List */}
      {allSlugs.length > 0 ? (
        <>
          <Suspense fallback={
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-sf-hi rounded-lg" />
              ))}
            </div>
          }>
            <ArticleList 
              slugs={allSlugs}
              lang="ru"
            />
          </Suspense>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <LoadMoreButton
                currentPage={currentPage}
                hasMore={hasMore}
                searchQuery={searchQuery}
                currentSort={currentSort}
                lang="ru"
              />
            </div>
          )}
        </>
      ) : (
        /* No Results Message */
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4 text-txcolor-primary">
            {dictionary.search.labels.noResults}
          </h2>
          <div className="max-w-md mx-auto text-txcolor-secondary space-y-2">
            <p>{dictionary.search.messages.tryFollowing}:</p>
            <ul className="text-left space-y-1 mt-4">
              <li>• {dictionary.search.messages.checkSpelling}</li>
              <li>• {dictionary.search.messages.useGeneralTerms}</li>
              <li>• {dictionary.search.messages.trySynonyms}</li>
            </ul>
          </div>
          
          {/* Alternative Navigation */}
          <div className="mt-8 pt-6 border-t border-sf-hi">
            <p className="mb-4 text-sm text-txcolor-secondary">
              {dictionary.search.interface.alternativeNavigation}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/ru/rubrics" 
                className="px-4 py-2 bg-pr-fix text-white rounded-lg hover:bg-pr-hi transition-colors"
              >
                {dictionary.search.navigation.viewAllArticles}
              </a>
              <a 
                href="/ru/authors" 
                className="px-4 py-2 bg-sf-hi text-txcolor-primary rounded-lg hover:bg-sf-lo transition-colors"
              >
                {dictionary.search.navigation.meetAuthors}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}