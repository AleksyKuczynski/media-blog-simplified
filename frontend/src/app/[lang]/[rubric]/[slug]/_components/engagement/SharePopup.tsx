// app/[lang]/[rubric]/[slug]/_components/engagement/SharePopup.tsx
/**
 * Article Engagement - Share Modal
 * 
 * Client component displaying social share options in centered modal.
 * Handles platform-specific sharing logic.
 * 
 * Features:
 * - Platform grid (Telegram, WhatsApp, VK, Twitter, Facebook, Instagram)
 * - Web Share API for Instagram mobile
 * - Clipboard fallback for Instagram desktop
 * - Copy link option
 * - Success feedback
 * 
 * Platform Handling:
 * - Instagram: Web Share API (mobile) → clipboard (desktop)
 * - Other platforms: Open share window
 * - Copy: Direct clipboard access
 * 
 * Dependencies:
 * - @/main/components/Interface/Modal (Modal component)
 * - @/main/lib/dictionary (translations)
 * - ./EngagementIcons (platform icons)
 * - ./lib/share (share utility functions)
 * - article.styles.ts (WIDGETS_STYLES.sharePopup)
 * 
 * @param isOpen - Modal visibility state
 * @param onClose - Close handler
 * @param onShare - Share action handler (returns share method used)
 * @param showCopySuccess - Display copy success message
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { dictionary } from '@/config/i18n';
import {
  TelegramIcon,
  WhatsAppIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  VKIcon,
  CopyLinkIcon,
} from './EngagementIcons';
import { WIDGETS_STYLES } from '../article.styles';
import { SharePlatform } from './lib';

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

// SharePopup Component
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