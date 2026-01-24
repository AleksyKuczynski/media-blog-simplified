// src/app/[lang]/search/page.tsx
import { Metadata } from 'next';
import SearchTips from '@/features/search/page/SearchTips';
import SearchBarForm from '@/features/search/page/SearchBarForm';
import SearchResults from '@/features/search/page/SearchResults';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, ArticleSlugInfo, ITEMS_PER_PAGE } from '@/api/directus';
import { SearchSchema } from '@/shared/seo/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/shared/seo/metadata/SearchMetadata';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import { RubricCardData } from '@/features/shared/CardCarousel/types';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';
import { ActionLink } from '@/shared/primitives/ActionLink';
import RubricsCarouselSection from '@/features/rubric-display/RubricsCarouselSection';
import { transformRubricsToCarousel } from '@/api/directus/transformToCarouselCards';
import AuthorsCarouselSection from '@/features/author-display/AuthorsCarouselSection';

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

  // Fetch search results if valid query
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

  // Determine search results mode
  let resultsMode: 'results' | 'no-results' | 'invalid-query' | null = null;
  if (hasInvalidQuery) {
    resultsMode = 'invalid-query';
  } else if (hasValidQuery && !hasResults) {
    resultsMode = 'no-results';
  } else if (hasResults) {
    resultsMode = 'results';
  }

  return (
    <>
      <SearchSchema
        dictionary={dictionary}
        query={searchQuery}
        resultCount={totalCount}
      />

      <Section 
        title={dictionary.search.templates.pageTitle}
        titleLevel="h1"
        hasNextSectionTitle={true}
      >
        <SearchTips dictionary={dictionary} />

        <div className="mb-8">
          <SearchBarForm
            dictionary={dictionary}
            lang={lang}
            currentQuery={searchQuery}
          />
        </div>

        {isEmptyState && dictionary.search.hub && (
          <div 
            className="text-center py-8 mb-8"
            role="status"
          >
            <p className="text-lg text-on-sf-var">
              {dictionary.search.hub.emptyStateMessage}
            </p>
          </div>
        )}

        {resultsMode && (
          <SearchResults
            dictionary={dictionary}
            lang={lang}
            searchQuery={searchQuery}
            slugs={currentPageSlugs}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={currentPage}
            currentSort={currentSort}
            mode={resultsMode}
          />
        )}
      </Section>

      <RandomArticlesSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.sections.rubrics.readMoreAbout}
        variant="secondary"
        limit={6}
      />

      <RubricsCarouselSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.search.hub.browseCategories}
        variant="primary"
      />

      <AuthorsCarouselSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.sections.authors.ourAuthors}
        variant="tertiary"
      />
    </>
  );
}