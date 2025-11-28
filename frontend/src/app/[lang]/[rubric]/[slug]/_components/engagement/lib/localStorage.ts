// app/[lang]/[rubric]/[slug]/_components/engagement/lib/localStorage.ts
/**
 * Article Engagement - LocalStorage Management
 * 
 * Manages persistent client-side engagement state.
 * 
 * Storage Keys:
 * - liked_articles: Permanent like state
 * - engagement_deltas: Temporary action deltas (10min expiry)
 * 
 * Like Storage (Permanent):
 * - getLikedArticles(): Get all liked article slugs
 * - isArticleLiked(slug): Check if article is liked
 * - saveLikedArticle(slug): Add to liked set
 * - removeLikedArticle(slug): Remove from liked set
 * 
 * Delta Storage (Temporary):
 * - getEngagementDeltas(): Get all pending deltas
 * - saveEngagementDeltas(deltas): Save delta state
 * - getLikeDelta(slug): Get like delta for article
 * - getShareDelta(slug): Get share delta for article
 * - saveShareDelta(slug, baseValue): Record share action
 * 
 * Features:
 * - Automatic delta expiry (10 minutes)
 * - Silent error handling
 * - SSR compatibility checks
 * 
 * Dependencies:
 * - ./actionLog (like state functions)
 * 
 * NOTE: Contains timestamp-based reconciliation logic
 */

import {
  getLikedArticles as _getLikedArticles,
  isArticleLiked as _isArticleLiked,
  addLikedArticle as _addLikedArticle,
  removeLikedArticle as _removeLikedArticle,
} from './actionLog';

const ENGAGEMENT_DELTAS_KEY = 'engagement_deltas';
const DELTA_EXPIRY_MS = 120 * 1000; // 120 seconds

export interface DeltaValue {
  delta: number;
  timestamp: number;
  baseServerValue: number;
}

export interface ArticleDeltas {
  likes?: DeltaValue;
  shares?: DeltaValue;
}

export interface EngagementDeltas {
  [slug: string]: ArticleDeltas;
}

/**
 * Get all engagement deltas
 */
export function getEngagementDeltas(): EngagementDeltas {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(ENGAGEMENT_DELTAS_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    const now = Date.now();
    const filtered: EngagementDeltas = {};

    // Filter out expired deltas
    for (const [slug, deltas] of Object.entries(parsed as EngagementDeltas)) {
      const articleDeltas: ArticleDeltas = {};

      if (deltas.likes && now - deltas.likes.timestamp < DELTA_EXPIRY_MS) {
        articleDeltas.likes = deltas.likes;
      }

      if (deltas.shares && now - deltas.shares.timestamp < DELTA_EXPIRY_MS) {
        articleDeltas.shares = deltas.shares;
      }

      if (Object.keys(articleDeltas).length > 0) {
        filtered[slug] = articleDeltas;
      }
    }

    // Save filtered deltas back
    if (Object.keys(filtered).length !== Object.keys(parsed).length) {
      saveEngagementDeltas(filtered);
    }

    return filtered;
  } catch (error) {
    return {};
  }
}

/**
 * Save engagement deltas
 */
export function saveEngagementDeltas(deltas: EngagementDeltas): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ENGAGEMENT_DELTAS_KEY, JSON.stringify(deltas));
  } catch (error) {
    // Silent failure
  }
}

/**
 * Get like delta for specific article
 */
export function getLikeDelta(slug: string): DeltaValue | null {
  const deltas = getEngagementDeltas();
  return deltas[slug]?.likes || null;
}

/**
 * Get share delta for specific article
 */
export function getShareDelta(slug: string): DeltaValue | null {
  const deltas = getEngagementDeltas();
  return deltas[slug]?.shares || null;
}

/**
 * Save share delta
 */
export function saveShareDelta(slug: string, currentServerValue: number): void {
  if (typeof window === 'undefined') return;

  try {
    const deltas = getEngagementDeltas();
    
    if (!deltas[slug]) {
      deltas[slug] = {};
    }
    
    const currentDelta = deltas[slug].shares?.delta || 0;
    const existingBase = deltas[slug].shares?.baseServerValue ?? currentServerValue;
    
    deltas[slug].shares = {
      delta: currentDelta + 1,
      timestamp: Date.now(),
      baseServerValue: currentDelta === 0 ? currentServerValue : existingBase,
    };

    saveEngagementDeltas(deltas);
  } catch (error) {
    // Silent failure
  }
}

// Re-export liked articles functions from actionLog
export const getLikedArticles = _getLikedArticles;
export const isArticleLiked = _isArticleLiked;
export const saveLikedArticle = _addLikedArticle;
export const removeLikedArticle = _removeLikedArticle;