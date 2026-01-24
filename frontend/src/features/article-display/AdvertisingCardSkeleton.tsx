// src/main/components/ArticleCards/AdvertisingCardSkeleton.tsx

import { cn } from '@/lib/utils/cn';
import { ADVERTISING_CARD_SKELETON_STYLES } from './articles.styles';

export function AdvertisingCardSkeleton() {
  return (
    <article 
      className={ADVERTISING_CARD_SKELETON_STYLES.base}
      role="status"
      aria-label="Loading sponsored content..."
    >
      <div className={ADVERTISING_CARD_SKELETON_STYLES.content}>
        {/* Title skeleton - 2 lines */}
        <div className={ADVERTISING_CARD_SKELETON_STYLES.title} />
        <div className={ADVERTISING_CARD_SKELETON_STYLES.titleSecond} />
        
        {/* Description skeleton - 4 lines */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className={ADVERTISING_CARD_SKELETON_STYLES.description} />
          <div className={cn(ADVERTISING_CARD_SKELETON_STYLES.description, 'w-5/6')} />
          <div className={cn(ADVERTISING_CARD_SKELETON_STYLES.description, 'w-4/5')} />
          <div className={cn(ADVERTISING_CARD_SKELETON_STYLES.description, 'w-3/5')} />
        </div>
        
        {/* Button skeleton */}
        <div className={ADVERTISING_CARD_SKELETON_STYLES.buttonContainer}>
          <div className={ADVERTISING_CARD_SKELETON_STYLES.button} />
        </div>
      </div>
      
      <span className="sr-only">Loading sponsored content...</span>
    </article>
  );
}