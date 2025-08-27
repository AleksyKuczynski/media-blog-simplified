// src/main/lib/image-utils/imageFrameTypes.ts

export type ViewportBreakpoint = 
  | 'mobile-portrait' 
  | 'mobile-landscape' 
  | 'tablet-portrait' 
  | 'tablet-landscape'
  | 'desktop-portrait' 
  | 'desktop-landscape';

export type ImageDisplayMode = 'center-horizontal' | 'center-vertical' | 'square';

export interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  filename?: string;
}

export interface ImageFrameDimensions {
  ratio: number;
  maxHeight: number;
  height: number;
  imageDisplayMode: ImageDisplayMode;
  width?: number;
}

export interface BreakpointConstraints {
  maxRatio: number;
  minRatio: number;
  maxHeight: number;
  preferredRatio: number;
  maxWidth: number;
}

export interface ImageFrameCalculationInput {
  imageAttributes: ImageAttributes;
  viewportWidth: number;
  viewportHeight: number;
  maxWidth?: number;
}

export interface ViewportState {
  width: number;
  height: number;
  isLandscape: boolean;
  breakpoint: ViewportBreakpoint;
}

// Simplified version of carousel's constraint system
export const BREAKPOINT_CONSTRAINTS: Record<ViewportBreakpoint, BreakpointConstraints> = {
  'mobile-portrait': {
    maxRatio: 1,
    minRatio: 0.75,
    maxHeight: 500,
    preferredRatio: 0.8,
    maxWidth: 343 // 375px - 32px margins
  },
  'mobile-landscape': {
    maxRatio: 1.5,
    minRatio: 1,
    maxHeight: 400,
    preferredRatio: 1.33,
    maxWidth: 635 // 667px - 32px margins
  },
  'tablet-portrait': {
    maxRatio: 1.5,
    minRatio: 0.67,
    maxHeight: 600,
    preferredRatio: 1,
    maxWidth: 720 // 768px - 48px margins
  },
  'tablet-landscape': {
    maxRatio: 1.78,
    minRatio: 0.75,
    maxHeight: 500,
    preferredRatio: 1.33,
    maxWidth: 976 // 1024px - 48px margins
  },
  'desktop-portrait': {
    maxRatio: 2,
    minRatio: 0.5,
    maxHeight: 800,
    preferredRatio: 1,
    maxWidth: 1136 // 1200px - 64px margins
  },
  'desktop-landscape': {
    maxRatio: 2,
    minRatio: 0.5,
    maxHeight: 700,
    preferredRatio: 1.5,
    maxWidth: 1136 // 1200px - 64px margins
  }
};