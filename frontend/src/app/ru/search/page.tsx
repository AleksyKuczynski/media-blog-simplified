// src/app/ru/search/page.tsx
// FIXED: Separated client UI controls from server-rendered article list
// ARCHITECTURE: SearchResultsHeader (client) + ArticleList (server) composition
// DICTIONARY: Uses only existing dictionary entries, no hardcoded text

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsHeader from '@/main/components/Search/SearchResultsHeader';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import dictionary from '@/main/lib/dictionary/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

// Force dynamic for search functionality
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ 
    search?: string; 
    sort?: string; 
    page?: string;
  }>;
}

// Static metadata generation - NO QUERY HANDLING
export function generateMetadata(): Metadata {
  try {
    return generateSearchMetadataSimple(dictionary);
  } catch (error) {
    console.error('Search page metadata generation failed:', error);
    // Fallback metadata using dictionary only
    return {
      title: processTemplate(dictionary.navigation.templates.pageTitle, {
        page: dictionary.search.templates.pageTitle,
        siteName: dictionary.seo.site.name
      }),
      description: `${dictionary.search.templates.pageDescription} на ${dictionary.seo.site.name}`,
    };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const dict = dictionary;
  
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';
  const searchQuery = resolvedSearchParams.search?.trim() || '';

  // Determine page state based on requirements
  const hasValidQuery = searchQuery.length >= 3;
  const hasInvalidQuery = searchQuery.length > 0 && searchQuery.length < 3;
  
  // Only fetch results if there's a valid search query
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  let hasResults = false;

  if (hasValidQuery) {
    try {
      // Server-side search results fetching
      for (let page = 1; page <= currentPage; page++) {
        const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
          page,
          currentSort,
          '',
          searchQuery,
          []
        );
        allSlugs = [...allSlugs, ...slugs];
        hasMore = pageHasMore;
        if (!pageHasMore) break;
      }
      hasResults = allSlugs.length > 0;
    } catch (error) {
      console.error('Search results fetching failed:', error);
      // Continue with empty results, component will handle gracefully
    }
  }

  // Determine layout state
  const isEmptyState = !searchQuery; // No query present
  const isResultsState = hasValidQuery && hasResults; // Valid query with results
  const isNoResultsState = hasValidQuery && !hasResults; // Valid query with no results
  
  return (
    <>
      {/* Schema Markup */}
      <SearchSchema
        dictionary={dict}
        query={searchQuery}
        resultCount={hasResults ? allSlugs.length : undefined}
      />

      {/* Main Search Container */}
      <Section
        title={dict.search.templates.pageTitle}
        className="min-h-[60vh]"
        ariaLabel={dict.search.accessibility.searchLabel}
      >
        <div className="container mx-auto px-4 py-8">
          
          {/* Search Bar - Always Visible */}
          <div className="max-w-2xl mx-auto mb-8">
            <Suspense fallback={
              <div className="h-12 bg-sf-hi rounded-lg animate-pulse" />
            }>
              <SearchBarClient
                dictionary={dict}
                lang="ru"
                className="w-full"
              />
            </Suspense>
          </div>

          {/* Content States */}
          
          {/* STATE 1: Empty State - No Query */}
          {isEmptyState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-label={dict.common.status.empty}
            >
              <div className="max-w-md mx-auto">
                <svg 
                  className="mx-auto h-16 w-16 text-on-sf-var mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <h2 className="text-xl font-semibold text-on-sf mb-2">
                  {dict.search.templates.pageTitle}
                </h2>
                <p className="text-on-sf-var">
                  {dict.search.templates.pageDescription}
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: Invalid Query - Less than 3 characters */}
          {hasInvalidQuery && (
            <div 
              className="text-center py-12"
              role="alert"
              aria-live="polite"
            >
              <div className="max-w-md mx-auto">
                <p className="text-on-sf-var">
                  {dict.search.labels.minCharacters}
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: No Results - Valid query but no matches */}
          {isNoResultsState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <div className="max-w-md mx-auto">
                <svg 
                  className="mx-auto h-16 w-16 text-on-sf-var mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h2 className="text-xl font-semibold text-on-sf mb-2">
                  {dict.search.labels.noResults}
                </h2>
                <p className="text-on-sf-var">
                  {dict.search.labels.placeholder}
                </p>
              </div>
            </div>
          )}

          {/* STATE 4: Results - Valid query with matches */}
          {isResultsState && (
            <section 
              className="space-y-6"
              aria-labelledby="search-results-heading"
            >
              {/* Results Header - Client Component for Interactivity */}
              <SearchResultsHeader
                dictionary={dict}
                searchQuery={searchQuery}
                resultsCount={allSlugs.length}
                currentSort={currentSort}
                lang="ru"
              />

              {/* Results List - Server Component (can render async ArticleCard) */}
              <main role="main" aria-label={dict.search.accessibility.searchResultsLabel}>
                <Suspense fallback={
                  <div className="space-y-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-48 bg-sf-cont rounded-2xl animate-pulse" />
                    ))}
                  </div>
                }>
                  <ArticleList
                    dictionary={dict}
                    slugInfos={allSlugs}
                    lang="ru"
                    className="space-y-6"
                    ariaLabel={processTemplate(dict.search.templates.resultsFor, { query: searchQuery })}
                  />
                </Suspense>
              </main>

              {/* Load More Button */}
              {hasMore && (
                <footer className="text-center pt-6">
                  <Suspense fallback={
                    <div className="bg-sf-cont rounded-lg px-6 py-3 animate-pulse">
                      {dict.common.status.loading}
                    </div>
                  }>
                    <LoadMoreButton
                      dictionary={dict}
                      currentPage={currentPage}
                    />
                  </Suspense>
                </footer>
              )}
            </section>
          )}
        </div>
      </Section>
    </>
  );
}