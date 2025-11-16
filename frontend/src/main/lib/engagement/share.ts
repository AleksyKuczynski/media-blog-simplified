// frontend/src/main/lib/engagement/share.ts
/**
 * Share Platform Utilities
 * 
 * Social media sharing URLs and copy-to-clipboard functionality
 * - Web Share API support for Instagram on mobile
 * - VK (VKontakte) support for Russian market
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
    
    case 'vk':
      return `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    
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
 * Check if Web Share API is available
 */
export function canUseWebShare(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  return 'share' in navigator && navigator.canShare !== undefined;
}

/**
 * Share via Web Share API (mobile native share sheet)
 * Returns true if shared successfully, false if user cancelled or API unavailable
 */
export async function shareViaWebAPI(config: ShareConfig): Promise<boolean> {
  if (!canUseWebShare()) {
    return false;
  }

  try {
    await navigator.share({
      title: config.title,
      url: config.url,
    });
    return true;
  } catch (error) {
    // User cancelled or sharing failed
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled - this is normal, not an error
      return false;
    }
    // Other errors (e.g., not allowed in this context)
    console.error('Web Share API error:', error);
    return false;
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