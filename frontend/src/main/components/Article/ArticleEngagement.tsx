// frontend/src/main/components/Article/ArticleEngagement.tsx
// FIXED: Removed useEffect anti-patterns, proper error handling, optimistic updates only
'use client';

import { useState, useCallback, useEffect } from 'react';
import { trackGAEvent } from '@/main/lib/analytics/google';
import { trackYandexEvent } from '@/main/lib/analytics/yandex';
import {
  toggleLike as toggleLikeApi,
  trackShare as trackShareApi,
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
 * - One useEffect for localStorage sync (necessary to prevent hydration mismatch)
 * 
 * WHY ONE useEffect IS ACCEPTABLE:
 * localStorage is a browser-only API not available during SSR.
 * Reading it during initial render causes hydration mismatch.
 * This useEffect runs once after mount to sync with browser state.
 * This is the recommended Next.js pattern for browser-only state.
 * 
 * @param initialEngagement - Engagement data fetched during SSR (prevents initial API call)
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  initialEngagement,
  className = '',
}: ArticleEngagementProps) {
  // ===================================================================
  // STATE
  // ===================================================================
  const [engagement, setEngagement] = useState<EngagementData>(initialEngagement);
  
  // FIXED: Initialize to false to match SSR, then sync with localStorage after hydration
  // This prevents React hydration mismatch errors
  const [isLiked, setIsLiked] = useState(false);
  
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track if component has mounted (for localStorage access)
  const [isMounted, setIsMounted] = useState(false);

  // ===================================================================
  // ERROR HANDLING
  // ===================================================================

  /**
   * Sync with localStorage after hydration
   * This useEffect is necessary to prevent hydration mismatches
   * since localStorage is not available during SSR
   */
  useEffect(() => {
    setIsMounted(true);
    setIsLiked(isArticleLiked(slug));
  }, [slug]);

  /**
   * Show error message briefly
   */
  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  // ===================================================================
  // INTERACTION HANDLERS
  // ===================================================================

  /**
   * Handle like/unlike toggle
   * FIXED: Trust optimistic updates, don't refetch after mutation
   */
  const handleLikeToggle = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);
    
    const previousLikedState = isLiked;
    const previousLikeCount = engagement.likes;

    try {
      // Step 1: Optimistic UI update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Calculate new count (prevent going below 0)
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

      // Step 3: Update backend (but DON'T refetch - trust the optimistic update)
      try {
        await toggleLikeApi(slug, previousLikedState);
        
        // Track in analytics only on success
        const action = newLikedState ? 'like' : 'unlike';
        trackGAEvent(action, {
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent(`article_${action}`, { slug });
      } catch (apiError: any) {
        // If API fails but was rate limit, keep the optimistic update
        // (user might have legitimately liked it, just hit rate limit)
        if (apiError?.message?.includes('Rate limit')) {
          showError('Too many requests. Your like has been saved locally and will sync when possible.');
          // Keep the optimistic update
        } else {
          // For other errors, rollback
          throw apiError;
        }
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
   * FIXED: Optimistic update for share count
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

    // Track share in backend (fire and forget - don't block user)
    trackShareApi(slug).catch((error) => {
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

        {/* Share Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
            aria-label="Share article"
            aria-haspopup="true"
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

          {/* Share Dropdown Menu */}
          <div
            className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white shadow-lg rounded-lg border border-gray-200 py-2 min-w-[180px] z-10"
            role="menu"
          >
            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              role="menuitem"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {showCopySuccess ? '✓ Copied!' : 'Copy link'}
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Twitter
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Telegram
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}