// frontend/src/main/lib/hooks/useEngagement.ts
/**
 * Main Engagement Hook
 * 
 * Coordinates all engagement functionality with timestamp-based reconciliation
 * - Views: Server-tracked on first visit, reconciled via action log
 * - Likes: Debounced (1s), optimistic updates, fire-and-forget API
 * - Shares: Immediate optimistic update, fire-and-forget API
 */

import { useState, useEffect, useCallback } from 'react';
import { useLikeState } from './useLikeState';
import { useShareState } from './useShareState';
import { useViewTracking } from './useViewTracking';
import { updateEngagement } from '../engagement/api';
import { getShareUrl, copyToClipboard, openShareWindow } from '../engagement/share';
import { logAction, reconcileCounts } from '../engagement/actionLog';
import { trackGAEvent } from '../analytics/google';
import { trackYandexEvent } from '../analytics/yandex';
import type { EngagementData, SharePlatform } from '../engagement';
import dictionary from '../dictionary/dictionary';

export interface UseEngagementOptions {
  slug: string;
  title: string;
  url: string;
  initialData: EngagementData;
  trackView?: boolean;
  viewWasTrackedByAPI?: boolean;
}

export interface UseEngagementReturn {
  engagement: EngagementData;
  hasViewTracked: boolean;
  isLiked: boolean;
  isLikeProcessing: boolean;
  toggleLike: () => void;
  handleShare: (platform: SharePlatform) => Promise<void>;
  showCopySuccess: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Main engagement hook - combines all engagement functionality
 */
export function useEngagement({
  slug,
  title,
  url,
  initialData,
  trackView = false,
  viewWasTrackedByAPI = false,
}: UseEngagementOptions): UseEngagementReturn {
  const [engagement, setEngagement] = useState<EngagementData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shareRefreshTrigger, setShareRefreshTrigger] = useState(0);

  // Sync engagement state when initialData changes
  useEffect(() => {
    setEngagement(initialData);
  }, [initialData]);

  // Log view action if tracked by API (for reconciliation)
  useEffect(() => {
    if (viewWasTrackedByAPI) {
      logAction(slug, 'view');
    }
  }, [slug, viewWasTrackedByAPI]);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Optional view tracking (disabled by default, views handled by API)
  const { hasTracked: hasViewTracked } = useViewTracking({
    slug,
    delayMs: 1000,
    enabled: trackView,
    onTrack: () => {
      logAction(slug, 'view');
      setEngagement(prev => ({
        ...prev,
        views: prev.views + 1,
      }));
    },
  });

  // Like state management with reconciliation
  const {
    isLiked,
    isProcessing: isLikeProcessing,
    optimisticLikes,
    toggleLike,
  } = useLikeState({
    slug,
    currentLikes: engagement.likes,
    currentViews: engagement.views,
    currentShares: engagement.shares,
    lastUpdated: engagement.last_updated || null,
  });

  // Share state management with reconciliation
  const { optimisticShares } = useShareState({
    slug,
    currentViews: engagement.views,
    currentLikes: engagement.likes,
    currentShares: engagement.shares,
    lastUpdated: engagement.last_updated || null,
    refreshTrigger: shareRefreshTrigger,
  });

  // Views reconciliation
  const reconciledCounts = reconcileCounts(
    slug,
    { 
      views: engagement.views, 
      likes: engagement.likes, 
      shares: engagement.shares 
    },
    engagement.last_updated || null
  );

  // Display engagement with optimistic counts
  const displayEngagement: EngagementData = {
    ...engagement,
    views: reconciledCounts.views,
    likes: optimisticLikes,
    shares: optimisticShares,
  };

  /**
   * Handle share action
   */
  const handleShare = useCallback(async (platform: SharePlatform) => {
    if (platform === 'copy') {
      const success = await copyToClipboard(url);
      
      if (success) {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);

        trackGAEvent('share', {
          method: 'copy',
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent('article_share', { slug, method: 'copy' });
      } else {
        showError(dictionary.errors.engagement.updateFailed);
      }
      return;
    }

    // Log action for reconciliation
    logAction(slug, 'share');
    
    // Trigger re-calculation in useShareState
    setShareRefreshTrigger(prev => prev + 1);

    // Track share in backend (fire-and-forget)
    updateEngagement(slug, 'share').catch(() => {
      // Silent failure - user already opened share dialog
    });

    // Track in analytics
    trackGAEvent('share', {
      method: platform,
      article_slug: slug,
      article_title: title,
    });
    trackYandexEvent('article_share', { slug, method: platform });

    // Open share dialog
    const shareUrl = getShareUrl(platform, { url, title });
    
    if (platform !== 'instagram') {
      openShareWindow(shareUrl);
    }
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