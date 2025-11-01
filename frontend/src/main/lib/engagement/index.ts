// frontend/src/main/lib/engagement/index.ts
/**
 * Engagement Module - Public API
 * 
 * Centralized exports for all engagement functionality
 */

// Types
export type {
  EngagementData,
  EngagementResponse,
  EngagementError,
  EngagementAction,
  EngagementState,
  LikeState,
  ViewTrackingState,
  SharePlatform,
  ShareConfig,
  RetryOptions,
} from './types';

// API
export {
  fetchEngagement,
  updateEngagement,
  fetchEngagementBatch,
} from './api';

// LocalStorage
export {
  getLikedArticles,
  isArticleLiked,
  saveLikedArticle,
  removeLikedArticle,
} from './localStorage';

// Share
export {
  getShareUrl,
  copyToClipboard,
  openShareWindow,
} from './share';

// Retry
export {
  retryWithBackoff,
  shouldRetryError,
} from './retry';

// Hooks (from ../hooks since they're in lib/hooks not lib/engagement/hooks)
export {
  useEngagement,
  type UseEngagementOptions,
  type UseEngagementReturn,
} from '../hooks/useEngagement';

export {
  useViewTracking,
  type UseViewTrackingOptions,
  type UseViewTrackingReturn,
} from '../hooks/useEngagement';

export {
  useLikeState,
  type UseLikeStateOptions,
  type UseLikeStateReturn,
} from '../hooks/useLikeState';