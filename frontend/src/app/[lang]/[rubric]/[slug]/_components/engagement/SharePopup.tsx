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
import { SHARE_POPUP_STYLES } from './engagement.styles';
import { SharePlatform } from './lib';

const styles = SHARE_POPUP_STYLES;

export interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: SharePlatform) => Promise<'native' | 'copy' | 'window'>;
  showCopySuccess: boolean;
}

const SHARE_PLATFORMS = [
  { id: 'telegram' as SharePlatform, icon: TelegramIcon, colorKey: 'telegram' as const },
  { id: 'whatsapp' as SharePlatform, icon: WhatsAppIcon, colorKey: 'whatsapp' as const },
  { id: 'vk' as SharePlatform, icon: VKIcon, colorKey: 'vk' as const },
  { id: 'twitter' as SharePlatform, icon: TwitterIcon, colorKey: 'twitter' as const },
  { id: 'facebook' as SharePlatform, icon: FacebookIcon, colorKey: 'facebook' as const },
  { id: 'instagram' as SharePlatform, icon: InstagramIcon, colorKey: 'instagram' as const },
  { id: 'copy' as SharePlatform, icon: CopyLinkIcon, colorKey: 'copy' as const },
];

export function SharePopup({ isOpen, onClose, onShare, showCopySuccess }: SharePopupProps) {
  const [lastPlatform, setLastPlatform] = useState<SharePlatform | null>(null);

  const handlePlatformClick = async (platform: SharePlatform) => {
    setLastPlatform(platform);
    const shareMethod = await onShare(platform);
    
    if (shareMethod === 'native' || shareMethod === 'window') {
      onClose();
    }
  };

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
      size={styles.modal.size}
      position={styles.modal.position}
    >
      <div className={styles.header.container}>
        <h2 className={styles.header.title}>
          {dictionary.share.title}
        </h2>
      </div>

      <div className={styles.content.container}>
        <div className={styles.content.grid}>
          {SHARE_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const colorClass = styles.colors[platform.colorKey];
            
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform.id)}
                className={`${styles.platform.button.base} ${colorClass}`}
                aria-label={`Share on ${platform.id}`}
              >
                <div className={styles.platform.iconWrapper}>
                  <Icon className={styles.platform.icon} />
                </div>
                <span className={styles.platform.label}>
                  {dictionary.share.platforms[platform.id]}
                </span>
              </button>
            );
          })}
        </div>

        {showCopySuccess && (
          <div className={styles.success.wrapper}>
            <p className={styles.success.message}>
              {getSuccessMessage()}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}