// src/features/rubric-display/styles.ts

export const RUBRIC_CARD_STYLES = {
  // Card container - manages its own responsive width
  card: [
    'group relative overflow-hidden rounded-2xl',
    'bg-sf-cont shadow-sm hover:shadow-lg transition-all duration-200',
    // Width control: 2 cols on small screens, 3 cols on lg+
    'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]',
    'p-6 flex flex-col'
  ].join(' '),
  
  // Header with icon and count
  header: 'mb-4 flex items-center justify-between',
  
  // Icon container (larger than carousel - 48px)
  iconWrapper: 'relative h-12 w-12',
  iconImage: 'object-contain',
  iconFallback: 'h-12 w-12 rounded-lg bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center',
  iconFallbackText: 'text-on-pr-cont text-lg font-bold',
  
  // Article count
  articleCount: 'text-sm text-on-sf-var font-medium',
  
  // Title
  title: 'mb-3 text-2xl font-semibold group-hover:text-pr-cont transition-colors',
  titleLink: 'before:absolute before:inset-0',
  
  // Description
  description: 'text-sm text-on-sf-var mb-4 line-clamp-3 flex-grow',
  
  // Action link
  action: 'mt-auto pt-2',
  actionText: 'text-sm font-medium text-pr-cont group-hover:underline inline-flex items-center gap-1',
  
  // Screen reader
  srOnly: 'sr-only',
} as const;