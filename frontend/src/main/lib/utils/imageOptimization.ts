// frontend/src/main/lib/utils/imageOptimization.ts
/**
 * Directus Image Optimization Utility
 * 
 * UPDATED: Uses HTTPS proxy for social media sharing
 * - Direct Directus URLs for internal use (HTTP OK)
 * - Proxied URLs for social sharing (HTTPS required)
 */

import { DIRECTUS_URL } from '../directus/directusConstants';

const SITE_URL = process.env.SITE_URL;

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
 * @param useProxy - Use HTTPS proxy (required for social sharing). Default: true
 * @returns Optimized image URL with transformation parameters
 * 
 * @example
 * ```typescript
 * // For social sharing (HTTPS via proxy):
 * const ogImage = getOptimizedImageUrl(article.image_id, 'og');
 * // Returns: https://event4me.vercel.app/api/images/assets/abc-123?width=1200&height=630...
 * 
 * // For internal use (direct HTTP):
 * const thumbnail = getOptimizedImageUrl(article.image_id, 'thumbnail', false);
 * // Returns: http://51.21.135.65:8055/assets/abc-123?width=800&height=450...
 * ```
 */
export function getOptimizedImageUrl(
  assetId: string | null | undefined,
  preset: ImagePreset,
  useProxy: boolean = true
): string {
  if (!assetId) {
    // Return fallback image via proxy
    return `${SITE_URL}/api/images/assets/default-og-image.jpg`;
  }

  // Extract asset ID if full URL provided
  const cleanAssetId = extractAssetId(assetId);
  
  // Get preset configuration
  const config = IMAGE_PRESETS[preset];
  
  // Build query parameters
  const params = buildTransformParams(config);
  
  if (useProxy) {
    // Use HTTPS proxy for social sharing
    return `${SITE_URL}/api/images/assets/${cleanAssetId}?${params}`;
  } else {
    // Use direct Directus URL for internal use
    return `${DIRECTUS_URL}/assets/${cleanAssetId}?${params}`;
  }
}

/**
 * Get custom optimized image URL with specific parameters
 * 
 * @param assetId - Directus file UUID or full asset URL
 * @param options - Custom transformation options
 * @param useProxy - Use HTTPS proxy (required for social sharing). Default: true
 * @returns Optimized image URL
 */
export function getCustomOptimizedImageUrl(
  assetId: string | null | undefined,
  options: ImageTransformOptions,
  useProxy: boolean = true
): string {
  if (!assetId) {
    return `${SITE_URL}/api/images/assets/default-og-image.jpg`;
  }

  const cleanAssetId = extractAssetId(assetId);
  const params = buildTransformParams(options);
  
  if (useProxy) {
    return `${SITE_URL}/api/images/assets/${cleanAssetId}?${params}`;
  } else {
    return `${DIRECTUS_URL}/assets/${cleanAssetId}?${params}`;
  }
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
 * All variants use HTTPS proxy for social media compatibility
 */
export function getSocialImageVariants(
  assetId: string | null | undefined
): {
  og: string;
  twitter: string;
  vk: string;
} {
  return {
    og: getOptimizedImageUrl(assetId, 'og', true),
    twitter: getOptimizedImageUrl(assetId, 'twitter', true),
    vk: getOptimizedImageUrl(assetId, 'vk', true),
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