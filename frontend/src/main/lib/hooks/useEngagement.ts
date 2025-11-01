// frontend/src/main/lib/engagement/hooks/useEngagement.ts
/**
 * Main Engagement Hook
 * 
 * Combines view tracking, like state, and share functionality
 */

import { useState, useCallback } from 'react';
import { updateEngagement } from '../api';
import { trackGAEvent } from '../../analytics/google';
import { trackYandexEvent } from '../../analytics/yandex';
import { getShareUrl, copyToClipboard, openShareWindow } from '../share';
import { useViewTracking } from './useViewTracking';
import { useLikeState } from './useLikeState';
import type { EngagementData, SharePlatform } from '../types';

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
  isViewTracking: boolean;
  hasViewTracked: boolean;
  
  // Like state
  isLiked: boolean;
  isLikeProcessing: boolean;
  toggleLike: () => Promise<void>;
  
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

  // View tracking with delayed execution
  const { isTracking: isViewTracking, hasTracked: hasViewTracked } = useViewTracking({
    slug,
    delayMs: 2000,
    onSuccess: (data) => {
      console.log('[Engagement] View tracked, updating state');
      setEngagement(data);
    },
    onError: (err) => {
      console.error('[Engagement] View tracking error:', err);
      // Silent failure for views - don't disrupt UX
    },
  });

  // Like state management
  const {
    isLiked,
    isProcessing: isLikeProcessing,
    optimisticLikes,
    toggleLike: toggleLikeInternal,
  } = useLikeState({
    slug,
    currentLikes: engagement.likes,
    onSuccess: (data, action) => {
      console.log(`[Engagement] ${action} successful, updating state`);
      setEngagement(data);
      
      // Track in analytics
      trackGAEvent(action, {
        article_slug: slug,
        article_title: title,
      });
      trackYandexEvent(`article_${action}`, { slug });
    },
    onError: (err) => {
      showError(err.message);
    },
  });

  /**
   * Update engagement state with optimistic like count
   */
  const currentEngagement: EngagementData = {
    ...engagement,
    likes: optimisticLikes, // Use optimistic value for instant feedback
  };

  /**
   * Toggle like wrapper
   */
  const toggleLike = useCallback(async () => {
    await toggleLikeInternal();
  }, [toggleLikeInternal]);

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

    // Track share in backend via Flow (fire and forget - don't block user)
    updateEngagement(slug, 'share').catch((error) => {
      console.error('[Engagement] Error tracking share:', error);
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
    engagement: currentEngagement,
    isViewTracking,
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