// src/features/article-display/ArticleListSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { ArticleCardSkeletonVariant } from './ArticleCardVariant';
import { ARTICLE_LIST_SKELETON_STYLES } from './styles';

interface ArticleListSkeletonProps {
  variant?: 'grid' | 'list';
  count?: number;
  showCount?: boolean;
  className?: string;
}

export function ArticleListSkeleton({ 
  variant = 'grid', 
  count = 6,
  showCount = false,
  className 
}: ArticleListSkeletonProps) {
  const gridClasses = variant === 'grid' 
    ? ARTICLE_LIST_SKELETON_STYLES.container.grid
    : ARTICLE_LIST_SKELETON_STYLES.container.list;

  return (
    <section 
      className={cn(ARTICLE_LIST_SKELETON_STYLES.section, className)} 
      role="status" 
      aria-label="Loading articles..."
    >
      {/* Count skeleton */}
      {showCount && (
        <div className={ARTICLE_LIST_SKELETON_STYLES.countSkeleton} />
      )}
      
      {/* Grid skeleton */}
      <div className={cn(
        ARTICLE_LIST_SKELETON_STYLES.container.base,
        gridClasses
      )}>
        {Array.from({ length: count }, (_, index) => (
          <ArticleCardSkeletonVariant 
            key={index}
            layout="regular"
            showImage={true}
          />
        ))}
      </div>
      
      <span className={ARTICLE_LIST_SKELETON_STYLES.srOnly}>Loading articles...</span>
    </section>
  );
}