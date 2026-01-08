// src/features/shared/CardCarousel/styles.ts

import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import { cn } from '@/lib/utils/cn';

type CardType = 'article' | 'rubric' | 'author';

// ================================================================
// CAROUSEL WRAPPER STYLES - Dynamic based on card type
// ================================================================

export function getCarouselStyles(cardType: CardType) {
  // Card width variations:
  // - author: 4 cards fit on xl/2xl → ~23% width (accounting for gaps)
  // - rubric: 6 cards fit on xl/2xl → ~15% width (accounting for gaps)
  // - article: default scrollable
  
  const cardWrapperWidths = {
    article: 'flex-none w-[200px] sm:w-[220px] lg:w-[240px]',
    rubric: 'flex-none w-[200px] sm:w-[220px] lg:w-[240px] xl:w-[16%] 2xl:w-[16%]',
    author: 'flex-none w-[220px] sm:w-[240px] lg:w-[260px] xl:w-[24%] 2xl:w-[24%]',
  };

  return {
    wrapper: cn(
      'relative',
      'w-full',
    ),
    
    scrollContainer: cn(
      'flex gap-4 overflow-x-auto scrollbar-hide',
      'snap-x snap-mandatory scroll-smooth',
      'px-4 sm:px-6 2xl:px-8',
      'py-5',
      'scroll-px-4 sm:scroll-px-6 2xl:scroll-px-8'
    ),
    
    cardWrapper: cn(
      cardWrapperWidths[cardType],
      'snap-start'
    ),
    
    gradientLeft: cn(
      'absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10',
      'bg-gradient-to-r from-sf-hst to-transparent',
      'transition-opacity duration-200',
      'my-5'
    ),
    
    gradientRight: cn(
      'absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10',
      'bg-gradient-to-l from-sf-hst to-transparent',
      'transition-opacity duration-200',
      'my-5'
    ),
    
    navButton: {
      base: cn(
        'absolute top-1/2 -translate-y-1/2 z-20',
        'bg-sf-cont hover:bg-sf-hi',
        'rounded-full p-2 shadow-lg',
        'transition-all duration-200',
        'opacity-0 group-hover:opacity-100',
        'disabled:opacity-0 disabled:cursor-not-allowed',
        'hidden lg:flex items-center justify-center'
      ),
      left: 'left-4',
      right: 'right-4',
      icon: 'w-6 h-6 text-on-sf',
    },
  };
}

// ================================================================
// ARTICLE CAROUSEL CARD STYLES (from RELATED_CARD_STYLES)
// ================================================================

export const ARTICLE_CAROUSEL_CARD_STYLES = {
  // Card container
  container: 'group block w-full h-full rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300',
  
  // Card structure
  card: 'bg-sf-cont rounded-2xl overflow-hidden h-full flex flex-col',
  
  // Image container
  imageContainer: `relative w-full ${IMAGE_RATIO_STRING} overflow-hidden bg-sf-hi`,
  
  // Image element
  image: 'object-cover',
  
  // Content container
  content: 'p-4 flex flex-col flex-grow',
  
  // Title
  title: 'text-base font-semibold line-clamp-3 md:line-clamp-4 mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200 flex-grow',
  
  // Date
  date: 'max-sm:hidden text-xs text-on-sf-var mt-auto',
} as const;

// ================================================================
// RUBRIC CAROUSEL CARD STYLES (horizontal, wider)
// ================================================================

export const RUBRIC_CAROUSEL_CARD_STYLES = {
  // Card container
  container: 'block w-full h-full group',

  // Card structure
  card: 'h-full w-full bg-sf-cont rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200',
  
  // Content container
  content: 'h-full p-6 flex flex-col items-center gap-8',
  
  // Image container
  iconWrapper: 'relative w-24 h-24',
  
  // Image element
  iconImage: 'object-contain',
  iconFallback: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix',
  iconFallbackText: 'text-on-pr-cont text-xl font-bold',
  
  // Text content container
  textContent: 'w-full flex flex-col gap-6 min-w-0 grow',

  // Text content
  name: 'text-2xl text-on-sf text-center group-hover:text-pr-cont transition-colors grow',
  description: 'max-md:hidden text-on-sf-var line-clamp-2 mt-1',
  articleCount: 'text-sm font-semibold text-on-sf bg-sf-hi rounded-full mt-1 p-2 px-4',
} as const;

// ================================================================
// AUTHOR CAROUSEL CARD STYLES (horizontal, medium)
// ================================================================

export const AUTHOR_CAROUSEL_CARD_STYLES = {
  // Card container
  container: 'block w-full h-full group',

  // Card structure
  card: 'h-full bg-sf rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200',
  
  // Content container
  content: 'flex flex-col gap-4',
  
  // Image container
  avatarWrapper: 'relative aspect-square flex-shrink-0 overflow-hidden rounded-3xl',
  
  // Image element
  avatarImage: 'object-cover',
  avatarFallback: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix',
  avatarFallbackText: 'text-on-pr-cont text-xl font-bold',
  
  // Text content container
  textContent: 'p-8 pt-0 flex-1 min-w-0',

  // Text content
  name: 'text-2xl md:text-3xl lg:text-4xl text-on-sf group-hover:text-pr-cont transition-colors',
  bio: 'max-md:hidden max-lg:text-sm text-on-sf-var line-clamp-4 mt-8',
} as const;