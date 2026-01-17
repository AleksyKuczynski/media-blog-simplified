// app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useEngagement.ts
/**
 * Article Engagement - Main Hook
 * 
 * Orchestrates all engagement functionality with state reconciliation.
 * Combines view tracking, like state, and share state.
 * 
 * Architecture:
 * - Views: Server-tracked, reconciled via action log
 * - Likes: Debounced (1s), optimistic updates, fire-and-forget API
 * - Shares: Immediate optimistic update, fire-and-forget API
 * 
 * Features:
 * - Timestamp-based reconciliation
 * - Optimistic UI updates
 * - Error handling with user feedback
 * - Analytics tracking (GA + Yandex)
 * - Web Share API support (Instagram)
 * 
 * Dependencies:
 * - ./useLikeState (like button logic)
 * - ./useShareState (share state logic)
 * - ./useViewTracking (optional view tracking)
 * - ../lib/api (updateEngagement)
 * - ../lib/share (share utilities)
 * - ../lib/actionLog (reconcileCounts, logAction)
 * - @/main/lib/analytics (GA + Yandex tracking)
 * - @/main/lib/dictionary (error messages)
 * 
 * @param slug - Article slug
 * @param title - Article title
 * @param url - Full article URL
 * @param initialData - Server engagement data
 * @param trackView - Enable client-side view tracking (default: false)
 * @param viewWasTrackedByAPI - Server tracked view on this request
 * 
 * @returns {UseEngagementReturn} State and action handlers
 */

import { useState, useEffect, useCallback } from 'react';
import { useLikeState } from './useLikeState';
import { updateEngagement } from '../lib/api';
import { getShareUrl, copyToClipboard, openShareWindow, shareViaWebAPI } from '../lib/share';
import { logAction, reconcileCounts } from '../lib/actionLog';
import type { EngagementData, SharePlatform } from '../lib';
import { useViewTracking } from './useViewTracking';
import { useShareState } from './useShareState';
import { trackGAEvent } from '@/features/analytics/lib/google';
import { trackYandexEvent } from '@/features/analytics/lib/yandex';
import { dictionary } from '@/config/i18n';

export interface UseEngagementOptions {
  slug: string;
  title: string;
  url: string;
  initialData: EngagementData;
  trackView?: boolean;
  viewWasTrackedByAPI?: boolean;
}

export type ShareMethod = 'native' | 'copy' | 'window';

export interface UseEngagementReturn {
  engagement: EngagementData;
  hasViewTracked: boolean;
  isLiked: boolean;
  isLikeProcessing: boolean;
  toggleLike: () => void;
  handleShare: (platform: SharePlatform) => Promise<ShareMethod>;
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
   * Returns the share method used: 'native', 'copy', or 'window'
   */
  const handleShare = useCallback(async (platform: SharePlatform): Promise<ShareMethod> => {
    // Handle regular copy
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
      return 'copy';
    }

    // Handle Instagram - try Web Share API first, fallback to clipboard
    if (platform === 'instagram') {
      // Try Web Share API (mobile native share sheet)
      const sharedViaAPI = await shareViaWebAPI({ url, title });
      
      if (sharedViaAPI) {
        // Successfully shared via native share sheet
        trackGAEvent('share', {
          method: 'instagram-native',
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent('article_share', { slug, method: 'instagram-native' });
        return 'native'; // Signal that native share was used
      }
      
      // Fallback: Copy to clipboard (desktop or Web Share API unavailable)
      const success = await copyToClipboard(url);
      
      if (success) {
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);

        trackGAEvent('share', {
          method: 'instagram-copy',
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent('article_share', { slug, method: 'instagram-copy' });
      } else {
        showError(dictionary.errors.engagement.updateFailed);
      }
      return 'copy';
    }

    // Handle other platforms (Facebook, Twitter, Telegram, WhatsApp)
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
    openShareWindow(shareUrl);
    return 'window';
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