// frontend/src/main/components/Article/Engagement/SharePopup.tsx
/**
 * Share Popup Component
 * 
 * Displays social media share options in a popup
 * Handles outside click to close, optimistic share count updates
 */

'use client';

import { useRef } from 'react';
import { useOutsideClick } from '@/main/lib/hooks/useOutsideClick';
import type { SharePlatform } from '@/main/lib/engagement';

export interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: SharePlatform) => Promise<void>;
  showCopySuccess: boolean;
}

// Social media platform configurations
const SHARE_PLATFORMS = [
  {
    id: 'telegram' as SharePlatform,
    name: 'Telegram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
      </svg>
    ),
    color: 'hover:bg-[#0088cc]/10 hover:text-[#0088cc]',
  },
  {
    id: 'whatsapp' as SharePlatform,
    name: 'WhatsApp',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
  },
  {
    id: 'twitter' as SharePlatform,
    name: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
  },
  {
    id: 'facebook' as SharePlatform,
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
  },
  {
    id: 'instagram' as SharePlatform,
    name: 'Instagram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: 'hover:bg-gradient-to-tr hover:from-[#fd5949] hover:via-[#d6249f] hover:to-[#285AEB]/10 hover:text-[#d6249f]',
  },
  {
    id: 'copy' as SharePlatform,
    name: 'Copy Link',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
    color: 'hover:bg-on-sf-var/10 hover:text-on-sf',
  },
];

/**
 * SharePopup Component
 * Displays a popup with social media share buttons
 */
export function SharePopup({ isOpen, onClose, onShare, showCopySuccess }: SharePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useOutsideClick(popupRef, null, isOpen, onClose);

  if (!isOpen) return null;

  const handlePlatformClick = async (platform: SharePlatform) => {
    await onShare(platform);
    
    // Close popup after sharing (except for copy, which shows success message)
    if (platform !== 'copy') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-[50]" 
        aria-hidden="true"
      />
      
      {/* Popup */}
      <div
        ref={popupRef}
        className="absolute left-full ml-4 bottom-0 z-[60] w-64 bg-sf-cont border border-ol-var rounded-xl shadow-xl p-4 animate-fade-in"
        role="dialog"
        aria-label="Share options"
      >
        {/* Header */}
        <div className="mb-3 pb-2 border-b border-ol-var">
          <h3 className="text-sm font-semibold text-on-sf">
            Share Article
          </h3>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-2 gap-2">
          {SHARE_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformClick(platform.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-lg
                text-on-sf-var transition-all duration-200
                ${platform.color}
                focus:outline-none focus:ring-2 focus:ring-pr-fix/50
              `}
              aria-label={`Share on ${platform.name}`}
            >
              <div className="flex items-center justify-center">
                {platform.icon}
              </div>
              <span className="text-xs font-medium">
                {platform.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy success notification */}
        {showCopySuccess && (
          <div className="mt-3 pt-3 border-t border-ol-var">
            <div className="px-3 py-2 bg-success/10 text-success text-xs rounded-lg text-center font-medium">
              Link copied!
            </div>
          </div>
        )}
      </div>
    </>
  );
}