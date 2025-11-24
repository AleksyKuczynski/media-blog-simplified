// src/app/[lang]/search/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getDictionary, type Lang } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import Section from '@/main/components/Main/Section';
import Breadcrumbs from '@/main/components/Navigation/Breadcrumbs/Breadcrumbs';
import SearchBarClient from '@/main/components/Search/SearchBarClient';
import SearchResultsHeader from '@/main/components/Search/SearchResultsHeader';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import { fetchArticleSlugs, fetchRubricBasics } from '@/main/lib/directus';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  params: Promise<{ lang: string }>;
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
  
  let allSlugs: ArticleSlugInfo[] = [];
  let hasMore = false;
  let hasResults = false;

  if (hasValidQuery) {
    try {
      for (let page = 1; page <= currentPage; page++) {
        const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
          page,
          currentSort,
          '',
          searchQuery,
          []
        );
        allSlugs = [...allSlugs, ...slugs];
        hasMore = pageHasMore;
        if (!pageHasMore) break;
      }
      hasResults = allSlugs.length > 0;
    } catch (error) {
      console.error('Search results fetching failed:', error);
    }
  }

  const rubricBasics = await fetchRubricBasics(lang as Lang);

  const isEmptyState = !searchQuery;
  const isResultsState = hasValidQuery && hasResults;
  const isNoResultsState = hasValidQuery && !hasResults;

  const breadcrumbItems = [
    {
      label: dictionary.navigation.labels.home,
      href: `/${lang}`,
    },
    {
      label: dictionary.search.templates.pageTitle,
      href: `/${lang}/search`,
    },
  ];
  
  return (
    <>
      {/* Schema Markup */}
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={hasResults ? allSlugs.length : undefined}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang={lang as Lang}
        translations={{
          home: dictionary.navigation.labels.home,
          allRubrics: dictionary.navigation.labels.rubrics,
          allAuthors: dictionary.navigation.labels.authors,
        }}
      />

      {/* Main Search Section */}
      <Section
        className="py-8 min-h-[60vh]"
        ariaLabel={dictionary.search.accessibility.searchLabel}
      >
        <div className="container mx-auto px-4">
          
          {/* Page Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-on-sf">
              {dictionary.search.templates.pageTitle}
            </h1>
            <p className="text-lg text-on-sf-var max-w-2xl mx-auto">
              {dictionary.search.templates.pageDescription}
            </p>
          </header>

          {/* Search Bar - Always Visible */}
          <div className="max-w-2xl mx-auto mb-12">
            <Suspense fallback={
              <div className="h-12 bg-sf-hi rounded-lg animate-pulse" />
            }>
              <SearchBarClient
                dictionary={dictionary}
                lang={lang as Lang}
                className="w-full"
              />
            </Suspense>
          </div>

          {/* Invalid Query Warning */}
          {hasInvalidQuery && (
            <div 
              className="max-w-2xl mx-auto mb-8 p-4 bg-warning/10 border border-warning/20 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <p className="text-on-warning text-center">
                {dictionary.search.labels.minCharacters}
              </p>
            </div>
          )}

          {/* Content States */}
          
          {/* STATE 1: Empty State - No Query */}
          {isEmptyState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-label={dictionary.search.labels.noResults}
            >
              <div className="max-w-md mx-auto">
                <svg 
                  className="mx-auto h-16 w-16 text-on-sf-var mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <h2 className="text-xl font-semibold text-on-sf mb-2">
                  {dictionary.search.labels.noResults}
                </h2>
                <p className="text-on-sf-var">
                  {dictionary.search.labels.placeholder}
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: No Results */}
          {isNoResultsState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <div className="max-w-md mx-auto">
                <svg 
                  className="mx-auto h-16 w-16 text-on-sf-var mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h2 className="text-xl font-semibold text-on-sf mb-2">
                  {dictionary.search.labels.noResults}
                </h2>
                <p className="text-on-sf-var mb-4">
                  {processTemplate(dictionary.search.templates.resultsFor, {
                    query: searchQuery
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dictionary.search.labels.noResults}
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: Results - Valid query with matches */}
          {isResultsState && (
            <Section 
              className="py-0"
              ariaLabel={processTemplate(dictionary.search.templates.resultsFor, {
                query: searchQuery
              })}
            >
              <div className="space-y-6">
                {/* Results Header with Count and Sorting */}
                <SearchResultsHeader
                  dictionary={dictionary}
                  searchQuery={searchQuery}
                  resultsCount={allSlugs.length}
                  currentSort={currentSort}
                  lang={lang as Lang}
                />

                {/* Results List */}
                <ArticleList 
                  slugInfos={allSlugs}
                  dictionary={dictionary}
                  lang={lang as Lang}
                />

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <LoadMoreButton 
                      dictionary={dictionary}
                      currentPage={currentPage}
                    />
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>
      </Section>
    </>
  );
}