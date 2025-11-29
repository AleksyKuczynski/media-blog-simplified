// src/features/rubric-display/styles.ts

export const RUBRIC_CARD_STYLES = {
  // Card container
  card: 'group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg',
  
  // Header with icon and count
  header: 'mb-4 flex items-center justify-between',
  
  // Icon container
  iconWrapper: 'relative h-8 w-8',
  iconImage: 'object-contain',
  iconFallback: 'h-8 w-8 rounded bg-muted flex items-center justify-center',
  iconFallbackText: 'text-muted-foreground text-xs',
  
  // Article count
  articleCount: 'text-sm text-muted-foreground',
  
  // Title
  title: 'mb-2 text-xl font-semibold group-hover:text-primary transition-colors',
  titleLink: 'before:absolute before:inset-0',
  
  // Description
  description: 'text-sm text-muted-foreground mb-4 line-clamp-3',
  
  // Action link
  action: 'mt-auto',
  actionText: 'text-sm font-medium text-primary group-hover:underline',
  
  // Screen reader
  srOnly: 'sr-only',
} as const;

export const RUBRICS_SECTION_STYLES = {
  // Section wrapper
  section: 'py-16',
  container: 'container mx-auto px-4',
  
  // Header
  header: 'text-center mb-12',
  heading: 'text-3xl font-bold mb-4 text-on-sf',
  description: 'text-lg text-on-sf-var max-w-2xl mx-auto mb-8',
  
  // View all link
  viewAll: {
    link: 'inline-flex items-center gap-2 text-pr-cont hover:text-pr-fix font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2 rounded group',
    arrow: 'transform transition-transform duration-200 group-hover:translate-x-1',
  },
  
  // Grid wrapper
  grid: 'max-w-7xl mx-auto',
} as const;

export const RUBRIC_SECTION_STYLES = {
  // Container (for article page rubric display)
  container: 'mb-4',
  
  // Link
  link: 'inline-flex items-center gap-2 text-pr-cont hover:text-pr-fix transition-colors duration-200',
  
  // Icon
  icon: 'relative w-6 h-6 flex-shrink-0',
  
  // Text
  text: 'font-medium',
} as const;