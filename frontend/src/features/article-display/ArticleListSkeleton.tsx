// src/features/article-display/ArticleListSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { ArticleCardSkeletonVariant } from './ArticleCardVariant';
import { ARTICLE_LIST_STYLES } from './styles';

interface ArticleListSkeletonProps {
  count?: number;
  className?: string;
  ariaLabel?: string;
}

export function ArticleListSkeleton({ 
  count = 6,
  className,
  ariaLabel = 'Loading articles...'
}: ArticleListSkeletonProps) {
  return (
    <section 
      className={cn(ARTICLE_LIST_STYLES.section, className)}
      role="status" 
      aria-label={ariaLabel}
    >
      <div className={ARTICLE_LIST_STYLES.container}>
        {Array.from({ length: count }, (_, index) => (
          <ArticleCardSkeletonVariant 
            key={index}
            layout="regular"
            showImage={true}
          />
        ))}
      </div>
      
      <span className="sr-only">{ariaLabel}</span>
    </section>
  );
}