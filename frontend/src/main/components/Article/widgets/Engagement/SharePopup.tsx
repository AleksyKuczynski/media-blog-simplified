// frontend/src/main/components/Article/widgets/Engagement/SharePopup.tsx
/**
 * Share Popup Component (Standardized)
 * 
 * Displays social media share options in a centered modal
 * - Uses common Modal.tsx component for consistent behavior
 * - Uses dictionary for all text content
 * - Uses Article.styles for all Tailwind classes
 * - Instagram: Web Share API on mobile, clipboard fallback on desktop
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/main/components/Interface/Modal/Modal';
import { dictionary } from '@/main/lib/dictionary';
import { WIDGETS_STYLES } from '../../styles';
import type { SharePlatform } from '@/main/lib/engagement';

const styles = WIDGETS_STYLES.sharePopup;

export interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: SharePlatform) => Promise<'native' | 'copy' | 'window'>;
  showCopySuccess: boolean;
}

// Platform configurations with SVG paths only (labels from dictionary)
const SHARE_PLATFORMS = [
  {
    id: 'telegram' as SharePlatform,
    svgPath: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z",
    colorKey: 'telegram' as const,
  },
  {
    id: 'whatsapp' as SharePlatform,
    svgPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    colorKey: 'whatsapp' as const,
  },
  {
    id: 'twitter' as SharePlatform,
    svgPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    colorKey: 'twitter' as const,
  },
  {
    id: 'facebook' as SharePlatform,
    svgPath: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    colorKey: 'facebook' as const,
  },
  {
    id: 'instagram' as SharePlatform,
    svgPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    colorKey: 'instagram' as const,
  },
  {
    id: 'copy' as SharePlatform,
    svgPath: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
    colorKey: 'copy' as const,
    isStroke: true, // Copy icon uses stroke instead of fill
  },
];

/**
 * SharePopup Component
 */
export function SharePopup({ isOpen, onClose, onShare, showCopySuccess }: SharePopupProps) {
  const [lastPlatform, setLastPlatform] = useState<SharePlatform | null>(null);

  const handlePlatformClick = async (platform: SharePlatform) => {
    setLastPlatform(platform);
    const shareMethod = await onShare(platform);
    
    // Close modal based on share method:
    // - 'native': Close (user completed share via native sheet)
    // - 'window': Close (share window opened)
    // - 'copy': Stay open (show success message)
    if (shareMethod === 'native' || shareMethod === 'window') {
      onClose();
    }
    // If 'copy', modal stays open to show success message
  };

  // Get success message from dictionary based on platform
  const getSuccessMessage = () => {
    if (lastPlatform === 'instagram') {
      return dictionary.share.messages.instagramCopied;
    }
    return dictionary.share.messages.linkCopied;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dictionary.share.title}
      size="sm"
      position="center"
    >
      <div className={styles.container}>
        {/* Share buttons grid */}
        <div className={styles.grid}>
          {SHARE_PLATFORMS.map((platform) => {
            // Get platform name from dictionary
            const platformName = dictionary.share.platforms[platform.id];
            
            // Generate aria-label directly (simpler than processTemplate)
            const ariaLabel = `${dictionary.share.accessibility.shareOn.replace('{platform}', platformName)}`;

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformClick(platform.id)}
                className={`${styles.button.base} ${styles.colors[platform.colorKey]}`}
                aria-label={ariaLabel}
              >
                <div className={styles.button.iconWrapper}>
                  <svg 
                    className={styles.button.icon} 
                    fill={platform.isStroke ? "none" : "currentColor"}
                    stroke={platform.isStroke ? "currentColor" : undefined}
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap={platform.isStroke ? "round" : undefined}
                      strokeLinejoin={platform.isStroke ? "round" : undefined}
                      strokeWidth={platform.isStroke ? 2 : undefined}
                      d={platform.svgPath}
                    />
                  </svg>
                </div>
                <span className={styles.button.label}>
                  {platformName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Copy/Instagram success notification */}
        {showCopySuccess && (
          <div className={styles.success.wrapper}>
            <div className={styles.success.message}>
              {getSuccessMessage()}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}