// src/app/ru/search/page.tsx
// OPTIMIZED: Simplified states, clean dictionary usage, improved SEO

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsClient from '@/main/components/Search/SearchResultsClient';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import dictionary from '@/main/lib/dictionary/dictionary';

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
      title: `${dictionary.search.templates.pageTitle} — ${dictionary.seo.site.name}`,
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
  const isNotFoundState = hasInvalidQuery || (hasValidQuery && !hasResults); // Invalid or no results

  return (
    <>
      {/* Static SEO - NO QUERY HANDLING */}
      <SearchSchema dictionary={dict} />
      
      {/* STATE 1: Empty page with middle-centered SearchBar */}
      {isEmptyState && (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl px-4">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-txcolor-primary mb-4">
                  {dict.search.templates.pageTitle}
                </h1>
                <p className="text-lg text-txcolor-secondary">
                  {dict.search.templates.pageDescription}
                </p>
              </div>
              
              <Suspense fallback={
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              }>
                <SearchBarClient
                  dictionary={dict}
                  lang="ru"
                  className="w-full"
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: Results page with top-centered SearchBar and ArticleList */}
      {isResultsState && (
        <Section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Top-centered SearchBar */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-txcolor-primary mb-6">
                {dict.search.templates.pageTitle}
              </h1>
              
              <Suspense fallback={
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              }>
                <SearchBarClient
                  dictionary={dict}
                  lang="ru"
                  className="max-w-2xl mx-auto"
                />
              </Suspense>
            </div>

            {/* Search Results */}
            <Suspense fallback={
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            }>
              <SearchResultsClient
                dictionary={dict}
                searchQuery={searchQuery}
                allSlugs={allSlugs}
                hasMore={hasMore}
                currentPage={currentPage}
                currentSort={currentSort}
              />
            </Suspense>
          </div>
        </Section>
      )}

      {/* STATE 3: Not found - middle-centered SearchBar with message */}
      {isNotFoundState && (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl px-4">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-txcolor-primary mb-4">
                  {dict.search.templates.pageTitle}
                </h1>
                <p className="text-lg text-txcolor-secondary mb-4">
                  {dict.search.templates.pageDescription}
                </p>
              </div>
              
              <Suspense fallback={
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              }>
                <SearchBarClient
                  dictionary={dict}
                  lang="ru"
                  className="w-full"
                />
              </Suspense>

              {/* Not found message */}
              <div className="text-center mt-8">
                <p className="text-txcolor-secondary">
                  {hasInvalidQuery 
                    ? dict.search.labels.minCharacters
                    : dict.search.labels.noResults
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}