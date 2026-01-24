// src/features/rubric-display/RubricPageSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { ArticleCardSkeletonVariant } from '@/features/article-display/ArticleCardVariant';
import { ARTICLE_LIST_STYLES } from '@/features/article-display/articles.styles';
import { COLLECTION_DESCRIPTION_STYLES, SECTION_COUNT_STYLES } from '@/features/layout/layout.styles';

interface RubricPageSkeletonProps {
  ariaLabel?: string;
}

export function RubricPageSkeleton({ 
  ariaLabel = 'Loading rubric content...' 
}: RubricPageSkeletonProps) {
  return (
    <div role="status" aria-label={ariaLabel}>
      {/* Description skeleton */}
      <div className={cn(COLLECTION_DESCRIPTION_STYLES, 'space-y-2 mb-8')}>
        <div className="h-5 bg-sf-hst rounded w-full animate-pulse" />
        <div className="h-5 bg-sf-hst rounded w-5/6 animate-pulse" />
      </div>

      {/* Count skeleton */}
      <div className={cn(SECTION_COUNT_STYLES, 'mb-6')}>
        <div className="h-6 bg-sf-hst rounded w-32 mx-auto animate-pulse" />
      </div>

      {/* Article list skeleton */}
      <div className={ARTICLE_LIST_STYLES.container}>
        {Array.from({ length: 6 }, (_, index) => (
          <ArticleCardSkeletonVariant 
            key={index}
            layout="regular"
            showImage={true}
          />
        ))}
      </div>

      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}