// frontend/src/main/components/Article/ArticleEngagement.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { trackGAEvent } from '@/main/lib/analytics/google';
import { trackYandexEvent } from '@/main/lib/analytics/yandex';
import {
  fetchEngagement,
  trackView,
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
 * Handles: view tracking, likes, and social sharing
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  className = '',
}: ArticleEngagementProps) {
  // State
  const [engagement, setEngagement] = useState<EngagementData>({
    slug,
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ===================================================================
  // DATA FETCHING
  // ===================================================================

  /**
   * Fetch current engagement data
   */
  const loadEngagement = useCallback(async () => {
    try {
      const data = await fetchEngagement(slug);
      setEngagement(data);
    } catch (error) {
      console.error('Error loading engagement:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    // Load engagement data
    loadEngagement();

    // Check if article is liked (from localStorage)
    setIsLiked(isArticleLiked(slug));
  }, [slug, loadEngagement]);

  /**
   * Track page view on mount (only once, after 2 seconds)
   */
  useEffect(() => {
    const trackViewAsync = async () => {
      try {
        // Track in backend
        const updatedData = await trackView(slug);
        setEngagement(updatedData);

        // Track in analytics
        trackGAEvent('page_view', {
          page_path: url,
          article_slug: slug,
        });
        trackYandexEvent('article_view', { slug });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track after 2 seconds (avoid counting bounces)
    const timer = setTimeout(trackViewAsync, 2000);
    return () => clearTimeout(timer);
  }, [slug, url]);

  // ===================================================================
  // INTERACTION HANDLERS
  // ===================================================================

  /**
   * Handle like/unlike toggle
   */
  const handleLikeToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const previousLikedState = isLiked;
    const previousEngagement = { ...engagement };

    try {
      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Don't go below 0 in UI
      const newLikeCount = newLikedState 
        ? engagement.likes + 1 
        : Math.max(0, engagement.likes - 1);
      
      setEngagement({
        ...engagement,
        likes: newLikeCount,
      });

      // Update backend
      const updatedData = await toggleLikeApi(slug, previousLikedState);
      
      // CRITICAL: Update with actual server data
      setEngagement(updatedData);

      // Update localStorage
      if (newLikedState) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }

      // Track in analytics
      const action = newLikedState ? 'like' : 'unlike';
      trackGAEvent(action, {
        article_slug: slug,
        article_title: title,
      });
      trackYandexEvent(`article_${action}`, { slug });
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Rollback on error
      setIsLiked(previousLikedState);
      setEngagement(previousEngagement);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle share action
   */
  const handleShare = async (platform: SharePlatform) => {
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
      }
      return;
    }

    // Track share in backend
    try {
      const updatedData = await trackShareApi(slug);
      setEngagement(updatedData);
    } catch (error) {
      console.error('Error tracking share:', error);
    }

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
  };

  // ===================================================================
  // RENDER
  // ===================================================================

  if (isLoading) {
    return (
      <div className={`flex items-center gap-4 sm:gap-6 py-4 ${className}`}>
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
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

      {/* Share Button with Counter */}
      <div className="relative">
        <details className="group">
          <summary className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer list-none">
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
          </summary>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            {/* Copy Link */}
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {showCopySuccess ? 'Copied!' : 'Copy link'}
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare('telegram')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}