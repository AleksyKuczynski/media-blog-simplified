// frontend/src/main/components/Article/Engagement/ArticleEngagement.tsx
/**
 * Article Engagement - Client Component
 * FIXED VERSION - Adds client-side session check to prevent duplicate view tracking
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
      // Still fetch data but don't expect viewTracked=true from server
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

        // Debug log immediately after state update
        console.log('[ArticleEngagement] 🔄 State updated:', {
          fetchedViews: result.data.views,
          viewTracked: result.viewTracked || false,
          willShowOptimistic: result.viewTracked ? 'YES (+1)' : 'NO',
          calculatedDisplay: result.viewTracked 
            ? result.data.views + 1 
            : result.data.views,
        });

        // CRITICAL FIX: Mark as viewed in session storage if view was tracked
        // This prevents the flow from firing again on page refresh/navigation
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
  // CRITICAL: Use fetchedData directly, not engagement state
  const displayedViews = viewWasTracked 
    ? fetchedData.views + 1 
    : fetchedData.views;

  // Log display state after data is loaded (not during initial render)
  useEffect(() => {
    if (!isLoadingInitial) {
      console.log('[ArticleEngagement] 📊 Display:', {
        fetchedViews: fetchedData.views,
        viewWasTracked,
        displayedViews,
        calculation: viewWasTracked 
          ? `${fetchedData.views} + 1 = ${displayedViews}` 
          : `${fetchedData.views} (no optimistic)`,
      });
    }
  }, [fetchedData.views, viewWasTracked, displayedViews, isLoadingInitial]);

  return (
    <div className={className}>
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

      <div
        className="flex flex-wrap items-center gap-4 sm:gap-6 py-4 border-t border-b border-gray-200"
        role="group"
        aria-label="Article engagement metrics"
      >
        {/* Views */}
        {isLoadingInitial ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-12 h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <EngagementMetric
            type="view"
            count={displayedViews}
            icon={<EyeIcon />}
            ariaLabel={`${displayedViews} views`}
          />
        )}

        {/* Likes */}
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

        {/* Shares */}
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