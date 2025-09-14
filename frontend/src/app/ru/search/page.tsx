// src/app/ru/search/page.tsx
// FIXED: Uses updated SEO components with proper error handling

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsClient from '@/main/components/Search/SearchResultsClient';
import { russianDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { SearchSEO } from '@/main/components/SEO/SearchSEO';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';

// Force dynamic for search functionality
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
}

// Static metadata generation using fixed function
export function generateMetadata(): Metadata {
  try {
    return generateSearchMetadataSimple(russianDictionary);
  } catch (error) {
    console.error('Search page metadata generation failed:', error);
    // Fallback metadata
    return {
      title: 'Поиск — EventForMe',
      description: 'Поиск статей и материалов на EventForMe',
    };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const dict = russianDictionary;
  
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const searchQuery = searchParams.search || '';

  // Only fetch results if there's a valid search query
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  const hasSearchQuery = searchQuery && searchQuery.length >= 3;

  if (hasSearchQuery) {
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
    } catch (error) {
      console.error('Search results fetching failed:', error);
      // Continue with empty results, component will handle gracefully
    }
  }

  // Static page title using dictionary
  const pageTitle = dict.search.templates.pageTitle;

  return (
    <>
      {/* SEO Components - Server Side with error boundary */}
      <SearchSEO dictionary={dict} query={hasSearchQuery ? searchQuery : undefined} />
      
      {/* Main Content */}
      <Section className="min-h-screen bg-bgcolor-primary">
        <div className="container mx-auto px-4 py-8">
          
          {/* Page Header using dictionary */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-txcolor-primary mb-4">
              {pageTitle}
            </h1>
            <p className="text-txcolor-secondary max-w-2xl mx-auto">
              {dict.search.templates.pageDescription}
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto">
            
            {/* Search Bar - Client Component */}
            <div className="mb-8">
              <Suspense fallback={
                <div className="h-12 bg-sf-hi rounded-lg animate-pulse"></div>
              }>
                <SearchBarClient 
                  dictionary={dict}
                  lang="ru"
                  initialQuery={searchQuery}
                />
              </Suspense>
            </div>

            {/* Search Results - Client Component */}
            <Suspense fallback={
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-sf-hi rounded-lg animate-pulse"></div>
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

            {/* Alternative Navigation when no search */}
            {!hasSearchQuery && (
              <div className="mt-12 text-center">
                <h2 className="text-lg font-semibold text-txcolor-primary mb-6">
                  {dict.search.interface.alternativeNavigation}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  
                  {/* Popular Rubrics */}
                  <div className="p-6 bg-sf-hi rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-txcolor-primary mb-2">
                      {dict.search.navigation.popularRubrics}
                    </h3>
                    <a 
                      href="/ru/rubrics" 
                      className="text-pr-fix hover:text-pr-active transition-colors"
                      aria-label={dict.navigation.descriptions.rubrics}
                    >
                      {dict.common.actions.explore}
                    </a>
                  </div>

                  {/* Latest Articles */}
                  <div className="p-6 bg-sf-hi rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-txcolor-primary mb-2">
                      {dict.search.navigation.latestArticles}
                    </h3>
                    <a 
                      href="/ru/articles" 
                      className="text-pr-fix hover:text-pr-active transition-colors"
                      aria-label={dict.navigation.descriptions.articles}
                    >
                      {dict.common.actions.viewAll}
                    </a>
                  </div>

                  {/* Our Authors */}
                  <div className="p-6 bg-sf-hi rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-txcolor-primary mb-2">
                      {dict.search.navigation.ourAuthors}
                    </h3>
                    <a 
                      href="/ru/authors" 
                      className="text-pr-fix hover:text-pr-active transition-colors"
                      aria-label={dict.navigation.descriptions.authors}
                    >
                      {dict.common.actions.explore}
                    </a>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </Section>
    </>
  );
}