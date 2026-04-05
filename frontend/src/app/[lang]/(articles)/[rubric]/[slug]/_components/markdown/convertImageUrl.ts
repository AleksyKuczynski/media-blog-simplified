// app/[lang]/[rubric]/[slug]/_components/markdown/convertImageUrl.ts
/**
 * Article Markdown - Image URL Converter
 * 
 * Converts Directus asset IDs to full CDN URLs.
 * Handles both asset IDs and full URLs.
 * 
 * Input Formats:
 * - Asset ID: "abc123-def456"
 * - Full URL: "https://domain.com/assets/abc123"
 * - Relative: "/assets/abc123"
 * 
 * Output:
 * - Full Directus URL: "{DIRECTUS_URL}/assets/{assetId}"
 * 
 * Features:
 * - Asset ID detection
 * - Full URL passthrough
 * - Directus URL construction
 * 
 * Dependencies:
 * - @/main/lib/directus (DIRECTUS_URL)
 * 
 * @param imageUrl - Asset ID or URL string
 * @returns {string} Full Directus asset URL
 */

import { DIRECTUS_ASSETS_URL } from "@/api/directus";

export function convertImageUrl(url: string): string {
  if (!url) return '';

  const trimmedUrl = url.trim();

  // Check if it's already a valid asset path
  if (trimmedUrl.includes('/assets/')) {
    // Extract asset ID from URL (handles any hostname/port)
    const assetId = trimmedUrl.split('/assets/').pop()?.split('?')[0] || '';

    if (assetId) {
      // Reconstruct using public-facing URL
      return `${DIRECTUS_ASSETS_URL}/assets/${assetId}`;
    }
  }

  // If it's just an asset ID (UUID format)
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(trimmedUrl)) {
    return `${DIRECTUS_ASSETS_URL}/assets/${trimmedUrl}`;
  }
  
  // Return as-is if we can't parse it (better than breaking)
  console.warn(`Could not parse image URL: ${url}`);
  return trimmedUrl;
}