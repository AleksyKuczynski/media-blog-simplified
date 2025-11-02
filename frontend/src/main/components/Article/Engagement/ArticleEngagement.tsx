// frontend/src/main/components/Article/Engagement/ArticleEngagement.tsx
/**
 * Article Engagement - Client Component
 * 
 * FIXED: View tracking now happens during initial fetch (in GET endpoint)
 * - No more delayed view tracking
 * - Shows correct counters immediately on page load
 * - View count already includes current view
 */

'use client';

import { useState, useEffect } from 'react';
import { useEngagement } from '@/main/lib/hooks';
import { fetchEngagement } from '@/main/lib/engagement';
import { EngagementMetric } from './EngagementMetric';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';
import type { EngagementData } from '@/main/lib/engagement';

export interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

/**
 * Article Engagement Component
 * 
 * ARCHITECTURE (UPDATED):
 * 1. Mounts with placeholder data { views: 0, likes: 0, shares: 0 }
 * 2. Fetches real data from API on mount
 *    - GET endpoint automatically tracks view and creates/updates record
 *    - Returns fresh data with view already counted
 * 3. Updates state with real data (view count already correct)
 * 4. User interactions (like/share) use optimistic updates + fire-and-forget API
 * 
 * @example
 * ```tsx
 * <ArticleEngagement
 *   slug="my-article"
 *   title="Article Title"
 *   url="https://example.com/article"
 * />
 * ```
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  className = '',
}: ArticleEngagementProps) {
  const [initialData, setInitialData] = useState<EngagementData>({
    slug,
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch real engagement data on mount
  // NOTE: This now automatically tracks the view in the backend
  useEffect(() => {
    console.log('[ArticleEngagement] Fetching initial data for:', slug);
    
    fetchEngagement(slug)
      .then(data => {
        console.log('[ArticleEngagement] Initial data loaded:', data);
        console.log('  - View count includes current visit');
        setInitialData(data);
      })
      .catch(error => {
        console.error('[ArticleEngagement] Failed to fetch initial data:', error);
        // Keep placeholder data on error
      })
      .finally(() => {
        setIsLoadingInitial(false);
      });
  }, [slug]);

  // Main engagement hook (WITHOUT view tracking - that's handled by GET endpoint now)
  const {
    engagement,
    isLiked,
    isLikeProcessing,
    toggleLike,
    handleShare,
    showCopySuccess,
    error,
    clearError,
  } = useEngagement({
    slug,
    title,
    url,
    initialData,
    trackView: false, // CHANGED: Don't track view here - GET endpoint handles it
  });

  return (
    <div className={className}>
      {/* Error Banner */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-center justify-between"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Engagement Metrics */}
      <div
        className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-t border-b border-gray-200"
        role="group"
        aria-label="Article engagement metrics"
      >
        {/* View Count - Shows skeleton during initial load */}
        {isLoadingInitial ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <EngagementMetric
            type="view"
            count={engagement.views}
            icon={<EyeIcon />}
            ariaLabel={`${engagement.views} views`}
          />
        )}

        {/* Like Button - Shows skeleton during initial load */}
        {isLoadingInitial ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <EngagementMetric
            type="like"
            count={engagement.likes}
            icon={<HeartIcon filled={isLiked} />}
            interactive
            isActive={isLiked}
            isLoading={isLikeProcessing}
            disabled={isLikeProcessing}
            onClick={toggleLike}
            ariaLabel={isLiked ? 'Unlike article' : 'Like article'}
          />
        )}

        {/* Share Button - Shows skeleton during initial load */}
        {isLoadingInitial ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <div className="relative">
            <EngagementMetric
              type="share"
              count={engagement.shares}
              icon={<ShareIcon />}
              interactive
              onClick={() => handleShare('copy')}
              ariaLabel="Share article (copy link)"
            />

            {/* Copy Success Tooltip */}
            {showCopySuccess && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-sm rounded shadow-lg whitespace-nowrap z-10">
                Link copied!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}