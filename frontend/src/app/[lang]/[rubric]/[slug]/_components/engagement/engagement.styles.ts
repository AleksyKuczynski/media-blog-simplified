// app/[lang]/[rubric]/[slug]/_components/engagement/engagement.styles.ts
/**
 * Engagement Components - Centralized Style Constants
 * 
 * Organized by component:
 * - ENGAGEMENT_BAR_STYLES: Main fixed sidebar container
 * - ENGAGEMENT_METRIC_STYLES: Individual metric display
 * - SHARE_POPUP_STYLES: Share modal and platform buttons
 * - ENGAGEMENT_ERROR_STYLES: Error toast notifications
 * - ENGAGEMENT_LOADING_STYLES: Skeleton loading states
 */

export const ENGAGEMENT_BAR_STYLES = {
  container: {
    base: 'fixed bottom-4 left-4 z-[60] flex md:flex-col gap-2 py-3 px-4 bg-pr-cont hover:bg-pr-fix text-on-pr rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
    visible: 'opacity-100 translate-y-0',
    hidden: 'opacity-0 translate-y-4 pointer-events-none',
  },
  divider: 'h-px bg-on-pr/20 mx-2',
} as const;

export const ENGAGEMENT_METRIC_STYLES = {
  container: {
    base: 'flex md:flex-col gap-1 items-center justify-center transition-all rounded-lg',
    interactive: 'cursor-pointer hover:scale-105',
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'animate-pulse',
  },
  icon: {
    wrapper: 'w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0',
  },
  count: {
    base: 'text-xs sm:text-sm font-medium tabular-nums',
  },
  states: {
    view: {
      active: 'text-on-pr',
      inactive: 'text-on-pr/70',
    },
    like: {
      active: 'text-error',
      inactive: 'text-on-pr/70 hover:text-error',
    },
    share: {
      active: 'text-on-pr',
      inactive: 'text-on-pr/70 hover:text-on-pr',
    },
  },
} as const;

export const SHARE_POPUP_STYLES = {
  modal: {
    size: 'md' as const,
    position: 'center' as const,
  },
  header: {
    container: 'px-6 pt-6 pb-4 border-b border-ol-var',
    title: 'text-xl font-semibold text-on-sf',
  },
  content: {
    container: 'p-6',
    grid: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
  },
  platform: {
    button: {
      base: 'flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix focus:ring-offset-2',
    },
    iconWrapper: 'flex items-center justify-center',
    icon: 'w-5 h-5',
    label: 'text-xs font-medium',
  },
  colors: {
    telegram: 'hover:bg-[#0088cc]/10 hover:text-[#0088cc]',
    whatsapp: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
    vk: 'hover:bg-[#0077FF]/10 hover:text-[#0077FF]',
    twitter: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    facebook: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
    instagram: 'hover:bg-gradient-to-tr hover:from-[#fd5949] hover:via-[#d6249f] hover:to-[#285AEB]/10 hover:text-[#d6249f]',
    copy: 'hover:bg-on-sf-var/10 hover:text-on-sf',
  },
  success: {
    wrapper: 'mt-4 pt-4 border-t border-ol-var',
    message: 'px-3 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 text-sm rounded-lg text-center font-medium',
  },
} as const;

export const ENGAGEMENT_ERROR_STYLES = {
  toast: {
    container: 'fixed top-20 left-1/2 -translate-x-1/2 z-[70] max-w-md w-full mx-4',
    content: 'p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-center justify-between shadow-lg',
    closeButton: 'ml-2 text-red-600 hover:text-red-800 font-bold',
  },
} as const;

export const ENGAGEMENT_LOADING_STYLES = {
  skeleton: {
    container: 'flex flex-col items-center gap-1 p-2 animate-pulse',
    icon: 'w-5 h-5 sm:w-6 sm:h-6 bg-on-pr/20 rounded-full',
    count: 'w-8 h-3 bg-on-pr/20 rounded',
  },
} as const;