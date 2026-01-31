// features/search/search.styles.ts
/**
 * Search Components - Centralized Style Constants
 */

import { cn } from "@/lib/utils";

export const SEARCH_DROPDOWN_STYLES = {
  container: {
    base: 'absolute z-50 shadow-lg bg-sf-hi w-full top-full mt-2 max-h-[80vh] origin-top transition-none rounded-xl',
  },
  visibility: {
    hidden: 'scale-y-0 opacity-0 -translate-y-4 pointer-events-none invisible',
    animatingIn: 'scale-y-100 opacity-100 translate-y-0 transition-all duration-300 ease-out delay-150 visible',
    visible: 'scale-y-100 opacity-100 translate-y-0 transition-none visible',
    animatingOut: 'scale-y-0 opacity-0 -translate-y-4 transition-all duration-300 ease-in pointer-events-none',
  },
  content: {
    wrapper: 'transition-opacity duration-150 opacity-100',
    message: 'px-4 py-2 text-on-sf-var rounded-lg mx-2',
  },
} as const;

export const SEARCH_DROPDOWN_ITEM_STYLES = {
  item: {
    base: 'cursor-pointer transition-colors duration-300 px-4 py-2 mx-2 first:mt-2 last:mb-2',
    highlighted: 'bg-pr-fix text-on-pr rounded-lg',
    default: 'text-on-sf hover:bg-sf-cont hover:text-pr-fix rounded-lg',
  },
  badge: 'text-xs font-medium uppercase tracking-wide opacity-70 mb-1',
  title: 'font-medium',
  description: {
    base: 'text-sm truncate mt-0.5',
    highlighted: 'text-txcolor-inverted/80',
    default: 'text-txcolor-secondary',
  },
  meta: {
    base: 'text-sm mt-0.5',
    highlighted: 'text-txcolor-inverted/80',
    default: 'text-txcolor-secondary',
  },
} as const;

export const MOBILE_SEARCH_STYLES = {
  container: 'flex flex-col h-full',
  inputContainer: 'flex-shrink-0 px-3 py-3',
  inputWrapper: 'relative flex gap-3 items-center bg-sf rounded-xl shadow-md focus-within:ring-2 focus-within:ring-pr-fix focus-within:ring-offset-2 transition-shadow duration-200',
  iconWrapper: 'pl-4 text-on-sf-var cursor-pointer hover:text-on-sf transition-colors disabled:opacity-50 disabled:cursor-not-allowed',  suggestionsContainer: 'flex-1 overflow-y-auto px-6 pb-6',
  emptyState: 'text-center py-12 text-on-sf-var',
  emptyIcon: 'w-16 h-16 mx-auto mb-4 text-on-sf-var/30',
  emptyText: 'text-lg mb-2',
  emptyHint: 'text-sm opacity-70',
  suggestionsList: 'space-y-3',
  suggestion: {
    base: 'w-full text-left p-4 rounded-lg transition-all duration-200',
    default: 'text-on-sf-var hover:bg-sf-hi hover:text-on-sf',
    highlighted: 'bg-sf-hi text-on-sf',
    badge: 'flex items-center gap-2 mb-1',
    badgeText: 'text-xs font-medium uppercase tracking-wide text-on-sf-var opacity-70',
    title: 'font-medium text-base',
    description: 'text-sm opacity-80 mt-1 line-clamp-2',
    meta: 'text-sm opacity-80 mt-1',
  },
  tips: {
    span: 'font-bold mt-0.5',
    list: 'space-y-1 text-left',
    item: 'flex items-start gap-2',
  },

} as const;

export const SEARCH_INPUT_STYLES = {
  wrapper: 'relative flex-1 flex items-center',
  input: 'w-full py-3 px-4 bg-transparent text-on-sf placeholder:text-on-sf-var/50 focus:outline-none',
  clearButton: 'absolute right-2 p-2 text-on-sf-var hover:text-on-sf transition-colors duration-200 rounded-full hover:bg-sf-hi',
  clearIcon: 'w-5 h-5',
} as const;

export const SEARCH_BAR_FORM_STYLES = {
  container: cn(
    'relative mx-4 pt-4',
    'xs:mx-6',
    'sm:mx-auto sm:max-w-md',
    'lg:max-w-lg',
    'xl:max-w-lg',
  ),
  wrapper: 'relative',
  inputWrapper: 'flex items-center gap-3 bg-sf rounded-2xl shadow-md hover:shadow-lg focus-within:shadow-none focus-within:ring-1 focus-within:ring-pr-fix focus-within:ring-offset-2 transition-all duration-200 px-4 py-3',
  icon: 'text-on-sf-var pointer-events-none flex-shrink-0',
  iconSize: cn(
    'w-6 h-6',
    'md:w-7 md:h-7',
    'xl:w-8 xl:h-8',
  ),
  dropdown: 'absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50',
  tips: {
    base: 'absolute top-full left-0 right-0 mt-4 text-on-sf-var p-6 bg-sf-cont rounded-2xl pointer-events-none origin-top transition-all duration-300',
    visible: 'opacity-100 scale-y-100',
    hidden: 'opacity-0 scale-y-0',
  },
  input: {
    wrapper: 'relative flex-1 flex flex-col',
    label: cn(
      'text-xs lowercase font-medium text-sec-dim mb-1',
      'md:text-sm',
      'xl:text-base',
    ),
    input: 'w-full py-2 bg-transparent text-on-sf placeholder:text-on-sf-var/50 focus:outline-none lowercase',
    clearButton: 'absolute right-0 top-6 p-2 text-on-sf-var hover:text-on-sf transition-colors duration-200 rounded-full hover:bg-sf-hi',
    clearIcon: 'w-5 h-5',
  }
} as const;

export const SEARCH_PAGE_STYLES = {
  header: {
    container: 'mb-8',
  },
  form: {
    container: 'mb-12',
    wrapper: 'max-w-2xl mx-auto',
  },
  results: {
    section: 'mb-12',
    container: 'space-y-6',
    count: 'text-sm text-on-sf-var mb-4',
    list: 'space-y-6',
    pagination: 'mt-8',
    invalidState: 'text-center py-8 mb-8 bg-sf-hi rounded-lg',
    emptyState: 'text-center py-12 text-on-sf-var origin-top transition-all duration-300 opacity-100 scale-y-100',
    emptyTitle: 'text-xl font-bold mb-2 text-on-sf',
    emptyDescription: 'text-on-sf-var',
    stateText: 'text-on-sf-var',
  },
  tips: {
    span: 'font-black mt-1 text-sec-cont',
    list: 'space-y-1',
    item: 'flex items-start gap-2 lowercase',
  },
} as const;

export const SEARCH_RESULT_CARD_STYLES = {
  author: {
    link: 'block bg-sf-cont p-8 rounded-2xl transition-colors duration-200',
    container: 'flex items-start gap-6',
    content: 'flex-1',
    badge: {
      container: 'flex items-center gap-2 mb-2',
      text: 'text-sm font-medium uppercase tracking-wide text-on-sf-var opacity-70',
    },
    name: 'text-2xl uppercase text-on-sf mb-2',
    bio: 'text-on-sf-var line-clamp-2 mb-3',
    count: 'text-sm font-medium text-on-sf-var',
  },
  category: {
    link: 'block p-6 px-8 bg-sf-cont rounded-xl hover:bg-sf-hi transition-colors duration-200',
    container: 'flex items-center justify-between gap-4',
    name: 'text-xl font-bold text-pr-cont p-4 border-2 border-pr-fix rounded-full',
    count: 'text-sm font-medium text-on-sf-var',
  },
} as const;

export const SEARCH_RESULTS_HEADER_STYLES = {
  container: cn(
    'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4',
    'max-w-5xl mx-auto',
    'mb-6 xl:mb-16',
    'border-b border-ol pb-6',
  ),
  title: 'text-3xl mb-4 text-on-sf',
  span: 'font-normal',
  count: 'text-on-sf-var mb-4 lowercase',
  description: 'text-lg text-on-sf-var',
  textContainer: '',
  sortContainer: 'w-1/4',
} as const;

export const SEARCH_RESULTS_SECTION_STYLES = {
  container: 'mb-12 max-w-3xl mx-auto',
  heading: 'text-xl capitalize mb-4 xl:mb-6 text-on-sf-var',
  list: 'space-y-4',
} as const;