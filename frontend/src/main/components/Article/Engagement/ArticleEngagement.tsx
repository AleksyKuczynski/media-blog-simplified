// frontend/src/main/components/Article/ArticleEngagement.tsx
/**
 * Article Engagement Controller
 * 
 * REFACTORED: Clean, focused controller component
 * - Uses custom hooks for all logic
 * - Minimal state management
 * - Delegates presentation to ArticleEngagementWrapper
 */

'use client';

import { useEngagement, type EngagementData } from '@/main/lib/engagement';

export interface ArticleEngagementProps {
  slug: string;
  title: string;
  url: string;
  initialEngagement: EngagementData;
  children: (props: ArticleEngagementRenderProps) => React.ReactNode;
}

export interface ArticleEngagementRenderProps {
  engagement: EngagementData;
  isViewTracking: boolean;
  hasViewTracked: boolean;
  isLiked: boolean;
  isLikeProcessing: boolean;
  onLikeToggle: () => Promise<void>;
  onShare: (platform: 'copy' | 'facebook' | 'twitter' | 'telegram' | 'whatsapp') => Promise<void>;
  showCopySuccess: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

/**
 * Article Engagement Controller
 * 
 * Uses render props pattern to keep presentation separate
 * All logic is handled by the useEngagement hook
 * 
 * @example
 * ```tsx
 * <ArticleEngagement
 *   slug="my-article"
 *   title="Article Title"
 *   url="https://example.com/article"
 *   initialEngagement={data}
 * >
 *   {(props) => <ArticleEngagementView {...props} />}
 * </ArticleEngagement>
 * ```
 */
export default function ArticleEngagement({
  slug,
  title,
  url,
  initialEngagement,
  children,
}: ArticleEngagementProps) {
  const {
    engagement,
    isViewTracking,
    hasViewTracked,
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
    <>
      {children({
        engagement,
        isViewTracking,
        hasViewTracked,
        isLiked,
        isLikeProcessing,
        onLikeToggle: toggleLike,
        onShare: handleShare,
        showCopySuccess,
        error,
        onErrorDismiss: clearError,
      })}
    </>
  );
}