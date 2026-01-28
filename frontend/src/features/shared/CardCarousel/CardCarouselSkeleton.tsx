// src/features/shared/CardCarousel/CardCarouselSkeleton.tsx

import { getCarouselStyles } from './carousel.styles';
import { RubricCarouselCardSkeleton } from './RubricCarouselCardSkeleton';
import { AuthorCarouselCardSkeleton } from './AuthorCarouselCardSkeleton';

interface CardCarouselSkeletonProps {
  cardCount?: number;
  cardType?: 'article' | 'rubric' | 'author';
  ariaLabel?: string;
}

export function CardCarouselSkeleton({ 
  cardCount = 4,
  cardType = 'rubric',
  ariaLabel = 'Loading carousel...'
}: CardCarouselSkeletonProps) {
  const CAROUSEL_STYLES = getCarouselStyles(cardType);
  
  return (
    <div 
      className={CAROUSEL_STYLES.wrapper}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={CAROUSEL_STYLES.scrollContainer}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <div 
            key={index} 
            className={CAROUSEL_STYLES.cardWrapper}
          >
            {cardType === 'rubric' && <RubricCarouselCardSkeleton />}
            {cardType === 'author' && <AuthorCarouselCardSkeleton />}
          </div>
        ))}
      </div>
      
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}