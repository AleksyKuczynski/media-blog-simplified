// /frontend/src/app/[lang]/(main)/search/page.tsx
import { Suspense } from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import { fetchArticleSlugs } from '@/main/lib/directus/index';
import { Metadata } from 'next';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import SortingControl from '@/main/components/Navigation/SortingControl';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: {
  params: { lang: Lang },
  searchParams: { search?: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  const searchQuery = searchParams.search || '';
  return {
    title: searchQuery ? `${dict.search.results}: "${searchQuery}" | ${dict.search.pageTitle}` : dict.search.pageTitle,
    description: dict.search.pageDescription.replace('{query}', searchQuery ? ` ${dict.search.relatedTo} "${searchQuery}"` : ''),
  };
}

interface SearchPageProps {
  params: { lang: Lang };
  searchParams: { 
    search?: string; 
    sort?: string; 
    page?: string;
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const dict = await getDictionary(params.lang);
  const lang = params.lang;
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const searchQuery = searchParams.search || '';

  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  for (let page = 1; page <= currentPage; page++) {
    const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
      page,
      currentSort,
      undefined, // category
      searchQuery,
      [] // excludeSlugs
    );
    allSlugs = [...allSlugs, ...slugs];
    hasMore = pageHasMore;
    if (!pageHasMore) break;
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center font-display">{dict.search.results}</h1>
      
      <SortingControl
        translations={dict.sorting}
        currentSort={currentSort}
        lang={lang}
      />

      <Section
        ariaLabel={dict.search.results}
        title={dict.search.resultsFor.replace('{query}', searchQuery)}
      >
        <Suspense fallback={<div className="text-center text-lg text-text-secondary">{dict.common.loading}</div>}>
          <ArticleList
            key={`${searchQuery}-${currentSort}-${currentPage}`}
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