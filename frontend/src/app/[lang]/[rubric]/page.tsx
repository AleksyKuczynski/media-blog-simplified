// src/app/[lang]/[rubric]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Navigation/Breadcrumbs/Breadcrumbs';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';
import { generateRubricMetadata } from '@/main/components/SEO/metadata/RubricMetadata';
import { RubricPageSchema } from '@/main/components/SEO/schemas/RubricPageSchema';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, rubric: string }> 
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'rubric', async (lang, dictionary, resolvedParams) => {
    const { rubric } = resolvedParams;
    
    const rubricDetails = await fetchRubricDetails(rubric, lang);
    
    if (!rubricDetails) {
      throw new Error('Rubric not found');
    }

    const rubricTranslation = rubricDetails.translations?.find(t => t.languages_code === lang);
    if (!rubricTranslation) {
      throw new Error('Rubric translation not found');
    }

    const rubricName = rubricTranslation.name;
    const rubricDescription = rubricTranslation.description;

    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], undefined, rubric);
    const articleCount = slugs.length;

    return generateRubricMetadata({
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
  });
}

export default async function RubricPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lang: Lang, rubric: string }>,
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

    const articlesForSchema = allSlugInfos.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug,
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/${lang}/${rubric}/${slugInfo.slug}`,
    }));

    const articleCountText = getLocalizedArticleCount(dictionary, allSlugInfos.length);

    return (
      <>
        {/* Schema and Breadcrumbs */}
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
        
        {/* Rubric Header Section */}
        <Section 
          className="py-8"
          ariaLabel={processTemplate(dictionary.sections.templates.itemInCollection, {
            item: dictionary.sections.labels.articles,
            collection: rubricName
          })}
        >
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h1 
                className="text-4xl font-bold mb-4 text-on-sf"
                itemProp="name"
              >
                {rubricName}
              </h1>
              
              {rubricDescription && (
                <p 
                  className="text-lg text-on-sf-var mb-4 max-w-3xl"
                  itemProp="description"
                >
                  {rubricDescription}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground">
                {processTemplate(dictionary.sections.templates.totalCount, {
                  count: allSlugInfos.length.toString(),
                  countLabel: dictionary.common.count.articles
                })}
              </p>
            </header>
          </div>
        </Section>

        {/* Articles Section */}
        <Section 
          className="py-0"
          ariaLabel={processTemplate(dictionary.sections.templates.itemsInCollectionDescription, {
            items: dictionary.sections.labels.articles,
            collection: rubricName,
            siteName: dictionary.seo.site.name
          })}
        >
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
                  <LoadMoreButton 
                    currentPage={currentPage}
                    dictionary={dictionary}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  {processTemplate(dictionary.sections.templates.emptyCollection, {
                    items: dictionary.sections.labels.articles,
                    collection: rubricName
                  })}
                </p>
              </div>
            )}
          </div>
        </Section>
      </>
    );
    
  } catch (error) {
    console.error('Error rendering rubric page:', error);
    throw error;
  }
}