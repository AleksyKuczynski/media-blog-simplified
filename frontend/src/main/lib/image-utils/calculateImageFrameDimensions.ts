// src/main/lib/image-utils/calculateImageFrameDimensions.ts

import { 
  ImageFrameCalculationInput, 
  ImageFrameDimensions, 
  ViewportBreakpoint, 
  BREAKPOINT_CONSTRAINTS,
  ImageDisplayMode 
} from './imageFrameTypes';

// Simple viewport breakpoint detection
function getViewportBreakpoint(width: number, height: number): ViewportBreakpoint {
  const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  const orientation = width > height ? 'landscape' : 'portrait';
  return `${device}-${orientation}` as ViewportBreakpoint;
}

// Determine optimal image display mode based on aspect ratio
function determineImageDisplayMode(ratio: number): ImageDisplayMode {
  if (ratio > 1.3) return 'center-horizontal';
  if (ratio < 0.8) return 'center-vertical'; 
  return 'square';
}

// Calculate optimal aspect ratio considering viewport constraints
function calculateOptimalRatio(
  imageRatio: number,
  viewportWidth: number,
  viewportHeight: number,
  breakpoint: ViewportBreakpoint
): number {
  const constraints = BREAKPOINT_CONSTRAINTS[breakpoint];
  
  // Start with the image's natural ratio
  let optimalRatio = imageRatio;
  
  // Apply breakpoint-specific constraints
  if (optimalRatio > constraints.maxRatio) {
    console.log(`ImageFrame: Constraining ratio from ${imageRatio.toFixed(2)} to ${constraints.maxRatio} (max for ${breakpoint})`);
    optimalRatio = constraints.maxRatio;
  }
  
  if (optimalRatio < constraints.minRatio) {
    console.log(`ImageFrame: Constraining ratio from ${imageRatio.toFixed(2)} to ${constraints.minRatio} (min for ${breakpoint})`);
    optimalRatio = constraints.minRatio;
  }
  
  // Check if resulting height would exceed viewport
  const maxFrameWidth = Math.min(viewportWidth * 0.9, constraints.maxWidth);
  const resultingHeight = maxFrameWidth / optimalRatio;
  const maxAllowedHeight = Math.min(viewportHeight * 0.7, constraints.maxHeight);
  
  if (resultingHeight > maxAllowedHeight) {
    const constrainedRatio = maxFrameWidth / maxAllowedHeight;
    console.log(`ImageFrame: Viewport constraining ratio from ${optimalRatio.toFixed(2)} to ${constrainedRatio.toFixed(2)}`);
    optimalRatio = constrainedRatio;
  }
  
  return optimalRatio;
}

// Calculate maximum height for current breakpoint
function calculateMaxHeightForBreakpoint(
  ratio: number,
  viewportWidth: number,
  viewportHeight: number,
  breakpoint: ViewportBreakpoint
): number {
  const constraints = BREAKPOINT_CONSTRAINTS[breakpoint];
  
  // Calculate ideal width for this breakpoint
  const idealWidth = breakpoint.includes('mobile') 
    ? Math.min(viewportWidth * 0.95, constraints.maxWidth)
    : breakpoint.includes('tablet')
    ? Math.min(viewportWidth * 0.9, constraints.maxWidth)
    : Math.min(viewportWidth * 0.85, constraints.maxWidth);
  
  // Calculate height from ratio
  const calculatedHeight = idealWidth / ratio;
  
  // Apply viewport and breakpoint constraints
  const maxViewportHeight = viewportHeight * (
    breakpoint.includes('mobile') ? 0.6 : 0.7
  );
  
  return Math.min(
    calculatedHeight,
    maxViewportHeight,
    constraints.maxHeight
  );
}

// Simple cache for dimension calculations
const calculationCache = new Map<string, ImageFrameDimensions>();

function generateCacheKey(
  imageRatio: number,
  viewportWidth: number,
  viewportHeight: number,
  breakpoint: ViewportBreakpoint
): string {
  // Round values to reduce cache key variations
  const roundedRatio = Math.round(imageRatio * 100) / 100;
  const roundedWidth = Math.round(viewportWidth / 100) * 100;
  const roundedHeight = Math.round(viewportHeight / 100) * 100;
  
  return `${roundedRatio}-${roundedWidth}-${roundedHeight}-${breakpoint}`;
}

/**
 * Calculate optimal dimensions for a single image frame
 * Preserves the sophisticated viewport-responsive logic from carousel system
 */
export function calculateImageFrameDimensions({
  imageAttributes,
  viewportWidth,
  viewportHeight,
  maxWidth
}: ImageFrameCalculationInput): ImageFrameDimensions {
  const breakpoint = getViewportBreakpoint(viewportWidth, viewportHeight);
  
  // Calculate image's natural aspect ratio
  const imageRatio = (imageAttributes.width || 1200) / (imageAttributes.height || 800);
  
  // Generate cache key
  const cacheKey = generateCacheKey(imageRatio, viewportWidth, viewportHeight, breakpoint);
  
  // Check cache first
  if (calculationCache.has(cacheKey)) {
    const cached = calculationCache.get(cacheKey)!;
    console.log('Using cached image frame dimensions:', cached);
    return cached;
  }
  
  console.log(`ImageFrame: Calculating dimensions for image ratio: ${imageRatio.toFixed(2)}, viewport: ${viewportWidth}x${viewportHeight}, breakpoint: ${breakpoint}`);
  
  // Calculate optimal ratio considering viewport constraints
  const optimalRatio = calculateOptimalRatio(
    imageRatio,
    viewportWidth,
    viewportHeight,
    breakpoint
  );
  
  // Calculate max height for current breakpoint
  const maxHeight = calculateMaxHeightForBreakpoint(
    optimalRatio,
    viewportWidth,
    viewportHeight,
    breakpoint
  );
  
  // Determine display mode
  const imageDisplayMode = determineImageDisplayMode(optimalRatio);
  
  // Calculate width if maxWidth constraint provided
  const calculatedWidth = maxWidth ? Math.min(maxWidth, maxHeight * optimalRatio) : undefined;
  const finalHeight = calculatedWidth ? calculatedWidth / optimalRatio : maxHeight;
  
  const result: ImageFrameDimensions = {
    ratio: optimalRatio,
    maxHeight,
    height: finalHeight,
    imageDisplayMode,
    width: calculatedWidth
  };
  
  // Cache the result
  calculationCache.set(cacheKey, result);
  
  // Limit cache size to prevent memory leaks
  if (calculationCache.size > 20) {
    const keys = Array.from(calculationCache.keys());
    const firstKey = keys[0];
    if (firstKey) {
      calculationCache.delete(firstKey);
    }
  }
  
  console.log(`ImageFrame: Final ratio: ${optimalRatio.toFixed(2)}, height: ${finalHeight}px, mode: ${imageDisplayMode}`);
  
  return result;
}

/**
 * Simple hook-friendly version for client-side usage
 */
export function calculateImageFrameDimensionsClient(
  imageAttributes: { width?: number; height?: number },
  maxWidth?: number
): ImageFrameDimensions {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  return calculateImageFrameDimensions({
    imageAttributes: {
      src: '',
      alt: '',
      ...imageAttributes
    },
    viewportWidth,
    viewportHeight,
    maxWidth
  });
}