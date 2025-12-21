// app/[lang]/[rubric]/[slug]/_components/article.styles.ts
/**
 * Article Page - Centralized Style Constants
 * 
 * Tailwind utility classes organized by component category.
 * Single source of truth for all article page styling.
 * 
 * Sections:
 * - LAYOUT_STYLES: Header, Content wrappers
 * - ELEMENTS_STYLES: Typography (Heading, Paragraph, Link, List)
 * - MEDIA_STYLES: ImageFrame, Captions
 * - BLOCKS_STYLES: Blockquote, Table, InlineArticleCard, BalloonTip
 * - NAVIGATION_STYLES: TableOfContents, RelatedLinks
 * - WIDGETS_STYLES: SharePopup, ScrollToTopButton
 * 
 * Usage:
 * import { LAYOUT_STYLES } from './article.styles'
 * <div className={LAYOUT_STYLES.header.container} />
 * 
 * @see Header.tsx, Content.tsx for usage examples
 */

import { IMAGE_RATIO_STRING } from "@/features/mainConstants";


// ================================================================
// LAYOUT COMPONENTS
// ================================================================

export const LAYOUT_STYLES = {
  // Header component - flex on mobile, grid on desktop
  header: {
    // Container uses flex column on mobile, grid on desktop
    container: 'relative mb-12 flex flex-col sm:max-md:mx-16 md:grid md:grid-cols-2 md:gap-8 xl:gap-16',
    
    // Mobile-only date - order-1, hidden on desktop
    mobileDateText: 'order-1 font-medium text-sm text-on-sf-var mb-4 md:hidden',
    
    // Image wrapper - order-3 on mobile, order-1 on desktop (left column)
    imageWrapper: 'order-3 mb-6 md:order-1 md:mb-0',
    imageContainer: `relative ${IMAGE_RATIO_STRING} overflow-hidden rounded-3xl border border-ol-var shadow-lg w-full h-full`,
    image: 'w-full h-full object-cover',
    
    // Right column: Title + metadata - order-2 on both mobile and desktop
    rightColumn: 'order-2 mb-6 md:mb-0 md:flex md:flex-col md:justify-between',
    
    title: `mb-4 font-custom font-bold tracking-wide dark:tracking-wider text-on-sf text-3xl leading-[1.2] 
            sm:text-4xl sm:leading-[1.2] 
            md:text-3xl md:leading-[1.2] md:mb-0 
            lg:text-5xl lg:leading-[1.2]`,
    
    // Metadata box - hidden on mobile, visible on desktop at bottom of right column
    metadataBox: 'hidden md:block mt-8',
    
    // Authors wrapper
    authorsWrapper: 'mb-2 lg:mb-4 xl:mb-6',
    
    dateText: 'font-medium max-lg:text-sm text-on-sf-var',
    
    // Lead paragraph - order-4, full width
    lead: `order-4 font-light text-on-sf
            max-sm:px-4 pt-6 
            md:col-span-2 md:max-w-2xl md:mx-auto 
            text-xl leading-9
            md:text-2xl md:leading-9
            lg:text-2xl lg:leading-9 lg:max-w-3xl
            xl:max-w-4xl`,
  },

  // Content wrapper
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
    base: `text-on-sf 
           max-w-2xl mx-auto
          `,
    h2: `font-semibold font-serif 
          text-3xl my-8 mt-12 
          md:text-3xl
          lg:text-5xl lg:max-w-4xl`,
    h3: `font-medium font-serif 
          text-2xl mb-6 mt-8 
          md:text-2xl
          lg:text-4xl lg:max-w-4xl`,
    h4: `uppercase font-medium font-serif
          text-xl mb-4 mt-6 
          md:text-xl
          lg:text-2xl lg:max-w-4xl`,
  },

  // Paragraph
  paragraph: {
    base: `font-serif text-on-sf first:mt-0 last:mb-0
          mb-3 
          max-w-2xl mx-auto
          text-lg leading-[1.5]
          lg:text-xl lg:leading-[1.5] lg:max-w-4xl`,
  },

  // Links
  link: {
    base: 'text-pr-cont hover:text-pr-fix underline transition-colors duration-200',
    external: 'inline-flex items-center gap-1',
    externalIcon: 'w-3 h-3',
  },

  // Lists
  list: {
    base: `font-serif text-on-sf 
          my-6 pl-6 space-y-2
          max-w-2xl mx-auto
          text-lg leading-[1.5]
          lg:text-xl lg:leading-[1.5] lg:max-w-3xl lg:mb-16`,
    ordered: 'list-decimal list-outside',
    unordered: 'list-disc list-outside',
    item: 'text-on-sf marker:text-sec-cont last:mb-0',
  },
} as const;

// ================================================================
// MEDIA COMPONENTS
// ================================================================

export const MEDIA_STYLES = {
  // ImageFrame
  imageFrame: {
    figure: `max-w-svw -mx-2 my-8 md:my-12 lg:my-16
              md:mx-auto`,
    container: `relative mx-auto overflow-hidden bg-sf-cont
            max-h-[90vh] w-auto max-w-full 
            flex items-center justify-center`,
    image: 'w-full max-w-full object-contain',
    caption: 'max-w-2xl mx-auto mt-2 px-4 prose lg:prose-lg text-on-sf-var',
  },

  // ImageFrame Skeleton
  imageSkeleton: {
    container: 'relative mx-auto overflow-hidden bg-sf-cont animate-pulse',
    shimmer: 'absolute inset-0 bg-gradient-to-r from-sf-hi via-sf-hst to-sf-hi bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
    placeholder: 'absolute inset-0 flex items-center justify-center text-on-sf-var/50',
    loadingText: 'mt-2 text-sm text-on-sf-var/60',
    iconContainer: 'w-16 h-16 text-on-sf-var/30 mb-2',
  },
} as const;

// ================================================================
// BLOCK COMPONENTS
// ================================================================

export const BLOCKS_STYLES = {
  // Blockquote Type 1 (Highlight)
  blockquote1: {
    container: `relative mb-6 p-6 pt-8 
            max-w-xl mx-auto
            lg:my-12
            before:content-["”"] before:text-8xl before:text-sec-cont before:absolute before:-mt-2`,
    content: `text-on-sf-var my-0 pt-12 pb-4 font-semibold dark:font-medium font-serif
            text-xl leading-[1.75] 
            md:text-2xl md:leading-[1.75] 
            lg:text-3xl lg:leading-[1.75]`,
  },

  // Blockquote Type 2 (Quote with Author)
  blockquote2: {
    container: `relative mb-6 p-6 pt-8
            max-w-xl mx-auto
            lg:my-12
            before:content-["”"] before:text-8xl before:text-sec-cont before:absolute before:-mt-2`,
    content: `text-on-sf-var my-0 pt-12 pb-4 font-semibold dark:font-medium font-serif 
            text-xl leading-[1.75] 
            md:text-2xl md:leading-[1.75] 
            lg:text-3xl lg:leading-[1.75]`,
    author: 'text-on-sf-var text-right mb-2 max-sm:text-sm font-medium',
  },

  // Blockquote Type 3 (Epigraph)
  blockquote3: {
    container: 'relative mb-6 p-4 pl-12 md:pl-0 md:pr-12 text-on-sf-var flex flex-col items-end',
    content: 'font-serif leading-relaxed mb-4 md:w-1/2 md:text-lg',
    author: 'mb-1 md:w-1/2 max-sm:text-sm text-right',
    source: 'italic max-sm:text-sm mt-0 text-right',
  },

  // Blockquote Type 4 (Profile with Avatar)
  blockquote4: {
    container: `mb-6 p-8 pb-10 grid grid-cols-4 rounded-2xl border-t border-ol-var shadow-md
            max-w-xl mx-auto 
            lg:my-12`,
    avatarWrapper: 'rounded-full relative w-20 h-20 overflow-hidden',
    avatar: 'h-full w-full object-cover my-0',
    authorName: 'col-span-3 pl-4 self-center font-medium text-xl text-on-sf-var',
    content: 'col-span-4 pt-4 text-lg font-serif text-on-sf-var',
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
    container: 'not-prose my-6 md:my-12 w-full max-w-xl shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300',
    link: 'group block w-full',
    card: 'bg-sf-cont flex flex-row items-stretch h-20 sm:h-28 md:h-32',
    imageContainer: `relative flex-shrink-0 overflow-hidden bg-sf-hi 
          w-28 md:w-32`,
    image: 'object-cover group-hover:scale-110 transition-transform duration-300',
    content: 'flex flex-col justify-center flex-grow p-3 sm:p-4 min-w-0',
    label: 'text-xs font-medium uppercase tracking-wide mb-1 text-pr-cont hidden sm:block',
    title: 'font-semibold text-on-sf group-hover:text-pr-cont transition-colors duration-200 line-clamp-1 sm:line-clamp-2 text-sm sm:text-base',
    description: 'text-xs text-on-sf-var mt-1 line-clamp-1 hidden md:block',
    date: 'text-xs text-on-sf-var mt-1 hidden sm:block',
  },

  // BalloonTip (actual implementation from BalloonTip.tsx)
  balloonTip: {
    container: 'relative group',
    trigger: 'cursor-help border-b-4 border-sec-cont hover:border-sec-fix transition-colors',
    tooltip: `fixed mb-2 px-4 pt-2 pb-4 bg-sf border border-ol-var text-on-sf rounded-lg shadow-lg z-50 whitespace-normal w-[calc(100vw-2rem)] max-w-lg 
            max-md:text-sm`,  
  },
} as const;

// ================================================================
// NAVIGATION COMPONENTS
// ================================================================

export const NAVIGATION_STYLES = {
  // TableOfContents
  tableOfContents: {
    container: 'w-full max-w-2xl mx-auto mb-16',
    title: 'text-xl font-bold mb-4 text-on-sf-var bg-sf-hst py-3 px-6 rounded-lg shadow-sm',
    list: 'space-y-2 pl-6',
    link: 'block text-pr-cont hover:text-pr-fix transition-colors duration-200 py-1',
    linkActive: 'text-pr-fix font-semibold',
  },

  // RelatedLinks
    relatedLinks: {
    // QuickNavigation
    quickNav: {
      container: 'w-full max-w-2xl mx-auto py-4 border-b border-ol-var',
      nav: 'flex flex-wrap gap-x-4 gap-y-2',
      link: 'text-on-sf-var hover:text-on-sf hover:underline transition-colors',
    },
    
    // CategoriesAndRubricSection - Combined layout
    categoriesAndRubric: {
      container: 'w-full max-w-2xl pb-8 md:pb-12 lg:pb-16',
      // Wrapper: column on mobile, row on desktop
      wrapper: 'flex flex-row items-center gap-3',
      
      // Categories navigation - maintains original tag design
      categoriesNav: 'flex flex-wrap gap-2',
      categoryTag: 'px-2 py-0.5 max-lg:text-sm rounded-full text-pr-cont bg-sf-cont hover:bg-sf-hi transition-colors',
      
      // Rubric link - similar to author section
      rubricLink: 'max-md:hidden inline-flex items-center gap-3 pr-4 rounded-full text-pr-cont bg-sf-cont hover:bg-sf-hi transition-colors',
      rubricIcon: 'relative w-10 h-10 rounded-full overflow-hidden',
      rubricText: 'max-lg:text-sm font-medium whitespace-nowrap',
    },
    
    // AuthorSection (single author - standalone)
    author: {
      container: 'w-full max-w-2xl mx-auto',
      link: 'inline-flex items-center gap-3 pr-4 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      avatar: 'relative w-10 h-10 rounded-full overflow-hidden',
      info: 'flex flex-col',
      name: 'max-lg:text-sm font-medium text-pr-cont',
      label: 'text-xs text-on-sf-var',
    },
    
    // AuthorsSection (multiple authors)
    authors: {
      container: 'w-full max-w-2xl py-4',
      grid: 'flex flex-wrap gap-1',
      heading: 'sr-only',
      // Card styles for authors in grid
      card: 'inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      avatar: 'relative w-10 h-10 rounded-full overflow-hidden',
      info: 'flex flex-col',
      name: 'text-sm font-medium text-on-sf',
      label: 'text-xs text-on-sf-var',
    },
  },
} as const;

// ================================================================
// WIDGET COMPONENTS
// ================================================================

export const WIDGETS_STYLES = {
  // SharePopup
  sharePopup: {
    // Container
    container: 'p-6',
    
    // Grid for platform buttons
    grid: 'grid grid-cols-2 gap-2.5',
    
    // Platform button
    button: {
      base: 'flex flex-col items-center gap-2 p-3.5 rounded-lg text-on-sf-var transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2',
      iconWrapper: 'flex items-center justify-center',
      icon: 'w-5 h-5',
      label: 'text-xs font-medium',
    },
    
    // Platform-specific hover colors
    colors: {
      telegram: 'hover:bg-[#0088cc]/10 hover:text-[#0088cc]',
      whatsapp: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
      vk: 'hover:bg-[#0077FF]/10 hover:text-[#0077FF]',
      twitter: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
      facebook: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
      instagram: 'hover:bg-gradient-to-tr hover:from-[#fd5949] hover:via-[#d6249f] hover:to-[#285AEB]/10 hover:text-[#d6249f]',
      copy: 'hover:bg-on-sf-var/10 hover:text-on-sf',
    },
    
    // Success notification
    success: {
      wrapper: 'mt-4 pt-4 border-t border-ol-var',
      message: 'px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 text-sm rounded-lg text-center font-medium',
    },
  },
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