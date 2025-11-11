// src/main/components/Article/Captions/constants.ts

// Mode detection
export const STATIC_MODE_MAX_LINES = 3;
export const DEFAULT_LINE_HEIGHT = 20; // Fallback when CSS line-height can't be parsed

// Height calculations
export const EXPANDED_MAX_HEIGHT_RATIO = 0.8; // Maximum 80% of image height when expanded
export const MINIMIZED_PADDING = 32; // 3 lines + padding for minimized captions

// Z-index layering
export const CAPTION_Z_INDEX = {
  BASE: 20,
  EXPANDED: 25,
  VERTICAL_NAV: 30
} as const;

// Animation and timing
export const CAPTION_ANIMATION_DURATION = 300; // ms
export const MEASUREMENT_DEBOUNCE_DELAY = 150; // ms

// CSS Classes - reusable class combinations
export const CAPTION_BASE_CLASSES = 'absolute left-0 right-0 bottom-0 transition-all duration-300 ease-out';

export const CAPTION_THEME_CLASSES = {
  DEFAULT: 'theme-default:bg-sf/90 theme-default:backdrop-blur-sm',
  ROUNDED: 'theme-rounded:bg-sf/95 theme-rounded:backdrop-blur-md theme-rounded:rounded-t-2xl',
  SHARP: 'theme-sharp:bg-sf theme-sharp:border-t theme-sharp:border-ol'
} as const;

export const CAPTION_CONTENT_CLASSES = {
  DEFAULT: 'theme-default:px-4 theme-default:py-3',
  ROUNDED: 'theme-rounded:px-6 theme-rounded:py-4',
  SHARP: 'theme-sharp:px-4 theme-sharp:py-2'
} as const;

// Expansion indicator
export const EXPANSION_INDICATOR_CLASSES = 'absolute top-2 right-2 w-6 h-6 rounded-full bg-on-sf/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 text-on-sf text-xs hover:bg-on-sf/30';
