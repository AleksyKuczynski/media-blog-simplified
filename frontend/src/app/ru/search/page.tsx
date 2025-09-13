// src/app/ru/search/page.tsx - Fixed Server Component
import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsClient from '@/main/components/Search/SearchResultsClient';
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
  }

  // Static page title - always the same for SEO consistency
  const pageTitle = dict.search.templates.pageTitle;

  return (
    <>
      {/* SEO Components - Server Side */}
      <SearchSEO dictionary={dict} />
      
      {/* Main Content - Server Side */}
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
              
              {/* Centered Search Bar - Client Component */}
              <div className="max-w-lg mx-auto">
                <SearchBarClient 
                  dictionary={dict}
                  lang="ru"
                  className="w-full"
                />
              </div>
              
              {/* Search suggestions - Server Side */}
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

          {/* Search Results Section - Client Component */}
          {hasSearchQuery && (
            <SearchResultsClient
              dictionary={dict}
              searchQuery={searchQuery}
              allSlugs={allSlugs}
              hasMore={hasMore}
              currentPage={currentPage}
              currentSort={currentSort}
            />
          )}
        </Section>
      </main>
    </>
  );
}