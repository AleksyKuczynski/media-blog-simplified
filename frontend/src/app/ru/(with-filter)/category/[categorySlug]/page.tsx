// src/app/ru/(with-filter)/category/[categorySlug]/page.tsx

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { fetchArticleSlugs, fetchAllCategories, fetchRubricBasics } from '@/main/lib/directus';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import Link from 'next/link';

// ISR CONFIGURATION: 10 minutes (categories change less frequently)
export const revalidate = 600;
export const dynamicParams = true;

// Generate SEO-optimized metadata using existing CollectionMetadata component
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ categorySlug: string }> 
}): Promise<Metadata> {
  const categories = await fetchAllCategories(DEFAULT_LANG);
  const resolvedParams = await params;
  const category = categories.find(cat => cat.slug === resolvedParams.categorySlug);
  
  if (!category) {
    return {
      title: processTemplate(dictionary.metadata.notFound.page.title, {}),
      description: processTemplate(dictionary.metadata.notFound.page.description, {}),
    };
  }

  // Get article count for this category
  const { slugs } = await fetchArticleSlugs(1, 'desc', resolvedParams.categorySlug);

  // Transform category data for the collection metadata generator
  const categoryData = [{
    name: category.name,
    slug: category.slug,
    description: `Статьи в категории ${category.name}`,
  }];

  // Use existing generateCollectionMetadata component
  return await generateCollectionMetadata({
    dictionary,
    collectionType: 'articles', // Category pages show articles
    items: categoryData,
    totalCount: slugs.length,
    currentPath: `/${DEFAULT_LANG}/category/${resolvedParams.categorySlug}`,
    featured: false,
  });
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page?: string, sort?: string }>
}) {
  const resolvedParams = await params;
  const categories = await fetchAllCategories('ru');
  const rubricBasics = await fetchRubricBasics('ru');
  
  const category = categories.find(cat => cat.slug === resolvedParams.categorySlug);
  
  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';

  // Fetch articles for all pages up to current page
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;

  for (let page = 1; page <= currentPage; page++) {
    const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
      page,
      currentSort,
      resolvedParams.categorySlug
    );
    allSlugs = [...allSlugs, ...slugs];
    hasMore = pageHasMore;
    if (!pageHasMore) break;
  }

  // Generate breadcrumb items using dictionary
  const breadcrumbItems = [
    {
      label: dictionary.navigation.labels.home,
      href: `/${DEFAULT_LANG}`,
    },
    {
      label: dictionary.navigation.labels.articles,
      href: `/${DEFAULT_LANG}/articles`,
    },
    {
      label: category.name,
      href: `/${DEFAULT_LANG}/category/${resolvedParams.categorySlug}`,
    },
  ];

  // Prepare article data for CollectionPageSchema
  const articleItems = allSlugs.slice(0, 10).map(slug => ({
    name: slug.slug, // Using slug as name fallback since title not available
    slug: slug.slug,
    url: `${dictionary.seo.site.url}/articles/${slug.slug}`,
    description: `Статья ${slug.slug}`,
  }));

  return (
    <>
      {/* Use existing CollectionPageSchema component */}
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="articles"
        items={articleItems}
        totalCount={allSlugs.length}
        currentPath={`/ru/category/${resolvedParams.categorySlug}`}
        featured={false}
      />

      {/* Breadcrumbs for better navigation and SEO */}
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

      {/* Main content with semantic HTML for SEO */}
      <article itemScope itemType="https://schema.org/CollectionPage">
        <Section 
          title={category.name}
          className="py-8"
        >
          <div className="container mx-auto px-4">
            {/* Enhanced page header with semantic markup */}
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
              
              {/* Article count display */}
              {allSlugs.length > 0 && (
                <div className="mt-4 text-sm text-on-sf-var">
                  {processTemplate(dictionary.sections.templates.totalCount, {
                    count: allSlugs.length.toString(),
                    countLabel: dictionary.common.count.articles
                  })}
                </div>
              )}
            </header>

            {/* Main content area */}
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
                {allSlugs.length > 0 ? (
                  <>
                    <ArticleList 
                      slugInfos={allSlugs}
                      lang="ru"
                      dictionary={dictionary}
                      categorySlug={resolvedParams.categorySlug}
                      showCount={false}
                      ariaLabel={`Статьи в категории ${category.name}`}
                    />
                    
                    {/* Load more button with enhanced UX */}
                    {hasMore && (
                      <footer className="mt-8 text-center">
                        <LoadMoreButton 
                          currentPage={currentPage}
                          dictionary={dictionary}
                        />
                      </footer>
                    )}
                  </>
                ) : (
                  <div 
                    className="text-center py-12"
                    role="status"
                    aria-label={dictionary.common.status.empty}
                  >
                    <div className="text-gray-600 dark:text-gray-400">
                      <svg 
                        className="mx-auto h-12 w-12 mb-4 opacity-50" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      <p className="text-lg mb-2">
                        {dictionary.sections.articles.noArticlesFound}
                      </p>
                      <p className="text-sm opacity-75">
                        {processTemplate(dictionary.sections.templates.emptyCollection, {
                          collection: category.name,
                          items: dictionary.sections.labels.articles
                        })}
                      </p>
                      
                      {/* Navigation links for better UX */}
                      <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        <Link 
                          href={`/${DEFAULT_LANG}/articles`}
                          className="inline-flex items-center px-4 py-2 bg-prcolor text-white rounded-lg hover:bg-pr-fix transition-colors"
                        >
                          {dictionary.sections.articles.allArticles}
                        </Link>
                        <Link 
                          href={`/${DEFAULT_LANG}/rubrics`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {dictionary.sections.rubrics.allRubrics}
                        </Link>
                      </div>
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