// app/[lang]/[rubric]/[slug]/_components/engagement/lib/share.ts
/**
 * Article Engagement - Share Utilities
 * 
 * Platform-specific share URL generation and sharing methods.
 * 
 * Functions:
 * - getShareUrl(platform, config): Generate share URL for platform
 * - copyToClipboard(text): Copy to clipboard with fallback
 * - openShareWindow(url): Open share popup window
 * - shareViaWebAPI(config): Use Web Share API (mobile)
 * - canUseWebShare(): Check Web Share API availability
 * 
 * Supported Platforms:
 * - Telegram: t.me/share
 * - WhatsApp: wa.me/send
 * - VK: vk.com/share.php
 * - Twitter: twitter.com/intent/tweet
 * - Facebook: facebook.com/sharer/sharer.php
 * - Instagram: Web Share API (mobile) / clipboard (desktop)
 * - Copy: Clipboard API
 * 
 * Features:
 * - URL encoding for special characters
 * - Web Share API detection
 * - Clipboard fallback
 * - Popup window positioning
 * 
 * Dependencies:
 * - ./types (SharePlatform, ShareConfig)
 * 
 * NOTE: Instagram requires Web Share API or clipboard,
 * cannot open in popup window like other platforms
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