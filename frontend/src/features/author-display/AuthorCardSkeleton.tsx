// src/main/components/Main/AuthorCardSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { AUTHOR_CARD_SKELETON_STYLES } from './AuthorCard';

interface AuthorCardSkeletonProps {
  linkToProfile?: boolean;
  className?: string;
}

export function AuthorCardSkeleton({ 
  linkToProfile = true,
  className 
}: AuthorCardSkeletonProps) {
  const SkeletonContent = () => (
    <div className={cn(AUTHOR_CARD_SKELETON_STYLES.container, className)}>
      <div className={AUTHOR_CARD_SKELETON_STYLES.grid}>
        {/* Avatar skeleton */}
        <div className={AUTHOR_CARD_SKELETON_STYLES.avatar} />
        
        {/* Name skeleton - 2 lines */}
        <div className={AUTHOR_CARD_SKELETON_STYLES.name} />
        
        {/* Bio skeleton - 4 lines */}
        <div className="sm:col-span-2 space-y-2">
          <div className={AUTHOR_CARD_SKELETON_STYLES.bio} />
          <div className={cn(AUTHOR_CARD_SKELETON_STYLES.bio, 'w-5/6')} />
          <div className={cn(AUTHOR_CARD_SKELETON_STYLES.bio, 'w-4/5')} />
          <div className={cn(AUTHOR_CARD_SKELETON_STYLES.bio, 'w-3/5')} />
        </div>
      </div>
    </div>
  );

  if (linkToProfile) {
    return (
      <div 
        className="block h-full"
        role="status"
        aria-label="Loading author..."
      >
        <SkeletonContent />
        <span className="sr-only">Loading author...</span>
      </div>
    );
  }

  return (
    <div role="status" aria-label="Loading author...">
      <SkeletonContent />
      <span className="sr-only">Loading author...</span>
    </div>
  );
}