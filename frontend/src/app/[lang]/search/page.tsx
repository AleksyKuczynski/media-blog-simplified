// src/app/[lang]/search/page.tsx
// UPDATED: Search Hub implementation - content-rich search landing page

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import ArticleList from '@/main/components/Main/ArticleList';
import Pagination from '@/main/components/Main/Pagination';
import SearchResultsHeader from '@/main/components/Search/page/SearchResultsHeader';
import IntegratedSearchBar from '@/main/components/Search/page/IntegratedSearchBar';
import SearchTips from '@/main/components/Search/page/SearchTips';
import RubricsSection from '@/main/components/Main/RubricsSection';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs, fetchAllRubrics } from '@/main/lib/directus';
import { ArticleSlugInfo, Rubric } from '@/main/lib/directus/directusInterfaces';
import { ITEMS_PER_PAGE } from '@/main/lib/directus/directusConstants';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';
import { RelatedArticlesCarousel } from '@/main/components/Main/RelatedArticles';

export const revalidate = 0;

interface SearchPageProps {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ 
    search?: string; 
    sort?: string; 
    page?: string;
  }>;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    return generateSearchMetadataSimple(dictionary);
  });
}

export default async function SearchPage({ 
  params,
  searchParams 
}: SearchPageProps) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';
  const searchQuery = resolvedSearchParams.search?.trim() || '';

  const hasValidQuery = searchQuery.length >= 3;
  const hasInvalidQuery = searchQuery.length > 0 && searchQuery.length < 3;
  
  // Search results data (when query exists)
  let currentPageSlugs: ArticleSlugInfo[] = [];
  let totalCount = 0;
  let totalPages = 1;

  // Search hub data (always fetched)
  let recentSlugs: ArticleSlugInfo[] = [];
  let rubrics: Rubric[] = [];

  if (hasValidQuery) {
    // Fetch search results
    try {
      const result = await fetchArticleSlugs(
        currentPage,
        currentSort,
        lang,
        '',
        searchQuery,
        []
      );
      currentPageSlugs = result.slugs;
      totalCount = result.totalCount;
      totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  // Always fetch search hub content (recent articles + rubrics)
  try {
    const [recentResult, allRubrics] = await Promise.all([
      fetchArticleSlugs(1, 'desc', lang).then(r => ({ slugs: r.slugs.slice(0, 8) })),
      fetchAllRubrics(lang).catch(error => {
        console.error('Error fetching rubrics:', error);
        return [];
      })
    ]);
    
    recentSlugs = recentResult.slugs;
    rubrics = allRubrics;
  } catch (error) {
    console.error('Error fetching search hub content:', error);
  }

  // Transform rubrics for display
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations?.find(t => t.languages_code === lang);
    return {
      ...rubric,
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      icon: rubric.nav_icon,
      url: `/${lang}/${rubric.slug}`,
    };
  }).slice(0, 6); // Show only first 6 rubrics

  const hasResults = currentPageSlugs.length > 0;
  const isEmptyState = !searchQuery;
  const isNoResultsState = hasValidQuery && !hasResults;

  const exploreHeading = dictionary.search.hub?.exploreHeading || 'Начните изучение';

  return (
    <>
      {/* Schema markup */}
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={totalCount}
      />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Search Tips - Always visible, collapsed on mobile */}
        <SearchTips dictionary={dictionary} />

        {/* Integrated Search Bar - Always visible */}
        <div className="mb-8">
          <IntegratedSearchBar
            dictionary={dictionary}
            lang={lang}
            currentQuery={searchQuery}
          />
        </div>

        {/* Empty State Message */}
        {isEmptyState && (
          <div 
            className="text-center py-8 mb-8"
            role="status"
            aria-label={dictionary.search.accessibility.openSearch}
          >
            <p className="text-lg text-on-sf-var">
              {dictionary.search.accessibility.openSearch}
            </p>
          </div>
        )}

        {/* Invalid Query Warning */}
        {hasInvalidQuery && (
          <div 
            className="text-center py-8 mb-8 bg-sf-hi rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <p className="text-on-sf-var">
              {dictionary.search.labels.minCharacters}
            </p>
          </div>
        )}

        {/* No Results Message */}
        {isNoResultsState && (
          <div 
            className="text-center py-8 mb-8 bg-sf-hi rounded-lg"
            role="status"
            aria-live="polite"
          >
            <h2 className="text-xl font-bold mb-2 text-on-sf">
              {dictionary.search.labels.noResults}
            </h2>
            <p className="text-on-sf-var">
              Попробуйте изменить запрос или изучите популярные статьи ниже
            </p>
          </div>
        )}

        {/* Search Results - When query has results */}
        {hasResults && (
          <Section
            ariaLabel={dictionary.search.accessibility.searchResultsLabel}
            className="mb-12"
          >
            <SearchResultsHeader
              dictionary={dictionary}
              searchQuery={searchQuery}
              resultsCount={totalCount}
              currentSort={currentSort}
              lang={lang}
            />

            <Suspense fallback={<div>{dictionary.common.status.loading}</div>}>
              <ArticleList
                dictionary={dictionary}
                slugInfos={currentPageSlugs}
                lang={lang}
                className="space-y-6 mt-6"
              />
            </Suspense>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  dictionary={dictionary}
                />
              </div>
            )}
          </Section>
        )}

        {/* Search Hub Content - Always visible */}
        
        {/* Recent/Featured Articles */}
        {recentSlugs.length > 0 && (
          <Section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-on-sf text-center">
              {exploreHeading}
            </h2>
            <RelatedArticlesCarousel
              slugs={recentSlugs}
              dictionary={dictionary}
              lang={lang}
              showAll={true}
            />
          </Section>
        )}

        {/* Rubrics Section */}
        {transformedRubrics.length > 0 && (
          <RubricsSection
            rubrics={transformedRubrics}
            dictionary={dictionary}
            lang={lang}
            heading={dictionary.search.hub?.browseCategories}
            showViewAll={true}
            className="bg-muted/30"
          />
        )}
      </div>
    </>
  );
}