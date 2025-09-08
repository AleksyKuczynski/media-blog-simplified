// src/app/ru/search/page.tsx - Updated with new SEO architecture
import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import SortingControl from '@/main/components/Navigation/SortingControl';
import Section from '@/main/components/Main/Section';

// NEW: Import new dictionary system
import { russianDictionary } from '@/main/lib/dictionary/dictionary';

// NEW: Import new SEO components

// OLD: Keep compatibility with existing data fetching
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { generateSearchMetadata } from '@/main/components/SEO/metadata/SearchMetadata';
import { SearchPageSchema } from '@/main/components/SEO/schemas/SearchPageSchema';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
}

// NEW: Enhanced metadata generation using new SEO architecture
export async function generateMetadata({ 
  searchParams 
}: SearchPageProps): Promise<Metadata> {
  const searchQuery = searchParams.search || '';
  const currentPage = Number(searchParams.page) || 1;
  
  // TODO: In production, fetch actual results count here for better SEO
  // For now, we'll let the metadata function handle undefined resultsCount
  const resultsCount = undefined; // This could be fetched from a quick count API
  
  return generateSearchMetadata(
    russianDictionary, 
    searchQuery, 
    resultsCount, 
    currentPage
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Use new dictionary system
  const dict = russianDictionary;
  
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const searchQuery = searchParams.search || '';

  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  // Fetch search results if query is valid
  if (searchQuery && searchQuery.length >= 3) {
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

  // Transform ArticleSlugInfo to SearchResult format for schema
  const searchResults = allSlugs.map(slug => ({
    title: slug.title,
    url: `https://event4me.eu/ru/articles/${slug.slug}`,
    description: slug.excerpt || '',
    datePublished: slug.date_created,
    author: slug.author_name,
  }));

  // Generate page title based on search state
  const generatePageTitle = (): string => {
    if (!searchQuery) {
      return dict.search.templates.pageTitle;
    }
    return dict.search.templates.resultsFor.replace('{query}', searchQuery);
  };

  return (
    <>
      {/* NEW: Enhanced structured data for search functionality */}
      <SearchPageSchema
        dictionary={dict}
        searchQuery={searchQuery}
        resultsCount={allSlugs.length}
        searchResults={searchResults}
      />

      <Section 
        title={generatePageTitle()}
        ariaLabel={dict.search.accessibility.searchResultsLabel}
      >
        {/* Search results count and sorting */}
        {searchQuery && (
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-txcolor-secondary">
              {allSlugs.length > 0 
                ? `${dict.search.labels.results}: ${allSlugs.length}`
                : dict.search.labels.noResults
              }
            </p>
            
            <Suspense fallback={
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-prcolor">
                  Сортировка
                </span>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-md px-4 py-2 animate-pulse w-32">
                  Загрузка...
                </div>
              </div>
            }>
              <SortingControl 
                translations={{
                  sortOrder: 'Порядок',
                  newest: 'От новых', 
                  oldest: 'От старых'
                }}
                currentSort={currentSort}
                lang="ru" 
              />
            </Suspense>
          </div>
        )}

        {/* Search Results */}
        {searchQuery ? (
          searchQuery.length < 3 ? (
            <div className="text-center py-12">
              <p className="text-txcolor-secondary">
                {dict.search.labels.minCharacters}
              </p>
            </div>
          ) : allSlugs.length > 0 ? (
            <>
              <ArticleList 
                slugInfos={allSlugs} 
                lang="ru"
              />
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Suspense fallback={
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 animate-pulse">
                      Загрузка...
                    </div>
                  }>
                    <LoadMoreButton
                      currentPage={currentPage}
                      loadMoreText="Загрузить еще"
                    />
                  </Suspense>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-txcolor-secondary">
                {dict.search.labels.noResults}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-txcolor-secondary">
              {dict.search.labels.placeholder}
            </p>
          </div>
        )}
      </Section>
    </>
  );
}