// src/features/search/page/SearchResults.tsx
import { Suspense } from 'react';
import Pagination from '@/shared/ui/Pagination';
import { Dictionary, Lang } from '@/config/i18n';
import { ArticleSearchResult, AuthorSearchResult, CategorySearchResult } from '@/api/directus';
import ArticleList from '@/features/article-display/ArticleList';
import AuthorResultCard from './AuthorResultCard';
import CategoryResultCard from './CategoryResultCard';
import { SEARCH_PAGE_STYLES, SEARCH_RESULTS_HEADER_STYLES, SEARCH_RESULTS_SECTION_STYLES } from '../search.styles';
import { processTemplate } from '@/config/i18n/helpers/templates';
import SortingControl from '@/features/navigation/Filter/SortingControl';

interface SearchResultsProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly searchQuery: string;
  readonly articles: ArticleSearchResult[];
  readonly authors: AuthorSearchResult[];
  readonly categories: CategorySearchResult[];
  readonly totalArticles: number;
  readonly totalAuthors: number;
  readonly totalCategories: number;
  readonly totalResults: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly currentSort: string;
  readonly mode: 'results' | 'no-results' | 'invalid-query';
}

const sectionStyles = SEARCH_RESULTS_SECTION_STYLES;

// src/features/search/page/SearchResults.tsx

export default function SearchResults({
  dictionary,
  lang,
  searchQuery,
  articles,
  authors,
  categories,
  totalArticles,
  totalAuthors,
  totalCategories,
  totalResults,
  totalPages,
  currentPage,
  currentSort,
  mode,
}: SearchResultsProps) {
  if (mode === 'invalid-query') {
    return (
      <div 
        className={SEARCH_PAGE_STYLES.results.invalidState}
        role="alert"
        aria-live="polite"
      >
        <p className={SEARCH_PAGE_STYLES.results.stateText}>
          {dictionary.search.labels.minCharacters}
        </p>
      </div>
    );
  }

  if (mode === 'no-results') {
    return (
      <div 
        className={SEARCH_PAGE_STYLES.results.emptyState}
        role="status"
        aria-live="polite"
      >
        <h2 className={SEARCH_PAGE_STYLES.results.emptyTitle}>
          {dictionary.search.labels.noResults}
        </h2>
        <p className={SEARCH_PAGE_STYLES.results.emptyDescription}>
          {dictionary.search.hub.noResultsSuggestion}
        </p>
      </div>
    );
  }

  const articleSlugs = articles.map(article => ({
    slug: article.slug,
    rubric_slug: article.rubric_slug,
    layout: 'regular' as const,
    published_at: new Date().toISOString(),
    translations: [{
      languages_code: article.languages_code,
      title: article.title,
      local_slug: article.slug
    }]
  }));

  // Show sorting only if there are 2+ articles
  const showSorting = totalArticles >= 2;

  return (
    <>
      {/* Results summary without sorting */}
      <div className={SEARCH_RESULTS_HEADER_STYLES.container}>
        <div className={SEARCH_RESULTS_HEADER_STYLES.textContainer}>
          <h2 
            id="search-results-heading"
            className={`${SEARCH_RESULTS_HEADER_STYLES.title} sr-only`}
          >
            {processTemplate(dictionary.search.templates.resultsFor, { query: searchQuery })}
          </h2>
          <p 
            className={SEARCH_RESULTS_HEADER_STYLES.count}
            aria-live="polite"
          >
            {[
              totalArticles > 0 && `${dictionary.common.count.articles}: ${totalArticles}`,
              totalAuthors > 0 && `${dictionary.common.count.authors}: ${totalAuthors}`,
              totalCategories > 0 && `${dictionary.common.count.categories}: ${totalCategories}`
            ].filter(Boolean).join(', ')}
          </p>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className={sectionStyles.container}>
          <h2 className={sectionStyles.heading}>
            {dictionary.sections.labels.categories}: {totalCategories}
          </h2>
          <div className={sectionStyles.list}>
            {categories.map((category) => (
              <CategoryResultCard
                key={category.slug}
                category={category}
                lang={lang}
                dictionary={dictionary}
              />
            ))}
          </div>
        </section>
      )}

      {/* Authors Section */}
      {authors.length > 0 && (
        <section className={sectionStyles.container}>
          <h2 className={sectionStyles.heading}>
            {dictionary.sections.labels.authors}: {totalAuthors}
          </h2>
          <div className={sectionStyles.list}>
            {authors.map((author) => (
              <AuthorResultCard
                key={author.slug}
                author={author}
                lang={lang}
                dictionary={dictionary}
              />
            ))}
          </div>
        </section>
      )}

      {/* Articles Section */}
      {articles.length > 0 && (
        <section className={sectionStyles.container}>
          <h2 className={sectionStyles.heading}>
            {dictionary.common.count.articles}: {totalArticles}
          </h2>
          {showSorting && (
            <aside 
              aria-label={dictionary.filter.accessibility.sortingControl}
              className={sectionStyles.sorting}
            >
              <SortingControl
                dictionary={dictionary}
                currentSort={currentSort}
                variant="search"
              />
            </aside>
          )}

          <Suspense fallback={<div>Loading articles...</div>}>
            <ArticleList
              dictionary={dictionary}
              slugInfos={articleSlugs}
              lang={lang}
              className={SEARCH_PAGE_STYLES.results.list}
            />
          </Suspense>

          {totalPages > 1 && (
            <div className={SEARCH_PAGE_STYLES.results.pagination}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                dictionary={dictionary}
              />
            </div>
          )}
        </section>
      )}
    </>
  );
}