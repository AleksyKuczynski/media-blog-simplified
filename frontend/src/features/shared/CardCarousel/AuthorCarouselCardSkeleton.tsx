// src/features/shared/CardCarousel/AuthorCarouselCardSkeleton.tsx

import { AUTHOR_CAROUSEL_CARD_STYLES } from './styles';

export function AuthorCarouselCardSkeleton() {
  return (
    <div className={AUTHOR_CAROUSEL_CARD_STYLES.container}>
      <article className={AUTHOR_CAROUSEL_CARD_STYLES.card}>
        <div className={AUTHOR_CAROUSEL_CARD_STYLES.content}>
          {/* Avatar skeleton */}
          <div className={AUTHOR_CAROUSEL_CARD_STYLES.avatarWrapper}>
            <div className="w-full h-full bg-sf-hst animate-pulse" />
          </div>
          
          {/* Text content skeleton */}
          <div className={AUTHOR_CAROUSEL_CARD_STYLES.textContent}>
            {/* Name skeleton - 2 lines */}
            <div className="space-y-2">
              <div className="h-6 bg-on-sf/10 rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-on-sf/10 rounded w-1/2 mx-auto animate-pulse" />
            </div>
            
            {/* Bio skeleton (hidden, matches real card) */}
            <div className="hidden space-y-2 mt-8">
              <div className="h-4 bg-on-sf/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-on-sf/10 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-on-sf/10 rounded w-4/5 animate-pulse" />
              <div className="h-4 bg-on-sf/10 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}