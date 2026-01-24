// src/features/rubric-display/RubricsPageSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { COLLECTION_DESCRIPTION_STYLES } from '@/features/layout/layout.styles';
import { RUBRICS_GRID_STYLES } from './rubric.styles';

interface RubricsPageSkeletonProps {
  ariaLabel?: string;
  count?: number;
}

export function RubricsPageSkeleton({ 
  ariaLabel = 'Loading rubrics...',
  count = 8
}: RubricsPageSkeletonProps) {
  return (
    <section 
      className="container mx-auto px-4 py-8"
      role="status" 
      aria-label={ariaLabel}
    >
      {/* Title skeleton */}
      <div className="mb-6 flex justify-center">
        <div className="h-10 bg-sf-hst rounded w-64 animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className={cn(COLLECTION_DESCRIPTION_STYLES, 'space-y-2 mb-8')}>
        <div className="h-5 bg-sf-hst rounded w-full animate-pulse" />
        <div className="h-5 bg-sf-hst rounded w-4/5 animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className={RUBRICS_GRID_STYLES}>
        {Array.from({ length: count }, (_, index) => (
          <div 
            key={index}
            className={cn(
              'group relative overflow-hidden rounded-2xl',
              'bg-sf-cont shadow-sm',
              'w-full max-w-[360px] mx-auto',
              'p-8 2xl:p-8 flex flex-col'
            )}
          >
            {/* Icon skeleton */}
            <div className="relative mx-auto h-32 w-32 mb-4">
              <div className="h-full w-full bg-sf-hst rounded-lg animate-pulse" />
            </div>
            
            {/* Title skeleton */}
            <div className="mb-3 space-y-2">
              <div className="h-6 bg-sf-hst rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-sf-hst rounded w-1/2 mx-auto animate-pulse" />
            </div>
            
            {/* Description skeleton (hidden on mobile) */}
            <div className="max-md:hidden space-y-2 mb-4 flex-grow">
              <div className="h-4 bg-sf-hst rounded w-full animate-pulse" />
              <div className="h-4 bg-sf-hst rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-sf-hst rounded w-4/5 animate-pulse" />
            </div>
            
            {/* Action skeleton */}
            <div className="w-full mt-auto pt-2 flex justify-between items-center">
              <div className="h-5 bg-sf-hst rounded w-24 animate-pulse" />
              <div className="h-5 bg-sf-hst rounded w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">{ariaLabel}</span>
    </section>
  );
}