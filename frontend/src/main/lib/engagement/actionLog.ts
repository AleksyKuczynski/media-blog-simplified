// frontend/src/main/lib/engagement/actionLog.ts
/**
 * Action Log - Client-Side Engagement Tracking
 * 
 * Maintains a log of user actions with timestamps for reconciliation with server state
 * Prevents double-counting by comparing action timestamps against server's last_updated
 * 
 * Architecture:
 * - Actions logged immediately when user interacts
 * - Actions compared against server timestamp during reconciliation
 * - Old actions (>10 min) automatically cleaned up
 */

const ACTION_LOG_KEY = 'engagement_action_log';
const LIKED_ARTICLES_KEY = 'liked_articles';
const ACTION_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

export type ActionType = 'view' | 'like' | 'unlike' | 'share';

export interface Action {
  id: string;
  slug: string;
  type: ActionType;
  timestamp: number;
}

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all actions from localStorage
 */
export function getAllActions(): Action[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ACTION_LOG_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

/**
 * Save actions to localStorage
 */
function saveActions(actions: Action[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ACTION_LOG_KEY, JSON.stringify(actions));
  } catch (error) {
    // Silent failure
  }
}

/**
 * Log a user action
 */
export function logAction(slug: string, type: ActionType): void {
  const action: Action = {
    id: generateActionId(),
    slug,
    type,
    timestamp: Date.now(),
  };

  const actions = getAllActions();
  actions.push(action);
  saveActions(actions);
}

/**
 * Clean up old actions (>10 minutes)
 */
export function cleanupOldActions(): void {
  const now = Date.now();
  const actions = getAllActions();
  const freshActions = actions.filter(a => now - a.timestamp < ACTION_MAX_AGE_MS);
  
  if (freshActions.length !== actions.length) {
    saveActions(freshActions);
  }
}

/**
 * Get pending actions for a specific article
 * Pending = action timestamp > server's last_updated
 */
export function getPendingActions(
  slug: string,
  serverLastUpdated: string | null
): Action[] {
  const actions = getAllActions().filter(a => a.slug === slug);
  
  if (!serverLastUpdated) {
    return actions;
  }

  const serverTimestamp = new Date(serverLastUpdated).getTime();
  return actions.filter(a => a.timestamp > serverTimestamp);
}

/**
 * Calculate delta from pending actions
 */
export function calculateDeltaFromActions(actions: Action[]): {
  views: number;
  likes: number;
  unlikes: number;
  shares: number;
} {
  const delta = { views: 0, likes: 0, unlikes: 0, shares: 0 };

  for (const action of actions) {
    switch (action.type) {
      case 'view':
        delta.views++;
        break;
      case 'like':
        delta.likes++;
        break;
      case 'unlike':
        delta.unlikes++;
        break;
      case 'share':
        delta.shares++;
        break;
    }
  }

  return delta;
}

/**
 * Reconcile counts: Apply pending actions to server counts
 * 
 * @param slug - Article slug
 * @param serverCounts - Counts from server
 * @param serverLastUpdated - Server's last_updated timestamp
 * @returns Adjusted counts with pending actions applied
 */
export function reconcileCounts(
  slug: string,
  serverCounts: { views: number; likes: number; shares: number },
  serverLastUpdated: string | null
): { views: number; likes: number; shares: number } {
  cleanupOldActions();

  const pendingActions = getPendingActions(slug, serverLastUpdated);

  if (pendingActions.length === 0) {
    return serverCounts;
  }

  const delta = calculateDeltaFromActions(pendingActions);

  // Apply deltas (likes and unlikes cancel out)
  const netLikeDelta = delta.likes - delta.unlikes;
  const adjustedViews = Math.max(0, serverCounts.views + delta.views);
  const adjustedLikes = Math.max(0, serverCounts.likes + netLikeDelta);
  const adjustedShares = Math.max(0, serverCounts.shares + delta.shares);

  return {
    views: adjustedViews,
    likes: adjustedLikes,
    shares: adjustedShares,
  };
}

/**
 * Get all liked articles (permanent)
 */
export function getLikedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

/**
 * Check if article is liked (permanent state)
 */
export function isArticleLiked(slug: string): boolean {
  const likedArticles = getLikedArticles();
  return likedArticles.includes(slug);
}

/**
 * Add article to liked list (permanent)
 */
export function addLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  const likedArticles = getLikedArticles();
  if (!likedArticles.includes(slug)) {
    likedArticles.push(slug);
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
  }
}

/**
 * Remove article from liked list (permanent)
 */
export function removeLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  const likedArticles = getLikedArticles();
  const filtered = likedArticles.filter(s => s !== slug);
  
  if (filtered.length !== likedArticles.length) {
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(filtered));
  }
}

/**
 * Get statistics for debugging
 */
export function getActionLogStats(): {
  totalActions: number;
  actionsByType: Record<ActionType, number>;
  oldestAction: number | null;
  newestAction: number | null;
  likedCount: number;
} {
  const actions = getAllActions();
  const likedArticles = getLikedArticles();

  const stats = {
    totalActions: actions.length,
    actionsByType: {
      view: 0,
      like: 0,
      unlike: 0,
      share: 0,
    },
    oldestAction: actions.length > 0 ? Math.min(...actions.map(a => a.timestamp)) : null,
    newestAction: actions.length > 0 ? Math.max(...actions.map(a => a.timestamp)) : null,
    likedCount: likedArticles.length,
  };

  for (const action of actions) {
    stats.actionsByType[action.type]++;
  }

  return stats;
}

/**
 * Debug: Print action log to console
 * (Kept for development debugging, but silent internally)
 */
export function debugActionLog(): void {
  if (typeof window === 'undefined') return;
  
  const actions = getAllActions();
  const likedArticles = getLikedArticles();
  const stats = getActionLogStats();

  // Only log in development environment
  if (process.env.NODE_ENV === 'development') {
    console.group('📋 Action Log Debug');
    console.log('Stats:', stats);
    console.log('Liked Articles:', likedArticles);
    
    if (actions.length > 0) {
      console.table(
        actions.map(a => ({
          id: a.id.slice(0, 8),
          slug: a.slug.slice(0, 30),
          type: a.type,
          timestamp: new Date(a.timestamp).toISOString(),
          age: `${Math.round((Date.now() - a.timestamp) / 1000)}s ago`,
        }))
      );
    }
    
    console.groupEnd();
  }
}