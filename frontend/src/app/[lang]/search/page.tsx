// src/app/[lang]/search/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getDictionary, type Lang } from '@/main/lib/dictionary';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsHeader from '@/main/components/Search/SearchResultsHeader';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import { fetchArticleSlugs } from '@/main/lib/directus';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';

// Force dynamic for search functionality
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ 
    search?: string; 
    sort?: string; 
    page?: string;
  }>;
}

// Static metadata generation with lang-aware fallback
export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dictionary = getDictionary(lang as Lang);
    return generateSearchMetadataSimple(dictionary);
  } catch (error) {
    console.error('Search page metadata generation failed:', error);
    // Emergency fallback
    return {
      title: 'Search',
      description: 'Search articles',
    };
  }
}

export default async function SearchPage({ 
  params,
  searchParams 
}: SearchPageProps) {
  // ✅ Extract lang and get dictionary
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
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
    }
  }

  // Determine layout state
  const isEmptyState = !searchQuery;
  const isResultsState = hasValidQuery && hasResults;
  const isNoResultsState = hasValidQuery && !hasResults;
  
  return (
    <>
      {/* Schema Markup */}
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={hasResults ? allSlugs.length : undefined}
      />

      {/* Main Search Container */}
      <Section
        title={dictionary.search.templates.pageTitle}
        className="min-h-[60vh]"
        ariaLabel={dictionary.search.accessibility.searchLabel}
      >
        <div className="container mx-auto px-4 py-8">
          
          {/* Search Bar - Always Visible */}
          <div className="max-w-2xl mx-auto mb-8">
            <Suspense fallback={
              <div className="h-12 bg-sf-hi rounded-lg animate-pulse" />
            }>
              <SearchBarClient
                dictionary={dictionary}
                lang={lang as Lang}
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
              aria-label={dictionary.common.status.empty}
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
                  {dictionary.search.templates.pageTitle}
                </h2>
                <p className="text-on-sf-var">
                  {dictionary.search.templates.pageDescription}
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
                  {dictionary.search.labels.minCharacters}
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
                  {dictionary.search.labels.noResults}
                </h2>
                <p className="text-on-sf-var">
                  {dictionary.search.labels.placeholder}
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
              {/* Results Header with Count and Sorting */}
              <SearchResultsHeader
                dictionary={dictionary}
                searchQuery={searchQuery}
                resultsCount={allSlugs.length}
                currentSort={currentSort}
                lang={lang as Lang}
              />

              {/* Results List */}
              <ArticleList 
                slugs={allSlugs}
                dictionary={dictionary}
                lang={lang as Lang}
                currentSort={currentSort}
              />

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <LoadMoreButton 
                    dictionary={dictionary}
                    currentPage={currentPage}
                    currentSort={currentSort}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </Section>
    </>
  );
}