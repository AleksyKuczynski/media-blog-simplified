// src/app/ru/[rubric]/page.tsx
// FIXED: Correct ArticleSlugInfo usage and proper data handling

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import getDictionary from '@/main/lib/dictionary/getDictionary';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';

// FIXED: Import new SEO components with direct imports
import { generateRubricMetadata } from '@/main/components/SEO/metadata/RubricMetadata';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import Link from 'next/link';

// ISR CONFIGURATION: 5 minutes
export const revalidate = 300;
export const dynamicParams = true;

/**
 * Generate metadata using new RubricMetadata component
 */
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ rubric: string }> 
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const [dictionary, rubricDetails] = await Promise.all([
      getDictionary('ru'),
      fetchRubricDetails(resolvedParams.rubric, 'ru'),
    ]);
    
    if (!rubricDetails) {
      return {
        title: 'Рубрика не найдена — EventForMe',
        description: 'Запрашиваемая рубрика не найдена.',
      };
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === 'ru');
    const rubricName = rubricTranslation?.name || resolvedParams.rubric;
    const rubricDescription = rubricTranslation?.description;

    // Get article count for this rubric
    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], undefined, resolvedParams.rubric);
    const articleCount = slugs.length;

    return await generateRubricMetadata({
      dictionary,
      rubricData: {
        name: rubricName,
        slug: resolvedParams.rubric,
        description: rubricDescription,
        articleCount,
        path: `/ru/${resolvedParams.rubric}`,
        featured: false,
      },
    });
  } catch (error) {
    console.error('Error generating rubric metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Рубрика — EventForMe',
      description: 'Изучите материалы по выбранной рубрике.',
    };
  }
}

export default async function RubricPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ rubric: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) || 1;
    
    const [dictionary, rubricDetails, rubricBasics] = await Promise.all([
      getDictionary('ru'),
      fetchRubricDetails(resolvedParams.rubric, 'ru'),
      fetchRubricBasics('ru'),
    ]);

    if (!rubricDetails) {
      notFound();
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === 'ru');
    const rubricName = rubricTranslation?.name || resolvedParams.rubric;
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
        resolvedParams.rubric
      );
      allSlugInfos = [...allSlugInfos, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    // FIXED: Breadcrumb items using correct interface
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        label: dictionary.navigation.labels.rubrics,
        href: '/ru/rubrics',
      },
      {
        label: rubricName,
        href: `/ru/${resolvedParams.rubric}`,
      },
    ];

    // Generate simple articles for schema using only available data
    const articlesForSchema = allSlugInfos.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug, // Use slug as title fallback since title is not available
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/ru/${resolvedParams.rubric}/${slugInfo.slug}`,
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
            slug: resolvedParams.rubric,
            description: rubricDescription,
            articleCount: allSlugInfos.length,
            articles: articlesForSchema,
          }}
          currentPath={`/ru/${resolvedParams.rubric}`}
        />
        
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang="ru"
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
                  lang="ru"
                  dictionary={dictionary}
                  rubricSlug={resolvedParams.rubric}
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
                  href="/ru/rubrics"
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
                    href="/ru/rubrics"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {dictionary.sections.rubrics.allRubrics}
                  </Link>
                  <Link 
                    href="/ru/articles"
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
    
    // Error fallback
    return (
      <Section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Ошибка загрузки рубрики
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла ошибка при загрузке страницы рубрики. Попробуйте обновить страницу.
          </p>
          <Link 
            href="/ru" 
            className="text-blue-600 hover:text-blue-800"
          >
            Вернуться на главную
          </Link>
        </div>
      </Section>
    );
  }
}