// src/app/ru/[rubric]/page.tsx
// FIXED: Updated imports to use direct helper imports instead of index

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionary/getDictionary'; // FIXED: Correct dictionary import
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';

// FIXED: Import new SEO components with correct imports
import { generateRubricMetadata } from '@/main/components/SEO/metadata/RubricMetadata';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content'; // FIXED: Direct import

export const dynamic = 'force-dynamic';

/**
 * Generate metadata using new RubricMetadata component
 * FIXED: Updated to use correct dictionary and helper imports
 */
export async function generateMetadata({ 
  params 
}: { 
  params: { rubric: string } 
}): Promise<Metadata> {
  try {
    const [dictionary, rubricDetails] = await Promise.all([
      getDictionary('ru'), // FIXED: Use correct dictionary getter
      fetchRubricDetails(params.rubric, 'ru'),
    ]);
    
    if (!rubricDetails) {
      return {
        title: 'Рубрика не найдена — EventForMe',
        description: 'Запрашиваемая рубрика не найдена.',
      };
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === 'ru');
    const rubricName = rubricTranslation?.name || params.rubric;
    const rubricDescription = rubricTranslation?.description;

    // Get article count for this rubric
    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], undefined, params.rubric);
    const articleCount = slugs.length;

    // FIXED: Use updated RubricMetadata component
    return await generateRubricMetadata({
      dictionary,
      rubricData: {
        name: rubricName,
        slug: params.rubric,
        description: rubricDescription,
        articleCount,
        path: `/ru/${params.rubric}`,
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
  params: { rubric: string },
  searchParams: { page?: string }
}) {
  try {
    const page = parseInt(searchParams?.page || '1', 10);
    
    const [dictionary, rubricDetails, rubricBasics] = await Promise.all([
      getDictionary('ru'), // FIXED: Use correct dictionary getter
      fetchRubricDetails(params.rubric, 'ru'),
      fetchRubricBasics('ru'),
    ]);

    if (!rubricDetails) {
      notFound();
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === 'ru');
    const rubricName = rubricTranslation?.name || params.rubric;
    const rubricDescription = rubricTranslation?.description;

    // Fetch articles for this rubric
    const { slugs, hasMore } = await fetchArticleSlugs(
      page, 
      'desc', 
      undefined, 
      undefined, 
      [], 
      undefined, 
      params.rubric
    );

    // FIXED: Breadcrumb items using correct dictionary structure
    const breadcrumbItems = [
      {
        name: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        name: dictionary.navigation.labels.rubrics,
        href: '/ru/rubrics',
      },
      {
        name: rubricName,
        href: `/ru/${params.rubric}`,
      },
    ];

    // Transform articles for schema
    const articlesForSchema = slugs.slice(0, 10).map(slug => ({
      title: slug.title || slug.slug,
      slug: slug.slug,
      url: `${dictionary.seo.site.url}/ru/${params.rubric}/${slug.slug}`,
      publishedAt: slug.date_created,
    }));

    return (
      <>
        {/* FIXED: Structured data schema with correct props */}
        <RubricPageSchema
          dictionary={dictionary}
          rubricData={{
            name: rubricName,
            slug: params.rubric,
            description: rubricDescription,
            articleCount: slugs.length,
            articles: articlesForSchema,
          }}
          currentPath={`/ru/${params.rubric}`}
        />
        
        {/* FIXED: Breadcrumbs using correct dictionary */}
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
        
        {/* FIXED: Page header using dictionary */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {rubricName}
          </h1>
          
          {/* Description from rubric data or dictionary fallback */}
          {rubricDescription && (
            <p className="text-lg text-on-sf-var mb-4 max-w-3xl">
              {rubricDescription}
            </p>
          )}
          
          {/* FIXED: Article count using correct helper */}
          <p className="text-sm text-muted-foreground">
            {getLocalizedArticleCount(dictionary, slugs.length)}
          </p>
        </header>

        {/* Main content section */}
        <Section 
          isOdd={true}
          ariaLabel={`Статьи рубрики ${rubricName}`}
        >
          {slugs.length > 0 ? (
            <>
              <ArticleList 
                articles={slugs}
                lang="ru"
                showRubricBadge={false}
              />
              
              {hasMore && (
                <div className="mt-8 text-center">
                  <LoadMoreButton 
                    currentPage={page}
                    hasMore={hasMore}
                    baseUrl={`/ru/${params.rubric}`}
                    loadMoreText={dictionary.common.actions.loadMore}
                  />
                </div>
              )}
            </>
          ) : (
            {/* FIXED: Empty state using dictionary */}
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                В рубрике {rubricName} пока нет статей
              </p>
              <p className="text-sm text-muted-foreground">
                {dictionary.common.status.empty}
              </p>
            </div>
          )}
        </Section>
      </>
    );
    
  } catch (error) {
    console.error('Error rendering rubric page:', error);
    
    // FIXED: Error fallback using dictionary structure
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Ошибка</h1>
        <p className="text-lg text-muted-foreground">
          Произошла ошибка при загрузке рубрики. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }
}