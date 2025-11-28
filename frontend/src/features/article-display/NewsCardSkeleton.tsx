// src/main/components/ArticleCards/NewsCardSkeleton.tsx

import { cn } from '@/lib/utils/utils';
// ✅ Import style constants from parent component
import { NEWS_CARD_SKELETON_STYLES } from './NewsCard';

export function NewsCardSkeleton() {
  return (
    <article 
      className={NEWS_CARD_SKELETON_STYLES.base}
      role="status"
      aria-label="Loading news article..."
    >
      {/* Title skeleton - 2 lines */}
      <div className={NEWS_CARD_SKELETON_STYLES.title} />
      <div className={NEWS_CARD_SKELETON_STYLES.titleSecond} />
      
      {/* Date skeleton */}
      <div className={NEWS_CARD_SKELETON_STYLES.date} />
      
      {/* Description skeleton - 3 lines */}
      <div className="space-y-1 mb-3">
        <div className={NEWS_CARD_SKELETON_STYLES.description} />
        <div className={cn(NEWS_CARD_SKELETON_STYLES.description, 'w-5/6')} />
        <div className={cn(NEWS_CARD_SKELETON_STYLES.description, 'w-3/4')} />
      </div>
      
      {/* Read more skeleton */}
      <div className={NEWS_CARD_SKELETON_STYLES.readMore} />
      
      <span className="sr-only">Loading news article...</span>
    </article>
  );
}