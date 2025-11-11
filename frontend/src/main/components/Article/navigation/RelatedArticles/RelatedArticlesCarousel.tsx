// src/main/components/Article/RelatedArticles/RelatedArticlesCarousel.tsx
// PHASE 2B: Full horizontal scroll carousel

'use client';

import { useRef, useState, useEffect } from 'react';
import RelatedArticleCard, { RelatedArticleCardSkeleton } from './RelatedArticleCard';

export interface CarouselArticle {
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string; // Full image URL
  rubricSlug: string;
  formattedDate: string;
}

interface RelatedArticlesCarouselProps {
  articles: CarouselArticle[];
  lang: 'ru';
  isLoading?: boolean;
}

/**
 * RelatedArticlesCarousel - PHASE 2B: Full horizontal carousel
 * 
 * Features:
 * - Horizontal scroll with snap points
 * - Arrow navigation (desktop)
 * - Gradient indicators on edges
 * - Peek effect (partial cards visible)
 * - Touch/swipe support (native CSS)
 * - Responsive behavior
 * - Accessible keyboard navigation
 */
export default function RelatedArticlesCarousel({
  articles,
  lang,
  isLoading = false
}: RelatedArticlesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check scroll position to show/hide arrows
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 10); // Small threshold to account for rounding
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Set up scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();

    container.addEventListener('scroll', updateScrollButtons);
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [articles]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll by one card width
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 300; // Approximate card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="min-w-[280px] max-w-[300px]">
            <RelatedArticleCardSkeleton />
          </div>
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
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left gradient fade indicator */}
      {canScrollLeft && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-sf via-sf/50 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        role="list"
        aria-label="Related articles carousel"
      >
        {articles.map((article) => (
          <div 
            key={article.slug} 
            role="listitem"
            className="min-w-[280px] max-w-[300px] snap-center flex-shrink-0"
          >
            <RelatedArticleCard
              slug={article.slug}
              title={article.title}
              publishedAt={article.publishedAt}
              imageSrc={article.imageSrc}
              rubricSlug={article.rubricSlug}
              formattedDate={article.formattedDate}
              lang={lang}
            />
          </div>
        ))}
      </div>

      {/* Right gradient fade indicator */}
      {canScrollRight && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-sf via-sf/50 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Navigation arrows - Desktop only, visible on hover */}
      <div className="hidden lg:block">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 
              w-10 h-10 rounded-full bg-sf-cont/90 hover:bg-sf-cont
              border border-ol-var shadow-lg
              flex items-center justify-center
              transition-all duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
              hover:scale-110 active:scale-95`}
            aria-label="Scroll to previous articles"
            type="button"
          >
            <svg 
              className="w-5 h-5 text-on-sf" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20
              w-10 h-10 rounded-full bg-sf-cont/90 hover:bg-sf-cont
              border border-ol-var shadow-lg
              flex items-center justify-center
              transition-all duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
              hover:scale-110 active:scale-95`}
            aria-label="Scroll to next articles"
            type="button"
          >
            <svg 
              className="w-5 h-5 text-on-sf" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Hide scrollbar - Additional CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}