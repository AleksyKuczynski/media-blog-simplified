// src/features/rubric-display/styles.ts

import { cn } from "@/lib/utils";

export const RUBRIC_CARD_STYLES = {
  // Card container - manages its own responsive width
  card: cn(
    'group relative overflow-hidden rounded-2xl',
    'bg-sf-cont shadow-sm hover:shadow-lg transition-all duration-200',
    // Width control: 2 cols on small screens, 3 cols on lg+
    'w-full max-w-[360px] mx-auto',
    'p-8 2xl:p-8 flex flex-col'
  ),
  
  // Header with icon and count
  header: 'mb-4 flex items-center justify-between',
  
  // Icon container
  iconWrapper: 'relative mx-auto h-32 aspect-square',
  iconImage: 'object-contain',
  iconFallback: 'h-32 aspect-square rounded-lg bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center',
  iconFallbackText: 'text-on-pr-cont text-lg font-bold',
  
  // Title
  title: 'mt-3 py-3 text-xl text-on-sf md:max-lg:text-2xl 2xl:text-2xl font-medium font-serif uppercase text-center grow self-center',
  titleLink: 'before:absolute before:inset-0',
  
  // Description
  description: 'max-md:hidden text-on-sf-var mb-4 line-clamp-3 lg:text-lg',
  
  // Action link
  action: 'w-full mt-auto pt-2 flex justify-between',
  actionText: 'max-lg:text-sm font-medium text-pr-cont group-hover:underline inline-flex items-center gap-1',
  
  // Article count
  articleCount: 'max-lg:text-sm text-on-sf-var font-medium',
  
  // Screen reader
  srOnly: 'sr-only',
} as const;

export const RUBRICS_GRID_STYLES = cn(
  'w-full',
  'grid',
  'grid-cols-1',
  'md:grid-cols-2',
  'lg:grid-cols-3',
  'xl:grid-cols-4',
  'auto-rows-fr',
  'gap-2',
  'p-2 sm:p-4 md:p-8 2xl:p-16'
);