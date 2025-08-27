// /frontend/src/app/[lang]/(main)/(with-filter)/category/[categorySlug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { fetchArticleSlugs, fetchAllCategories } from '@/main/lib/directus';
import { ArticleSlugInfo, Category } from '@/main/lib/directus/directusInterfaces';

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: { categorySlug: string, lang: Lang },
  searchParams: { page?: string, sort?: string }
}) {
  const dict = await getDictionary(params.lang);
  const categories = await fetchAllCategories(params.lang);
  const category = categories.find(cat => cat.slug === params.categorySlug);
  
  if (!category) {
    notFound();
  }

  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';

  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  for (let page = 1; page <= currentPage; page++) {
    const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
      page,
      currentSort,
      params.categorySlug
    );
    allSlugs = [...allSlugs, ...slugs];
    hasMore = pageHasMore;
    if (!pageHasMore) break;
  }

  return (
    <Section 
      title={category.name}
      className="py-8"
    >
      <Suspense fallback={<div>{dict.common.loading}</div>}>
        {allSlugs.length > 0 ? (
          <>
            <ArticleList 
              slugInfos={allSlugs}
              lang={params.lang}
              categorySlug={params.categorySlug}
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
          <p className="text-center text-txcolor-secondary">{dict.sections.categories.noArticlesFound}</p>
        )}
      </Suspense>
    </Section>
  );
}