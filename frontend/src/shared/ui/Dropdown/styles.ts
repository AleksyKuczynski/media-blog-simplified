// src/shared/ui/Dropdown/styles.ts

import { cn } from "@/lib/utils";

export const DROPDOWN_STYLES = {
  wrapper: 'relative inline-block w-full',
  
  content: {
    base: cn(
      'absolute z-[70] shadow-md bg-sf border border-ol transition-all duration-200 ease-in-out origin-top w-full left-0',
      'rounded-xl',
      'md:rounded-2xl',
      'xl:rounded-3xl',
    ),
    open: 'opacity-100 scale-y-100 transform',
    closed: 'opacity-0 scale-y-0 pointer-events-none',
  },
  
  item: {
    base: cn(
      'flex items-center justify-between transition-colors duration-200 outline-none cursor-default lowercase',
      'text-sm px-4 py-2 mx-2 first:mt-2 last:mb-2',
      'md:text-base md:px-6 md:py-3',
      'xl:text-lg xl:px-8 xl:py-4 xl:mx-4 xl:first:mt-4 xl:last:mb-4',
    ),
    focused: cn(
      'bg-sec-fix text-on-sec rounded-xl',
      'md:rounded-2xl',
      'xl:rounded-3xl',
    ),
    selected: 'text-sec-dim cursor-default',
    default: cn(
      'text-on-sf hover:bg-sf-hi rounded-xl cursor-pointer',
      'md:rounded-2xl',
      'xl:rounded-3xl',
    ),
  },
  
  icon: {
    check: 'h-4 w-4 ml-2',
  }
} as const;