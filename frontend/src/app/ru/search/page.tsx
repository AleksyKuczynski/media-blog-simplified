// src/app/ru/search/page.tsx - Optimized with  SEO
import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import Section from '@/main/components/Main/Section';
import SearchBar from '@/main/components/Search/SearchBar';
import { russianDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { SearchSEO } from '@/main/components/SEO/SearchSEO';
import { generateSearchMetadata } from '@/main/components/SEO/metadata/SearchMetadata';

// Force dynamic for search functionality
export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
}

// Static metadata generation - no dynamic dependencies
export function generateMetadata(): Metadata {
  return generateSearchMetadata(russianDictionary);
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
    // Client-side search results loading
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
  }

  // Static page title - always the same for SEO consistency
  const pageTitle = dict.search.templates.pageTitle;

  return (
    <>
      {/*  SEO - static only */}
      <SearchSEO dictionary={dict} />
      
      {/* Main Content */}
      <main id="main-content" className="min-h-screen">
        <Section 
          title={pageTitle}
          ariaLabel={dict.search.accessibility.searchResultsLabel}
          className="py-8"
        >
          {/* Always show centered search bar when no query */}
          {!hasSearchQuery && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <h1 className="text-2xl font-bold mb-6 text-txcolor-primary">
                {dict.search.templates.pageTitle}
              </h1>
              <p className="text-lg mb-8 text-txcolor-secondary">
                {dict.search.templates.pageDescription}
              </p>
              
              {/* Centered Search Bar */}
              <div className="max-w-lg mx-auto">
                <SearchBar 
                  dictionary={dict}
                  lang="ru"
                  className="w-full"
                />
              </div>
              
              {/* Optional: Search suggestions */}
              <div className="mt-12 text-sm text-txcolor-secondary">
                <p className="mb-4">{dict.search.interface.alternativeNavigation}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="/ru/rubrics" 
                    className="text-pr-fix hover:text-pr-hi transition-colors"
                  >
                    {dict.search.navigation.popularRubrics}
                  </a>
                  <a 
                    href="/ru/articles" 
                    className="text-pr-fix hover:text-pr-hi transition-colors"
                  >
                    {dict.search.navigation.latestArticles}
                  </a>
                  <a 
                    href="/ru/authors" 
                    className="text-pr-fix hover:text-pr-hi transition-colors"
                  >
                    {dict.search.navigation.ourAuthors}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Section - Only show when there's a search query */}
          {hasSearchQuery && (
            <>
              {/* Results Header */}
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-txcolor-primary mb-2">
                    {dict.search.templates.resultsFor.replace('{query}', `"${searchQuery}"`)}
                  </h1>
                  <p className="text-txcolor-secondary">
                    {allSlugs.length > 0 
                      ? `${dict.search.pluralization.result.many}: ${allSlugs.length}`
                      : dict.search.labels.noResults
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
                    {dict.search.labels.noResults}
                  </h2>
                  <div className="max-w-md mx-auto text-txcolor-secondary space-y-2">
                    <p>{dict.search.messages.tryFollowing}:</p>
                    <ul className="text-left space-y-1 mt-4">
                      <li>• {dict.search.messages.checkSpelling}</li>
                      <li>• {dict.search.messages.useGeneralTerms}</li>
                      <li>• {dict.search.messages.trySynonyms}</li>
                    </ul>
                  </div>
                  
                  {/* Alternative Navigation */}
                  <div className="mt-8 pt-6 border-t border-sf-hi">
                    <p className="mb-4 text-sm text-txcolor-secondary">
                      {dict.search.interface.alternativeNavigation}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a 
                        href="/ru/rubrics" 
                        className="px-4 py-2 bg-pr-fix text-white rounded-lg hover:bg-pr-hi transition-colors"
                      >
                        {dict.search.navigation.viewAllArticles}
                      </a>
                      <a 
                        href="/ru/authors" 
                        className="px-4 py-2 bg-sf-hi text-txcolor-primary rounded-lg hover:bg-sf-lo transition-colors"
                      >
                        {dict.search.navigation.meetAuthors}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Section>
      </main>
    </>
  );
}
