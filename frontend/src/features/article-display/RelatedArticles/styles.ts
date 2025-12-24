// src/features/article-display/styles.ts

import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import { cn } from '@/lib/utils/cn';

// ================================================================
// RELATED ARTICLES STYLES
// ================================================================

export const RELATED_ARTICLES_STYLES = {
  // Section container
  section: '',
  
  // Heading
  heading: 'text-4xl md:text-7xl uppercase font-bold mb-3 md:mb-6 text-sf-cont',
} as const;

export const RELATED_CAROUSEL_STYLES = {
  // Outer wrapper
  wrapper: cn(
    'relative group',
    'w-screen', // Full viewport width
  ),
  
  // Scroll container
  scrollContainer: cn(
    'flex gap-4 overflow-x-auto scrollbar-hide',
    'snap-x snap-mandatory scroll-smooth',
    'px-4 sm:px-6 2xl:px-8',
    'scroll-px-4 sm:scroll-px-6 2xl:scroll-px-8' // Scroll snap padding (matches visual padding)
  ),
  
  // Individual card wrapper
  cardWrapper: cn(
    'flex-none w-[200px] sm:w-[220px] lg:w-[240px]',
    'snap-start'
  ),
  
  // Left gradient indicator
  gradientLeft: cn(
    'absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10',
    'bg-gradient-to-r from-sf-hst to-transparent',
    'transition-opacity duration-200'
  ),
  
  // Right gradient indicator
  gradientRight: cn(
    'absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10',
    'bg-gradient-to-l from-sf-hst to-transparent',
    'transition-opacity duration-200'
  ),
  
  // Navigation buttons
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
} as const;


export const RELATED_ARTICLE_STYLES = {
  section: 'mt-12 pt-8 border-t border-gray-200',
  h2: 'text-2xl font-bold mb-6 text-on-sf'
} as const;

export const RELATED_CARD_STYLES = {
  // Card container
  container: 'group block w-full h-full',
  
  // Card structure
  card: 'bg-sf-cont rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col',
  
  // Image container
  imageContainer: `relative w-full ${IMAGE_RATIO_STRING} overflow-hidden bg-sf-hi`,
  
  // Image element
  image: 'object-cover group-hover:scale-110 transition-transform duration-300',
  
  // Content container
  content: 'p-4 flex flex-col flex-grow',
  
  // Title
  title: 'text-base font-semibold line-clamp-3 md:line-clamp-4 mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200 flex-grow',
  
  // Date
  date: 'max-sm:hidden text-xs text-on-sf-var mt-auto',
} as const;

export const RELATED_CARD_SKELETON_STYLES = {
  container: RELATED_CARD_STYLES.container,
  card: cn(RELATED_CARD_STYLES.card, 'animate-pulse'),
  imageContainer: cn(RELATED_CARD_STYLES.imageContainer, 'bg-sf-hi'),
  content: RELATED_CARD_STYLES.content,
  title: 'h-4 bg-on-sf/10 rounded mb-2',
  titleSecond: 'h-4 w-3/4 bg-on-sf/10 rounded mb-2',
  date: 'h-3 w-20 bg-on-sf/10 rounded',
} as const;