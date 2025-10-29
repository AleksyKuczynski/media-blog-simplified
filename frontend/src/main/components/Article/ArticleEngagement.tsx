// frontend/src/main/components/Article/ArticleEngagement.tsx
// FIXED: Proper unlike action, uses Flow via API
'use client';

import { useState, useCallback, useEffect } from 'react';
import { trackGAEvent } from '@/main/lib/analytics/google';
import { trackYandexEvent } from '@/main/lib/analytics/yandex';
import {
  isArticleLiked,
  saveLikedArticle,
  removeLikedArticle,
  type EngagementData,
} from '@/main/lib/engagement/engagementService';

// ===================================================================
// TYPES
// ===================================================================

interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  /** Initial engagement data from SSR */
  initialEngagement: EngagementData;
  className?: string;
}

type SharePlatform = 'copy' | 'facebook' | 'twitter' | 'telegram' | 'whatsapp';

// ===================================================================
// SHARE UTILITIES
// ===================================================================

const SHARE_URLS = {
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  telegram: (url: string, title: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
};

// ===================================================================
// MAIN COMPONENT
// ===================================================================

/**
 * ArticleEngagement - Client component for article interactions
 * 
 * ARCHITECTURE:
 * - Gets initial engagement data from SSR (no fetch on mount)
 * - Uses optimistic updates for instant UI feedback
 * - Calls API route which triggers Directus Flow
 * - One useEffect for localStorage sync (browser-only API)
 * 
 * LIKE/UNLIKE:
 * - Single button that toggles between liked/not liked
 * - Sends "like" action to increment
 * - Sends "unlike" action to decrement
 * - localStorage tracks user's like status locally
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  initialEngagement,
  className,
}: ArticleEngagementProps) {
  // State
  const [engagement, setEngagement] = useState<EngagementData>(initialEngagement);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Sync with localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    setIsLiked(isArticleLiked(slug));
  }, [slug]);

  /**
   * Show error message temporarily
   */
  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  /**
   * Handle like/unlike toggle
   * FIXED: Sends correct action (like or unlike) to API
   */
  const handleLikeToggle = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    // Store previous state for rollback
    const previousLikedState = isLiked;
    const previousLikeCount = engagement.likes;

    try {
      // Step 1: Optimistic update (instant UI feedback)
      const newLikedState = !previousLikedState;
      setIsLiked(newLikedState);

      const newLikeCount = newLikedState 
        ? engagement.likes + 1 
        : Math.max(0, engagement.likes - 1);
      
      setEngagement(prev => ({
        ...prev,
        likes: newLikeCount,
      }));

      // Step 2: Update localStorage immediately
      if (newLikedState) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }

      // Step 3: Send correct action to API (which triggers Flow)
      const action = newLikedState ? 'like' : 'unlike';
      
      try {
        const response = await fetch(`/api/engagement/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update like');
        }

        const result = await response.json();
        
        // Update with actual count from server (in case of sync issues)
        setEngagement(prev => ({
          ...prev,
          likes: result.data.likes,
        }));

        // Track in analytics
        trackGAEvent(action, {
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent(`article_${action}`, { slug });

      } catch (apiError: any) {
        // Handle rate limiting gracefully
        if (apiError?.message?.includes('Rate limit')) {
          showError('Too many requests. Your like has been saved locally and will sync when possible.');
          // Keep the optimistic update
          return;
        }
        
        // For other errors, throw to trigger rollback
        throw apiError;
      }

    } catch (error: any) {
      console.error('Error toggling like:', error);
      
      // Rollback on error
      setIsLiked(previousLikedState);
      setEngagement(prev => ({
        ...prev,
        likes: previousLikeCount,
      }));
      
      // Update localStorage to match rollback
      if (previousLikedState) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }
      
      showError(error?.message || 'Failed to update like. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isLiked, engagement.likes, slug, title, showError]);

  /**
   * Handle share action
   * Optimistic update for share count
   */
  const handleShare = useCallback(async (platform: SharePlatform) => {
    if (platform === 'copy') {
      // Copy link to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);

        // Track in analytics
        trackGAEvent('share', {
          method: 'copy',
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent('article_share', { slug, method: 'copy' });
      } catch (error) {
        console.error('Failed to copy link:', error);
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
    fetch(`/api/engagement/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'share' }),
    }).catch((error) => {
      console.error('Error tracking share:', error);
      // Don't rollback - user already opened share dialog
    });

    // Open share dialog
    const shareUrl = SHARE_URLS[platform](url, title);
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');

    // Track in analytics
    trackGAEvent('share', {
      method: platform,
      article_slug: slug,
      article_title: title,
    });
    trackYandexEvent('article_share', { slug, method: platform });
  }, [slug, title, url, showError]);

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <>
      {/* Error Banner */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Engagement Actions */}
      <div
        className={`flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-t border-b border-gray-200 ${className}`}
        role="group"
        aria-label="Article engagement actions"
      >
        {/* View Count (Read-only) */}
        <div
          className="flex items-center gap-2 text-gray-600"
          aria-label={`${engagement.views} views`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="font-medium">{engagement.views.toLocaleString()}</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            isLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={isLiked ? 'Unlike article' : 'Like article'}
          aria-pressed={isLiked}
        >
          <svg
            className="w-5 h-5"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="font-medium">{engagement.likes.toLocaleString()}</span>
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all cursor-pointer"
            aria-label="Share article"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="font-medium">{engagement.shares.toLocaleString()}</span>
          </button>

          {/* Copy Success Indicator */}
          {showCopySuccess && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-sm rounded shadow-lg whitespace-nowrap">
              Link copied!
            </div>
          )}
        </div>

        {/* Share Dropdown (optional - can add later) */}
        {/* TODO: Add share menu with Facebook, Twitter, Telegram, WhatsApp */}
      </div>
    </>
  );
}