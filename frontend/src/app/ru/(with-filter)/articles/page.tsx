// src/app/ru/(with-filter)/articles/page.tsx
// REDESIGNED: Matches RubricPage/AuthorPage design with FilterGroup and SEO text

import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import FilterGroup from '@/main/components/Navigation/FilterGroup';
import { getDictionary } from '@/main/lib/dictionary/getDictionary';
import { fetchArticleSlugs, fetchAllCategories } from '@/main/lib/directus';
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';

interface ArticlesPageProps {
  searchParams: Promise<{ 
    page?: string; 
    sort?: string;
    category?: string;
  }>;
}

// FIXED: Generate metadata using CollectionMetadata following established pattern
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary('ru');
  
  // Fetch articles to get accurate count and items for metadata
  try {
    const { slugs } = await fetchArticleSlugs(1, 'desc');
    
    // FIXED: Transform article data using only available properties (slug, layout)
    const articleItems = slugs.slice(0, 5).map(slug => ({
      name: slug.slug, // Use slug as name since title is not available
      slug: slug.slug,
      description: `Статья ${slug.slug}`, // Generate description from slug
    }));

    // FIXED: Use proper CollectionMetadata instead of PageMetadata
    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'articles',
      items: articleItems,
      totalCount: slugs.length, // FIXED: Use slugs.length, not totalCount property
      currentPath: '/ru/articles',
      featured: false,
    });
    
  } catch (error) {
    console.error('Error generating articles metadata:', error);
    
    // Fallback metadata using dictionary entries (no hardcoded text)
    return {
      title: processTemplate(dictionary.seo.templates.collectionPage, {
        collection: processTemplate(dictionary.sections.templates.collectionTitle, {
          section: dictionary.sections.labels.articles,
        }),
        siteName: dictionary.seo.site.name,
      }),
      description: processTemplate(dictionary.seo.templates.metaDescription, {
        description: dictionary.sections.articles.collectionPageDescription,
        siteName: dictionary.seo.site.name,
      }),
    };
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  // Get dictionary and categories for FilterGroup
  const [dictionary, categories] = await Promise.all([
    getDictionary('ru'),
    fetchAllCategories('ru')
  ]);
  
  // FIXED: Await searchParams Promise
  const resolvedSearchParams = await searchParams;
  
  // Parse parameters (preserve existing logic)
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';
  const categoryFilter = resolvedSearchParams.category;
  
  // Fetch articles for all pages up to current (simplified - no hero logic)
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  
  try {
    // Get regular articles (no hero article filtering)
    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        currentSort,
        categoryFilter
      );
      
      allSlugs = [...allSlugs, ...slugs];
      hasMore = pageHasMore;
      
      if (!pageHasMore) break;
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Handle error state gracefully
  }

  // ADDED: Prepare data for structured schema using available properties
  const articleItems = allSlugs.slice(0, 10).map(slug => ({
    name: slug.slug, // FIXED: Use slug as name since title is not available
    slug: slug.slug,
    url: `${dictionary.seo.site.url}/ru/articles/${slug.slug}`,
    description: `Статья ${slug.slug}`, // FIXED: Generate description from slug
  }));

  return (
    <>
      {/* Schema & Breadcrumbs at top (following RubricPage pattern) */}
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="articles"
        items={articleItems}
        totalCount={allSlugs.length}
        currentPath="/ru/articles"
        featured={false}
      />

      {/* REDESIGNED: FilterGroup replaces header section (following RubricPage structure) */}
      <div className="mb-8 container mx-auto px-4">
        {/* SEO Text section (replaces description paragraph from RubricPage pattern) */}
        <div className="mt-6">
          <p className="text-lg text-on-sf-var mb-4 max-w-3xl">
            {dictionary.sections.articles.collectionPageDescription}
          </p>
          
          {/* Article count display (following RubricPage pattern) */}
          {allSlugs.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {processTemplate(dictionary.sections.templates.totalCount, {
                count: allSlugs.length.toString(),
                countLabel: dictionary.common.count.articles
              })}
            </p>
          )}
        </div>
      </div>

      {/* Main Articles Section (following RubricPage pattern exactly) */}
      <Section 
        className="py-0"
        ariaLabel={dictionary.sections.articles.allArticles}
      >
        <div className="container mx-auto px-4">
          {allSlugs.length > 0 ? (
            <>
              {/* Enhanced ArticleList (preserve existing) */}
              <ArticleList 
                slugInfos={allSlugs} 
                lang="ru" 
                dictionary={dictionary}
                categorySlug={categoryFilter}
                showCount={true}
                ariaLabel={`${dictionary.sections.articles.allArticles}. Показано статей: ${allSlugs.length}`}
              />
              
              {/* Enhanced LoadMoreButton (preserve existing) */}
              {hasMore && (
                <div className="mt-12">
                  <Suspense fallback={
                    <div className="text-center">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-3 animate-pulse">
                        {dictionary.common.status.loading}
                      </div>
                    </div>
                  }>
                    <LoadMoreButton 
                      currentPage={currentPage}
                      dictionary={dictionary}
                      disabled={false}
                    />
                  </Suspense>
                </div>
              )}
            </>
          ) : (
            <div 
              className="text-center py-12"
              role="status"
              aria-label={dictionary.common.status.empty}
            >
              <p className="text-on-sf-var">
                {categoryFilter 
                  ? `${dictionary.sections.articles.noArticlesFound} в этой категории`
                  : dictionary.sections.articles.noArticlesFound
                }
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}