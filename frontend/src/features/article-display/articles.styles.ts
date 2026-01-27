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
  header: 'mb-12',
  title: {
    base: 'leading-tight font-bold font-display text-on-sf w-fullflex flex-col',
    main:'text-4xl md:text-5xl mb-6 max-w-3xl',
    sub: 'text-2xl md:text-3xl max-w-3xl',
  },
  description: 'text-xl text-on-sf-var max-w-3xl mr-0 leading-relaxed',
  
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
  container: 'container mx-auto pb-6 md:pb-8 lg:pb-12 px-2 sm:px-4 md:px-8 lg:px-0 max-w-[896px] flex flex-col gap-3 lg:gap-4',

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
  
  // Screen reader text
  srOnly: 'sr-only',
} as const;

// ================================================================
// HERO ARTICLES CARD STYLES
// ================================================================

export const HERO_ARTICLES_STYLES = {
  container: cn(
    'grid grid-cols-1', 
    '2xl:grid-cols-2',
    'gap-6 lg:gap-4 xl:gap-6',
    'pb-6 md:pb-8 md:px-8 xl:px-12',
  ),
  
  // Promoted article section
  promoted: {
    wrapper: 'col-span-full 2xl:col-span-1 2xl:h-full',
  },
  
  // Latest articles grid
  latest: {
    wrapper: cn(
      'grid grid-cols-1 gap-6',
      'lg:max-2xl:grid-cols-3',
      'px-4 md:px-0',
      '',
    ),
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
  linkPromoted: '2xl:h-full',
  
  layouts: {
    regular: cn(
      'w-full h-full bg-sf-cont rounded-lg', 
      'shadow-sm sm:rounded-2xl hover:shadow-xl transition-shadow duration-200 overflow-hidden',
      'grid', 
      'grid-cols-3',
    ),
    promoted: cn(
      'flex flex-col items-center overflow-hidden',
      'md:bg-sf md:grid md:rounded-2xl md:shadow-sm md:hover:shadow-xl md:transition-shadow md:duration-200',
      'md:max-2xl:grid-cols-2', 
      '2xl:grid-cols-1 2xl:h-full',
    ),
    latest: cn(
      'w-full h-full bg-sf-cont shadow-sm rounded-2xl hover:shadow-xl transition-shadow duration-200 overflow-hidden',
      'grid', 
      'max-sm:mx-4 max-sm:max-w-[400]',
      'sm:max-lg:grid-cols-3',
      '2xl:grid-cols-5',
    ),
  },
  
  image: {
    base: `relative overflow-hidden bg-sf-hi`,
    regular: `w-full h-full ${IMAGE_RATIO_STRING} flex-shrink-0 sm:rounded-2xl`,
    promoted: cn(
      'order-2 md:max-2xl:order-1',
      `max-md:-mt-8 w-full h-full ${IMAGE_RATIO_STRING} min-h-[300px]`,
      'md:max-2xl:rounded-r-2xl',
      '2xl:rounded-2xl',
    ),
    latest: `w-full h-full ${IMAGE_RATIO_STRING} flex-shrink-0 rounded-md 2xl:col-span-2`,
  },

  imageElement: 'object-cover',
  
  content: {
    regular: cn(
      'flex flex-col flex-grow sm:max-lg:justify-center xl:justify-center',
      'p-4 lg:p-6', 
      'col-span-2',
    ),
    promoted: cn(
      'bg-sf z-10', 
        'order-1 md:max-2xl:order-2',
        'max-md:shadow-sm max-md:hover:shadow-xl max-md:transition-shadow max-md:duration-200',
        'max-md:rounded-2xl max-md:overflow-hidden', 
        'max-md:max-w-[400] max-md:mx-4',
        'md:mx-0 md:w-full md:max-w-full md:h-full',
        'md:max-2xl:rounded-none',
        'p-6 lg:p-8 flex flex-col lg:max-xl:justify-center',
      ),
    latest: cn(
      'flex flex-col flex-grow sm:max-lg:justify-center xl:justify-center',
      'p-4 lg:p-6', 
      'sm:max-lg:col-span-2',
      '2xl:col-span-3',
    ),
  },
  
  // Title variants
  title: {
    base: 'mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200',
    regular:  cn(
      'line-clamp-3 sm:line-clamp-4 sm:grow', 
      'max-sm:font-medium text-lg sm:text-xl lg:text-2xl sm:uppercase',
    ),
    promoted: 'font-bold text-2xl font-display lg:text-3xl xl:text-4xl',
    latest: cn(
      'line-clamp-4 font-display', 
      'font-bold text-lg sm:text-xl 2xl:text-2xl',
    ),
  },
  
  // Date variants
  date: {
    base: ' text-on-sf-var',
    regular: '',
    promoted: '',
    latest: '',
  },
  
  // Description variants
  description: {
    base: 'text-sm md:text-base line-clamp-3 mb-4 text-on-sf-var',
    regular: 'max-sm:hidden xl:text-lg',
    promoted: 'max-md:hidden xl:grow lg:text-xl lg:pt-4 2xl:hidden',
    latest: 'max-md:hidden xl:text-lg',
  },
  
  // Footer (Date + Read More)
  footer: {
    base: 'flex items-end justify-between gap-4 mt-auto max-lg:text-xs lg:max-xl:text-sm',
    regular: 'max-xs:hidden pt-2',
    promoted: 'pt-4',
    latest: 'pt-2',
  },
} as const;

export const STANDARD_CARD_SKELETON_STYLES = {
  base: STANDARD_CARD_STYLES.base,
  layouts: STANDARD_CARD_STYLES.layouts,
  content: STANDARD_CARD_STYLES.content,
  footer: 'flex items-end justify-between gap-4 mt-auto',
  
  image: {
    regular: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.regular, 'bg-sf-hi animate-pulse'),
    promoted: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.promoted, 'bg-sf-hi animate-pulse'),
    latest: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.latest, 'bg-sf-hi animate-pulse'),
  },
  
  title: 'h-5 bg-on-sf/10 rounded mb-2 animate-pulse',
  titleSecond: 'h-5 w-3/4 bg-on-sf/10 rounded mb-2 animate-pulse',
  date: 'h-4 w-24 bg-on-sf/10 rounded animate-pulse',
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
