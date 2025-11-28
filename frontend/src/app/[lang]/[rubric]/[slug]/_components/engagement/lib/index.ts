// app/[lang]/[rubric]/[slug]/_components/engagement/lib/index.ts
/**
 * Article Engagement - Public API
 * 
 * Barrel export for engagement module.
 * Centralizes all public exports.
 * 
 * Exports:
 * - Types (all from ./types)
 * - API functions (fetchEngagement, updateEngagement)
 * - LocalStorage functions (getLikedArticles, isArticleLiked, etc.)
 * - Share functions (getShareUrl, copyToClipboard, etc.)
 * - Utility functions (checkRateLimit, hasRecentlyViewed, etc.)
 * 
 * Dependencies: All other lib/ files
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

// LocalStorage - Shares (delta only)
export {
  saveShareDelta,
  getShareDelta,
} from './localStorage';

// Share (UPDATED: Added Web Share API functions)
export {
  getShareUrl,
  copyToClipboard,
  openShareWindow,
  shareViaWebAPI,
  canUseWebShare,
} from './share';

export { checkRateLimit } from './checkRateLimit';
export { hasRecentlyViewed } from './hasRecentlyViewed';
export { triggerEngagementFlow } from './triggerEngagementFlow';