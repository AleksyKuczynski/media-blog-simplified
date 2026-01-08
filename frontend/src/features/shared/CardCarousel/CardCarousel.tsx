// src/features/shared/CardCarousel/CardCarousel.tsx

'use client';

import { useRef, useState, useEffect } from 'react';
import { getCarouselStyles } from './styles';
import ArticleCarouselCard from './ArticleCarouselCard';
import RubricCarouselCard from './RubricCarouselCard';
import AuthorCarouselCard from './AuthorCarouselCard';
import { CardCarouselProps } from './types';



export default function CardCarousel({
  cards,
  lang,
  dictionary,
  isLoading = false
}: CardCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine card type from first card
  const cardType = cards[0]?.type || 'article';
  const CAROUSEL_STYLES = getCarouselStyles(cardType);

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
  }, [cards]);

  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = cardType === 'author' ? 280 : cardType === 'rubric' ? 240 : 320;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className={CAROUSEL_STYLES.scrollContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={CAROUSEL_STYLES.cardWrapper}>
            <div className="w-80 h-48 bg-sf-hi rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div 
      className={CAROUSEL_STYLES.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left gradient */}
      {canScrollLeft && (
        <div 
          className={CAROUSEL_STYLES.gradientLeft}
          style={{ opacity: canScrollLeft ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className={CAROUSEL_STYLES.scrollContainer}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        role="list"
        aria-label="Card carousel"
      >
        {cards.map((card) => (
          <div 
            key={`${card.type}-${card.slug}`}
            role="listitem"
            className={CAROUSEL_STYLES.cardWrapper}
          >
            {card.type === 'article' && (
              <ArticleCarouselCard
                slug={card.slug}
                title={card.title}
                publishedAt={card.publishedAt}
                imageSrc={card.imageSrc}
                rubricSlug={card.rubricSlug}
                formattedDate={card.formattedDate}
                lang={lang}
              />
            )}
            {card.type === 'rubric' && (
              <RubricCarouselCard
                slug={card.slug}
                name={card.name}
                description={card.description}
                iconSrc={card.iconSrc}
                url={card.url}
                articleCount={card.articleCount}
                dictionary={dictionary}
              />
            )}
            {card.type === 'author' && (
              <AuthorCarouselCard
                slug={card.slug}
                name={card.name}
                bio={card.bio}
                avatarSrc={card.avatarSrc}
                url={card.url}
                dictionary={dictionary}
              />
            )}
          </div>
        ))}
      </div>

      {/* Right gradient */}
      {canScrollRight && (
        <div 
          className={CAROUSEL_STYLES.gradientRight}
          style={{ opacity: canScrollRight ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Navigation buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className={`${CAROUSEL_STYLES.navButton.base} ${CAROUSEL_STYLES.navButton.left}`}
          style={{ opacity: isHovered ? 1 : 0 }}
          aria-label="Scroll left"
        >
          <svg className={CAROUSEL_STYLES.navButton.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className={`${CAROUSEL_STYLES.navButton.base} ${CAROUSEL_STYLES.navButton.right}`}
          style={{ opacity: isHovered ? 1 : 0 }}
          aria-label="Scroll right"
        >
          <svg className={CAROUSEL_STYLES.navButton.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}