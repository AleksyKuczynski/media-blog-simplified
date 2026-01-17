// src/app/[lang]/[rubric]/page.tsx

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ArticleList from '@/features/article-display/ArticleList';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import CollectionDescription from '@/features/layout/CollectionDescription';
import CollectionCount from '@/features/layout/CollectionCount';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ITEMS_PER_PAGE } from '@/api/directus';
import { RubricPageSchema } from '@/shared/seo/schemas/RubricPageSchema';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { SECTION_COUNT_STYLES } from '@/features/layout/styles';

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

    const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
      currentPage,
      'desc',
      lang,
      undefined,
      undefined,
      [],
      undefined,
      rubric
    );

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const rubricAriaLabel = processTemplate(
      dictionary.sections.templates.itemInCollection,
      {
        item: dictionary.sections.labels.articles,
        collection: rubricName,
      }
    );

    return (
      <>
        <RubricPageSchema
          dictionary={dictionary}
          rubricData={{
            name: rubricName,
            slug: rubric,
            description: rubricDescription,
            articleCount: totalCount,
          }}
          currentPath={`/${lang}/${rubric}`}
        />

        <Section 
          title={rubricName}
          titleLevel="h1"
          ariaLabel={rubricAriaLabel}
          hasNextSectionTitle={true}
        >
          {rubricDescription && (
            <CollectionDescription>
              {rubricDescription}
            </CollectionDescription>
          )}

          {totalCount > 0 && (
            <CollectionCount
              count={totalCount}
              countLabel={dictionary.common.count.articles}
              dictionary={dictionary}
              className={SECTION_COUNT_STYLES}
            />
          )}

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-on-sf-var">{dictionary.common.status.loading}</div>
            </div>
          }>
            {currentPageSlugs.length > 0 ? (
              <>
                <ArticleList 
                  slugInfos={currentPageSlugs}
                  lang={lang}
                  dictionary={dictionary}
                  ariaLabel={`${dictionary.sections.labels.articles} в рубрике ${rubricName}`}
                />
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    dictionary={dictionary}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12" role="status">
                <p className="text-on-sf-var">
                  {dictionary.sections.articles.noArticlesFound}
                </p>
              </div>
            )}
          </Suspense>
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    notFound();
  }
}