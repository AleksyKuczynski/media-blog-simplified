// frontend/src/main/lib/engagement/index.ts
/**
 * Engagement Module - Public API
 * 
 * UPDATED: Added share delta exports
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

// LocalStorage - Likes (permanent + delta)
export {
  getLikedArticles,
  isArticleLiked,
  saveLikedArticle,
  removeLikedArticle,
} from './localStorage';

// LocalStorage - Shares (NEW: delta only)
export {
  saveShareDelta,
  getShareDelta,
} from './localStorage';

// Share
export {
  getShareUrl,
  copyToClipboard,
  openShareWindow,
} from './share';

export { checkRateLimit } from './checkRateLimit';
export { hasRecentlyViewed } from './hasRecentlyViewed';
export { triggerEngagementFlow } from './triggerEngagementFlow';