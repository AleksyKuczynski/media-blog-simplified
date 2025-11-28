// src/main/components/ArticleCards/StandardCardSkeleton.tsx

import { cn } from '@/lib/utils/utils';
// ✅ Import from StandardCard where styling logic lives
import { STANDARD_CARD_SKELETON_STYLES } from './StandardCard';

interface StandardCardSkeletonProps {
  layout?: 'regular' | 'promoted' | 'latest';
  showImage?: boolean;
  className?: string;
}

export function StandardCardSkeleton({ 
  layout = 'regular', 
  showImage = true,
  className 
}: StandardCardSkeletonProps) {
  return (
    <div 
      className={cn(
        STANDARD_CARD_SKELETON_STYLES.base, 
        STANDARD_CARD_SKELETON_STYLES.layouts[layout], 
        className
      )}
      role="status"
      aria-label="Loading article..."
    >
      {/* Image skeleton */}
      {showImage && (
        <div className={STANDARD_CARD_SKELETON_STYLES.image[layout]} />
      )}
      
      {/* Content skeleton */}
      <div className={STANDARD_CARD_SKELETON_STYLES.content[layout]}>
        {/* Title skeleton - 2 lines */}
        <div className={STANDARD_CARD_SKELETON_STYLES.title} />
        <div className={STANDARD_CARD_SKELETON_STYLES.titleSecond} />
        
        {/* Date skeleton */}
        <div className={STANDARD_CARD_SKELETON_STYLES.date} />
        
        {/* Description skeleton - 3 lines */}
        <div className="space-y-1 mb-4">
          <div className={STANDARD_CARD_SKELETON_STYLES.description} />
          <div className={cn(STANDARD_CARD_SKELETON_STYLES.description, 'w-5/6')} />
          <div className={cn(STANDARD_CARD_SKELETON_STYLES.description, 'w-4/5')} />
        </div>
        
        {/* Read more skeleton */}
        <div className="flex justify-end">
          <div className={STANDARD_CARD_SKELETON_STYLES.readMore} />
        </div>
      </div>
      
      <span className="sr-only">Loading article...</span>
    </div>
  );
}