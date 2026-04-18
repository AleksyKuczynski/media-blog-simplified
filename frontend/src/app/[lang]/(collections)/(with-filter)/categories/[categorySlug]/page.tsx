// src/app/[lang]/(collections)/(with-filter)/category/[categorySlug]/page.tsx

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ArticleList from '@/features/article-display/ArticleList';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchAllCategories, ITEMS_PER_PAGE } from '@/api/directus';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import CollectionCount from '@/features/layout/CollectionCount';
import { SECTION_COUNT_STYLES } from '@/features/layout/layout.styles';
import { Metadata } from 'next';
import { getPageTitle, processTemplate } from '@/config/i18n/helpers/templates';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; categorySlug: string }>;
}): Promise<Metadata> {
  const { lang, categorySlug } = await params;
  const dictionary = getDictionary(lang as Lang);
  const categories = await fetchAllCategories(lang);
  const category = categories.find(cat => cat.slug === categorySlug);

  if (!category) return {};

  const siteUrl = dictionary.seo.site.url;
  const description = processTemplate(dictionary.sections.templates.exploreRubricOn, {
    rubric: category.name,
    siteName: dictionary.seo.site.name,
  });

  return {
    title: getPageTitle(dictionary, category.name),
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/categories/${categorySlug}`,
      languages: {
        en: `${siteUrl}/en/categories/${categorySlug}`,
        ru: `${siteUrl}/ru/categories/${categorySlug}`,
        'x-default': `${siteUrl}/ru/categories/${categorySlug}`,
      },
    },
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: {
  params: Promise<{ lang: Lang; categorySlug: string }>;
  searchParams: Promise<{ page?: string, sort?: string }>
}) {
  const { lang, categorySlug } = await params;
  const dictionary = getDictionary(lang as Lang);
  const categories = await fetchAllCategories(lang);
  
  const category = categories.find(cat => cat.slug === categorySlug);
  
  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';

  const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
    currentPage,
    currentSort,
    lang,
    categorySlug
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const articleItems = currentPageSlugs.slice(0, 10).map(slug => ({
    name: slug.slug,
    slug: slug.slug,
    url: `${dictionary.seo.site.url}/articles/${slug.slug}`,
    description: processTemplate(dictionary.sections.templates.itemDescription, { name: slug.slug }),
  }));

  return (
    <>
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="articles"
        items={articleItems}
        totalCount={totalCount}
        currentPath={`/${lang}/categories/${categorySlug}`}
        featured={false}
      />

      <Section
        as="article"
        itemScope
        itemType="https://schema.org/CollectionPage" 
        title={category.name}
        titleLevel="h1"
        className="py-8"
        hasNextSectionTitle={true}
        flexGrow={true}
      >
        <Suspense fallback={
          <div 
            className="text-center py-8"
            role="status" 
            aria-label={dictionary.common.status.loading}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prcolor" aria-hidden="true" />
              <p className="text-on-sf-var">
                {dictionary.common.status.loading}
              </p>
            </div>
          </div>
        }>
          {currentPageSlugs.length > 0 ? (
            <>
              {totalCount > 0 && (
                <CollectionCount
                  count={totalCount}
                  countLabel={dictionary.common.count.articles}
                  dictionary={dictionary}
                  className={SECTION_COUNT_STYLES}
                />
              )}

              <ArticleList 
                slugInfos={currentPageSlugs}
                lang={lang}
                dictionary={dictionary}
                categorySlug={categorySlug}
                ariaLabel={processTemplate(dictionary.sections.templates.categoryDescription, { categoryName: category.name })}
                fromContext={`category:${categorySlug}`}
              />
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                dictionary={dictionary}
              />
            </>
          ) : (
            <div 
              className="text-center py-12"
              role="status"
              aria-label={dictionary.common.status.empty}
            >
              <div className="text-gray-600 dark:text-gray-400">
                <p>{dictionary.sections.articles.noArticlesFound}</p>
              </div>
            </div>
          )}
        </Suspense>
      </Section>
    </>
  );
}