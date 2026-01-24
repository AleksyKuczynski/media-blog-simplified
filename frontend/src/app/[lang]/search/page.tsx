// src/app/[lang]/search/page.tsx
import { Metadata } from 'next';
import SearchTips from '@/features/search/page/SearchTips';
import SearchBarForm from '@/features/search/page/SearchBarForm';
import SearchResults from '@/features/search/page/SearchResults';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchAllRubrics, fetchArticleCard, DIRECTUS_URL, ArticleSlugInfo, Rubric, ITEMS_PER_PAGE } from '@/api/directus';
import { SearchSchema } from '@/shared/seo/schemas/SearchSchema';
import { generateSearchMetadataSimple } from '@/shared/seo/metadata/SearchMetadata';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import { ArticleCardData } from '@/features/shared/CardCarousel/types';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';
import { ActionLink } from '@/shared/primitives/ActionLink';

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
  let carouselCards: ArticleCardData[] = [];
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
    
    const recentSlugs = recentResult.slugs;
    rubrics = allRubrics;

    // Transform recent slugs to ArticleCardData format for CardCarousel
    if (recentSlugs.length > 0) {
      const articleCardsPromises = recentSlugs.map(s => fetchArticleCard(s.slug, lang));
      const articleCards = await Promise.all(articleCardsPromises);

      carouselCards = articleCards
        .filter(article => article !== null)
        .map(article => {
          const formattedDate = new Date(article!.published_at).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const imageSrc = article!.article_heading_img 
            ? `${DIRECTUS_URL}/assets/${article!.article_heading_img}`
            : undefined;

          return {
            type: 'article' as const,
            slug: article!.slug,
            title: article!.translations[0]?.title || '',
            publishedAt: article!.published_at,
            rubricSlug: article!.rubric_slug || 'articles',
            imageSrc,
            formattedDate,
          };
        });
    }
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

      <Section 
        title={dictionary.search.hub.exploreHeading}
        titleLevel="h2"
        hasNextSectionTitle={true}
        variant="primary"
      >
        <RandomArticlesSection
          lang={lang}
          dictionary={dictionary}
          limit={6}
        />

        <ActionLink 
          href={`/${lang}/articles`}
        >
          {dictionary.sections.home.viewAllArticles}
        </ActionLink>
      </Section>

      {transformedRubrics.length > 0 && dictionary.search.hub && (
        <Section 
          title={dictionary.search.hub.browseCategories}
          titleLevel="h2"
          variant="tertiary"
          hasNextSectionTitle={true}
        >

          {/* Carousel */}
          <CardCarousel
            cards={transformedRubrics.map(rubric => {
              const iconField = rubric.nav_icon || rubric.icon;
              const iconSrc = iconField ? `${DIRECTUS_URL}/assets/${iconField}` : undefined;

              return {
                type: 'rubric' as const,
                slug: rubric.slug,
                name: rubric.name,
                description: rubric.description,
                iconSrc,
                url: rubric.url,
                articleCount: rubric.articleCount,
              };
            })}
            lang={lang}
            dictionary={dictionary}
          />

          <ActionLink 
            href={`/${lang}/rubrics`}
            variant="primary"
          >
            {dictionary.sections.home.viewAllRubrics}
          </ActionLink>
        </Section>
      )}
    </>
  );
}