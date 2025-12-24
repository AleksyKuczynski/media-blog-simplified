// src/features/shared/CardCarousel/styles.ts

import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import { cn } from '@/lib/utils/cn';

// ================================================================
// CAROUSEL WRAPPER STYLES (from RELATED_CAROUSEL_STYLES)
// ================================================================

export const CAROUSEL_STYLES = {
  // Outer wrapper
  wrapper: cn(
    'relative group',
    'w-full',
  ),
  
  // Scroll container
  scrollContainer: cn(
    'flex gap-4 overflow-x-auto scrollbar-hide',
    'snap-x snap-mandatory scroll-smooth',
    'px-4 sm:px-6 2xl:px-8',
    ' py-5', // Vertical padding to show shadows - should be equal to vertical margin of gradients
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
    'transition-opacity duration-200',
    'my-5' // Vertical margin to compensating scrollContainer vertical padding
  ),
  
  // Right gradient indicator
  gradientRight: cn(
    'absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10',
    'bg-gradient-to-l from-sf-hst to-transparent',
    'transition-opacity duration-200',
    'my-5' // Vertical margin to compensating scrollContainer vertical padding
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

// ================================================================
// ARTICLE CAROUSEL CARD STYLES (from RELATED_CARD_STYLES)
// ================================================================

export const ARTICLE_CAROUSEL_CARD_STYLES = {
  // Card container
  container: 'group block w-full h-full rounded-2xl shadow-md hover:shadow-lg transition-all duration-300',
  
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
  container: 'block w-[320px] group',
  card: 'h-full bg-sf-cont rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200',
  content: 'p-4 flex items-center gap-4',
  iconWrapper: 'relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-sf-hi',
  iconImage: 'object-contain',
  iconFallback: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix',
  iconFallbackText: 'text-on-pr-cont text-xl font-bold',
  textContent: 'flex-1 min-w-0',
  name: 'font-semibold text-on-sf group-hover:text-pr-cont transition-colors text-sm truncate',
  description: 'text-xs text-on-sf-var line-clamp-2 mt-1',
  articleCount: 'text-xs text-on-sf-var mt-1',
} as const;

// ================================================================
// AUTHOR CAROUSEL CARD STYLES (horizontal, medium)
// ================================================================

export const AUTHOR_CAROUSEL_CARD_STYLES = {
  container: 'block w-[300px] group',
  card: 'h-full bg-sf-cont rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200',
  content: 'p-4 flex items-center gap-4',
  avatarWrapper: 'relative w-14 h-14 flex-shrink-0 rounded-full overflow-hidden bg-sf-hi',
  avatarImage: 'object-cover',
  avatarFallback: 'w-full h-full flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix',
  avatarFallbackText: 'text-on-pr-cont text-xl font-bold',
  textContent: 'flex-1 min-w-0',
  name: 'font-semibold text-on-sf group-hover:text-pr-cont transition-colors text-sm truncate',
  bio: 'text-xs text-on-sf-var line-clamp-2 mt-1',
} as const;