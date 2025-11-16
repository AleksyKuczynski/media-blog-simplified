// frontend/src/main/components/Article/widgets/Engagement/SharePopup.tsx
/**
 * Share Popup Component
 * 
 * Displays social media share options in a centered modal
 * - Uses Modal component for consistent behavior
 * - Uses dictionary for all text content
 * - Uses icon components from EngagementIcons
 * - Instagram: Web Share API on mobile, clipboard fallback on desktop
 * - VK: Russian social network support
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/main/components/Interface/Modal/Modal';
import { dictionary } from '@/main/lib/dictionary';
import { WIDGETS_STYLES } from '../../styles';
import type { SharePlatform } from '@/main/lib/engagement';
import {
  TelegramIcon,
  WhatsAppIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  VKIcon,
  CopyLinkIcon,
} from './EngagementIcons';

const styles = WIDGETS_STYLES.sharePopup;

export interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: SharePlatform) => Promise<'native' | 'copy' | 'window'>;
  showCopySuccess: boolean;
}

// Platform configurations with icon components
const SHARE_PLATFORMS = [
  {
    id: 'telegram' as SharePlatform,
    icon: TelegramIcon,
    colorKey: 'telegram' as const,
  },
  {
    id: 'whatsapp' as SharePlatform,
    icon: WhatsAppIcon,
    colorKey: 'whatsapp' as const,
  },
  {
    id: 'vk' as SharePlatform,
    icon: VKIcon,
    colorKey: 'vk' as const,
  },
  {
    id: 'twitter' as SharePlatform,
    icon: TwitterIcon,
    colorKey: 'twitter' as const,
  },
  {
    id: 'facebook' as SharePlatform,
    icon: FacebookIcon,
    colorKey: 'facebook' as const,
  },
  {
    id: 'instagram' as SharePlatform,
    icon: InstagramIcon,
    colorKey: 'instagram' as const,
  },
  {
    id: 'copy' as SharePlatform,
    icon: CopyLinkIcon,
    colorKey: 'copy' as const,
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
            const Icon = platform.icon;
            const platformName = dictionary.share.platforms[platform.id];
            const ariaLabel = dictionary.share.accessibility.shareOn.replace('{platform}', platformName);

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformClick(platform.id)}
                className={`${styles.button.base} ${styles.colors[platform.colorKey]}`}
                aria-label={ariaLabel}
              >
                <div className={styles.button.iconWrapper}>
                  <Icon className={styles.button.icon} />
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