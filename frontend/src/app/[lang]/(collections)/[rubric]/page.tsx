// src/app/[lang]/(collections)/[rubric]/page.tsx

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ArticleList from '@/features/article-display/ArticleList';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import CollectionDescription from '@/features/layout/CollectionDescription';
import CollectionCount from '@/features/layout/CollectionCount';
import PageError from '@/shared/errors/PageError';
import EmptyState from '@/shared/ui/EmptyState';
import { RubricPageSkeleton } from '@/features/rubric-display/RubricPageSkeleton';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchRubricDetails, ITEMS_PER_PAGE } from '@/api/directus';
import { RubricPageSchema } from '@/shared/seo/schemas/RubricPageSchema';
import { getPageTitle, processTemplate } from '@/config/i18n/helpers/templates';
import { SECTION_COUNT_OVERLAP_STYLES } from '@/features/layout/layout.styles';
import { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; rubric: string }>;
}): Promise<Metadata> {
  const { lang, rubric } = await params;
  const dictionary = getDictionary(lang as Lang);
  const rubricDetails = await fetchRubricDetails(rubric, lang);

  if (!rubricDetails) return {};

  const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === lang);
  const rubricName = rubricTranslation?.name || rubric;
  const rubricDescription = rubricTranslation?.description;
  const siteUrl = dictionary.seo.site.url;

  const description = rubricDescription ||
    processTemplate(dictionary.sections.templates.exploreRubricOn, {
      rubric: rubricName,
      siteName: dictionary.seo.site.name,
    });

  return {
    title: getPageTitle(dictionary, rubricName),
    description,
    alternates: {
      canonical: `${siteUrl}/${lang}/${rubric}`,
      languages: {
        en: `${siteUrl}/en/${rubric}`,
        ru: `${siteUrl}/ru/${rubric}`,
        'x-default': `${siteUrl}/ru/${rubric}`,
      },
    },
  };
}

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
    
    const [rubricDetails] = await Promise.all([
      fetchRubricDetails(rubric, lang),
    ]);

    if (!rubricDetails) {
      notFound();
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === lang);
    const rubricName = rubricTranslation?.name || rubric;
    const rubricDescription = rubricTranslation?.description;

    

    const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
      currentPage,
      undefined,
      lang,
      undefined,      // category
      undefined,      // search
      [],             // excludeSlugs
      undefined,      // authorSlug
      undefined,      // illustratorSlug
      rubric          // rubricSlug
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
          flexGrow={true}
        >
          <Suspense fallback={<RubricPageSkeleton ariaLabel={dictionary.common.status.loading} />}>
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
                className={SECTION_COUNT_OVERLAP_STYLES}
              />
            )}

            {currentPageSlugs.length > 0 ? (
              <>
                <ArticleList 
                  slugInfos={currentPageSlugs}
                  lang={lang}
                  dictionary={dictionary}
                  ariaLabel={`${dictionary.sections.labels.articles} в рубрике ${rubricName}`}
                  fromContext={`rubric:${rubric}`}
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
              <EmptyState message={dictionary.sections.articles.noArticlesFound} />
            )}
          </Suspense>
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    
    const { lang } = await params;
    const dictionary = getDictionary(lang as Lang);
    
    return (
      <Section>
        <PageError 
          dictionary={dictionary}
          contentType="rubric"
          backHref={`/${lang}`}
        />
      </Section>
    );
  }
}