// frontend/src/main/lib/engagement/share.ts
/**
 * Share Platform Utilities
 * 
 * Social media sharing URLs and copy-to-clipboard functionality
 */

import { ShareConfig } from "./types";
import { SharePlatform } from "./types";


/**
 * Generate share URL for different platforms
 * 
 * @param platform - Social platform identifier
 * @param config - Share configuration (url, title)
 * @returns Formatted share URL
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
    
    case 'copy':
      return url; // Will be handled by clipboard API
    
    default:
      return url;
  }
}

/**
 * Copy text to clipboard
 * 
 * @param text - Text to copy
 * @returns Promise resolving to success boolean
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    console.error('[Share] Clipboard API not available');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('[Share] Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Open share dialog in new window
 * 
 * @param url - Share URL
 */
export function openShareWindow(url: string): void {
  window.open(
    url,
    '_blank',
    'width=600,height=400,noopener,noreferrer'
  );
}