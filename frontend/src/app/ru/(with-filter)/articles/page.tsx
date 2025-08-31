// src/app/ru/(with-filter)/articles/page.tsx - ADD SUSPENSE

import { Suspense } from 'react';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';
import { fetchHeroSlugs, fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import HeroArticles from '@/main/components/Main/HeroArticles';
import Section from '@/main/components/Main/Section';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage({ searchParams }: { 
  searchParams: { page?: string, sort?: string, category?: string, search?: string }
}) {
  const dict = await getDictionary('ru');
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const currentCategory = searchParams.category || '';
  const currentSearch = searchParams.search || '';
  const isSortExplicit = 'sort' in searchParams;
  const isDefaultView = !isSortExplicit && !currentCategory && !currentSearch;

  let heroSlugs: string[] = [];
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  if (isDefaultView) {
    try {
      heroSlugs = await fetchHeroSlugs('ru');
    } catch (error) {
      console.error('Error fetching hero articles:', error);
    }
  }

  for (let page = 1; page <= currentPage; page++) {
    const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
      page, 
      currentSort,
      currentCategory, 
      currentSearch, 
      heroSlugs
    );
    allSlugs = [...allSlugs, ...slugs];
    hasMore = pageHasMore;
    if (!pageHasMore) break;
  }

  return (
    <>
      {isDefaultView && (
        <Section 
          title={dict.sections.articles.featuredArticles}
          ariaLabel={dict.sections.articles.featuredArticles}
        >
          <Suspense fallback={<div>{dict.common.loading}</div>}>
            {heroSlugs.length > 0 ? (
              <HeroArticles 
                heroSlugs={heroSlugs} 
                lang="ru"
              />
            ) : (
              <div>{dict.sections.articles.noFeaturedArticles}</div>
            )}
          </Suspense>
        </Section>
      )}

      <Section 
        isOdd={true}
        title={isDefaultView ? dict.sections.articles.latestArticles : dict.sections.articles.allArticles}
        ariaLabel={isDefaultView ? dict.sections.articles.latestArticles : dict.sections.articles.allArticles}
      >
        <ArticleList slugInfos={allSlugs} lang="ru" />
        {hasMore && (
          <div className="mt-8 flex justify-center">
            {/* ✅ FIX: Wrap LoadMoreButton with Suspense */}
            <Suspense fallback={
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 animate-pulse">
                Loading...
              </div>
            }>
              <LoadMoreButton 
                currentPage={currentPage}
                loadMoreText={dict.common.loadMore}
              />
            </Suspense>
          </div>
        )}
      </Section>
    </>
  );
}