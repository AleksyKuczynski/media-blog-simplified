// src/features/shared/CardCarousel/RubricCarouselCardSkeleton.tsx

import { RUBRIC_CAROUSEL_CARD_STYLES } from './carousel.styles';

export function RubricCarouselCardSkeleton() {
  return (
    <div className={RUBRIC_CAROUSEL_CARD_STYLES.container}>
      <article className={RUBRIC_CAROUSEL_CARD_STYLES.card}>
        <div className={RUBRIC_CAROUSEL_CARD_STYLES.content}>
          {/* Icon skeleton */}
          <div className={RUBRIC_CAROUSEL_CARD_STYLES.iconWrapper}>
            <div className="w-full h-full bg-sf-hst rounded-lg animate-pulse" />
          </div>
          
          {/* Text content skeleton */}
          <div className={RUBRIC_CAROUSEL_CARD_STYLES.textContent}>
            {/* Name skeleton - 2 lines */}
            <div className="space-y-2 text-center">
              <div className="h-5 bg-on-sf/10 rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-5 bg-on-sf/10 rounded w-1/2 mx-auto animate-pulse" />
            </div>
            
            {/* Description skeleton (hidden on mobile) */}
            <div className="max-md:hidden space-y-2 mt-4">
              <div className="h-4 bg-on-sf/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-on-sf/10 rounded w-5/6 animate-pulse" />
            </div>
            
            {/* Article count skeleton */}
            <div className={RUBRIC_CAROUSEL_CARD_STYLES.articleCount}>
              <div className="h-4 bg-on-sf/10 rounded w-20 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}