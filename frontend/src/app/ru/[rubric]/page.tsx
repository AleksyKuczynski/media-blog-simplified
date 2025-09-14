// src/app/ru/[rubric]/page.tsx - MIGRATED: Uses new SEO components and unified dictionary
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary as getNewDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';

// NEW: Import new SEO components instead of old ones
import { generateRubricMetadata } from '@/main/components/SEO/metadata/RubricMetadata';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers';

export const dynamic = 'force-dynamic';

/**
 * MIGRATED: Generate metadata using new RubricMetadata component
 * Replaces old generateSEOMetadata from SEOManager
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { rubric: string } 
}): Promise<Metadata> {
  const [dictionary, rubricDetails] = await Promise.all([
    getNewDictionary('ru'), // UPDATED: Use new dictionary
    fetchRubricDetails(params.rubric, 'ru'),
  ]);
  
  if (!rubricDetails) {
    return {
      title: 'Rubric Not Found',
      description: 'The requested rubric could not be found.'
    };
  }

  const rubricTranslation = rubricDetails.translations.find(t => t.languages_code === 'ru');
  const rubricName = rubricTranslation?.name || params.rubric;
  const rubricDescription = rubricTranslation?.description;

  // Get article count for this rubric
  const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], undefined, params.rubric);
  const articleCount = slugs.length; // This is just page 1, but gives us a count

  // UPDATED: Use new RubricMetadata component
  return await generateRubricMetadata({
    dictionary,
    rubricData: {
      name: rubricName,
      slug: params.rubric,
      description: rubricDescription,
      articleCount,
      path: `/ru/${params.rubric}`,
      featured: false, // Could be determined by some logic
    },
  });
}

export default async function RubricPage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string },
  searchParams: { page?: string }
}) {
  // UPDATED: Use new dictionary
  const dictionary = await getNewDictionary('ru');
  const currentPage = Number(searchParams.page) || 1;
  
  try {
    const [rubricDetails, rubricBasics] = await Promise.all([
      fetchRubricDetails(params.rubric, 'ru'),
      fetchRubricBasics('ru'),
    ]);

    if (!rubricDetails) {
      notFound();
    }

    // Fetch articles for current page and all previous pages
    let allSlugs: ArticleSlugInfo[] = [];
    let hasMore = false;

    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        'desc',
        undefined,
        undefined,
        [],
        undefined,
        params.rubric
      );
      allSlugs = [...allSlugs, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    const rubricTranslation = rubricDetails.translations.find(t => t.languages_code === 'ru');
    const rubricName = rubricTranslation?.name || params.rubric;
    const rubricDescription = rubricTranslation?.description;

    // UPDATED: Use new dictionary structure for breadcrumbs
    const breadcrumbItems = [
      { label: dictionary.sections.rubrics.allRubrics, href: '/ru/rubrics' },
      { label: rubricName, href: `/ru/${params.rubric}` },
    ];

    // Generate localized article count text
    const articleCountText = getLocalizedArticleCount(
      allSlugs.length, 
      dictionary.common.articles
    );

    return (
      <>
        {/* NEW: Use RubricPageSchema instead of StructuredDataManager */}
        <RubricPageSchema
          dictionary={dictionary}
          rubricData={{
            name: rubricName,
            slug: params.rubric,
            description: rubricDescription,
            articleCount: allSlugs.length,
            articles: allSlugs.map(slug => ({
              title: slug.title,
              slug: slug.slug,
              url: `/ru/${params.rubric}/${slug.slug}`,
              publishedAt: slug.published_at,
            })),
          }}
          currentPath={`/ru/${params.rubric}`}
        />
        
        {/* UPDATED: Use new dictionary structure */}
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang="ru"
          translations={{
            home: dictionary.navigation.labels.home,
            allRubrics: dictionary.sections.rubrics.allRubrics,
            allAuthors: dictionary.sections.authors.ourAuthors,
          }}
        />
        
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {rubricName}
          </h1>
          
          {/* Rubric description if available */}
          {rubricDescription && (
            <p className="text-lg text-on-sf-var mb-4 max-w-4xl">
              {rubricDescription}
            </p>
          )}
          
          {/* Article count and navigation info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              {dictionary.sections.rubrics.articlesInRubric}: {articleCountText}
            </span>
            {currentPage > 1 && (
              <span>
                {dictionary.common.page} {currentPage}
              </span>
            )}
          </div>
        </header>

        {/* Main content section */}
        <Section 
          isOdd={true}
          ariaLabel={`${dictionary.sections.rubrics.articlesInRubric} ${rubricName}`}
        >
          {allSlugs.length > 0 ? (
            <>
              <ArticleList 
                slugInfos={allSlugs} 
                lang="ru"
                rubricSlug={params.rubric} 
                dictionary={dictionary}
              />
              
              {/* Load more button */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <LoadMoreButton
                    currentPage={currentPage}
                    loadMoreText={dictionary.common.loadMore}
                  />
                </div>
              )}
            </>
          ) : (
            /* No articles state */
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                {dictionary.sections.articles.noArticlesFound}
              </h2>
              <p className="text-on-sf-var mb-6">
                В рубрике "{rubricName}" пока нет статей
              </p>
              <a 
                href="/ru/rubrics"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {dictionary.sections.rubrics.browseAllRubrics}
              </a>
            </div>
          )}
        </Section>
        
        {/* Additional information section */}
        {allSlugs.length > 0 && (
          <Section 
            isOdd={false}
            ariaLabel={`${dictionary.sections.rubrics.readMoreAbout} ${rubricName}`}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                {dictionary.sections.rubrics.readMoreAbout} {rubricName}
              </h2>
              <p className="text-on-sf-var mb-6">
                {dictionary.sections.rubrics.categoriesDescription}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="/ru/rubrics"
                  className="px-4 py-2 border border-ol-var rounded-lg hover:bg-sf-hi transition-colors"
                >
                  {dictionary.sections.rubrics.allRubrics}
                </a>
                <a 
                  href="/ru/articles"
                  className="px-4 py-2 border border-ol-var rounded-lg hover:bg-sf-hi transition-colors"
                >
                  {dictionary.sections.articles.allArticles}
                </a>
              </div>
            </div>
          </Section>
        )}
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    notFound();
  }
}