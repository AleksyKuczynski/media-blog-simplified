// src/main/components/Search/SearchResultsClient.tsx
// OPTIMIZED: No hardcoded text, proper dictionary usage, clean component structure

'use client'

import React, { Suspense } from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
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
 * SearchResultsClient - Optimized component with dictionary-driven content
 * NO HARDCODED TEXT - uses dictionary entries exclusively
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

  // Generate results title using dictionary template
  const resultsTitle = processTemplate(dictionary.search.templates.resultsFor, {
    query: `"${searchQuery}"`,
  });

  // Generate results count using dictionary count helper
  const resultsCountText = allSlugs.length > 0 
    ? formatCount(dictionary, allSlugs.length, 'results')
    : dictionary.search.labels.noResults;

  return (
    <>
      {/* Results Header - Dictionary-driven */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-txcolor-primary mb-2">
            {resultsTitle}
          </h1>
          <p className="text-txcolor-secondary">
            {resultsCountText}
          </p>
        </div>

        {/* Sorting Control - Only show when results exist */}
        {allSlugs.length > 0 && (
          <SortingControl
            dictionary={dictionary}
            currentSort={currentSort}
            lang={lang}
          />
        )}
      </div>

      {/* Results Content - Dictionary-driven messages */}
      {allSlugs.length > 0 ? (
        <Suspense fallback={
          <div className="text-center py-8">
            {dictionary.common.status.loading}
          </div>
        }>
          <ArticleList
            slugInfos={allSlugs}
            lang={lang}
            dictionary={dictionary}
          />
        </Suspense>
      ) : (
        <SearchNoResults dictionary={dictionary} />
      )}

      {/* Load More Button - Dictionary-driven text */}
      {allSlugs.length > 0 && hasMore && (
        <div className="flex justify-center mt-8">
          <LoadMoreButton
            currentPage={currentPage}
            dictionary={dictionary}
          />
        </div>
      )}
    </>
  );
}

/**
 * SearchNoResults - Separate component for no results state
 * NO HARDCODED TEXT - uses dictionary.search.help entries
 */
function SearchNoResults({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="text-center py-12">
      <p className="text-txcolor-secondary text-lg mb-4">
        {dictionary.search.labels.noResults}
      </p>
      
      <p className="text-txcolor-secondary mb-4">
        {dictionary.search.interface.tryFollowing}
      </p>
      
      <div className="text-txcolor-secondary text-sm space-y-2">
        <p className="font-medium">{dictionary.search.help.searchTips}</p>
        <ul className="space-y-1 text-left inline-block">
          <li>• {dictionary.search.help.checkSpelling}</li>
          <li>• {dictionary.search.help.useGeneralTerms}</li>
          <li>• {dictionary.search.help.trySynonyms}</li>
        </ul>
      </div>

      {/* Alternative Navigation - Dictionary-driven */}
      <div className="mt-8 pt-6 border-t border-bgcolor-accent">
        <p className="text-txcolor-secondary mb-4">
          {dictionary.search.interface.alternativeNavigation}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a 
            href="/ru/rubrics" 
            className="text-pr-fix hover:text-pr-hi transition-colors px-3 py-1 rounded-md hover:bg-bgcolor-accent/10"
          >
            {dictionary.search.navigation.popularRubrics}
          </a>
          <a 
            href="/ru/articles" 
            className="text-pr-fix hover:text-pr-hi transition-colors px-3 py-1 rounded-md hover:bg-bgcolor-accent/10"
          >
            {dictionary.search.navigation.latestArticles}
          </a>
          <a 
            href="/ru/authors" 
            className="text-pr-fix hover:text-pr-hi transition-colors px-3 py-1 rounded-md hover:bg-bgcolor-accent/10"
          >
            {dictionary.search.navigation.ourAuthors}
          </a>
        </div>
      </div>
    </div>
  );
}