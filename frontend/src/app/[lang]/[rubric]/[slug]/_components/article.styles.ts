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
  // Header component (actual implementation from Header.tsx)
  header: {
    container: `relative mb-12 
          lg:grid grid-cols-2 justify-center`,
    title: `mb-6 font-custom font-bold tracking-wide dark:tracking-wider text-on-sf
          text-3xl
          max-w-2xl mx-auto 
          lg:pl-6 xl:pl-8 lg:text-left`,
    imageContainer: `relative ${IMAGE_RATIO_STRING} overflow-hidden rounded-3xl 
          h-full mx-auto
          max-w-md
          md:max-lg:w-3/4 `,
    image: 'w-full h-full object-cover',
    metadataBox: 'font-medium text-sm xl:text-base text-on-sf-var mx-auto w-full lg:max-w-[800px] p-2 lg:py-6 xl:py-8 bg-sf-cont md:max-lg:w-3/4 lg:rounded-2xl lg:mt-8',
    authorLink: 'text-pr-cont hover:text-pr-fix underline underline-offset-4 transition-colors duration-600',
    lead: `font-light max-w-xl mx-auto text-on-sf
          mb-8 col-span-2 text-lg px-2 pt-6 
          xl:text-xl `,
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
    base: `text-on-sf 
           max-w-2xl mx-auto
          `,
    h2: `font-bold font-serif 
          text-3xl mb-8 mt-16 
          md:text-3xl`,
    h3: `font-bold font-serif 
          text-2xl mb-6 mt-8 
          md:text-2xl`,
    h4: `uppercase font-serif
          text-xl mb-4 mt-6 
          md:text-xl`,
  },

  // Paragraph
  paragraph: {
    base: `font-serif text-on-sf-var leading-relaxed first:mt-0 last:mb-0
          mb-3 
          max-w-2xl mx-auto
          md:text-lg  `,
  },

  // Links
  link: {
    base: 'text-pr-cont hover:text-pr-fix underline transition-colors duration-200',
    external: 'inline-flex items-center gap-1',
    externalIcon: 'w-3 h-3',
  },

  // Lists
  list: {
    base: `font-serif text-on-sf-var leading-relaxed 
          my-6 pl-6 space-y-2
          max-w-2xl mx-auto`,
    ordered: 'list-decimal list-outside',
    unordered: 'list-disc list-outside',
    item: 'text-on-sf-var marker:text-sec-cont last:mb-0',
  },
} as const;

// ================================================================
// MEDIA COMPONENTS
// ================================================================

export const MEDIA_STYLES = {
  // ImageFrame
  imageFrame: {
    wrapper: `max-w-svw -mx-2 mb-8
              md:mx-auto`,
    figure: 'w-full',
    container: `relative mx-auto overflow-hidden bg-sf-cont md:rounded-lg
            max-h-[90vh] w-auto max-w-full 
            flex items-center justify-center my-0`,
    image: 'w-full max-w-full object-contain',
    caption: 'prose-sm text-on-sf-var text-center px-4',
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
    content: `text-on-sf-var my-0 pt-12 pb-4 
            text-xl leading-relaxed font-semibold dark:font-medium font-serif`,
  },

  // Blockquote Type 2 (Quote with Author)
  blockquote2: {
    container: `relative mb-6 p-6 pt-8
            max-w-xl mx-auto
            lg:my-12
            before:content-["”"] before:text-8xl before:text-sec-cont before:absolute before:-mt-2`,
    content: `text-on-sf-var my-0 pt-12 pb-4 
            text-xl leading-relaxed font-semibold dark:font-medium font-serif`,
    author: 'text-on-sf-var text-right mb-2 text-base font-medium',
  },

  // Blockquote Type 3 (Epigraph)
  blockquote3: {
    container: 'relative mb-6 p-4 pl-12 md:pl-0 md:pr-12 text-on-sf-var flex flex-col items-end',
    content: 'font-serif mb-4 md:w-1/2',
    author: 'mb-1 md:w-1/2 text-right',
    source: 'italic text-sm mt-0 text-right',
  },

  // Blockquote Type 4 (Profile with Avatar)
  blockquote4: {
    container: `mb-6 p-6 pb-10 grid grid-cols-4 rounded-2xl border-t border-ol-var shadow-md
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
    
    // CategoriesSection
    categories: {
      container: 'w-full max-w-2xl mx-auto pb-4',
      nav: 'flex flex-wrap gap-2',
      tag: 'text-sm text-on-sf-var bg-sf-cont px-3 py-1.5 rounded-lg hover:bg-sf-hi transition-colors',
    },
    
    // RubricSection
    rubric: {
      container: 'w-full max-w-2xl mx-auto pb-4',
      link: 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      icon: 'relative w-6 h-6',
      text: 'text-base font-medium text-on-sf',
    },
    
    // AuthorSection (single author - standalone)
    author: {
      container: 'w-full max-w-2xl mx-auto py-4 border-t border-ol-var',
      link: 'inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-sf-cont hover:bg-sf-hi transition-colors',
      avatar: 'relative w-10 h-10 rounded-full overflow-hidden',
      info: 'flex flex-col',
      name: 'text-sm font-medium text-on-sf',
      label: 'text-xs text-on-sf-var',
    },
    
    // AuthorsSection (multiple authors)
    authors: {
      container: 'w-full max-w-2xl mx-auto py-4 border-t border-ol-var',
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
    heading: 'text-2xl font-bold mb-6 text-on-sf max-w-2xl mx-auto',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    emptyState: 'text-center py-8 text-on-sf-var',
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