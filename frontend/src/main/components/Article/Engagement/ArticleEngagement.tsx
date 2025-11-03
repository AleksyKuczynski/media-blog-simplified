// frontend/src/main/components/Article/Engagement/ArticleEngagement.tsx
/**
 * Article Engagement - Client Component
 * UPDATED: Sticky vertical bar in bottom-left corner
 * Matches scroll-to-top button styling
 */

'use client';

import { useState, useEffect } from 'react';
import { useEngagement } from '@/main/lib/hooks';
import { EngagementMetric } from './EngagementMetric';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';
import type { EngagementData } from '@/main/lib/engagement';

export interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

interface EngagementResponse {
  success: boolean;
  data: EngagementData;
  viewTracked?: boolean;
}

export default function ArticleEngagement({
  slug,
  title,
  url,
  className = '',
}: ArticleEngagementProps) {
  // Track fetched data separately for direct access
  const [fetchedData, setFetchedData] = useState<EngagementData>({
    slug,
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [viewWasTracked, setViewWasTracked] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch engagement data on mount
  useEffect(() => {
    // CRITICAL FIX: Check if article was already viewed in this browser session
    // This prevents the API from triggering the Directus flow on subsequent visits
    const sessionKey = `viewed_${slug}`;
    const alreadyViewedInSession = typeof window !== 'undefined' 
      ? sessionStorage.getItem(sessionKey) 
      : null;

    if (alreadyViewedInSession) {
      console.log('[ArticleEngagement] ✅ Already viewed in this session - skipping view tracking');
    } else {
      console.log('[ArticleEngagement] 🆕 First view in this session');
    }

    console.log('[ArticleEngagement] Fetching data for:', slug);
    
    fetch(`/api/engagement/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json() as Promise<EngagementResponse>;
      })
      .then((result) => {
        console.log('[ArticleEngagement] ✅ Response:', {
          views: result.data.views,
          likes: result.data.likes,
          shares: result.data.shares,
          viewTracked: result.viewTracked,
        });
        
        setFetchedData(result.data);
        setViewWasTracked(result.viewTracked || false);

        // CRITICAL FIX: Mark as viewed in session storage if view was tracked
        if (result.viewTracked && typeof window !== 'undefined') {
          sessionStorage.setItem(sessionKey, 'true');
          console.log('[ArticleEngagement] 📝 Marked as viewed in session storage');
        }
      })
      .catch((error) => {
        console.error('[ArticleEngagement] ❌ Fetch error:', error);
      })
      .finally(() => {
        setIsLoadingInitial(false);
      });
  }, [slug]);

  // Engagement hook for likes/shares functionality
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
    initialData: fetchedData,
    trackView: false,
  });

  // Calculate displayed views with optimistic +1
  const displayedViews = viewWasTracked 
    ? fetchedData.views + 1 
    : fetchedData.views;

  return (
    <>
      {/* Error Toast (if needed) - positioned at top */}
      {error && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] max-w-md w-full mx-4"
          role="alert"
        >
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-center justify-between shadow-lg">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="ml-2 text-red-600 hover:text-red-800 font-bold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Sticky Engagement Bar - Bottom Left */}
      <aside
        className={`
          fixed bottom-4 left-4 z-60
          flex flex-col gap-2
          p-3 sm:p-4
          bg-pr-cont hover:bg-pr-fix
          text-on-pr
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-200
          ${className}
        `}
        role="complementary"
        aria-label="Article engagement metrics"
      >
        {/* Views - Top */}
        {isLoadingInitial ? (
          <div className="flex flex-col items-center gap-1 p-2 animate-pulse">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-on-pr/20 rounded-full"></div>
            <div className="w-8 h-3 bg-on-pr/20 rounded"></div>
          </div>
        ) : (
          <EngagementMetric
            type="view"
            count={displayedViews}
            icon={<EyeIcon className="w-full h-full" />}
            ariaLabel={`${displayedViews} views`}
          />
        )}

        {/* Separator */}
        <div className="h-px bg-on-pr/20 mx-2" />

        {/* Likes - Middle */}
        {isLoadingInitial ? (
          <div className="flex flex-col items-center gap-1 p-2 animate-pulse">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-on-pr/20 rounded-full"></div>
            <div className="w-8 h-3 bg-on-pr/20 rounded"></div>
          </div>
        ) : (
          <EngagementMetric
            type="like"
            count={engagement.likes}
            icon={<HeartIcon filled={isLiked} className="w-full h-full" />}
            interactive
            isActive={isLiked}
            isLoading={isLikeProcessing}
            disabled={isLikeProcessing}
            onClick={toggleLike}
            ariaLabel={isLiked ? 'Unlike article' : 'Like article'}
          />
        )}

        {/* Separator */}
        <div className="h-px bg-on-pr/20 mx-2" />

        {/* Shares - Bottom */}
        {isLoadingInitial ? (
          <div className="flex flex-col items-center gap-1 p-2 animate-pulse">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-on-pr/20 rounded-full"></div>
            <div className="w-8 h-3 bg-on-pr/20 rounded"></div>
          </div>
        ) : (
          <div className="relative">
            <EngagementMetric
              type="share"
              count={engagement.shares}
              icon={<ShareIcon className="w-full h-full" />}
              interactive
              onClick={() => handleShare('copy')}
              ariaLabel="Share article (copy link)"
            />
            {/* Link copied notification - positioned to the right of the button */}
            {showCopySuccess && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10 animate-fade-in">
                Link copied!
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}