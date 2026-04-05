// app/[lang]/[rubric]/[slug]/_components/markdown/parseMarkdownImage.ts
/**
 * Article Markdown - Image Syntax Parser
 * 
 * Parses markdown image syntax into structured data.
 * 
 * Syntax: ![alt text](assetId)
 * 
 * Features:
 * - Alt text extraction
 * - Asset ID extraction
 * - Full URL construction
 * 
 * Dependencies:
 * - @/api/directus (DIRECTUS_URL)
 * 
 * @param markdown - Image markdown string
 * @returns {ParsedImage | null} Structured image data or null
 */

import { DIRECTUS_ASSETS_URL } from "@/api/directus";

export function parseMarkdownImage(markdown: string): { alt: string; src: string; assetId: string } | null {
  // Guard against null/undefined markdown
  if (!markdown || typeof markdown !== 'string') {
    return null;
  }

  const match = markdown.match(/!\[(.*?)\]\((.*?)(\s+".*?")?\)/);
  if (!match) {
    return null;
  }
  
  const [, alt, rawSrc] = match;

  // Guard against undefined capture groups
  if (rawSrc === undefined) {
    console.error('Invalid image markdown: missing URL', markdown);
    return null;
  }
  
  let src = rawSrc.trim();
  let assetId = '';

  // Handle different URL formats
  if (src.includes('/assets/')) {
    // Extract asset ID from full URL (handles old cached URLs)
    assetId = src.split('/assets/').pop()?.split('?')[0] || '';
    // Reconstruct URL using current DIRECTUS_URL
    src = `${DIRECTUS_ASSETS_URL}/assets/${assetId}`;
  } else {
    // Assume it's just an asset ID
    assetId = src;
    src = `${DIRECTUS_ASSETS_URL}/assets/${assetId}`;
  }

  return {
    alt: alt?.trim() || 'Article image',  // Also guard alt
    src,
    assetId
  };
}