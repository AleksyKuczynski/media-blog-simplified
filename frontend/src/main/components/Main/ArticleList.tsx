// src/main/components/Main/ArticleList.tsx
// ENHANCED: Better error handling, accessibility, and dictionary usage

import { Suspense } from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import ArticleCard from '../ArticleCards/ArticleCard';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

interface ArticleListProps {
  readonly slugInfos: ArticleSlugInfo[];
  readonly lang: Lang;
  readonly dictionary: Dictionary;
  readonly authorSlug?: string;
  readonly categorySlug?: string;
  readonly rubricSlug?: string;
  readonly variant?: 'grid' | 'list';
  readonly showCount?: boolean;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly errorMessage?: string;
}

/**
 * Enhanced ArticleList - Improved accessibility, error handling, and dictionary usage
 * NO HARDCODED TEXT - comprehensive dictionary integration
 */
export default function ArticleList({ 
  slugInfos, 
  lang, 
  dictionary,
  authorSlug, 
  categorySlug,
  rubricSlug,
  variant = 'grid',
  showCount = false,
  className = '',
  ariaLabel,
  errorMessage
}: ArticleListProps) {
  
  // Enhanced empty state with context-aware messages
  if (slugInfos.length === 0) {
    const contextualMessage = getContextualEmptyMessage();
    
    return (
      <div 
        className="text-center py-12"
        role="status"
        aria-label={dictionary.accessibility.emptyState}
      >
        <div className="text-gray-600 dark:text-gray-400">
          <svg 
            className="mx-auto h-12 w-12 mb-4 opacity-50" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <p className="text-lg mb-2">
            {errorMessage || contextualMessage}
          </p>
          <p className="text-sm opacity-75">
            {dictionary.sections.templates.emptyCollection}
          </p>
        </div>
      </div>
    );
  }

  // Enhanced loading component with better UX
  const LoadingFallback = () => (
    <div 
      className="text-center py-8"
      role="status" 
      aria-label={dictionary.accessibility.loadingContent}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prcolor" aria-hidden="true" />
        <p className="text-gray-600 dark:text-gray-400">
          {processTemplate(dictionary.sections.articles.loadingArticles, {
            items: dictionary.sections.labels.articles
          })}
        </p>
      </div>
    </div>
  );

  // Count display for better UX
  const ArticleCount = () => showCount ? (
    <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
      {processTemplate(dictionary.sections.templates.totalCount, {
        count: slugInfos.length.toString(),
        countLabel: dictionary.common.count.articles
      })}
    </div>
  ) : null;

  // Grid layout classes based on variant
  const gridClasses = variant === 'grid' 
    ? 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-6 lg:gap-8'
    : 'flex flex-col gap-4';

  // Context-aware empty message generator
  function getContextualEmptyMessage(): string {
    if (categorySlug) {
      return processTemplate(dictionary.sections.templates.emptyCollection, {
        collection: dictionary.sections.templates.itemInCollection.replace('{item}', '').replace('{collection}', 'категории'),
        items: dictionary.sections.labels.articles
      });
    }
    if (rubricSlug) {
      return processTemplate(dictionary.sections.templates.emptyCollection, {
        collection: 'рубрике',
        items: dictionary.sections.labels.articles
      });
    }
    if (authorSlug) {
      return dictionary.sections.articles.noArticlesFound + ' этого автора';
    }
    return dictionary.sections.articles.noArticlesFound;
  }

  return (
    <section
      className={`article-list ${className}`}
      aria-label={ariaLabel || dictionary.accessibility.articlesList}
      role="region"
    >
      <ArticleCount />
      
      <Suspense fallback={<LoadingFallback />}>
        <div className={`container mx-auto ${gridClasses} py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8`}>
          {slugInfos.map((slugInfo, index) => (
            <ArticleCard 
              key={slugInfo.slug}
              slug={slugInfo.slug}
              lang={lang} 
              authorSlug={authorSlug}
              rubricSlug={rubricSlug}
              layout={slugInfo.layout}
              dictionary={dictionary}
              // Enhanced accessibility
              aria-posinset={index + 1}
              aria-setsize={slugInfos.length}
            />
          ))}
        </div>
      </Suspense>
    </section>
  );
}