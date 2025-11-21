// src/app/[lang]/[rubric]/page.tsx
// FIXED: Correct ArticleSlugInfo usage and proper data handling

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';
import { generateRubricMetadata } from '@/main/components/SEO/metadata/RubricMetadata';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import Link from 'next/link';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import { getDictionary, Lang } from '@/main/lib/dictionary';

// ISR CONFIGURATION: 5 minutes
export const revalidate = 300;
export const dynamicParams = true;

/**
 * Generate metadata using new RubricMetadata component
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, rubric: string }> 
}): Promise<Metadata> {
  try {
    const { lang, rubric } = await params;
    const dictionary = getDictionary(lang as Lang);
    const [rubricDetails] = await Promise.all([
      fetchRubricDetails(rubric, lang),
    ]);
    
    if (!rubricDetails) {
      return {
        title: 'Рубрика не найдена — EventForMe',
        description: 'Запрашиваемая рубрика не найдена.',
      };
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === lang);
    const rubricName = rubricTranslation?.name || rubric;
    const rubricDescription = rubricTranslation?.description;

    // Get article count for this rubric
    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], undefined, rubric);
    const articleCount = slugs.length;

    return await generateRubricMetadata({
      dictionary,
      rubricData: {
        name: rubricName,
        slug: rubric,
        description: rubricDescription,
        articleCount,
        path: `/${lang}/${rubric}`,
        featured: false,
      },
    });
  } catch (error) {
    console.error('Error generating rubric metadata:', error);
    
    // Fallback metadata
    const errorHandler = createErrorHandler(dictionary);
    return errorHandler.generateErrorMetadata('rubric');
  }
}

export default async function RubricPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lang: Lang, rubric: string }>,
  searchParams: Promise<{ page?: string }>
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

    // Fetch article slugs for all pages up to current page
    let allSlugInfos: ArticleSlugInfo[] = [];
    let hasMore = false;

    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        'desc',
        undefined,
        undefined,
        [],
        undefined,
        rubric
      );
      allSlugInfos = [...allSlugInfos, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    // FIXED: Breadcrumb items using correct interface
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

    // Generate simple articles for schema using only available data
    const articlesForSchema = allSlugInfos.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug, // Use slug as title fallback since title is not available
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/${lang}/${rubric}/${slugInfo.slug}`,
      // publishedAt is not available in ArticleSlugInfo, so we omit it
    }));

    // Get article count text using helper
    const articleCountText = getLocalizedArticleCount(dictionary, allSlugInfos.length);

    return (
      <>
        <RubricPageSchema
          dictionary={dictionary}
          rubricData={{
            name: rubricName,
            slug: rubric,
            description: rubricDescription,
            articleCount: allSlugInfos.length,
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
        
        <header className="mb-8 container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {rubricName}
          </h1>
          
          {rubricDescription && (
            <p className="text-lg text-gray-600 mb-4 max-w-3xl">
              {rubricDescription}
            </p>
          )}
          
          <p className="text-sm text-gray-500">
            {articleCountText}
          </p>
        </header>

        <Section className="py-0">
          <div className="container mx-auto px-4">
            {allSlugInfos.length > 0 ? (
              <>
                <ArticleList 
                  slugInfos={allSlugInfos} 
                  lang={lang}
                  dictionary={dictionary}
                  rubricSlug={rubric}
                  showCount={false}
                />
                
                {hasMore && (
                  <div className="mt-8 text-center">
                    <LoadMoreButton
                      currentPage={currentPage}
                      dictionary={dictionary}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">
                  {dictionary.common.status.empty}
                </h2>
                <p className="text-gray-600 mb-6">
                  В рубрике {rubricName} пока нет статей
                </p>
                <Link 
                  href={`/${lang}/rubrics`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {dictionary.navigation.labels.rubrics}
                </Link>
              </div>
            )}
          </div>
        </Section>
        
        {allSlugInfos.length > 0 && (
          <Section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                  Больше о рубрике {rubricName}
                </h2>
                <p className="text-gray-600 mb-6">
                  {dictionary.sections.rubrics.categoriesDescription}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href={`/${lang}/rubrics`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {dictionary.sections.rubrics.allRubrics}
                  </Link>
                  <Link 
                    href={`/${lang}/articles`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {dictionary.sections.articles.allArticles}
                  </Link>
                </div>
              </div>
            </div>
          </Section>
        )}
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    
    throw error;
  }
}