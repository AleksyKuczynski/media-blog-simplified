// src/app/ru/(with-filter)/articles/page.tsx
// EXAMPLE: How to properly use enhanced ArticleList and LoadMoreButton with dictionary

import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import HeroArticles from '@/main/components/Main/HeroArticles';
import { getDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus';
import { generatePageMetadata } from '@/main/components/SEO/metadata/PageMetadata';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';

interface ArticlesPageProps {
  searchParams: { 
    page?: string; 
    sort?: string;
    category?: string;
  };
}

// Generate metadata using new SEO system
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary('ru');
  
  return await generatePageMetadata({
    dictionary,
    pageType: 'articles',
    pageData: {
      title: dictionary.sections.articles.allArticles,
      description: 'Все статьи о культурных событиях, музыке и современных идеях',
      path: '/ru/articles',
    },
  });
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  // Get dictionary first
  const dictionary = await getDictionary('ru');
  
  // Parse parameters
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';
  const categoryFilter = searchParams.category;
  
  // Default view logic
  const isDefaultView = currentPage === 1 && !categoryFilter && currentSort === 'desc';
  
  // Fetch articles for all pages up to current
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  let heroSlugs: ArticleSlugInfo[] = [];
  
  try {
    // Get hero articles for default view
    if (isDefaultView) {
      const heroResponse = await fetchArticleSlugs(1, 'desc', categoryFilter, undefined, ['featured']);
      heroSlugs = heroResponse.slugs.slice(0, 3);
    }

    // Get regular articles
    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        currentSort,
        categoryFilter
      );
      
      // Filter out hero articles from regular list on default view
      const filteredSlugs = isDefaultView && page === 1 
        ? slugs.filter(slug => !heroSlugs.some(hero => hero.slug === slug.slug))
        : slugs;
        
      allSlugs = [...allSlugs, ...filteredSlugs];
      hasMore = pageHasMore;
      
      if (!pageHasMore) break;
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Handle error state gracefully
  }

  return (
    <>
      {/* Hero Section for Default View */}
      {isDefaultView && heroSlugs.length > 0 && (
        <Section
          title={dictionary.sections.articles.featuredArticles}
          className="py-8"
          ariaLabel={dictionary.sections.articles.featuredArticles}
        >
          <Suspense fallback={
            <div className="text-center py-8" role="status">
              {dictionary.common.status.loading}
            </div>
          }>
            {heroSlugs.length > 0 ? (
              <HeroArticles 
                heroSlugs={heroSlugs} 
                lang="ru"
                dictionary={dictionary}
              />
            ) : (
              <div className="text-center py-4 text-gray-600">
                {dictionary.sections.articles.noFeaturedArticles}
              </div>
            )}
          </Suspense>
        </Section>
      )}

      {/* Main Articles Section */}
      <Section 
        isOdd={!isDefaultView || heroSlugs.length === 0}
        title={isDefaultView 
          ? dictionary.sections.articles.latestArticles 
          : dictionary.sections.articles.allArticles
        }
        ariaLabel={isDefaultView 
          ? dictionary.sections.articles.latestArticles 
          : dictionary.sections.articles.allArticles
        }
      >
        {allSlugs.length > 0 ? (
          <>
            {/* Enhanced ArticleList with proper dictionary usage */}
            <ArticleList 
              slugInfos={allSlugs} 
              lang="ru" 
              dictionary={dictionary}
              categorySlug={categoryFilter}
              showCount={true}
              ariaLabel={`${dictionary.sections.articles.allArticles}. Показано статей: ${allSlugs.length}`}
            />
            
            {/* Enhanced LoadMoreButton with dictionary */}
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
            aria-label={dictionary.accessibility.emptyState}
          >
            <p className="text-gray-600 dark:text-gray-400">
              {categoryFilter 
                ? `${dictionary.sections.articles.noArticlesFound} в этой категории`
                : dictionary.sections.articles.noArticlesFound
              }
            </p>
          </div>
        )}
      </Section>
    </>
  );
}