// src/app/[lang]/search/page.tsx
// FIXED: Uses totalCount, proper totalPages

import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchResultsClient from '@/main/components/Search/SearchResultsClient';
import Section from '@/main/components/Main/Section';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs, fetchRubricBasics } from '@/main/lib/directus';
import { ITEMS_PER_PAGE } from '@/main/lib/directus/directusConstants';
import { SearchSchema } from '@/main/components/SEO/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/main/components/SEO/metadata/SearchMetadata';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';
import Breadcrumbs from '@/main/components/Navigation/Breadcrumbs/Breadcrumbs';

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
  
  // FIXED: Get totalCount
  let currentPageSlugs: ArticleSlugInfo[] = [];
  let totalCount = 0;
  let hasResults = false;
  let totalPages = 1;

  if (hasValidQuery) {
    try {
      const result = await fetchArticleSlugs(
        currentPage,
        currentSort,
        '',
        searchQuery,
        []
      );
      currentPageSlugs = result.slugs;
      totalCount = result.totalCount;
      hasResults = currentPageSlugs.length > 0;
      totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
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
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={totalCount}
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

      <Section
        ariaLabel={dictionary.search.labels.results}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="text-center py-8" role="status">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prcolor" />
                <p className="text-on-sf-var">{dictionary.common.status.loading}</p>
              </div>
            </div>
          }>
            <SearchResultsClient
              dictionary={dictionary}
              allSlugs={currentPageSlugs}
              lang={lang}
              searchQuery={searchQuery}
              currentPage={currentPage}
              currentSort={currentSort}
              totalCount={totalCount}
              totalPages={totalPages}
              isEmptyState={isEmptyState}
              isResultsState={isResultsState}
              isNoResultsState={isNoResultsState}
              hasInvalidQuery={hasInvalidQuery}
            />
          </Suspense>
        </div>
      </Section>
    </>
  );
}