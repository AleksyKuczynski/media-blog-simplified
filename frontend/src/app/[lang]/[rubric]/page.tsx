// src/app/[lang]/[rubric]/page.tsx
// FIXED: Uses totalCount, proper totalPages

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ArticleList from '@/main/components/Main/ArticleList';
import Pagination from '@/main/components/Main/Pagination';
import Section from '@/main/components/Main/Section';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics } from '@/main/lib/directus';
import { ITEMS_PER_PAGE } from '@/main/lib/directus/directusConstants';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import Breadcrumbs from '@/main/components/Navigation/Breadcrumbs/Breadcrumbs';

export const revalidate = 300;

export default async function RubricPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: Lang; rubric: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  try {
    const { lang, rubric } = await params;
    const resolvedSearchParams = await searchParams;
    const dictionary = getDictionary(lang as Lang);
    const currentPage = Number(resolvedSearchParams.page) || 1;
    
    const [rubricDetails, rubricBasics] = await Promise.all([
      fetchRubricDetails(rubric, lang),
      fetchRubricBasics(lang),
    ]);

    if (!rubricDetails) {
      notFound();
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === lang);
    const rubricName = rubricTranslation?.name || rubric;
    const rubricDescription = rubricTranslation?.description;

    // FIXED: Get totalCount
    const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
      currentPage,
      'desc',
      undefined,
      undefined,
      [],
      undefined,
      rubric
    );

    // FIXED: Calculate totalPages correctly
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: `/${lang}`,
      },
      {
        label: dictionary.navigation.labels.rubrics,
        href: `/${lang}/rubrics`,
      },
      {
        label: rubricName,
        href: `/${lang}/${rubric}`,
      },
    ];

    const articlesForSchema = currentPageSlugs.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug,
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/${lang}/${rubric}/${slugInfo.slug}`,
    }));

    const articleCountText = getLocalizedArticleCount(dictionary, totalCount);

    return (
      <>
        <RubricPageSchema
          dictionary={dictionary}
          rubricData={{
            name: rubricName,
            slug: rubric,
            description: rubricDescription,
            articleCount: totalCount,
            articles: articlesForSchema,
          }}
          currentPath={`/${lang}/${rubric}`}
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
        
        <Section 
          className="py-8"
          ariaLabel={processTemplate(dictionary.sections.templates.itemInCollection, {
            item: dictionary.sections.labels.articles,
            collection: rubricName
          })}
        >
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4 text-on-sf">
                {rubricName}
              </h1>
              {rubricDescription && (
                <p className="text-lg text-on-sf-var mb-4">
                  {rubricDescription}
                </p>
              )}
              {/* FIXED: Show total count */}
              {totalCount > 0 && (
                <div className="text-sm text-on-sf-var">
                  {articleCountText}
                </div>
              )}
            </header>

            <main role="main">
              <Suspense fallback={
                <div className="text-center py-8" role="status">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prcolor" />
                    <p className="text-on-sf-var">{dictionary.common.status.loading}</p>
                  </div>
                </div>
              }>
                {currentPageSlugs.length > 0 ? (
                  <>
                    <ArticleList 
                      slugInfos={currentPageSlugs}
                      lang={lang}
                      dictionary={dictionary}
                      showCount={false}
                      ariaLabel={`${dictionary.sections.labels.articles} в рубрике ${rubricName}`}
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
                  <div className="text-center py-12" role="status">
                    <p className="text-on-sf-var">
                      {dictionary.sections.articles.noArticlesFound}
                    </p>
                  </div>
                )}
              </Suspense>
            </main>
          </div>
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    notFound();
  }
}