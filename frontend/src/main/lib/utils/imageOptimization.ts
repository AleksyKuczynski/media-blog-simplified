// frontend/src/main/lib/utils/imageOptimization.ts
/**
 * Directus Image Optimization Utility
 * 
 * Provides URL transformations for social sharing and responsive images
 * Uses Directus built-in image transformation via URL parameters
 * Images are generated on-demand and cached by Directus
 */

import { DIRECTUS_URL } from '../directus/directusConstants';

/**
 * Image transformation presets for different use cases
 */
export const IMAGE_PRESETS = {
  // Open Graph (Facebook, LinkedIn, most social networks)
  og: {
    width: 1200,
    height: 630,
    fit: 'cover',
    quality: 85,
  },
  // Twitter Card
  twitter: {
    width: 1200,
    height: 675,
    fit: 'cover',
    quality: 85,
  },
  // VK (VKontakte) - Russian social network
  vk: {
    width: 537,
    height: 240,
    fit: 'cover',
    quality: 85,
  },
  // Article thumbnail (cards)
  thumbnail: {
    width: 800,
    height: 450,
    fit: 'cover',
    quality: 80,
  },
  // Article hero (large display)
  hero: {
    width: 1600,
    height: 900,
    fit: 'cover',
    quality: 85,
  },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
  withoutEnlargement?: boolean;
}

/**
 * Get optimized image URL for a specific preset
 * 
 * @param assetId - Directus file UUID or full asset URL
 * @param preset - Predefined preset name
 * @returns Optimized image URL with transformation parameters
 * 
 * @example
 * ```typescript
 * const ogImage = getOptimizedImageUrl(article.image_id, 'og');
 * // Returns: http://directus.com/assets/abc-123?width=1200&height=630&fit=cover&quality=85
 * ```
 */
export function getOptimizedImageUrl(
  assetId: string | null | undefined,
  preset: ImagePreset
): string {
  if (!assetId) {
    // Return fallback image
    return `${DIRECTUS_URL}/assets/default-og-image.jpg`;
  }

  // Extract asset ID if full URL provided
  const cleanAssetId = extractAssetId(assetId);
  
  // Get preset configuration
  const config = IMAGE_PRESETS[preset];
  
  // Build query parameters
  const params = buildTransformParams(config);
  
  return `${DIRECTUS_URL}/assets/${cleanAssetId}?${params}`;
}

/**
 * Get custom optimized image URL with specific parameters
 * 
 * @param assetId - Directus file UUID or full asset URL
 * @param options - Custom transformation options
 * @returns Optimized image URL
 * 
 * @example
 * ```typescript
 * const customImage = getCustomOptimizedImageUrl(imageId, {
 *   width: 600,
 *   quality: 90,
 *   format: 'webp'
 * });
 * ```
 */
export function getCustomOptimizedImageUrl(
  assetId: string | null | undefined,
  options: ImageTransformOptions
): string {
  if (!assetId) {
    return `${DIRECTUS_URL}/assets/default-og-image.jpg`;
  }

  const cleanAssetId = extractAssetId(assetId);
  const params = buildTransformParams(options);
  
  return `${DIRECTUS_URL}/assets/${cleanAssetId}?${params}`;
}

/**
 * Extract asset ID from various URL formats
 * Handles: full URLs, asset paths, or bare UUIDs
 */
function extractAssetId(input: string): string {
  // If it contains /assets/, extract the UUID
  if (input.includes('/assets/')) {
    const parts = input.split('/assets/');
    const assetPart = parts[1] || '';
    // Remove query parameters if present
    return assetPart.split('?')[0];
  }
  
  // Otherwise assume it's already a clean UUID
  return input;
}

/**
 * Build URL query parameters from transformation options
 */
function buildTransformParams(options: ImageTransformOptions): string {
  const params: string[] = [];
  
  if (options.width) {
    params.push(`width=${options.width}`);
  }
  
  if (options.height) {
    params.push(`height=${options.height}`);
  }
  
  if (options.fit) {
    params.push(`fit=${options.fit}`);
  }
  
  if (options.quality) {
    params.push(`quality=${options.quality}`);
  }
  
  if (options.format) {
    params.push(`format=${options.format}`);
  }
  
  if (options.withoutEnlargement) {
    params.push('withoutEnlargement=true');
  }
  
  return params.join('&');
}

/**
 * Get all social sharing image variants for an asset
 * Useful for providing multiple og:image tags
 * 
 * @example
 * ```typescript
 * const variants = getSocialImageVariants(article.image_id);
 * // Returns: { og: '...', twitter: '...', vk: '...' }
 * ```
 */
export function getSocialImageVariants(
  assetId: string | null | undefined
): {
  og: string;
  twitter: string;
  vk: string;
} {
  return {
    og: getOptimizedImageUrl(assetId, 'og'),
    twitter: getOptimizedImageUrl(assetId, 'twitter'),
    vk: getOptimizedImageUrl(assetId, 'vk'),
  };
}

/**
 * Validate if asset ID is in valid UUID format
 */
export function isValidAssetId(assetId: string | null | undefined): boolean {
  if (!assetId) return false;
  
  const cleanId = extractAssetId(assetId);
  const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  
  return uuidRegex.test(cleanId);
}