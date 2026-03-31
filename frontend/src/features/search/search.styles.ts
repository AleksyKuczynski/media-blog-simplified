// features/search/search.styles.ts
/**
 * Search Components - Centralized Style Constants
 */

import { cn } from "@/lib/utils";

// Styles for the mobile search component
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
  clearButton: 'absolute right-2 pb-3 text-on-sf-var hover:text-on-sf transition-colors duration-200 rounded-full hover:bg-sf-hi',
  clearIcon: 'w-5 h-5',
} as const;

// Styles for the search bar form component
export const SEARCH_BAR_FORM_STYLES = {
  container: cn(
    'flex flex-row justify-center border dark:border-2 border-ol mx-auto group transition-all duration-300 flex-shrink-0',
    'focus-within:border-transparent focus-within:ring-1 focus-within:ring-ol focus-within:ring-offset-1',
    'mb-8 rounded-full mx-4',
    'xs:mx-6',
    'md:mx-auto md:max-w-[720px]',
    'lg:max-w-[796px]',
    'xl:max-w-[896px]',
  ),
  wrapper: 'relative w-full',
  inputWrapper: cn(
    'flex items-center gap-3',
    'bg-sf rounded-full shadow-md hover:shadow-lg focus-within:shadow-none transition-all duration-200',
    ' px-3 py-3',
  ),
  icon: 'text-sf pointer-events-none flex-shrink-0',
  iconSize: cn(
    'aspect-square bg-sf-hst p-3 rounded-full',
    'w-6',
    'md:w-7',
    'xl:w-[60px]',
  ),
  dropdown: 'absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50',
  tips: {
    base: 'absolute top-full left-0 right-0 mt-4 text-on-sf-var p-6 bg-sf-cont rounded-2xl pointer-events-none origin-top transition-all duration-300',
    visible: 'opacity-100 scale-y-100',
    hidden: 'opacity-0 scale-y-0',
  },
  input: {
    wrapper: cn(
      'relative flex-1 flex flex-col truncate',
      'rounded-r-full text-sm',
      'md:text-base',
      'xl:text-lg',
    ),
    label: cn(
      'text-xs lowercase font-medium text-sec-dim',
      'md:text-sm',
      'xl:text-base',
    ),
    input: cn(
      'w-full bg-transparent text-on-sf placeholder:text-on-sf-var/50 focus:outline-none lowercase',
      'text-sm',
      'md:text-base',
      'xl:text-lg',
    ),
    clearButton: 'absolute right-0 top-6 pt-1 pr-3 text-on-sf-var hover:text-on-sf transition-colors duration-200 rounded-full hover:bg-sf-hi',
    clearIcon: 'w-5 h-5',
  }
} as const;

export const SEARCH_WITH_SORTING_STYLES = {
  // Combined container (like FilterGroup)
  container: cn(
    'flex flex-row justify-center border dark:border-2 border-ol mx-auto group transition-all duration-300 flex-shrink-0',
    'mb-8 rounded-full mx-4',
    'xs:mx-6',
    'sm:mx-auto sm:max-w-[720px]',
    '',
    'lg:max-w-[896px]',
    'xl:max-w-[896px]',
  ),
  inactive: 'bg-sf shadow-md',
  active: 'bg-sf-hst shadow-none',
  activeHover: 'bg-sf-hi shadow-none',
  
  // Divider between controls
  divider: {
    base: 'w-px dark:w-[2px] bg-ol self-center h-12 md:h-16 xl:h-20 transition-opacity duration-300',
    visible: 'opacity-100',
    hidden: 'opacity-0',
  },
  
  // Search wrapper (takes remaining space)
  searchWrapper: cn(
    'flex flex-col flex-1 py-3 px-3',
    'hover:bg-sf-hi rounded-full',
    'focus-within:bg-sf focus-within:shadow-md focus-within:rounded-full transition-all duration-200',
  ),
  
  // Sorting wrapper (fixed width like in FilterGroup)
  sortingWrapper: cn(
    'flex flex-col',
    'w-[200px] xl:w-[240px]',
  ),
} as const;

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

// Styles for the main search page component
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

// Styles for the results section component
export const SEARCH_RESULTS_SECTION_STYLES = {
  container: cn(
    'mx-auto mb-12 max-w-3xl flex flex-col gap-2',
    'sm:px-6 lg:px-8',
  ),
  heading: 'mx-2 mb-4 xl:mb-6 font-medium uppercase text-on-sf-dim',
  sorting: 'mx-auto -mt-4 mb-6',
  list: 'space-y-4',
} as const;

export const SEARCH_RESULTS_HEADER_STYLES = {
  container: cn(
    'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4',
    'max-w-5xl mx-auto',
    'my-6 xl:mb-16',
    '',
  ),
  title: 'text-3xl mb-4 text-on-sf',
  span: 'font-normal',
  count: 'mt-8 px-6 py-4 bg-sf rounded-2xl text-sec-dim font-medium lowercase',
  description: 'text-lg text-on-sf-var',
  textContainer: 'mx-auto',
  sortContainer: 'w-1/4',
} as const;

export const SEARCH_RESULT_CARD_STYLES = {
  author: {
    link: 'block bg-sf-cont mx-2 max-w-80 px-8 py-4 rounded-xl transition-colors duration-200',
    container: 'flex items-start gap-6',
    content: 'flex-1',
    badge: {
      container: 'flex items-center gap-2 mb-2',
      text: 'text-sm font-medium uppercase tracking-wide text-on-sf-var opacity-70',
    },
    name: 'text-xl uppercase text-on-sf mb-2',
    bio: 'max-md:hidden text-on-sf-var line-clamp-2 mb-3',
    count: 'text-sm font-medium text-on-sf-var',
  },
  category: {
    link: 'block mx-2 max-w-80 transition-colors duration-200',
    container: 'flex flex-col justify-between gap-1 px-8 py-4 bg-sf-cont text-pr-cont rounded-xl',
    name: 'text-xl uppercase',
    count: 'text-sm font-medium text-on-sf-var',
  },
} as const;
