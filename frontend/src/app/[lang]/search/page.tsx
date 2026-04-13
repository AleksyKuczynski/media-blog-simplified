// src/app/[lang]/search/page.tsx
import { Metadata } from 'next';
import SearchResults from '@/features/search/page/SearchResults';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchUnifiedSearch, UnifiedSearchResults } from '@/api/directus/fetchUnifiedSearch';
import { SearchSchema } from '@/shared/seo/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/shared/seo/metadata/SearchMetadata';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';
import RubricsCarouselSection from '@/features/rubric-display/RubricsCarouselSection';
import AuthorsCarouselSection from '@/features/author-display/AuthorsCarouselSection';
import SearchPageWrapper from '@/features/search/page/SearchPageWrapper';
import { Suspense } from 'react';
import { CardCarouselSkeleton } from '@/features/shared/CardCarousel/CardCarouselSkeleton';

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
  
  let searchResults: UnifiedSearchResults = {
    articles: [],
    authors: [],
    categories: [],
    totalArticles: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalResults: 0,
    hasMore: false
  };

  // Fetch search results if valid query
  if (hasValidQuery) {
    try {
      searchResults = await fetchUnifiedSearch(searchQuery, lang, currentPage, currentSort);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  const hasResults = searchResults.totalResults > 0;

  // Determine search results mode
  let resultsMode: 'results' | 'no-results' | 'invalid-query' | null = null;
  if (hasInvalidQuery) {
    resultsMode = 'invalid-query';
  } else if (hasValidQuery && !hasResults) {
    resultsMode = 'no-results';
  } else if (hasResults) {
    resultsMode = 'results';
  }

  // Calculate total pages based on articles (paginated section)
  const RESULTS_PER_PAGE = 10;
  const totalPages = Math.ceil(searchResults.totalArticles / RESULTS_PER_PAGE);

  return (
    <>
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={searchResults.totalResults}
      />

      <h1 className="sr-only">{dictionary.search.templates.pageTitle}</h1>

      <SearchPageWrapper
        dictionary={dictionary}
        lang={lang}
        currentQuery={searchQuery}
        hasResults={hasResults}
        showSorting={hasResults && searchResults.totalArticles >= 2}
        resultsMode={resultsMode}
      >
        {resultsMode && (
          <Section 
            title={dictionary.search.labels.results}
            titleLevel="h2"
            hasNextSectionTitle={true}
            flexGrow={true}
          >
            <SearchResults
              dictionary={dictionary}
              lang={lang}
              searchQuery={searchQuery}
              articles={searchResults.articles}
              authors={searchResults.authors}
              categories={searchResults.categories}
              totalArticles={searchResults.totalArticles}
              totalAuthors={searchResults.totalAuthors}
              totalCategories={searchResults.totalCategories}
              totalPages={totalPages}
              currentPage={currentPage}
              currentSort={currentSort}
              mode={resultsMode}
            />
          </Section>
        )}

        <Suspense fallback={
          <Section 
            title={dictionary.sections.authors.ourAuthors}
            variant="secondary" 
            hasNextSectionTitle={true}
          >
            <CardCarouselSkeleton 
              cardCount={6}
              cardType="author"
              ariaLabel={dictionary.common.status.loading}
            />
          </Section>
        }>
          <RandomArticlesSection
            lang={lang}
            dictionary={dictionary}
            title={dictionary.sections.rubrics.readMoreAbout}
            variant="secondary"
            limit={6}
          />
        </Suspense>

        <Suspense fallback={
          <Section 
            title={dictionary.sections.authors.ourAuthors}
            variant="primary" 
            hasNextSectionTitle={true}
          >
            <CardCarouselSkeleton 
              cardCount={6}
              cardType="author"
              ariaLabel={dictionary.common.status.loading}
            />
          </Section>
        }>
          <RubricsCarouselSection
            lang={lang}
            dictionary={dictionary}
            title={dictionary.search.hub.browseCategories}
            variant="primary"
          />
        </Suspense>

        <Suspense fallback={
          <Section 
            title={dictionary.sections.authors.ourAuthors}
            variant="tertiary" 
            hasNextSectionTitle={true}
          >
            <CardCarouselSkeleton 
              cardCount={6}
              cardType="author"
              ariaLabel={dictionary.common.status.loading}
            />
          </Section>
        }>
          <AuthorsCarouselSection
            lang={lang}
            dictionary={dictionary}
            title={dictionary.sections.authors.ourAuthors}
            variant="tertiary"
          />
        </Suspense>

      </SearchPageWrapper>
    </>
  );
}