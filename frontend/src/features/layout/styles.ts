// features/layout/styles.ts
/**
 * Layout Components - Centralized Style Constants
 * 
 * Organized by component:
 * - SECTION_STYLES: Section wrapper, container, title
 * - FOOTER_STYLES: Footer grid, columns, links, copyright
 */

export const SECTION_STYLES = {
  wrapper: {
    base: 'w-full pb-6 lg:pb-8 xl:pb-12 relative',
    primary: 'bg-pr-sf',
    secondary: 'bg-sec-sf',
    tertiary: 'bg-tr-sf',
    default: 'bg-sf',
    withNextTitle: 'pb-16 sm:pb-20 lg:pb-24',
  },
  container: {
    base: 'container-fluid mx-auto',
    withTitle: 'pt-16 sm:pt-20 lg:pt-24',
  },
  header: {
    wrapper: 'absolute -top-7 sm:-top-8 md:-top-10 lg:-top-12 left-0 right-0',
    title: {
      base: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase pl-1 leading-tight',
      primary: 'text-pr-sf',
      secondary: 'text-sec-sf',
      tertiary: 'text-tr-sf',
      default: 'text-sf',
    },
  },
} as const;

export const FOOTER_STYLES = {
  container: 'bg-sf-cont text-on-sf-var py-12 md:py-16',
  innerContainer: 'container mx-auto px-4',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6',
  
  section: {
    wrapper: 'space-y-4',
    heading: 'text-lg font-semibold text-prcolor',
    description: 'text-sm leading-relaxed',
  },
  
  nav: {
    wrapper: 'space-y-2',
    itemWrapper: '',
  },
  
  link: {
    base: 'text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded',
    external: 'text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded',
  },
  
  contact: {
    divider: 'pt-2 border-t border-ol-var/20',
    button: 'inline-block px-4 py-2 text-sm font-medium text-on-pr bg-pr-cont hover:bg-pr-fix rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2',
  },
  
  copyright: {
    wrapper: 'mt-12 pt-8 border-t border-ol-var/20',
    text: 'text-center text-sm text-on-sf-var',
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