// src/features/shared/CardCarousel/carousel.styles.ts

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
    article: 'flex-none w-[220px] sm:w-[240px] lg:w-[260px]',
    rubric: 'flex-none w-[200px] sm:w-[220px] lg:w-[240px] 2xl:w-[238px]',
    author: 'flex-none w-[200px] sm:w-[220px] lg:w-[240px] 2xl:w-[238px]',
  };

  return {
    wrapper: cn(
      'relative',
      'w-full',
      'flex flex-col gap-4'
    ),
    
    scrollContainer: cn(
      'flex gap-2 overflow-x-auto scrollbar-hide',
      'snap-x snap-mandatory scroll-smooth',
      'px-4 sm:px-6 2xl:px-8',
      'py-5',
      'scroll-px-4 sm:scroll-px-6 2xl:scroll-px-8'
    ),
    
    cardWrapper: cn(
      cardWrapperWidths[cardType],
      'snap-start'
    ),
    
    navButtonContainer: cn(
      'flex justify-center items-center gap-4',
      'pb-2'
    ),
    
    navButton: {
      base: cn(
        'bg-sf-cont hover:bg-sf-hi',
        'rounded-full p-3 shadow-md',
        'transition-all duration-200',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        'flex items-center justify-center'
      ),
      icon: 'w-6 h-6 text-on-sf',
    },
  };
}

export const CAROUSEL_IMAGE_PARAMS = {
  author: {
    width: 480,
    height: 480,
    quality: 90,
    format: 'webp'
  },
} as const;

// ================================================================
// ARTICLE CAROUSEL CARD STYLES (from RELATED_CARD_STYLES)
// ================================================================

export const ARTICLE_CAROUSEL_CARD_STYLES = {
  // Card container
  container: 'group block w-full h-full rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300',
  
  // Card structure
  card: 'bg-sf-cont rounded-2xl overflow-hidden h-full flex flex-col',
  
  // Image container
  imageContainer: `relative w-full ${IMAGE_RATIO_STRING} overflow-hidden bg-sf-hi rounded-b-2xl`,
  
  // Image element
  image: 'object-cover',
  
  // Content container
  content: 'p-6 flex flex-col flex-grow',
  
  // Title
  title: 'text-base font-serif font-medium line-clamp-3 md:line-clamp-4 mb-4 text-on-sf group-hover:text-pr-cont transition-colors duration-200 flex-grow',
  
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
  name: 'text-lg text-on-sf text-center uppercase group-hover:text-pr-cont transition-colors grow',
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
  card: 'h-full group transition-all duration-200',
  
  // Content container
  content: 'flex flex-col gap-8 pb-4',
  
  // Image container
  avatarWrapper: 'relative aspect-square w-4/5 mx-auto flex-shrink-0 overflow-hidden rounded-full shadow:md group-hover:shadow-lg transition-shadow duration-200',
  
  // Image element
  avatarImage: 'object-cover',
  avatarFallback: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix',
  avatarFallbackText: 'text-on-pr-cont text-xl font-bold',
  
  // Text content container
  textContent: 'px-2 flex-1 min-w-0 text-center text-on-sf-var group-hover:text-on-sf transition-colors',

  // Text content
  name: 'pb-2 max-sm:text-sm xl:text-lg uppercase',
  count: 'max-lg:text-sm',
} as const;

export function getAuthorCarouselAvatarUrl(baseUrl: string, assetId: string): string {
  const params = CAROUSEL_IMAGE_PARAMS.author;
  return `${baseUrl}/assets/${assetId}?width=${params.width}&height=${params.height}&quality=${params.quality}&format=${params.format}`;
}