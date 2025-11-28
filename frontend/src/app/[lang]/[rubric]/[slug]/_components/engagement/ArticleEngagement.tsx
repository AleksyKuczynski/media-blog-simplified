// src/app/[lang]/[rubric]/[slug]/_components/engagement/ArticleEngagement.tsx
/**
 * Article Engagement Component
 * 
 * Displays engagement metrics (views, likes, shares) in a sticky sidebar
 * - Views: Tracked server-side on first visit
 * - Likes: Interactive with persistent state
 * - Shares: Opens social sharing popup
 */

'use client';

import { useState, useEffect } from 'react';
import { useEngagement } from '@/main/lib/hooks';
import { EngagementMetric } from './EngagementMetric';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';
import type { EngagementData } from '@/app/[lang]/[rubric]/[slug]/_components/engagement/api';
import { SharePopup } from './SharePopup';

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
  const [fetchedData, setFetchedData] = useState<EngagementData>({
    slug,
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [viewWasTracked, setViewWasTracked] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  // Fetch engagement data on mount
  useEffect(() => {
    // Check if article was already viewed in this browser session
    const sessionKey = `viewed_${slug}`;
    const alreadyViewedInSession = typeof window !== 'undefined' 
      ? sessionStorage.getItem(sessionKey) === 'true'
      : false;

    async function fetchData() {
      try {
        const response = await fetch(`/api/engagement/${slug}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch engagement data');
        }

        const result: EngagementResponse = await response.json();

        if (result.success && result.data) {
          setFetchedData(result.data);
          setViewWasTracked(result.viewTracked || false);

          // Mark as viewed in session if not already
          if (result.viewTracked && typeof window !== 'undefined') {
            sessionStorage.setItem(sessionKey, 'true');
          }
        }
      } catch (error) {
        // Silent failure - use default values
      } finally {
        setIsLoadingInitial(false);
      }
    }

    if (alreadyViewedInSession) {
      setViewWasTracked(false);
    }

    fetchData();
  }, [slug]);

  // Engagement hook
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
    viewWasTrackedByAPI: viewWasTracked,
  });

  // Share popup handlers
  const handleShareButtonClick = () => {
    setIsSharePopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsSharePopupOpen(false);
  };

  // Display views with optimistic +1 if view was just tracked
  const displayedViews = viewWasTracked 
    ? fetchedData.views + 1 
    : fetchedData.views;

  return (
    <>
      {/* Error Toast */}
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

      {/* Sticky Engagement Bar */}
      <aside
        className={`
          fixed bottom-4 left-4 z-60
          flex md:flex-col gap-2
          py-3 px-4
          bg-pr-cont hover:bg-pr-fix
          text-on-pr
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-200
          ${className}
        `}
        role="complementary"
        aria-label="Article engagement metrics"
      >
        {/* Views */}
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

        <div className="h-px bg-on-pr/20 mx-2" />

        {/* Likes */}
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

        <div className="h-px bg-on-pr/20 mx-2" />

        {/* Shares */}
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
              isActive={isSharePopupOpen}
              onClick={handleShareButtonClick}
              ariaLabel="Share article"
            />
            
            <SharePopup
              isOpen={isSharePopupOpen}
              onClose={handleClosePopup}
              onShare={handleShare}
              showCopySuccess={showCopySuccess}
            />
          </div>
        )}
      </aside>
    </>
  );
}