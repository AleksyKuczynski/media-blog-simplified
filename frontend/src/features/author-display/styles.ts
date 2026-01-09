// src/features/author-display/styles.ts
import { cn } from "@/lib/utils";

export const AUTHOR_CARD_STYLES = {
  // Container styling - manages its own responsive width
  container: cn(
    'h-full relative rounded-2xl overflow-hidden',
    'bg-sf-cont shadow-sm hover:shadow-lg',
    'dark:hover:shadow-[0px_0px_7px_5px_rgba(255,255,255,0.2)] transition-shadow duration-200 group',
    'transition-shadow duration-200 group',
    // Width control: full width below lg, 2 cols on lg+
    'w-full max-w-[688px] xl:max-2xl:max-w-[592px]',
    'flex'
  ),
  
  // Link wrapper (when linkToProfile is true)
  link: 'block h-full',
  
  // Avatar container (larger than carousel)
  avatarContainer: 'relative w-2/5 aspect-square rounded-md overflow-hidden',
  
  // Avatar image
  avatarImage: 'object-cover w-full h-full',
  
  // Avatar fallback (when no image)
  avatarFallback: 'w-full h-full bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center',
  avatarFallbackText: 'text-on-pr-cont text-4xl font-bold',
  
  // Grid layout
  grid: cn(
    'flex flex-col',
    'gap-2 p-3 w-3/5',
    'sm:gap-3 sm:p-4',

  ),
  
  // Author name
  name: cn(
    'text-on-sf grow',
    'text-xl sm:text-3xl md:text-4xl xl:max-2xl:text-3xl'

  ),
  
  // Bio text
  bio: cn(
    'text-on-sf-var',
    'line-clamp-2 sm:line-clamp-5 xl:max-2xl:line-clamp-4',
    'max-sm:text-sm lg:text-lg'
  ),

  // Total articles
  count: 'text-xs text-on-sf-var mt-1',
} as const;

export const AUTHOR_CARD_SKELETON_STYLES = {
  // Inherit base structure
  container: cn(AUTHOR_CARD_STYLES.container, 'animate-pulse'),
  grid: AUTHOR_CARD_STYLES.grid,
  
  // Skeleton-specific elements
  avatar: cn(AUTHOR_CARD_STYLES.avatarContainer, 'bg-sf-hi'),
  name: 'h-6 bg-on-sf/10 rounded self-end',
  nameSecond: 'h-6 w-3/4 bg-on-sf/10 rounded',
  bio: 'h-4 bg-on-sf/10 rounded',
} as const;