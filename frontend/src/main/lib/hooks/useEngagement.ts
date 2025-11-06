// frontend/src/main/lib/hooks/useEngagement.ts
/**
 * Main Engagement Hook - Phase 2 (Views Fix)
 * 
 * UPDATED: Views now use the same reconciliation as likes/shares
 * 
 * BEHAVIOR:
 * - Views: Reconciled from action log (logged when API tracks)
 * - Likes: Debounced (1s), optimistic updates, fire-and-forget, action log
 * - Shares: Optimistic +1, fire-and-forget, action log
 * - Reconciliation: Timestamp-based (action.timestamp vs server.last_updated)
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

export interface UseEngagementOptions {
  slug: string;
  title: string;
  url: string;
  initialData: EngagementData;
  trackView?: boolean;
  viewWasTrackedByAPI?: boolean;  // NEW: Flag from API response
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
  viewWasTrackedByAPI = false,
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

  // Log view action if tracked by API (for reconciliation)
  useEffect(() => {
    if (viewWasTrackedByAPI) {
      console.log('[useEngagement] View was tracked by API, logging action');
      logAction(slug, 'view');
    }
  }, [slug, viewWasTrackedByAPI]);

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
   * Optional view tracking (disabled by default, views handled by API)
   */
  const { hasTracked: hasViewTracked } = useViewTracking({
    slug,
    delayMs: 1000,
    enabled: trackView,
    onTrack: () => {
      console.log('[Engagement] View tracked (client-side), logging action');
      logAction(slug, 'view');
      setEngagement(prev => ({
        ...prev,
        views: prev.views + 1,
      }));
    },
  });

  /**
   * Like state management with action log reconciliation
   */
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

  /**
   * Share state management with action log reconciliation
   */
  const { optimisticShares } = useShareState({
    slug,
    currentViews: engagement.views,
    currentLikes: engagement.likes,
    currentShares: engagement.shares,
    lastUpdated: engagement.last_updated || null,
    refreshTrigger: shareRefreshTrigger,
  });

  /**
   * Views reconciliation (same as likes/shares)
   */
  const reconciledCounts = reconcileCounts(
    slug,
    { 
      views: engagement.views, 
      likes: engagement.likes, 
      shares: engagement.shares 
    },
    engagement.last_updated || null
  );

  /**
   * Display engagement with optimistic counts (all reconciled)
   */
  const displayEngagement: EngagementData = {
    ...engagement,
    views: reconciledCounts.views,    // Reconciled view count
    likes: optimisticLikes,           // Reconciled like count
    shares: optimisticShares,         // Reconciled share count
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
    // 1. Log action with timestamp (persists across refreshes)
    logAction(slug, 'share');
    
    // 2. Trigger re-calculation in useShareState
    setShareRefreshTrigger(prev => prev + 1);

    // 3. Track share in backend via Flow (fire and forget)
    updateEngagement(slug, 'share').catch((error) => {
      console.error('[Engagement] Error tracking share (non-critical):', error);
      // Don't rollback - user already opened share dialog and action is logged
    });

    // 4. Track in analytics
    trackGAEvent('share', {
      method: platform,
      article_slug: slug,
      article_title: title,
    });
    trackYandexEvent('article_share', { slug, method: platform });

    // 5. Open share dialog
    const shareUrl = getShareUrl(platform, { url, title });
    
    if (platform === 'instagram') {
      // Instagram: Show instructions (can't programmatically share)
      console.log('[Engagement] Instagram share:', shareUrl);
      // Could show a modal with instructions here
    } else {
      // Other platforms: Open share window
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