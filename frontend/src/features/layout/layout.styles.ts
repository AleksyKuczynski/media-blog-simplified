// features/layout/styles.ts
/**
 * Layout Components - Centralized Style Constants
 * 
 * Organized by component:
 * - SECTION_STYLES: Section wrapper, container, title
 * - FOOTER_STYLES: Footer grid, columns, links, copyright
 */

import { cn } from "@/lib/utils";

export const COLLECTION_DESCRIPTION_STYLES = cn(
  'text-on-sf-var font-serif max-w-3xl shadow-sm leading-relaxed',
  'bg-sf-hi rounded-xl',
  'mx-4 p-6 pb-8 mb-8',
  'xs:mx-6 xs:text-lg xs:leading-relaxed',     
  'sm:mx-8 sm:p-8 sm:pb-12 sm:leading-relaxed', 
  'md:mx-16 md:mb-12 md:rounded-2xl md:leading-relaxed',
  'lg:mx-auto lg:p-12 lg:pb-16 lg:text-xl lg:leading-relaxed',
  'xl:text-xl xl:p-16 xl:pb-20 xl:rounded-3xl xl:leading-relaxed',
  'leading-relaxed'
)

export const SECTION_COUNT_STYLES = cn(
  'mx-auto text-center font-semibold text-on-sf-var bg-sf-cont rounded-full shadow-sm',
  'text-xs w-32 p-2 mb-4',
  'sm:text-sm sm:w-32 sm:mb-6',
  'lg:text-base lg:w-36 lg:p-3',
);

// When positioned with description
export const SECTION_COUNT_OVERLAP_STYLES = cn(
  SECTION_COUNT_STYLES,
  '-mt-12',
  'sm:-mt-[50px]',
  'md:-mt-[66px]',
  'lg:-mt-[72px]',
);

export const CARD_GRID_STYLES = cn(
  'w-full', 
  'flex flex-wrap justify-center',
  'gap-4 lg:gap-6 2xl:gap-8',
  'p-2 sm:p-4 md:p-8  2xl:p-16'
)

export const SECTION_STYLES = {
  wrapper: {
    base: 'w-full pb-6 lg:pb-8 xl:pb-12 relative',
    primary: 'bg-gradient-to-b from-pr-fix to-pr-sf',
    secondary: 'bg-gradient-to-b from-sec-fix to-sec-sf',
    tertiary: 'bg-gradient-to-b from-tr-fix to-tr-sf',
    default: ' bg-gradient-to-b from-sf-hst to-sf-hi',
    withNextTitle: 'pb-16 md:pb-20 lg:pb-[88px] xl:pb-[96px]',
    flexGrow: 'flex-grow',
  },
  container: {
    base: 'mx-auto',
    withTitle: 'pt-8 md:pt-12',
    flexGrow: 'flex flex-col flex-grow',
  },
  header: {
    wrapper: cn('absolute -top-7 -left-[2px] right-0', 
            'sm:-top-8', 
            'md:-top-10 md:-left-[3px]', 
            'lg:-top-[50px] lg:-left-[4px]',
            'xl:-top-[60px] xl:-left-[5px]'),
    title: {
      base: cn(
        'pl-3 font-display font-semibold max-md:font-bold uppercase leading-tight',

        'text-xl', 
        'sm:text-2xl', 
        'md:text-4xl', 
        'lg:text-5xl', 
        'xl:text-6xl'
      ),
      primary: 'text-pr-fix',
      secondary: 'text-sec-fix',
      tertiary: 'text-tr-fix',
      default: 'text-sf-hst',
    },
  },
} as const;

export const FOOTER_STYLES = {
  container: cn(
    'w-full bg-gradient-to-b from-sf-hst to-sf-hi',
  ),
  innerContainer: 'max-w-7xl mx-auto px-4 sm:px-12 py-12',
  
  // Responsive grid with order control
  grid: cn(
    // sm-lg: single column, natural order
    'grid grid-cols-2 gap-8 py-12',
    // lg-xl: 2 columns (2:1 ratio)
    'md:grid-cols-[2fr_1fr] md:gap-x-12 md:gap-y-8 md:py-16',
    // xl+: 4 columns (2:2:1:1 ratio)
    'xl:grid-cols-[2fr_2fr_1fr_1fr] xl:gap-16 xl:py-24 2xl:py-32'
  ),
  
  // Section-specific order classes
  logoSection: cn(
    // sm-md: order 1
    'order-1 max-md:col-span-2 text-center',
    // lg-xl: left column, order 1
    'md:order-1 md:row-span-2',
    // xl+: column 2, row 1
    'xl:col-start-2 xl:row-start-1'
  ),
  
  socialSection: cn(
    // sm-md: order 5
    'order-5 col-start-1',
    // lg-xl: left column, order 2
    'md:order-2 md:col-start-2',
    // xl+: column 2, row 2
    'xl:col-start-4 xl:row-start-2'
  ),
  
  aboutSection: cn(
    // sm-md: order 2
    'order-2 max-md:col-span-2',
    // lg-xl: left column, order 3
    'md:order-4',
    // xl+: column 1, row 1-2 (span 2 rows)
    'xl:col-start-1 xl:row-start-1 xl:row-span-2'
  ),
  
  legalSection: cn(
    // sm-md: order 3
    'order-3',
    // lg-xl: right column, order 1
    'md:order-3 md:col-start-2',
    // xl+: column 4, row 1-2 (span 2 rows)
    'xl:col-start-4 xl:row-start-1'
  ),
  
  quickLinksSection: cn(
    // sm-md: order 4
    'order-4 row-span-2 col-start-2',
    // lg-xl: right column, order 2
    'md:order-5',
    // xl+: column 3, row 1-2 (span 2 rows)
    'xl:col-start-3 xl:row-start-1 xl:row-span-2'
  ),
  
  section: {
    wrapper: '',
    heading: 'text-xs font-medium uppercase text-on-sf-dim mb-6',
    description: 'text-on-sf-var leading-relaxed',
  },
  
  nav: {
    wrapper: 'flex flex-col gap-2',
    itemWrapper: '',
  },
  
  link: {
    base: cn(
      'text-on-sf-var hover:text-prcolor',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded',
      'text-sm'
    ),
  },
  
  social: {
    wrapper: 'flex gap-4',
    link: cn(
      'text-on-sf-var hover:text-prcolor',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded'
    ),
    icon: 'w-6 h-6',
  },
  
  contact: {
    logoWrapper: 'mb-4',
    button: cn(
      'my-12 justify-self-center px-6 py-3 bg-pr-cont text-on-pr',
      'hover:bg-pr-fix',
      'rounded-xl transition-colors duration-200',
      'focus:bg-pr-dim',
      'font-medium'
    ),
  },
  
  copyright: {
    wrapper: cn(
      'mt-8 pt-6 border-t border-on-sf-dim',
      'text-center'
    ),
    text: 'text-sm text-on-sf-var',
  },
} as const;

export const CONTACT_MODAL_STYLES = {
  form: {
    container: 'p-6 space-y-5',
  },
  
  status: {
    base: 'px-4 py-3 rounded-lg text-sm font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    error: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
  
  field: {
    wrapper: '',
    label: 'block text-sm font-medium text-on-sf mb-2',
    required: 'text-red-500 ml-1',
    input: {
      base: 'w-full px-4 py-3 bg-sf-cont border rounded-lg text-on-sf placeholder:text-on-sf-var transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix focus:border-transparent',
      default: 'border-ol-var hover:border-ol-var/60',
      error: 'border-red-500 dark:border-red-500',
      disabled: '',
    },
    textarea: {
      base: 'w-full px-4 py-3 bg-sf-cont border rounded-lg text-on-sf placeholder:text-on-sf-var transition-colors duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-pr-fix focus:border-transparent',
      default: 'border-ol-var hover:border-ol-var/60',
      error: 'border-red-500 dark:border-red-500',
      disabled: '',
    },
    error: 'mt-1.5 text-sm text-red-600 dark:text-red-400',
    hint: 'mt-1.5 text-xs text-on-sf-var',
  },
  
  buttons: {
    wrapper: 'flex gap-3 pt-2',
    primary: 'flex-1 px-6 py-3 bg-pr-cont hover:bg-pr-fix text-on-pr font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'px-6 py-3 bg-transparent border-2 border-ol-var text-on-sf-var hover:text-on-sf hover:border-ol-var/60 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  },
} as const;

// Helper function to get input classes based on state
export const getInputClasses = (hasError: boolean, isTextarea: boolean = false) => {
  const styles = isTextarea ? CONTACT_MODAL_STYLES.field.textarea : CONTACT_MODAL_STYLES.field.input;
  return `${styles.base} ${hasError ? styles.error : styles.default}`;
};

// Helper function to get status message classes
export const getStatusClasses = (type: 'success' | 'error') => {
  return `${CONTACT_MODAL_STYLES.status.base} ${CONTACT_MODAL_STYLES.status[type]}`;
};