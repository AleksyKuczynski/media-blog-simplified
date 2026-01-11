// src/features/article-display/ArticleList.tsx

import { Suspense } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import ArticleCard from './ArticleCard';
import { ArticleCardSkeletonVariant } from './ArticleCardVariant';
import { ARTICLE_LIST_STYLES } from './styles';
import { ArticleSlugInfo } from '@/api/directus';
import { processTemplate } from '@/config/i18n/helpers/templates';

interface ArticleListProps {
  readonly slugInfos: ArticleSlugInfo[];
  readonly lang: Lang;
  readonly dictionary: Dictionary;
  readonly authorSlug?: string;
  readonly categorySlug?: string;
  readonly rubricSlug?: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly errorMessage?: string;
}

export default function ArticleList({
  slugInfos,
  lang,
  rubricSlug,
  authorSlug,
  dictionary,
  errorMessage,
  className = '',
  ariaLabel
}: ArticleListProps) {
  
  // Empty state
  if (slugInfos.length === 0) {
    const contextualMessage = errorMessage || 
      processTemplate(dictionary.sections.templates.emptyCollection, {
        collection: dictionary.sections.labels.collection,
        items: dictionary.sections.labels.articles
      });

    return (
      <div className={ARTICLE_LIST_STYLES.container}>
        <div className={ARTICLE_LIST_STYLES.empty.wrapper}>
          <svg 
            className={ARTICLE_LIST_STYLES.empty.icon}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <p className={ARTICLE_LIST_STYLES.empty.title}>
            {errorMessage || contextualMessage}
          </p>
          <p className={ARTICLE_LIST_STYLES.empty.description}>
            {processTemplate(dictionary.sections.templates.emptyCollection, {
              collection: dictionary.sections.labels.collection,
              items: dictionary.sections.labels.articles
            })}
          </p>
        </div>
      </div>
    );
  }

  // Loading fallback
  const LoadingFallback = () => (
    <div 
      className={ARTICLE_LIST_STYLES.container}
      role="status" 
      aria-label={dictionary.common.status.loading}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <ArticleCardSkeletonVariant 
          key={index}
          layout="regular"
          showImage={true}
        />
      ))}
      <span className="sr-only">{dictionary.common.status.loading}</span>
    </div>
  );

  return (
    <section
      className={`${ARTICLE_LIST_STYLES.section} ${className}`}
      aria-label={ariaLabel || dictionary.sections.labels.articles}
      role="region"
    >
      <Suspense fallback={<LoadingFallback />}>
        <div className={ARTICLE_LIST_STYLES.container}>
          {slugInfos.map((slugInfo, index) => (
            <ArticleCard 
              key={slugInfo.slug}
              slug={slugInfo.slug}
              lang={lang} 
              authorSlug={authorSlug}
              rubricSlug={rubricSlug}
              layout={slugInfo.layout}
              dictionary={dictionary}
              aria-posinset={index + 1}
              aria-setsize={slugInfos.length}
            />
          ))}
        </div>
      </Suspense>
    </section>
  );
}