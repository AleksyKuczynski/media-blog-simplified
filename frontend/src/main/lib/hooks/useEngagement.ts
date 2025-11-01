// frontend/src/main/lib/hooks/useEngagement.ts
/**
 * Main Engagement Hook
 * 
 * REFACTORED: Combines view tracking, like state, and share functionality
 * All optimistic updates, fire-and-forget API calls
 */

import { useState, useCallback } from 'react';
import { useLikeState } from './useLikeState';
import { useViewTracking } from './useViewTracking';
import { updateEngagement } from '../engagement/api';
import { getShareUrl, copyToClipboard, openShareWindow } from '../engagement/share';
import { trackGAEvent } from '../analytics/google';
import { trackYandexEvent } from '../analytics/yandex';
import type { EngagementData, SharePlatform } from '../engagement';

export interface UseEngagementOptions {
  slug: string;
  title: string;
  url: string;
  initialData: EngagementData;
}

export interface UseEngagementReturn {
  // Data
  engagement: EngagementData;
  
  // View tracking
  hasViewTracked: boolean;
  
  // Like state
  isLiked: boolean;
  isLikeProcessing: boolean;
  toggleLike: () => void;
  
  // Share
  handleShare: (platform: SharePlatform) => Promise<void>;
  showCopySuccess: boolean;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

/**
 * Main engagement hook - combines all engagement functionality
 * 
 * BEHAVIOR:
 * - Views: Track after 1 second, optimistic +1, fire-and-forget
 * - Likes: Debounced (1s), optimistic updates, fire-and-forget
 * - Shares: Optimistic +1, fire-and-forget
 * - No syncing back from server (fire-and-forget)
 * 
 * @param options - Engagement configuration
 * @returns Complete engagement state and handlers
 * 
 * @example
 * ```tsx
 * const {
 *   engagement,
 *   isLiked,
 *   toggleLike,
 *   handleShare,
 * } = useEngagement({
 *   slug: 'my-article',
 *   title: 'Article Title',
 *   url: 'https://example.com/article',
 *   initialData: { slug: 'my-article', views: 0, likes: 0, shares: 0 }
 * });
 * ```
 */
export function useEngagement({
  slug,
  title,
  url,
  initialData,
}: UseEngagementOptions): UseEngagementReturn {
  const [engagement, setEngagement] = useState<EngagementData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  /**
   * Show error message temporarily
   */
  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * View tracking with optimistic update
   */
  const { hasTracked: hasViewTracked } = useViewTracking({
    slug,
    delayMs: 1000, // 1 second delay
    onTrack: () => {
      console.log('[Engagement] View tracked, optimistic +1');
      setEngagement(prev => ({
        ...prev,
        views: prev.views + 1,
      }));
    },
  });

  /**
   * Like state management with debouncing
   */
  const {
    isLiked,
    isProcessing: isLikeProcessing,
    optimisticLikes,
    toggleLike,
  } = useLikeState({
    slug,
    currentLikes: engagement.likes,
  });

  /**
   * Display engagement with optimistic like count
   */
  const displayEngagement: EngagementData = {
    ...engagement,
    likes: optimisticLikes, // Use optimistic value
  };

  /**
   * Handle share action
   */
  const handleShare = useCallback(async (platform: SharePlatform) => {
    if (platform === 'copy') {
      // Copy link to clipboard
      const success = await copyToClipboard(url);
      
      if (success) {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);

        // Track in analytics
        trackGAEvent('share', {
          method: 'copy',
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent('article_share', { slug, method: 'copy' });
      } else {
        showError('Failed to copy link to clipboard');
      }
      return;
    }

    // Optimistically increment share count
    setEngagement(prev => ({
      ...prev,
      shares: prev.shares + 1,
    }));

    // Track share in backend via Flow (fire and forget)
    updateEngagement(slug, 'share').catch((error) => {
      console.error('[Engagement] Error tracking share (non-critical):', error);
      // Don't rollback - user already opened share dialog
    });

    // Open share dialog
    const shareUrl = getShareUrl(platform, { url, title });
    openShareWindow(shareUrl);

    // Track in analytics
    trackGAEvent('share', {
      method: platform,
      article_slug: slug,
      article_title: title,
    });
    trackYandexEvent('article_share', { slug, method: platform });
  }, [slug, title, url, showError]);

  return {
    engagement: displayEngagement,
    hasViewTracked,
    isLiked,
    isLikeProcessing,
    toggleLike,
    handleShare,
    showCopySuccess,
    error,
    clearError,
  };
}