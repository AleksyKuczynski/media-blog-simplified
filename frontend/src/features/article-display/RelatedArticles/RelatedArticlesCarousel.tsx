// src/features/article-display/RelatedArticles/RelatedArticlesCarousel.tsx

'use client';

import { useRef, useState, useEffect } from 'react';
import RelatedArticleCard, { RelatedArticleCardSkeleton } from './RelatedArticleCard';
import { Lang } from '@/config/i18n';
import { RELATED_CAROUSEL_STYLES } from './styles';

export interface CarouselArticle {
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string;
  rubricSlug: string;
  formattedDate: string;
}

interface RelatedArticlesCarouselProps {
  articles: CarouselArticle[];
  lang: Lang;
  isLoading?: boolean;
}

export default function RelatedArticlesCarousel({
  articles,
  lang,
  isLoading = false
}: RelatedArticlesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [articles]);

  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 300;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className={RELATED_CAROUSEL_STYLES.scrollContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={RELATED_CAROUSEL_STYLES.cardWrapper}>
            <RelatedArticleCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div 
      className={RELATED_CAROUSEL_STYLES.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left gradient */}
      {canScrollLeft && (
        <div 
          className={RELATED_CAROUSEL_STYLES.gradientLeft}
          style={{ opacity: canScrollLeft ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className={RELATED_CAROUSEL_STYLES.scrollContainer}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        role="list"
        aria-label="Related articles carousel"
      >
        {articles.map((article) => (
          <div 
            key={article.slug} 
            role="listitem"
            className={RELATED_CAROUSEL_STYLES.cardWrapper}
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

      {/* Right gradient */}
      {canScrollRight && (
        <div 
          className={RELATED_CAROUSEL_STYLES.gradientRight}
          style={{ opacity: canScrollRight ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Navigation buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className={`${RELATED_CAROUSEL_STYLES.navButton.base} ${RELATED_CAROUSEL_STYLES.navButton.left}`}
          style={{ opacity: isHovered ? 1 : 0 }}
          aria-label="Scroll to previous articles"
          type="button"
        >
          <svg 
            className={RELATED_CAROUSEL_STYLES.navButton.icon}
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
          className={`${RELATED_CAROUSEL_STYLES.navButton.base} ${RELATED_CAROUSEL_STYLES.navButton.right}`}
          style={{ opacity: isHovered ? 1 : 0 }}
          aria-label="Scroll to next articles"
          type="button"
        >
          <svg 
            className={RELATED_CAROUSEL_STYLES.navButton.icon}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}