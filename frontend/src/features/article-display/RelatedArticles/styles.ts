// src/features/article-display/styles.ts

import { cn } from '@/lib/utils/cn';

// ================================================================
// RELATED ARTICLES STYLES
// ================================================================

export const RELATED_ARTICLES_STYLES = {
  // Section container
  section: 'mt-12 pt-8 border-t border-gray-200',
  
  // Heading
  heading: 'text-2xl font-bold mb-6 text-on-sf max-w-2xl mx-auto',
} as const;

export const RELATED_CAROUSEL_STYLES = {
  // Outer wrapper
  wrapper: cn(
    'relative group',
    'w-screen', // Full viewport width
    '-mx-4 sm:-mx-6 2xl:-mx-8', // Negative margins to break out of container padding
    'px-4 sm:px-6 2xl:px-8' // Add padding back for content
  ),
  
  // Scroll container
  scrollContainer: cn(
    'flex gap-4 overflow-x-auto scrollbar-hide',
    'snap-x snap-mandatory scroll-smooth',
    'py-2'
  ),
  
  // Individual card wrapper
  cardWrapper: cn(
    'flex-none w-[280px] sm:w-[300px] lg:w-[320px]',
    'snap-start'
  ),
  
  // Left gradient indicator
  gradientLeft: cn(
    'absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10',
    'bg-gradient-to-r from-sf to-transparent',
    'transition-opacity duration-200'
  ),
  
  // Right gradient indicator
  gradientRight: cn(
    'absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10',
    'bg-gradient-to-l from-sf to-transparent',
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
    left: '-left-4',
    right: '-right-4',
    icon: 'w-6 h-6 text-on-sf',
  },
} as const;


export const RELATED_ARTICLE_STYLES = {
  section: 'mt-12 pt-8 border-t border-gray-200',
  h2: 'text-2xl font-bold mb-6 text-on-sf'
} as const;

export const RELATED_CARD_STYLES = {
  // Card container
  container: 'group block w-full',
  
  // Card structure
  card: 'bg-sf-cont rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col',
  
  // Image container
  imageContainer: 'relative w-full aspect-video overflow-hidden bg-sf-hi',
  
  // Image element
  image: 'object-cover group-hover:scale-110 transition-transform duration-300',
  
  // Content container
  content: 'p-4 flex flex-col flex-grow',
  
  // Title
  title: 'text-base font-semibold line-clamp-2 mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200 flex-grow',
  
  // Date
  date: 'text-xs text-on-sf-var mt-auto',
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