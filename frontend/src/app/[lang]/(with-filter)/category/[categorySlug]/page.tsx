// src/app/[lang]/(with-filter)/category/[categorySlug]/page.tsx
// FIXED: Uses totalCount, proper totalPages calculation

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ArticleList from '@/features/article-display/ArticleList';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchAllCategories, fetchRubricBasics, ITEMS_PER_PAGE } from '@/api/directus';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import { processTemplate } from '@/config/i18n/helpers/templates';
import Breadcrumbs from '@/features/navigation/Breadcrumbs/Breadcrumbs';

export const revalidate = 300;

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
  const rubricBasics = await fetchRubricBasics(lang);
  
  const category = categories.find(cat => cat.slug === categorySlug);
  
  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';

  // FIXED: Get totalCount
  const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
    currentPage,
    currentSort,
    lang,
    categorySlug
  );

  // FIXED: Calculate totalPages correctly
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const breadcrumbItems = [
    {
      label: dictionary.navigation.labels.home,
      href: `/${lang}`,
    },
    {
      label: dictionary.navigation.labels.articles,
      href: `/${lang}/articles`,
    },
    {
      label: category.name,
      href: `/${lang}/category/${categorySlug}`,
    },
  ];

  const articleItems = currentPageSlugs.slice(0, 10).map(slug => ({
    name: slug.slug,
    slug: slug.slug,
    url: `${dictionary.seo.site.url}/articles/${slug.slug}`,
    description: `Статья ${slug.slug}`,
  }));

  return (
    <>
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="articles"
        items={articleItems}
        totalCount={totalCount}
        currentPath={`/${lang}/category/${categorySlug}`}
        featured={false}
      />

      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics} 
        lang={lang}
        translations={{
          home: dictionary.navigation.labels.home,
          allRubrics: dictionary.navigation.labels.rubrics,
          allAuthors: dictionary.navigation.labels.authors,
        }}
      />

      <article itemScope itemType="https://schema.org/CollectionPage">
        <Section 
          title={category.name}
          className="py-8"
        >
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h1 
                className="text-3xl font-bold mb-4 text-on-sf"
                itemProp="name"
              >
                {category.name}
              </h1>
              <p 
                className="text-lg text-on-sf-var"
                itemProp="description"
              >
                {processTemplate(dictionary.navigation.templates.sectionDescription, {
                  action: dictionary.common.actions.explore,
                  section: category.name,
                  siteName: dictionary.seo.site.name
                })}
              </p>
              
              {/* FIXED: Show total count */}
              {totalCount > 0 && (
                <div className="mt-4 text-sm text-on-sf-var">
                  {processTemplate(dictionary.sections.templates.totalCount, {
                    count: totalCount.toString(),
                    countLabel: dictionary.common.count.articles
                  })}
                </div>
              )}
            </header>

            <main role="main" itemProp="mainEntity">
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
                    <ArticleList 
                      slugInfos={currentPageSlugs}
                      lang={lang}
                      dictionary={dictionary}
                      categorySlug={categorySlug}
                      showCount={false}
                      ariaLabel={`${dictionary.sections.templates.categoryDescription} ${category.name}`}
                    />
                    
                    <div className="mt-12">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        dictionary={dictionary}
                      />
                    </div>
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
            </main>
          </div>
        </Section>
      </article>
    </>
  );
}