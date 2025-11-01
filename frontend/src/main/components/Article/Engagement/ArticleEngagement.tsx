// frontend/src/main/components/Article/Engagement/ArticleEngagement.tsx
/**
 * Article Engagement - Client Component
 * 
 * SIMPLIFIED: Direct rendering without render props
 * - Uses custom hook for logic
 * - Renders UI directly
 * - No function children (fixes server/client boundary issue)
 */

'use client';

import { useEngagement, type EngagementData } from '@/main/lib/engagement';
import { EngagementMetric } from './EngagementMetric';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';

export interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  initialEngagement: EngagementData;
  className?: string;
}

/**
 * Article Engagement Component
 * 
 * Combines logic (useEngagement hook) and presentation (UI)
 * All in one client component - simpler and works across server/client boundary
 * 
 * @example
 * ```tsx
 * <ArticleEngagement
 *   slug="my-article"
 *   title="Article Title"
 *   url="https://example.com/article"
 *   initialEngagement={data}
 * />
 * ```
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  initialEngagement,
  className = '',
}: ArticleEngagementProps) {
  const {
    engagement,
    isViewTracking,
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
    initialData: initialEngagement,
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
        {/* View Count - Shows loading state during tracking */}
        <EngagementMetric
          type="view"
          count={engagement.views}
          icon={<EyeIcon />}
          isLoading={isViewTracking}
          ariaLabel={`${engagement.views} views${isViewTracking ? ' (updating...)' : ''}`}
        />

        {/* Like Button - Interactive with optimistic updates */}
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

        {/* Share Button - Shows copy success feedback */}
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
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-sm rounded shadow-lg whitespace-nowrap">
              Link copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}