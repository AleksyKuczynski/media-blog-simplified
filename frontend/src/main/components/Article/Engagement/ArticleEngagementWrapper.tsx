// frontend/src/main/components/Article/ArticleEngagementWrapper.tsx
/**
 * Article Engagement Wrapper
 * 
 * REFACTORED: Main presentation component
 * - Server component that fetches initial data
 * - Renders ArticleEngagement controller with clean UI
 * - Uses unified EngagementMetric components
 */

import ArticleEngagement from './ArticleEngagement';
import { EngagementMetric } from './EngagementMetric';
import { EyeIcon, HeartIcon, ShareIcon } from './EngagementIcons';
import type { EngagementData } from '@/main/lib/engagement';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export interface ArticleEngagementWrapperProps {
  slug: string;
  title: string;
  url: string;
  className?: string;
}

/**
 * Fetch engagement data directly from Directus (server-side)
 */
async function fetchEngagementSSR(slug: string): Promise<EngagementData> {
  try {
    if (!DIRECTUS_API_TOKEN || !DIRECTUS_URL) {
      console.error('❌ SSR: Missing DIRECTUS_URL or DIRECTUS_API_TOKEN');
      return { slug, views: 0, likes: 0, shares: 0 };
    }

    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    console.log('🔍 SSR: Fetching engagement for:', slug);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error('❌ SSR: Directus API error:', response.status);
      return { slug, views: 0, likes: 0, shares: 0 };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const record = data.data[0];
      console.log('✅ SSR: Engagement data loaded:', {
        slug,
        views: record.view_count,
        likes: record.like_count,
        shares: record.share_count,
      });

      return {
        slug: record.article_slug,
        views: record.view_count || 0,
        likes: record.like_count || 0,
        shares: record.share_count || 0,
      };
    }

    console.log('ℹ️ SSR: No engagement record found for:', slug);
    return { slug, views: 0, likes: 0, shares: 0 };
  } catch (error) {
    console.error('❌ SSR: Error fetching engagement:', error);
    return { slug, views: 0, likes: 0, shares: 0 };
  }
}

/**
 * Article Engagement Wrapper - Main Presentation Component
 * 
 * ARCHITECTURE:
 * - Server component: Fetches initial data from Directus
 * - Renders ArticleEngagement controller with render props
 * - Uses unified EngagementMetric components for consistent UI
 * - Shows loading states during view tracking
 * - Displays errors gracefully
 */
export default async function ArticleEngagementWrapper({
  slug,
  title,
  url,
  className = '',
}: ArticleEngagementWrapperProps) {
  const initialEngagement = await fetchEngagementSSR(slug);

  return (
    <ArticleEngagement
      slug={slug}
      title={title}
      url={url}
      initialEngagement={initialEngagement}
    >
      {({
        engagement,
        isViewTracking,
        isLiked,
        isLikeProcessing,
        onLikeToggle,
        onShare,
        showCopySuccess,
        error,
        onErrorDismiss,
      }) => (
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
                onClick={onErrorDismiss}
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
              onClick={onLikeToggle}
              ariaLabel={isLiked ? 'Unlike article' : 'Like article'}
            />

            {/* Share Button - Shows copy success feedback */}
            <div className="relative">
              <EngagementMetric
                type="share"
                count={engagement.shares}
                icon={<ShareIcon />}
                interactive
                onClick={() => onShare('copy')}
                ariaLabel="Share article (copy link)"
              />

              {/* Copy Success Tooltip */}
              {showCopySuccess && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-sm rounded shadow-lg whitespace-nowrap animate-fade-in-out">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ArticleEngagement>
  );
}