// src/features/article-display/styles.ts

import { cn } from '@/lib/utils/cn';
import { IMAGE_RATIO_STRING } from '../mainConstants';

// ================================================================
// HERO SECTION STYLES
// ================================================================

export const HERO_SECTION_STYLES = {
  // Section wrapper (applied to Section component)
  section: 'py-8',
  
  // Container
  container: 'container mx-auto px-4',
  
  // Header
  header: 'text-center mb-12',
  title: 'text-4xl md:text-5xl font-bold font-display mb-6 text-on-sf',
  description: 'text-xl text-on-sf-var max-w-3xl mx-auto leading-relaxed',
  
  // Loading state
  loading: {
    wrapper: 'text-center py-12',
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-prcolor mx-auto mb-4',
    text: 'text-on-sf-var',
  },
} as const;

// ================================================================
// ARTICLE LIST STYLES
// ================================================================

export const ARTICLE_LIST_STYLES = {
  // Section wrapper
  section: 'article-list',
  
  // Container
  container: {
    base: 'container mx-auto py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8',
    grid: 'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 gap-6 lg:gap-8',
    list: 'flex flex-col gap-4',
  },
  
  // Count display
  count: 'mb-6 text-sm text-gray-600 dark:text-gray-400',
  
  // Empty state
  empty: {
    wrapper: 'flex flex-col items-center justify-center py-16 px-4 text-center',
    icon: 'w-16 h-16 text-gray-400 mb-4',
    title: 'text-lg mb-2',
    description: 'text-sm opacity-75',
  },
} as const;

// ================================================================
// ARTICLE LIST SKELETON STYLES
// ================================================================

export const ARTICLE_LIST_SKELETON_STYLES = {
  // Reuse main section class
  section: ARTICLE_LIST_STYLES.section,
  
  // Reuse container styles
  container: ARTICLE_LIST_STYLES.container,
  
  // Count skeleton
  countSkeleton: 'mb-6 h-4 w-32 bg-on-sf/10 rounded animate-pulse',
  
  // Screen reader text
  srOnly: 'sr-only',
} as const;

// ================================================================
// HERO ARTICLES CARD STYLES
// ================================================================

export const HERO_ARTICLES_STYLES = {
  container: `grid grid-cols-1 
          2xl:grid-cols-2 2xl:gap-12
          pb-6 md:pb-8 lg:pb-12 md:px-8 xl:px-12 gap-6 lg:gap-4 xl:gap-8`,
  
  // Promoted article section
  promoted: {
    wrapper: 'col-span-full 2xl:col-span-1 sm:pb-6 max-2xl:pb-12 2xl:items-stretch',
  },
  
  // Latest articles grid
  latest: {
    wrapper: `grid grid-cols-1 gap-8
            lg:max-2xl:grid-cols-3
            px-4 md:px-0
            2xl:pb-6 2xl:gap-12`,
  },
  
  // Empty state
  empty: 'text-center py-8 text-muted-foreground',
} as const;

export const HERO_ARTICLES_SKELETON_STYLES = {
  container: HERO_ARTICLES_STYLES.container,
  promoted: HERO_ARTICLES_STYLES.promoted,
  latest: HERO_ARTICLES_STYLES.latest,
} as const;

// ================================================================
// STANDARD CARD STYLES
// ================================================================

export const STANDARD_CARD_STYLES = {
  base: 'w-full h-full',

  link: 'block group flex flex-col items-center',
  linkPromoted: '',
  
  layouts: {
    regular: 'bg-sf-cont flex flex-col h-full shadow-sm rounded-2xl hover:shadow-xl transition-shadow duration-200 overflow-hidden',
    promoted: `flex flex-col items-center overflow-hidden
            md:bg-sf md:grid md:rounded-2xl md:shadow-sm md:hover:shadow-xl md:transition-shadow md:duration-200
            md:max-2xl:grid-cols-2 
            2xl:grid-cols-1`,
    latest: `w-full h-full bg-sf-cont shadow-sm rounded-2xl hover:shadow-xl transition-shadow duration-200 overflow-hidden
            grid 
            max-sm:mx-4 max-sm:max-w-[400]
            sm:max-lg:grid-cols-3
            2xl:grid-cols-5`,
  },
  
  image: {
    base: `relative overflow-hidden bg-sf-hi`,
    regular: `w-full ${IMAGE_RATIO_STRING}`,
    promoted: `order-2 md:max-2xl:order-1
            max-md:-mt-8 w-full h-full ${IMAGE_RATIO_STRING} min-h-[300px]
            md:max-2xl:rounded-r-2xl
            2xl:rounded-2xl`,
    latest: `w-full h-full ${IMAGE_RATIO_STRING} flex-shrink-0 rounded-md 2xl:col-span-2`,
  },

  imageElement: 'object-cover group-hover:scale-105 transition-transform duration-300',
  
  content: {
    regular: `p-4 lg:p-6 flex flex-col flex-grow`,
    promoted: `bg-sf z-10 
            order-1 md:max-2xl:order-2
            max-md:shadow-sm max-md:hover:shadow-xl max-md:transition-shadow max-md:duration-200
            max-md:rounded-2xl max-md:overflow-hidden 
            max-md:max-w-[400] max-md:mx-4
            md:mx-0 md:w-full md:max-w-full md:h-full
            md:max-2xl:rounded-none
            p-6 lg:p-8 flex flex-col lg:max-xl:justify-center`,
    latest: `flex flex-col flex-grow sm:max-lg:justify-center xl:justify-center
          p-4 lg:p-6 
          sm:max-lg:col-span-2
          2xl:col-span-3`,
  },
  
  // Title variants
  title: {
    base: 'font-bold mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200',
    regular: 'line-clamp-3',
    promoted: 'text-2xl font-display lg:text-4xl',
    latest: `line-clamp-5 font-display 
            text-lg sm:text-xl 2xl:text-2xl`,
  },
  
  // Date variants
  date: {
    base: 'text-xs lg:text-sm text-on-sf-var',
    regular: 'mb-2',
    promoted: 'grow',
    latest: 'grow',
  },
  
  // Description variants
  description: {
    base: 'text-sm lg:text-base line-clamp-3 mb-4 text-on-sf-var',
    regular: 'max-sm:hidden',
    promoted: 'max-md:hidden xl:grow 2xl:hidden',
    latest: 'max-md:hidden',
  },
} as const;

export const STANDARD_CARD_SKELETON_STYLES = {
  base: STANDARD_CARD_STYLES.base,
  layouts: STANDARD_CARD_STYLES.layouts,
  content: STANDARD_CARD_STYLES.content,
  
  image: {
    regular: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.regular, 'bg-sf-hi animate-pulse'),
    promoted: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.promoted, 'bg-sf-hi animate-pulse'),
    latest: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.latest, 'bg-sf-hi animate-pulse'),
  },
  
  title: 'h-5 bg-on-sf/10 rounded mb-2 animate-pulse',
  titleSecond: 'h-5 w-3/4 bg-on-sf/10 rounded mb-2 animate-pulse',
  date: 'h-4 w-24 bg-on-sf/10 rounded mb-2 animate-pulse',
  description: 'h-4 bg-on-sf/10 rounded mb-1 animate-pulse',
  readMore: 'h-4 w-20 bg-on-sf/10 rounded animate-pulse',
} as const;

// ================================================================
// NEWS CARD STYLES
// ================================================================

export const NEWS_CARD_STYLES = {
  base: 'bg-sf-cont p-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-200',
  link: 'block h-full',
  title: 'text-lg mb-2 font-display text-on-sf hover:text-pr-cont transition-colors duration-200',
  date: 'text-xs mb-2 text-on-sf-var',
  description: 'line-clamp-3 text-sm text-on-sf-var mb-3',
  readMoreContainer: '',
  readMore: 'text-xs font-semibold text-pr-cont hover:text-pr-fix transition-colors duration-200',
} as const;

export const NEWS_CARD_SKELETON_STYLES = {
  base: cn(NEWS_CARD_STYLES.base, 'animate-pulse'),
  title: 'h-5 bg-on-sf/10 rounded mb-2',
  titleSecond: 'h-5 w-4/5 bg-on-sf/10 rounded mb-2',
  date: 'h-3 w-20 bg-on-sf/10 rounded mb-2',
  description: 'h-4 bg-on-sf/10 rounded',
  readMore: 'h-3 w-16 bg-on-sf/10 rounded',
} as const;

// ================================================================
// ADVERTISING CARD STYLES
// ================================================================

export const ADVERTISING_CARD_STYLES = {
  base: 'bg-gradient-to-br from-pr-cont to-pr-fix text-on-pr-cont p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105',
  link: 'block h-full',
  content: 'flex flex-col h-full',
  title: 'text-xl font-bold mb-3 text-on-pr-cont',
  description: 'text-sm mb-4 flex-grow text-on-pr-cont/90 line-clamp-4',
  buttonContainer: 'mt-auto',
  button: 'text-sm font-semibold bg-on-pr-cont text-pr-cont px-3 py-1 rounded-full hover:bg-on-pr-cont/90 transition-colors duration-200',
} as const;

export const ADVERTISING_CARD_SKELETON_STYLES = {
  base: 'bg-gradient-to-br from-sf-hi to-sf-hst p-6 rounded-2xl shadow-lg animate-pulse',
  content: ADVERTISING_CARD_STYLES.content,
  buttonContainer: ADVERTISING_CARD_STYLES.buttonContainer,
  title: 'h-6 bg-on-sf/10 rounded mb-3',
  titleSecond: 'h-6 w-3/4 bg-on-sf/10 rounded mb-3',
  description: 'h-4 bg-on-sf/10 rounded',
  button: 'h-7 w-20 bg-on-sf/20 rounded-full',
} as const;
