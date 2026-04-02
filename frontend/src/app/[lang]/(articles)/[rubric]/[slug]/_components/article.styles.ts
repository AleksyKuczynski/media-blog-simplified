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
import { cn } from "@/lib/utils";


// ================================================================
// LAYOUT COMPONENTS
// ================================================================

export const LAYOUT_STYLES = {
  // Header component - flex on mobile, grid on desktop
  header: {
    // Container uses flex column on mobile, grid on desktop
    container: 'relative mb-12 flex flex-col sm:max-md:mx-16 md:grid md:grid-cols-2 md:gap-8 xl:gap-16',
  
    // Metadata elements (for schema.org)
    metadata: 'sr-only',

    // Mobile-only date - order-1, hidden on desktop
    mobileDateText: 'order-1 font-medium text-sm text-on-sf-var mb-4 md:hidden',
    
    // Image wrapper - order-3 on mobile, order-1 on desktop (left column)
    imageWrapper: 'order-3 mb-6 md:order-1 md:mb-0',
    imageContainer: `relative ${IMAGE_RATIO_STRING} overflow-hidden rounded-3xl border border-ol-var shadow-lg w-full h-full`,
    image: 'w-full h-full object-cover',

    // Illustrator credit below image
    illustratorCredit: 'mt-2 text-sm text-on-sf-var',
    illustratorLabel: 'text-muted-foreground',
    illustratorLink: 'text-on-sf hover:text-pr-cont transition-colors underline decoration-1 underline-offset-2',   
    
    // Right column: Title + metadata - order-2 on both mobile and desktop
    rightColumn: 'order-2 mb-6 md:mb-0 md:flex md:flex-col md:justify-between',
    
    title: cn(
      'mb-4 font-custom font-bold tracking-wide dark:tracking-wider text-on-sf text-3xl leading-[1.2] flex-grow',
      'sm:text-4xl sm:leading-[1.2]',
      'md:text-3xl md:leading-[1.2] md:mb-0',
      'lg:text-4xl lg:leading-[1.2]',
      'xl:text-5xl xl:leading-[1.2]'
    ),
    
    // Metadata box - hidden on mobile, visible on desktop at bottom of right column
    metadataBox: 'hidden md:block mt-8',
    
    // Authors wrapper
    authorsWrapper: '',
    
    dateText: 'font-medium max-lg:text-sm text-on-sf-var max-md:hidden',
    
    // Lead paragraph - order-4, full width
    lead: cn(
      'order-4 font-light dark:font-extralight text-on-sf',
      'max-sm:px-4 pt-6', 
      'md:col-span-2 md:max-w-2xl md:mx-auto', 
      'text-xl leading-9',
      'md:text-2xl md:leading-9',
      'lg:text-2xl lg:leading-9 lg:max-w-3xl',
      'xl:max-w-4xl',
    ),
  },

  // Article container
  articleContainer: 'container overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 pb-12 md:pb-20 lg:pb-32 xl:pb-40',

  // Content wrapper
  content: {
    container: 'pb-16 md:pb-20 lg:pb-[88px] xl:pb-[96px] not-prose',
  },
} as const;

// ================================================================
// TYPOGRAPHY ELEMENTS
// ================================================================

export const ELEMENTS_STYLES = {
  // Heading levels
  heading: {
    base: cn(
      'text-on-sf', 
      'max-w-2xl mx-auto'
    ),
    h2: cn(
      'font-semibold font-serif', 
      'text-3xl my-8 mt-12', 
      'md:text-3xl',
      'lg:text-5xl lg:max-w-4xl'
    ),
    h3: cn(
      'font-medium font-serif', 
      'text-2xl mb-6 mt-8', 
      'md:text-2xl',
      'lg:text-4xl lg:max-w-4xl'
    ),
    h4: cn(
      'uppercase font-medium font-serif',
      'text-xl mb-4 mt-6', 
      'md:text-xl',
      'lg:text-2xl lg:max-w-4xl'
    ),
  },

  // Paragraph
  paragraph: {
    base: cn(
      'font-serif dark:font-light text-on-sf', 
      'first:mt-0 last:mb-0',
      'mb-3',
      'max-w-xl mx-auto',
      'text-lg leading-[1.5]',
      'lg:text-xl lg:leading-[1.5] lg:max-w-3xl'
    )
  },

  // Links
  link: {
    base: 'text-pr-cont hover:text-pr-fix underline transition-colors duration-200',
    external: 'inline-flex items-center gap-1',
    externalIcon: 'w-3 h-3',
  },

  // Lists
  list: {
    base: cn(
      'font-serif dark:font-light text-on-sf',
      'my-6 pl-6 space-y-2',
      'max-w-xl mx-auto',
      'text-lg leading-[1.5]',
      'lg:text-xl lg:leading-[1.5] lg:max-w-3xl lg:mb-16'
    ),
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
    figure: `max-w-svw -mx-2 my-8 md:my-12 lg:my-16 md:mx-auto`,
    container: `mx-auto overflow-hidden bg-sf-cont`,
    image: 'block w-full h-full object-contain',
    caption: 'max-md:mx-2 max-w-2xl lg:max-w-4xl mx-auto mt-2 prose lg:prose-lg text-on-sf-var text-center',
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
    container: cn(
      'relative mb-6 p-6 mt-8',
      'max-w-xl mx-auto',
      'lg:my-12',
      'before:content-["”"] before:text-8xl before:text-sec-cont before:absolute before:-mt-2'
    ),
    content: cn(
      'text-on-sf-var dark:text-on-sf my-0 pt-12 pb-4 font-semibold dark:font-medium font-serif',
      'text-xl leading-[1.75]',
      'md:text-2xl md:leading-[1.75]',
      'lg:text-3xl lg:leading-[1.75]'
    ),
  },

// Blockquote Type 2 (Quote with Author)
  blockquote2: {
    container: cn(
      'relative mb-6 p-6 mt-8',
      'max-w-xl mx-auto',
      'lg:my-12',
      'before:content-["”"] before:text-8xl before:text-sec-cont before:absolute before:-mt-2'
    ),
    content: cn(
      'text-on-sf-var dark:text-on-sf my-0 pt-12 pb-4 font-medium dark:font-normal font-serif',
      'text-xl leading-[1.75]',
      'md:text-xl md:leading-[1.65]',
      'lg:text-2xl'
    ),
    footer: 'text-on-sf-var text-right mt-3 mb-2',
    cite: 'text-on-sf-var max-sm:text-sm font-medium not-italic',
  },

  // Blockquote Type 3 (Epigraph)
  blockquote3: {
    container: 'relative mb-6 p-4 pl-12 md:pl-0 md:pr-12 text-on-sf-var flex flex-col items-end',
    content: 'font-serif leading-relaxed mb-4 md:w-1/2 md:text-lg',
    footer: 'md:w-1/2 text-right',
    cite: 'not-italic flex flex-col',
    author: 'mb-1 max-sm:text-sm',
    source: 'italic max-sm:text-sm mt-0',
  },

  // Blockquote Type 4 (Advice of portal)
  blockquote4: {
    container: cn(
      'relative flex flex-col',
      'rounded-2xl border border-ol shadow-sm',
      'max-w-xl mx-auto my-12',
      'max-sm:mx-6',
      'lg:my-12 lg:max-w-2xl'
    ),
    label: cn(
      'bg-sf text-sec-cont font-semibold tracking-wide',
      '-mt-4 mx-auto px-3 py-1',
      'md:text-lg md:px-4',
      'lg:text-2xl'
    ),
    content: cn(
      'text-lg font-serif leading-relaxed text-on-sf-var dark:text-on-sf',
      'p-6 pt-2',
      'md:p-8 md:pt-4',
      'lg:text-2xl lg:leading-[1.75] lg:p-12 lg:pt-6'
    ),
  },

  // Blockquote Type 5 (Gratitude)
  blockquote5: {
    container: cn(
      'relative flex flex-col',
      'border-t-2 border-ol',
      'max-w-xl mx-auto my-12',
      'max-sm:mx-6',
      'lg:mt-24 lg:max-w-2xl'
    ),
    content: cn(
      'font-serif italic leading-relaxed text-on-sf-fix dark:text-on-sf',
      'pt-2',
      'md:pt-4',
      'lg:text-lg lg:leading-[1.75] lg:pt-6'
    ),
  },

// Table
  table: {
    wrapper: `max-w-svw -mx-2 my-8 md:my-12 lg:my-16 md:mx-auto`,
    container: cn(
      'relative mx-auto overflow-x-auto',
      'max-w-full',
      ' [&::-webkit-scrollbar]:h-2',
      ' [&::-webkit-scrollbar-track]:bg-sf-cont',
      ' [&::-webkit-scrollbar-thumb]:bg-ol',
      ' [&::-webkit-scrollbar-thumb]:rounded-full'
    ),
    table: cn(
      'table-auto w-full border-collapse', 
      'min-w-[375px] max-w-4xl mx-auto'
    ),
    header: 'bg-sf-var',
    headerCell: cn(
      'px-4 py-3 font-semibold text-on-sf border-b-2 border-ol',
      'text-sm md:text-base',
      'w-auto',
      'first:sticky first:left-0 first:bg-sf-var first:z-10',
    ),
    bodyRow: cn(
      'even:bg-sf-cont odd:bg-sf',
      'hover:bg-sf-hi transition-colors'
    ),
    bodyCell: cn(
      'px-4 py-3 text-on-sf-var border-b border-ol-var',
      'text-sm md:text-base',
      'w-auto',
      'first:sticky first:left-0 first:z-10',
      'first:font-medium first:text-on-sf',
      'even:first:bg-sf-cont odd:first:bg-sf',
      'hover:first:bg-sf-hi'
    ),
    caption: cn(
      'max-w-2xl mx-auto mt-2 px-4 prose lg:prose-lg text-on-sf-var',
      'text-center italic'
    ),
  },

  // InlineArticleCard
  inlineArticleCard: {
    container: cn(
      'not-prose', 
      'my-6 md:my-12',
      'mx-8 sm:mx-auto',
      'max-w-xl md:max-w-2xl', 
      'shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300'
    ),
    link: 'group block w-full',
    card: 'bg-sf-cont flex flex-row items-stretch h-24 sm:h-28 md:h-48',
    imageContainer: `relative flex-shrink-0 overflow-hidden rounded-xl bg-sf-hi 
          w-20 sm:w-24 md:w-40`,
    image: 'object-cover',
    content: 'flex flex-col justify-center flex-grow gap-1 p-3 sm:p-4 min-w-0',
    label: 'text-xs font-medium uppercase tracking-wide mb-1 text-pr-cont hidden sm:block',
    title: cn(
      'font-semibold font-serif text-on-sf-var group-hover:text-on-sf transition-colors duration-200',
      'line-clamp-1 sm:line-clamp-2', 
      'text-sm sm:text-base md:text-lg'
    ),
    description: cn(
      'text-on-sf-var group-hover:text-on-sf transition-colors duration-200', 
      'mt-1 line-clamp-3 hidden md:block',
      'text-xs md:text-sm'
    ),
  },

  // BalloonTip (actual implementation from BalloonTip.tsx)
  balloonTip: {
    container: 'relative group',
    trigger: 'cursor-help bg-sf-cont border-b-4 border-dotted border-ol hover:border-sec-fix transition-colors',
    tooltip: `fixed mb-2 px-4 pt-2 pb-4 bg-sf border border-ol-var text-on-sf rounded-lg shadow-lg z-50 whitespace-normal w-[calc(100vw-2rem)] max-w-lg 
            max-md:text-sm`,  
  },
  
  // Figure and Figcaption (for markdown-generated figures)
  figure: {
    container: 'my-4',
    caption: 'text-center text-sm mt-2 text-on-sf-var',
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
    
    // CategoriesAndRubricSection - Combined layout
    categoriesAndRubric: {
      container: 'w-full max-w-2xl mb-8 md:mb-12 lg:mb-16',
      // Wrapper: column on mobile, row on desktop
      wrapper: 'flex flex-row items-center gap-3',
      
      // Categories navigation - maintains original tag design
      categoriesNav: 'flex flex-wrap gap-2 lg:gap-3',
      categoryTag: cn(
        'px-2 lg:px-3 py-0.5', 
        'max-lg:text-sm rounded-full', 
        'text-pr-cont dark:hover:text-pr-fix',
        'border border-dotted hover:border-solid dark:border-solid ',
        'border-pr-cont dark:hover:border-pr-fix',
        'transition-colors duration-200'
      ),
      
      // Rubric link - similar to author section
      rubricLink: cn(
        'max-md:hidden inline-flex items-center gap-3 p-3 pr-6 rounded-full',
        'bg-sf-cont hover:bg-sf-hi',
        'text-pr-cont dark:hover:text-pr-fix',
        'transition-colors duration-200'
      ),
      rubricIcon: 'relative w-8 h-8',
      rubricText: 'max-lg:text-sm font-medium whitespace-nowrap lowercase',
    },
    
    // AuthorSection (single author - standalone)
    author: {
      container: 'w-full max-w-2xl mx-auto',
      link: 'inline-flex items-stretch gap-3 pr-4 transition-colors group',
      avatar: 'relative w-12 lg:w-16 aspect-square rounded-full overflow-hidden',
      info: 'flex flex-col justify-between',
      name: 'block font-medium text-pr-cont group-hover:text-pr-fix text-lg lg:text-xl',
      label: 'block text-xs lg:text-sm font-medium text-on-sf-var uppercase',
    },
    
    // AuthorsSection (multiple authors)
    authors: {
      container: 'w-full max-w-2xl',
      containerBottomMargin: 'w-full max-w-2xl mt-12 mb-8 md:mb-12 md:mt-20 lg:mt-32 lg:mb-12',
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
    button: cn(
      'text-sf bg-sec-cont hover:bg-sec-fix focus:bg-sec-cont'
    ),
    icon: 'h-6 w-6 md:w-8 md:h-8',
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