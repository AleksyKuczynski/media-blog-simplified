// src/app/ru/search/page.tsx
import { Suspense } from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { Metadata } from 'next';
import { getDictionary } from '@/main/lib/dictionaries';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import SortingControl from '@/main/components/Navigation/SortingControl';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: {
  searchParams: { search?: string }
  // ✅ REMOVED: params: { lang: Lang } - no longer expected in static routes
}): Promise<Metadata> {
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  const searchQuery = searchParams.search || '';
  return {
    title: searchQuery ? `${dict.search.results}: "${searchQuery}" | ${dict.search.pageTitle}` : dict.search.pageTitle,
    description: dict.search.pageDescription.replace('{query}', searchQuery ? ` ${dict.search.relatedTo} "${searchQuery}"` : ''),
  };
}

interface SearchPageProps {
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
  // ✅ REMOVED: params: { lang: Lang } - no longer expected in static routes
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const searchQuery = searchParams.search || '';

  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  if (searchQuery && searchQuery.length >= 3) {
    // Fetch all pages up to current page
    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        currentSort,
        '', // no category filter in search
        searchQuery,
        [] // no hero exclusions in search
      );
      allSlugs = [...allSlugs, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }
  }

  return (
    <Section 
      title={searchQuery ? dict.search.resultsFor.replace('{query}', searchQuery) : dict.search.pageTitle}
      ariaLabel={dict.search.pageTitle}
    >
      {/* Search results count and sorting */}
      {searchQuery && (
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-txcolor-secondary">
            {allSlugs.length > 0 
              ? `${dict.search.results}: ${allSlugs.length}`
              : dict.search.noResults
            }
          </p>
          <SortingControl 
            translations={dict.sorting} 
            currentSort={currentSort}
            lang="ru" 
          />
        </div>
      )}

      {/* Search Results */}
      {searchQuery ? (
        searchQuery.length < 3 ? (
          <div className="text-center py-12">
            <p className="text-txcolor-secondary">{dict.search.minCharacters}</p>
          </div>
        ) : allSlugs.length > 0 ? (
          <>
            <ArticleList 
              slugInfos={allSlugs} 
              lang="ru" // ✅ HARDCODED: Russian language
            />
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <LoadMoreButton
                  currentPage={currentPage}
                  loadMoreText={dict.common.loadMore}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-txcolor-secondary">{dict.search.noResults}</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-txcolor-secondary">{dict.search.placeholder}</p>
        </div>
      )}
    </Section>
  );
}