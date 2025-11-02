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

export { checkRateLimit } from './checkRateLimit';
export { hasRecentlyViewed } from './hasRecentlyViewed'
export { triggerEngagementFlow } from './triggerEngagementFlow'