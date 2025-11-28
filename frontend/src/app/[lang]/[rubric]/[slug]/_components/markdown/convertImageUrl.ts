// src/main/lib/markdown/convertImageUrl.ts
import { DIRECTUS_URL } from '../../../../../../main/lib/directus/directusConstants';

/**
 * Converts any Directus image URL to use the current DIRECTUS_URL
 * Handles various formats:
 * - Full URLs from different Directus instances
 * - Asset IDs only
 * - Local development URLs
 * 
 * @param url - The image URL or asset ID to convert
 * @returns Normalized URL using current DIRECTUS_URL
 */
export function convertImageUrl(url: string): string {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  // Check if it's already a valid asset path
  if (trimmedUrl.includes('/assets/')) {
    // Extract asset ID from URL (handles any hostname/port)
    const assetId = trimmedUrl.split('/assets/').pop()?.split('?')[0] || '';
    
    if (assetId) {
      // Reconstruct using current DIRECTUS_URL
      return `${DIRECTUS_URL}/assets/${assetId}`;
    }
  }
  
  // If it's just an asset ID (UUID format)
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(trimmedUrl)) {
    return `${DIRECTUS_URL}/assets/${trimmedUrl}`;
  }
  
  // Return as-is if we can't parse it (better than breaking)
  console.warn(`Could not parse image URL: ${url}`);
  return trimmedUrl;
}