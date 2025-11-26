// src/app/[lang]/search/page.tsx
import { Metadata } from 'next';
import SearchTips from '@/main/components/Search/page/SearchTips';
import SearchBarForm from '@/main/components/Search/page/SearchBarForm';
import SearchResults from '@/main/components/Search/page/SearchResults';
import RubricsSection from '@/main/components/Main/RubricsSection';
import Section from '@/main/components/Main/Section';
import { RelatedArticlesCarousel } from '@/main/components/Main/RelatedArticles';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs, fetchAllRubrics } from '@/main/lib/directus';
import { ArticleSlugInfo, Rubric } from '@/main/lib/directus/directusInterfaces';
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
  let recentSlugs: ArticleSlugInfo[] = [];
  let rubrics: Rubric[] = [];

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

  // Always fetch search hub content
  try {
    const [recentResult, allRubrics] = await Promise.all([
      fetchArticleSlugs(1, 'desc', lang).then(r => ({ slugs: r.slugs.slice(0, 8) })),
      fetchAllRubrics(lang)
    ]);
    
    recentSlugs = recentResult.slugs;
    rubrics = allRubrics;
  } catch (error) {
    console.error('Error fetching search hub content:', error);
  }

  // Transform rubrics
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations?.find(t => t.languages_code === lang);
    return {
      ...rubric,
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      icon: rubric.nav_icon,
      url: `/${lang}/${rubric.slug}`,
    };
  }).slice(0, 6);

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

      <div className="container mx-auto px-4 py-8">
        
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

        {recentSlugs.length > 0 && dictionary.search.hub && (
          <Section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-on-sf text-center">
              {dictionary.search.hub.exploreHeading}
            </h2>
            <RelatedArticlesCarousel
              slugs={recentSlugs}
              dictionary={dictionary}
              lang={lang}
              showAll={true}
            />
          </Section>
        )}

        {transformedRubrics.length > 0 && dictionary.search.hub && (
          <RubricsSection
            rubrics={transformedRubrics}
            dictionary={dictionary}
            lang={lang}
            heading={dictionary.search.hub.browseCategories}
            showViewAll={true}
            className="bg-muted/30"
          />
        )}
      </div>
    </>
  );
}