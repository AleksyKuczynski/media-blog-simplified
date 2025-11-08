// src/main/components/Article/RelatedArticles/RelatedArticlesCarousel.tsx
// PHASE 2A: Simple vertical stack (will be transformed to horizontal carousel later)

'use client';

import RelatedArticleCard from "./RelatedArticleCard";
import { RelatedArticleCardSkeleton } from "./RelatedArticleCard";


export interface CarouselArticle {
  slug: string;
  title: string;
  publishedAt: string;
  imageId?: string;
  rubricSlug: string;
  formattedDate: string;
}

interface RelatedArticlesCarouselProps {
  articles: CarouselArticle[];
  lang: 'ru';
  isLoading?: boolean;
}

/**
 * RelatedArticlesCarousel - PHASE 2A VERSION
 * 
 * Current: Simple vertical stack for verification
 * Future: Will be transformed to horizontal scroll carousel with:
 * - Horizontal scroll with snap points
 * - Touch/swipe support
 * - Arrow navigation (desktop)
 * - Peek effect
 * 
 * For now: Just renders cards in a column to verify card design and data flow
 */
export default function RelatedArticlesCarousel({
  articles,
  lang,
  isLoading = false
}: RelatedArticlesCarouselProps) {

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <RelatedArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state - should not happen if parent handles it correctly
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div 
      className="space-y-4"
      role="list"
      aria-label="Related articles"
    >
      {articles.map((article) => (
        <div key={article.slug} role="listitem">
          <RelatedArticleCard
            slug={article.slug}
            title={article.title}
            publishedAt={article.publishedAt}
            imageId={article.imageId}
            rubricSlug={article.rubricSlug}
            formattedDate={article.formattedDate}
            lang={lang}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * TODO - PHASE 2B: Transform to horizontal carousel
 * 
 * Changes needed:
 * 1. Container: Change to horizontal scroll
 *    - overflow-x-auto
 *    - scroll-snap-type: x mandatory
 *    - flex flex-row
 * 
 * 2. Cards: Add fixed width and snap
 *    - min-w-[280px] max-w-[320px]
 *    - snap-center
 * 
 * 3. Add arrow navigation (desktop):
 *    - Previous/Next buttons
 *    - useRef for scroll container
 *    - scrollBy() for smooth scroll
 * 
 * 4. Add scroll indicators:
 *    - Gradient fade on edges
 *    - Show when more cards available
 * 
 * 5. Touch/swipe support:
 *    - Native CSS scroll behavior
 *    - scroll-behavior: smooth
 * 
 * 6. Peek effect:
 *    - Show partial next/prev cards
 *    - Negative margins or padding
 */