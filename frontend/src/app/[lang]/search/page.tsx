// src/app/[lang]/search/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import ArticleList from '@/main/components/Main/ArticleList';
import Pagination from '@/main/components/Main/Pagination';
import SearchResultsHeader from '@/main/components/Search/SearchResultsHeader';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { ITEMS_PER_PAGE } from '@/main/lib/directus/directusConstants';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';

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
  
  let currentPageSlugs: ArticleSlugInfo[] = [];
  let totalCount = 0;
  let totalPages = 1;

  if (hasValidQuery) {
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

  const hasResults = currentPageSlugs.length > 0;
  const isEmptyState = !searchQuery;
  const isNoResultsState = hasValidQuery && !hasResults;

  return (
    <>
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={totalCount}
      />

      <Section
        ariaLabel={dictionary.search.accessibility.searchResultsLabel}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          {isEmptyState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-label={dictionary.search.accessibility.openSearch}
            >
              <h1 className="text-2xl font-bold mb-4 text-on-sf">
                {dictionary.search.labels.title}
              </h1>
              <p className="text-on-sf-var">
                {dictionary.search.accessibility.openSearch}
              </p>
            </div>
          )}

          {hasInvalidQuery && (
            <div 
              className="text-center py-12"
              role="alert"
              aria-live="polite"
            >
              <h1 className="text-2xl font-bold mb-4 text-on-sf">
                {dictionary.search.labels.results}
              </h1>
              <p className="text-on-sf-var">
                {dictionary.search.labels.minCharacters}
              </p>
            </div>
          )}

          {isNoResultsState && (
            <div 
              className="text-center py-12"
              role="status"
              aria-live="polite"
            >
              <h1 className="text-2xl font-bold mb-4 text-on-sf">
                {dictionary.search.labels.noResults}
              </h1>
              <p className="text-on-sf-var">
                {dictionary.search.labels.noResults}
              </p>
            </div>
          )}

          {hasResults && (
            <section 
              className="space-y-6"
              role="region"
              aria-label={dictionary.search.accessibility.searchResultsLabel}
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
                  className="space-y-6"
                />
              </Suspense>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  dictionary={dictionary}
                />
              )}
            </section>
          )}
        </div>
      </Section>
    </>
  );
}