// src/main/components/Article/styles/Article.styles.ts
/**
 * Centralized Tailwind styling constants for Article components
 * 
 * Organization:
 * - LAYOUT: Header, Metadata, Content wrappers
 * - ELEMENTS: Typography (Heading, Paragraph, Link, List)
 * - MEDIA: ImageFrame, Captions
 * - BLOCKS: Blockquote, Table, InlineArticleCard, BalloonTip
 * - NAVIGATION: TableOfContents, RelatedLinks
 * - WIDGETS: ScrollToTopButton
 * 
 * Usage:
 * import { ARTICLE_STYLES } from '@/main/components/Article/styles';
 * <div className={ARTICLE_STYLES.layout.header.container} />
 */

// ================================================================
// LAYOUT COMPONENTS
// ================================================================

export const LAYOUT_STYLES = {
  // Header component (actual implementation from Header.tsx)
  header: {
    container: 'relative mb-12 lg:grid grid-cols-2 justify-center',
    title: 'mb-8 lg:pl-6 xl:pl-8 font-display text-3xl text-center lg:text-left font-bold text-on-sf',
    imageContainer: 'relative mx-auto aspect-[16/9] overflow-hidden order-first h-full w-full md:max-lg:w-3/4 rounded-t-2xl lg:rounded-2xl',
    image: 'w-full h-full object-cover',
    metadataBox: 'font-medium text-sm xl:text-base text-on-sf-var mx-auto flex justify-between col-span-2 w-full lg:max-w-[800px] lg:py-6 xl:py-8 bg-sf-cont md:max-lg:w-3/4 rounded-b-2xl lg:rounded-2xl lg:mt-8 p-6 shadow-sm',
    authorLink: 'text-pr-cont hover:text-pr-fix underline underline-offset-4 transition-colors duration-600',
    lead: 'text-lg xl:text-xl font-light max-w-[800px] mx-auto mb-8 col-span-2 pt-6 text-on-sf',
  },

  // Metadata component (actual implementation from Metadata.tsx)
  metadata: {
    container: 'font-medium text-sm xl:text-base text-on-sf-var mx-auto flex justify-between col-span-2 w-full lg:max-w-[800px] lg:py-6 xl:py-8 bg-sf-cont md:max-lg:w-3/4 rounded-b-2xl lg:rounded-2xl lg:mt-8 p-6 shadow-sm',
    authorLink: 'text-pr-cont hover:text-pr-fix underline underline-offset-4 transition-colors duration-600',
  },

  // Content wrapper (actual implementation from Content.tsx)
  content: {
    container: 'pb-12',
  },
} as const;

// ================================================================
// TYPOGRAPHY ELEMENTS
// ================================================================

export const ELEMENTS_STYLES = {
  // Heading levels
  heading: {
    base: 'font-bold text-on-sf mb-4 mt-8 first:mt-0',
    h1: 'text-3xl md:text-4xl font-display',
    h2: 'text-2xl md:text-3xl font-sans',
    h3: 'text-xl md:text-2xl font-sans',
    h4: 'text-lg md:text-xl font-sans',
    h5: 'text-base md:text-xl font-display',
    h6: 'text-sm md:text-lg font-display',
  },

  // Paragraph
  paragraph: {
    base: 'mb-6 text-base md:text-lg text-on-sf-var leading-relaxed first:mt-0 last:mb-0 font-serif',
  },

  // Links
  link: {
    base: 'text-pr-cont hover:text-pr-fix underline transition-colors duration-200',
    external: 'inline-flex items-center gap-1',
    externalIcon: 'w-3 h-3',
  },

  // Lists
  list: {
    base: 'mb-6 pl-6 space-y-2 text-on-sf-var leading-relaxed',
    item: 'text-on-sf-var marker:text-pr-cont pl-2 last:mb-0',
  },
} as const;

// ================================================================
// MEDIA COMPONENTS
// ================================================================

export const MEDIA_STYLES = {
  // ImageFrame
  imageFrame: {
    wrapper: 'w-full mb-8',
    figure: 'w-full',
    container: 'relative mx-auto overflow-hidden bg-sf-cont rounded-2xl shadow-lg',
    image: 'w-full h-full object-cover',
    caption: 'prose-sm text-on-sf-var mt-4 text-center px-4',
  },

  // ImageFrame Skeleton
  imageSkeleton: {
    container: 'relative mx-auto overflow-hidden bg-sf-cont rounded-2xl shadow-lg animate-pulse',
    shimmer: 'absolute inset-0 bg-gradient-to-r from-sf-hi via-sf-hst to-sf-hi bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
    placeholder: 'absolute inset-0 flex items-center justify-center text-on-sf-var/50',
    loadingText: 'mt-2 text-sm text-on-sf-var/60',
    iconContainer: 'w-16 h-16 text-on-sf-var/30 mb-2',
  },

  // Captions
  captions: {
    base: 'absolute left-0 right-0 bottom-0 transition-all duration-300 ease-out',
    
    // Theme variants
    themes: {
      default: 'theme-default:bg-sf/90 theme-default:backdrop-blur-sm theme-default:px-4 theme-default:py-3',
      rounded: 'theme-rounded:bg-sf/95 theme-rounded:backdrop-blur-md theme-rounded:rounded-t-2xl theme-rounded:px-6 theme-rounded:py-4',
      sharp: 'theme-sharp:bg-sf theme-sharp:border-t theme-sharp:border-ol theme-sharp:px-4 theme-sharp:py-2',
    },
    
    // Expansion indicator
    expandIndicator: 'absolute top-2 right-2 w-6 h-6 rounded-full bg-on-sf/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 text-on-sf text-xs hover:bg-on-sf/30',
  },
} as const;

// ================================================================
// BLOCK COMPONENTS
// ================================================================

export const BLOCKS_STYLES = {
  // Blockquote Type 1 (Highlight)
  blockquote1: {
    container: 'relative mb-6 p-6 pt-4 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4 rounded-xl shadow-md before:content-[\'\'] before:font-display before:text-8xl before:text-pr-cont before:text-start before:absolute',
    content: 'text-on-sf-var my-0 pt-12 pb-4 text-2xl text-center leading-relaxed font-semibold font-serif',
  },

  // Blockquote Type 2 (Quote with Author)
  blockquote2: {
    container: 'relative mb-6 p-6 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4 rounded-xl shadow-md before:content-[\'\'] before:font-display before:text-8xl before:text-pr-cont before:text-start before:absolute',
    content: 'text-on-sf-var mt-0 mb-4 pt-12 text-xl text-center leading-loose font-medium font-serif',
    author: 'text-on-sf-var text-right mb-2 text-base font-medium font-serif',
  },

  // Blockquote Type 3 (Epigraph)
  blockquote3: {
    container: 'relative mb-6 p-4 pl-12 md:pl-0 md:pr-12 flex flex-col items-end',
    content: 'text-lg font-serif text-on-sf-var mb-4 md:w-1/2',
    author: 'font-serif font-semibold text-base text-on-sf-var mb-1 md:w-1/2 text-right',
    source: 'font-serif text-on-sf-var/80 text-sm mt-0 text-right',
  },

  // Blockquote Type 4 (Profile with Avatar)
  blockquote4: {
    container: 'mb-6 px-6 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4 grid grid-cols-2 pt-6 bg-sf-cont rounded-xl shadow-md',
    avatarWrapper: 'justify-self-end rounded-2xl shadow-md mr-4 mb-2 relative w-20 h-20 overflow-hidden',
    avatar: 'h-full w-full object-cover my-0',
    authorName: 'self-center my-0 font-serif font-semibold text-2xl text-on-sf-var',
    content: 'col-span-2 pb-3 text-base font-medium font-serif text-on-sf-var',
  },

  // Table
  table: {
    wrapper: 'w-full overflow-x-auto my-8',
    container: 'min-w-full border-collapse bg-sf rounded-xl overflow-hidden shadow-md',
    table: 'w-full min-w-full border-collapse',
    header: 'bg-sf-cont',
    headerCell: 'px-4 py-3 text-left font-semibold text-on-sf border-b-2 border-ol',
    bodyRow: 'border-b border-ol-var last:border-0 hover:bg-sf-hi transition-colors',
    bodyCell: 'px-4 py-3 text-on-sf-var',
    caption: 'mt-2 text-sm text-on-sf-var text-center',
  },

  // InlineArticleCard
  inlineArticleCard: {
    container: 'not-prose my-6 w-full',
    link: 'group block w-full',
    card: 'bg-sf-cont rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-row items-stretch h-20 sm:h-28 md:h-32',
    imageContainer: 'relative flex-shrink-0 overflow-hidden bg-sf-hi w-20 sm:w-28 md:w-32',
    image: 'object-cover group-hover:scale-110 transition-transform duration-300',
    content: 'flex flex-col justify-center flex-grow p-3 sm:p-4 min-w-0',
    label: 'text-xs font-medium uppercase tracking-wide mb-1 text-pr-cont hidden sm:block',
    title: 'font-semibold text-on-sf group-hover:text-pr-cont transition-colors duration-200 line-clamp-1 sm:line-clamp-2 text-sm sm:text-base',
    description: 'text-xs text-on-sf-var mt-1 line-clamp-1 hidden md:block',
    date: 'text-xs text-on-sf-var mt-1 hidden sm:block',
  },

  // BalloonTip (actual implementation from BalloonTip.tsx)
  balloonTip: {
    container: 'relative inline-block group',
    trigger: 'cursor-help border-b-2 border-dotted border-pr-cont text-pr-cont hover:text-pr-fix transition-colors',
    tooltip: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-sf-hst text-on-sf text-sm rounded-lg shadow-lg whitespace-nowrap z-50',
  },
} as const;

// ================================================================
// NAVIGATION COMPONENTS
// ================================================================

export const NAVIGATION_STYLES = {
  // TableOfContents
  tableOfContents: {
    container: 'w-full max-w-2xl mx-auto mb-16 bg-sf-cont p-8 rounded-2xl shadow-lg',
    title: 'text-xl font-bold mb-4 text-on-sf-var bg-sf-hst py-3 px-6 rounded-lg shadow-sm',
    list: 'space-y-2 pl-6',
    link: 'block text-pr-cont hover:text-pr-fix transition-colors duration-200 py-1',
    linkActive: 'text-pr-fix font-semibold',
  },

  // RelatedLinks
    relatedLinks: {
    // QuickNavigation
    quickNav: {
      container: 'w-full py-4 border-b border-ol-var',
      nav: 'flex flex-wrap gap-x-4 gap-y-2',
      link: 'text-on-sf-var hover:text-on-sf hover:underline transition-colors',
    },
    
    // CategoriesSection
    categories: {
      container: 'w-full py-4',
      nav: 'flex flex-wrap gap-2',
      tag: 'text-sm text-on-sf-var bg-sf-cont px-3 py-1.5 rounded-lg hover:bg-sf-hi transition-colors',
    },
    
    // RubricSection
    rubric: {
      container: 'w-full py-4',
      link: 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      icon: 'relative w-6 h-6',
      text: 'text-base font-medium text-on-sf',
    },
    
    // AuthorSection (single author - standalone)
    author: {
      container: 'w-full py-4 border-t border-ol-var',
      link: 'inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      avatar: 'relative w-10 h-10 rounded-full overflow-hidden',
      info: 'flex flex-col',
      name: 'text-sm font-medium text-on-sf',
      label: 'text-xs text-on-sf-var',
    },
    
    // AuthorsSection (multiple authors)
    authors: {
      container: 'w-full py-4 border-t border-ol-var',
      grid: 'flex flex-wrap gap-3',
      heading: 'sr-only',
      // Card styles for authors in grid
      card: 'inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      avatar: 'relative w-10 h-10 rounded-full overflow-hidden',
      info: 'flex flex-col',
      name: 'text-sm font-medium text-on-sf',
      label: 'text-xs text-on-sf-var',
    },
  },

  // RelatedArticles
  relatedArticles: {
    container: 'mt-12 pt-8 border-t border-gray-200',
    heading: 'text-2xl font-bold mb-6 text-on-sf',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    emptyState: 'text-center py-8 text-on-sf-var',
  },
} as const;

// ================================================================
// WIDGET COMPONENTS
// ================================================================

export const WIDGETS_STYLES = {
  // ScrollToTopButton (uses FloatingButton component)
  // Note: ScrollToTopButton delegates styling to FloatingButton component
  // See FloatingButton.tsx for actual styling implementation
  scrollToTop: {
    // FloatingButton default styling (for reference)
    button: 'fixed p-2 transition-all duration-200 text-on-pr bg-pr-cont hover:bg-pr-fix rounded-full shadow-lg hover:shadow-xl bottom-4 right-4 z-50',
    icon: 'h-6 w-6',
  },
} as const;

// ================================================================
// COMBINED EXPORT
// ================================================================

export const ARTICLE_STYLES = {
  layout: LAYOUT_STYLES,
  elements: ELEMENTS_STYLES,
  media: MEDIA_STYLES,
  blocks: BLOCKS_STYLES,
  navigation: NAVIGATION_STYLES,
  widgets: WIDGETS_STYLES,
} as const;

// ================================================================
// TYPE EXPORTS (for advanced usage)
// ================================================================

export type LayoutStyles = typeof LAYOUT_STYLES;
export type ElementsStyles = typeof ELEMENTS_STYLES;
export type MediaStyles = typeof MEDIA_STYLES;
export type BlocksStyles = typeof BLOCKS_STYLES;
export type NavigationStyles = typeof NAVIGATION_STYLES;
export type WidgetsStyles = typeof WIDGETS_STYLES;
export type ArticleStyles = typeof ARTICLE_STYLES;