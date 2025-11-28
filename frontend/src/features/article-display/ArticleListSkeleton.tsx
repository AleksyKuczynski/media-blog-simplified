// src/main/components/Main/ArticleListSkeleton.tsx

import { cn } from '@/lib/utils/utils';
import { ArticleCardSkeletonVariant } from './ArticleCardVariant';

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
    ? 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-6 lg:gap-8'
    : 'flex flex-col gap-4';

  return (
    <section 
      className={cn('article-list', className)} 
      role="status" 
      aria-label="Loading articles..."
    >
      {/* Count skeleton */}
      {showCount && (
        <div className="mb-6">
          <div className="h-4 w-32 bg-on-sf/10 rounded animate-pulse" />
        </div>
      )}
      
      {/* Grid skeleton */}
      <div className={cn(
        'container mx-auto py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8',
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
      
      <span className="sr-only">Loading articles...</span>
    </section>
  );
}