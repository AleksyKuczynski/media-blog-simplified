// frontend/src/main/lib/engagement/share.ts
/**
 * Share Platform Utilities
 * 
 * Social media sharing URLs and copy-to-clipboard functionality
 */

import { ShareConfig, SharePlatform } from "./types";

/**
 * Generate share URL for different platforms
 */
export function getShareUrl(platform: SharePlatform, config: ShareConfig): string {
  const { url, title } = config;

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    
    case 'telegram':
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    
    case 'instagram':
      // Instagram doesn't support direct web sharing
      return url;
    
    case 'copy':
      return url;
    
    default:
      return url;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Open share dialog in new window
 */
export function openShareWindow(url: string): void {
  window.open(
    url,
    '_blank',
    'width=600,height=400,noopener,noreferrer'
  );
}