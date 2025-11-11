// src/main/components/Article/Captions/utils.ts

import type { CaptionMode, CaptionState, CaptionBehavior } from './types';
import { STATIC_MODE_MAX_LINES } from './constants';

/**
 * Creates initial caption behavior based on content existence
 */
export const createInitialCaptionBehavior = (hasContent: boolean): CaptionBehavior => ({
  mode: 'static', // Will be detected client-side
  state: hasContent ? 'expanded' : 'collapsed',
  hasContent
});

/**
 * Gets the appropriate initial state for a given mode
 */
export const getInitialStateForMode = (mode: CaptionMode, hasContent: boolean): CaptionState => {
  if (!hasContent) return 'collapsed';
  return mode === 'static' ? 'expanded' : 'minimized';
};

/**
 * Determines if a caption behavior allows interaction
 */
export const isInteractable = (behavior: CaptionBehavior): boolean => {
  return behavior.hasContent;
};

/**
 * Determines if a caption is clickable (expandable captions only)
 */
export const isClickableCaption = (behavior: CaptionBehavior): boolean => {
  return behavior.mode === 'expandable' && behavior.hasContent;
};

/**
 * Detects caption mode based on rendered content height
 */
export const detectCaptionMode = (element: HTMLDivElement): CaptionMode => {
  // Create a temporary clone to measure without affecting layout
  const clone = element.cloneNode(true) as HTMLDivElement;
  clone.style.cssText = 'position:absolute;visibility:hidden;height:auto;max-height:none;overflow:visible;pointer-events:none;z-index:-1000';
  
  document.body.appendChild(clone);
  
  try {
    const naturalHeight = clone.scrollHeight;
    const lineHeight = parseFloat(getComputedStyle(clone).lineHeight) || 20;
    const estimatedLines = Math.round(naturalHeight / lineHeight);
    
    console.log(`Caption mode detection: ${estimatedLines} lines (${naturalHeight}px height)`);
    
    return estimatedLines <= STATIC_MODE_MAX_LINES ? 'static' : 'expandable';
  } finally {
    document.body.removeChild(clone);
  }
};

/**
 * Creates a measurement signature to avoid duplicate measurements
 */
export const createMeasurementSignature = (
  contentLength: number, 
  viewportWidth: number, 
  behaviorState: CaptionState
): string => {
  return `${contentLength}-${viewportWidth}-${behaviorState}`;
};

/**
 * Calculates caption height based on mode and state
 */
export const calculateCaptionHeight = (
  mode: CaptionMode,
  state: CaptionState,
  measuredHeight: number,
  imageHeight: number
): string => {
  if (mode === 'static') {
    return `${measuredHeight}px`;
  }
  
  // Expandable captions
  if (state === 'expanded') {
    const maxExpandedHeight = Math.min(measuredHeight, imageHeight * 0.8);
    return `${maxExpandedHeight}px`;
  }
  
  // Minimized state
  const lineHeight = 20;
  const minimizedHeight = lineHeight * 3 + 32;
  return `${Math.min(minimizedHeight, measuredHeight)}px`;
};

/**
 * Calculates appropriate z-index for caption layering
 */
export const calculateCaptionZIndex = (
  navigationLayout: 'horizontal' | 'vertical',
  isExpanded: boolean
): number => {
  if (navigationLayout === 'vertical') return 30;
  return isExpanded ? 25 : 20;
};