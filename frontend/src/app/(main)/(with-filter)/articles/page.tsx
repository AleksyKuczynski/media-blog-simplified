// src/app/[lang]/(main)/articles/page.tsx

import { Suspense } from 'react';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { fetchHeroSlugs, fetchArticleSlugs } from '@/main/lib/directus/index';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import HeroArticles from '@/main/components/Main/HeroArticles';
import Section from '@/main/components/Main/Section';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage({ params: { lang }, searchParams }: { 
  params: { lang: Lang }, 
  searchParams: { page?: string, sort?: string, category?: string, search?: string } 
}) {
  const dict = await getDictionary(lang);
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
      heroSlugs = await fetchHeroSlugs(lang);
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
                lang={lang} 
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
        <Suspense fallback={<div>{dict.common.loading}</div>}>
          <ArticleList 
            slugInfos={allSlugs}
            lang={lang}
          />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <LoadMoreButton 
                currentPage={currentPage}
                loadMoreText={dict.common.loadMore}
              />
            </div>
          )}
        </Suspense>
      </Section>
    </>
  );
}