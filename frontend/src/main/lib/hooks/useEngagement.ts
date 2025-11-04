// frontend/src/main/lib/hooks/useEngagement.ts
/**
 * Main Engagement Hook
 * 
 * UPDATED v2: Added share delta persistence to localStorage
 * 
 * BEHAVIOR:
 * - Views: Tracked by GET endpoint (optional client-side tracking)
 * - Likes: Debounced (1s), optimistic updates, fire-and-forget, localStorage persistence
 * - Shares: Optimistic +1, fire-and-forget, localStorage delta (60s expiry)
 * - No syncing back from server (fire-and-forget)
 */

import { useState, useEffect, useCallback } from 'react';
import { useLikeState } from './useLikeState';
import { useShareState } from './useShareState';
import { useViewTracking } from './useViewTracking';
import { updateEngagement } from '../engagement/api';
import { getShareUrl, copyToClipboard, openShareWindow } from '../engagement/share';
import { saveShareDelta } from '../engagement/localStorage';
import { trackGAEvent } from '../analytics/google';
import { trackYandexEvent } from '../analytics/yandex';
import type { EngagementData, SharePlatform } from '../engagement';

export interface UseEngagementOptions {
  slug: string;
  title: string;
  url: string;
  initialData: EngagementData;
  trackView?: boolean;
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
 * @param options - Engagement configuration
 * @returns Complete engagement state and handlers
 */
export function useEngagement({
  slug,
  title,
  url,
  initialData,
  trackView = false,
}: UseEngagementOptions): UseEngagementReturn {
  const [engagement, setEngagement] = useState<EngagementData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shareRefreshTrigger, setShareRefreshTrigger] = useState(0);

  // Sync engagement state when initialData changes
  useEffect(() => {
    console.log('[useEngagement] Updating engagement with initialData:', initialData);
    setEngagement(initialData);
  }, [initialData]);

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
   * Optional view tracking (disabled by default)
   */
  const { hasTracked: hasViewTracked } = useViewTracking({
    slug,
    delayMs: 1000,
    enabled: trackView,
    onTrack: () => {
      console.log('[Engagement] View tracked (client-side), optimistic +1');
      setEngagement(prev => ({
        ...prev,
        views: prev.views + 1,
      }));
    },
  });

  /**
   * Like state management with debouncing and localStorage
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
   * NEW: Share state management with localStorage delta
   */
  const { optimisticShares } = useShareState({
    slug,
    currentShares: engagement.shares,
    refreshTrigger: shareRefreshTrigger,
  });

  /**
   * Display engagement with optimistic counts
   */
  const displayEngagement: EngagementData = {
    ...engagement,
    likes: optimisticLikes, // Optimistic like count with delta
    shares: optimisticShares, // NEW: Optimistic share count with delta
  };

  /**
   * Handle share action
   * UPDATED: Now saves delta to localStorage for persistence
   */
  const handleShare = useCallback(async (platform: SharePlatform) => {
    if (platform === 'copy') {
      // Copy link to clipboard
      const success = await copyToClipboard(url);
      
      if (success) {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);

        // Track in analytics (no backend call for copy)
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

    // For all other platforms (including Instagram):
    // 1. Save delta to localStorage (persists across refreshes)
    // This will be automatically picked up by useShareState hook
    saveShareDelta(slug);
    
    // 2. Trigger re-read of delta in useShareState
    setShareRefreshTrigger(prev => prev + 1);

    // 3. Track share in backend via Flow (fire and forget)
    updateEngagement(slug, 'share').catch((error) => {
      console.error('[Engagement] Error tracking share (non-critical):', error);
      // Don't rollback - user already opened share dialog and delta is saved
    });

    // 4. Handle platform-specific actions
    if (platform === 'instagram') {
      // Instagram has no web share URL, so copy link
      const success = await copyToClipboard(url);
      
      if (success) {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      } else {
        showError('Failed to copy link to clipboard');
      }
    } else {
      // Open share dialog for other platforms
      const shareUrl = getShareUrl(platform, { url, title });
      openShareWindow(shareUrl);
    }

    // 5. Track in analytics
    trackGAEvent('share', {
      method: platform,
      article_slug: slug,
      article_title: title,
    });
    trackYandexEvent('article_share', { slug, method: platform });
  }, [slug, title, url, showError]);

  return {
    engagement: displayEngagement, // Returns optimistic counts
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