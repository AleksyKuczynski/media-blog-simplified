// app/[lang]/[rubric]/[slug]/_components/engagement/ArticleEngagement.tsx
/**
 * Article Engagement - Main Container Component
 * 
 * Fixed sidebar displaying article engagement metrics (views, likes, shares).
 * Orchestrates data fetching, visibility tracking, and user interactions.
 * 
 * Architecture:
 * - Fixed positioning: Bottom-left sidebar with auto-hide
 * - Visibility logic: Hides on scroll threshold and section overlap
 * - State composition: Combines data fetch, engagement logic, visibility
 * 
 * Features:
 * - Conditional rendering based on loading states
 * - Optimistic view count display (+1 if tracked)
 * - Share modal trigger and state management
 * - Error toast integration
 * - Responsive layout (horizontal mobile, vertical desktop)
 * 
 * Dependencies:
 * - ./hooks/useEngagementData (initial data fetch)
 * - ./hooks/useEngagement (like/share logic)
 * - ./hooks/useEngagementVisibility (auto-hide logic)
 * - ./EngagementMetric (metric display component)
 * - ./SharePopup (share modal)
 * - ./engagement.styles (style constants)
 * 
 * @param slug - Article slug for data fetching
 * @param title - Article title for sharing
 * @param url - Full article URL for sharing
 * @param className - Optional additional styles
 */

'use client';

import { useState, useRef } from 'react';
import { EngagementMetric } from './EngagementMetric';
import { EngagementMetricSkeleton } from './EngagementMetricSkeleton';
import { EngagementErrorToast } from './EngagementErrorToast';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';
import { SharePopup } from './SharePopup';
import { useEngagement } from './hooks/useEngagement';
import { useEngagementData } from './hooks/useEngagementData';
import { useEngagementVisibility } from './hooks/useEngagementVisibility';
import { ENGAGEMENT_BAR_STYLES } from './engagement.styles';

export interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

const styles = ENGAGEMENT_BAR_STYLES;

export default function ArticleEngagement({
  slug,
  title,
  url,
  className = '',
}: ArticleEngagementProps) {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const engagementBarRef = useRef<HTMLElement>(null);

  // Fetch initial engagement data
  const { 
    data: fetchedData, 
    isLoading: isLoadingInitial, 
    viewWasTracked 
  } = useEngagementData(slug);

  // Track visibility based on scroll and overlap
  const isVisible = useEngagementVisibility({
    scrollThreshold: 300,
    relatedSectionId: 'related-articles-section',
    footerId: 'site-footer',
  });

  // Engagement logic (likes, shares, etc.)
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

  const containerClasses = `
    ${styles.container.base}
    ${isVisible ? styles.container.visible : styles.container.hidden}
    ${className}
  `;

  return (
    <>
      <EngagementErrorToast error={error} onClose={clearError} />

      <SharePopup
        isOpen={isSharePopupOpen}
        onClose={handleClosePopup}
        onShare={handleShare}
        showCopySuccess={showCopySuccess}
      />

      <aside
        ref={engagementBarRef}
        className={containerClasses}
        role="complementary"
        aria-label="Article engagement metrics"
        aria-hidden={!isVisible}
      >
        {/* Views */}
        {isLoadingInitial ? (
          <EngagementMetricSkeleton />
        ) : (
          <EngagementMetric
            type="view"
            count={displayedViews}
            icon={<EyeIcon className="w-full h-full" />}
            ariaLabel={`${displayedViews} views`}
          />
        )}

        <div className={styles.divider} />

        {/* Likes */}
        {isLoadingInitial ? (
          <EngagementMetricSkeleton />
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

        <div className={styles.divider} />

        {/* Shares */}
        {isLoadingInitial ? (
          <EngagementMetricSkeleton />
        ) : (
          <EngagementMetric
            type="share"
            count={engagement.shares}
            icon={<ShareIcon className="w-full h-full" />}
            interactive
            isActive={isSharePopupOpen}
            onClick={handleShareButtonClick}
            ariaLabel="Share article"
          />
        )}
      </aside>
    </>
  );
}