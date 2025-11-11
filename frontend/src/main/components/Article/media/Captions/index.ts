// src/main/components/Article/Captions/index.ts

export { Caption } from './Caption';
export type { 
  CaptionMode, 
  CaptionState, 
  CaptionBehavior, 
  CarouselItemWithBehavior,
  CaptionConfig
} from './types';
export { 
  createInitialCaptionBehavior,
  getInitialStateForMode,
  isInteractable,
  isClickableCaption,
  detectCaptionMode,
  calculateCaptionHeight,
  calculateCaptionZIndex
} from './utils';
export * from './constants';