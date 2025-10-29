// frontend/src/main/components/Article/ArticleEngagement.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { trackGAEvent } from '@/main/lib/analytics/google';
import { trackYandexEvent } from '@/main/lib/analytics/yandex';

// ===================================================================
// TYPES
// ===================================================================

interface EngagementData {
  views: number;
  likes: number;
  shares: number;
}

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
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // LocalStorage key for tracking liked articles
  const LIKED_ARTICLES_KEY = 'liked_articles';

  // ===================================================================
  // DATA FETCHING
  // ===================================================================

  /**
   * Fetch current engagement data
   */
  const fetchEngagement = useCallback(async () => {
    try {
      const response = await fetch(`/api/engagement/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch engagement');

      const result = await response.json();
      if (result.success && result.data) {
        setEngagement(result.data);
      }
    } catch (error) {
      console.error('Error fetching engagement:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  /**
   * Check if article is already liked (from localStorage)
   */
  const checkLikedState = useCallback(() => {
    try {
      const likedArticles = localStorage.getItem(LIKED_ARTICLES_KEY);
      if (likedArticles) {
        const liked = JSON.parse(likedArticles);
        setIsLiked(Array.isArray(liked) && liked.includes(slug));
      }
    } catch (error) {
      console.error('Error reading liked state:', error);
    }
  }, [slug]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    fetchEngagement();
    checkLikedState();
  }, [fetchEngagement, checkLikedState]);

  /**
   * Track page view on mount (only once)
   */
  useEffect(() => {
    const trackView = async () => {
      try {
        // Track in backend
        await fetch(`/api/engagement/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        });

        // Track in analytics
        trackGAEvent('page_view', {
          page_path: url,
          article_slug: slug,
        });
        trackYandexEvent('article_view', { slug });

        // Refresh engagement data
        fetchEngagement();
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track after 2 seconds (avoid counting bounces)
    const timer = setTimeout(trackView, 2000);
    return () => clearTimeout(timer);
  }, [slug, url, fetchEngagement]);

  // ===================================================================
  // INTERACTION HANDLERS
  // ===================================================================

  /**
   * Handle like/unlike toggle
   */
  const handleLikeToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const action = isLiked ? 'unlike' : 'like';

    try {
      const response = await fetch(`/api/engagement/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      const result = await response.json();
      if (result.success && result.data) {
        setEngagement(result.data);

        // Update localStorage
        const likedArticles = JSON.parse(
          localStorage.getItem(LIKED_ARTICLES_KEY) || '[]'
        );

        if (isLiked) {
          // Remove from liked
          const updated = likedArticles.filter((s: string) => s !== slug);
          localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(updated));
          setIsLiked(false);
        } else {
          // Add to liked
          likedArticles.push(slug);
          localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
          setIsLiked(true);
        }

        // Track in analytics
        trackGAEvent(action, {
          article_slug: slug,
          article_title: title,
        });
        trackYandexEvent(`article_${action}`, { slug });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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

        // Track share
        await fetch(`/api/engagement/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'share' }),
        });

        fetchEngagement();

        // Track in analytics
        trackGAEvent('share', {
          method: 'copy_link',
          article_slug: slug,
        });
        trackYandexEvent('article_share_copy', { slug });
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    } else {
      // Open share dialog
      const shareUrl = SHARE_URLS[platform](url, title);
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');

      // Track share
      await fetch(`/api/engagement/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'share' }),
      });

      fetchEngagement();

      // Track in analytics
      trackGAEvent('share', {
        method: platform,
        article_slug: slug,
      });
      trackYandexEvent(`article_share_${platform}`, { slug });
    }
  };

  // ===================================================================
  // RENDER
  // ===================================================================

  if (isLoading) {
    return (
      <div className={`flex items-center gap-6 py-4 ${className}`}>
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

      {/* Share Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Поделиться:</span>

        {/* Copy Link */}
        <button
          onClick={() => handleShare('copy')}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative"
          aria-label="Copy link"
          title="Копировать ссылку"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {showCopySuccess && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-600 text-white text-xs rounded whitespace-nowrap">
              Скопировано!
            </span>
          )}
        </button>

        {/* Telegram */}
        <button
          onClick={() => handleShare('telegram')}
          className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          aria-label="Share on Telegram"
          title="Telegram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </button>

        {/* Twitter/X */}
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-all"
          aria-label="Share on X (Twitter)"
          title="X (Twitter)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
          aria-label="Share on Facebook"
          title="Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
          aria-label="Share on WhatsApp"
          title="WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      </div>

      {/* Share Count (subtle) */}
      {engagement.shares > 0 && (
        <div className="text-sm text-gray-500 ml-auto">
          {engagement.shares.toLocaleString()} {engagement.shares === 1 ? 'раз' : 'раз'}
        </div>
      )}
    </div>
  );
}