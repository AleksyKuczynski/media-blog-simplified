// src/shared/ui/Dropdown/styles.ts

export const DROPDOWN_STYLES = {
  wrapper: 'relative inline-block w-full',
  
  content: {
    base: 'absolute z-[70] shadow-lg bg-sf-hi transition-all duration-200 ease-in-out origin-top rounded-lg w-full left-0',
    open: 'opacity-100 scale-y-100 transform',
    closed: 'opacity-0 scale-y-0 pointer-events-none',
  },
  
  item: {
    base: 'flex items-center justify-between transition-colors duration-200 outline-none cursor-default px-4 py-2 mx-2 first:mt-2 last:mb-2',
    focused: 'bg-pr-cont text-on-pr rounded-lg',
    selected: 'text-pr-cont cursor-default',
    default: 'text-on-sf hover:bg-sf-hst hover:text-pr-cont rounded-lg cursor-pointer',
  },
  
  icon: {
    check: 'h-4 w-4 ml-2',
  }
} as const;