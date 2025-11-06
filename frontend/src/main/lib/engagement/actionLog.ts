// frontend/src/main/lib/engagement/actionLog.ts
/**
 * Action Log LocalStorage - Phase 2
 * 
 * REPLACES: Delta-based storage with baseServerValue
 * NEW APPROACH: Event log with timestamp reconciliation
 * 
 * KEY CONCEPT:
 * - Store user actions with timestamps
 * - Compare action timestamps with server's last_updated
 * - Only apply deltas for actions AFTER server's last update
 * - Auto-cleanup processed actions
 * 
 * STORAGE STRUCTURE:
 * {
 *   "engagement_actions": [
 *     {
 *       id: "uuid-123",
 *       slug: "article-1",
 *       type: "like" | "unlike" | "share",
 *       timestamp: 1699123456789,  // JS timestamp (milliseconds)
 *     }
 *   ],
 *   "liked_articles": ["article-1", "article-2"]  // Permanent like state
 * }
 */

const ACTIONS_KEY = 'engagement_actions';
const LIKED_ARTICLES_KEY = 'liked_articles';
const MAX_ACTION_AGE_MS = 120 * 1000; // 120 seconds (2 minutes)

// ============================================================================
// TYPES
// ============================================================================

export type ActionType = 'like' | 'unlike' | 'share';

export interface EngagementAction {
  id: string;              // Unique ID (for deduplication)
  slug: string;            // Article slug
  type: ActionType;        // Action type
  timestamp: number;       // When action occurred (JS timestamp in ms)
}

export interface ActionLog {
  likes: number;           // Delta for likes
  unlikes: number;         // Delta for unlikes
  shares: number;          // Delta for shares
}

// ============================================================================
// PART 1: ACTION LOG CRUD OPERATIONS
// ============================================================================

/**
 * Get all actions from localStorage
 */
function getAllActions(): EngagementAction[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ACTIONS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[ActionLog] Error reading actions:', error);
    return [];
  }
}

/**
 * Save actions to localStorage
 */
function saveAllActions(actions: EngagementAction[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
  } catch (error) {
    console.error('[ActionLog] Error saving actions:', error);
  }
}

/**
 * Generate unique ID for action
 */
function generateActionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add new action to log
 */
export function logAction(slug: string, type: ActionType): void {
  if (typeof window === 'undefined') return;

  const action: EngagementAction = {
    id: generateActionId(),
    slug,
    type,
    timestamp: Date.now(),
  };

  const actions = getAllActions();
  actions.push(action);
  saveAllActions(actions);

  console.log(`[ActionLog] Logged ${type} for ${slug}`, action);
}

/**
 * Get actions for specific article
 */
export function getActionsForArticle(slug: string): EngagementAction[] {
  const allActions = getAllActions();
  return allActions.filter(action => action.slug === slug);
}

/**
 * Clean up old actions (older than 120 seconds)
 */
export function cleanupOldActions(): void {
  if (typeof window === 'undefined') return;

  const actions = getAllActions();
  const now = Date.now();
  const cutoff = now - MAX_ACTION_AGE_MS;

  const activeActions = actions.filter(action => action.timestamp > cutoff);

  if (activeActions.length !== actions.length) {
    saveAllActions(activeActions);
    console.log(`[ActionLog] Cleaned up ${actions.length - activeActions.length} old actions`);
  }
}

/**
 * Remove specific action by ID
 */
export function removeAction(actionId: string): void {
  if (typeof window === 'undefined') return;

  const actions = getAllActions();
  const filtered = actions.filter(a => a.id !== actionId);
  
  if (filtered.length !== actions.length) {
    saveAllActions(filtered);
    console.log(`[ActionLog] Removed action ${actionId}`);
  }
}

/**
 * Clear all actions for specific article
 */
export function clearActionsForArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  const actions = getAllActions();
  const filtered = actions.filter(a => a.slug !== slug);
  saveAllActions(filtered);
  
  console.log(`[ActionLog] Cleared all actions for ${slug}`);
}

// ============================================================================
// PART 2: TIMESTAMP-BASED RECONCILIATION
// ============================================================================

/**
 * Get pending actions for article based on server timestamp
 * 
 * CRITICAL LOGIC:
 * - If action.timestamp > serverLastUpdated → action is PENDING (not yet processed)
 * - If action.timestamp <= serverLastUpdated → action is PROCESSED (already counted)
 * 
 * @param slug - Article slug
 * @param serverLastUpdated - ISO timestamp from server (last_updated field)
 * @returns Actions that happened AFTER server's last update
 */
export function getPendingActions(
  slug: string,
  serverLastUpdated: string | null
): EngagementAction[] {
  const actions = getActionsForArticle(slug);

  // If no server timestamp, all recent actions are pending
  if (!serverLastUpdated) {
    return actions;
  }

  // Convert server ISO timestamp to JS timestamp (milliseconds)
  const serverTimestamp = new Date(serverLastUpdated).getTime();

  // Filter actions that occurred AFTER server's last update
  const pending = actions.filter(action => action.timestamp > serverTimestamp);

  if (pending.length > 0) {
    console.log(`[ActionLog] Found ${pending.length} pending actions for ${slug}:`, {
      serverTime: serverLastUpdated,
      serverTimestamp,
      pendingActions: pending.map(a => ({
        type: a.type,
        timestamp: a.timestamp,
        delta: a.timestamp - serverTimestamp,
      })),
    });
  }

  return pending;
}

/**
 * Calculate delta from pending actions
 * 
 * @param pendingActions - Actions not yet processed by server
 * @returns Like/unlike/share deltas
 */
export function calculateDeltaFromActions(pendingActions: EngagementAction[]): ActionLog {
  const delta: ActionLog = {
    likes: 0,
    unlikes: 0,
    shares: 0,
  };

  for (const action of pendingActions) {
    if (action.type === 'like') {
      delta.likes += 1;
    } else if (action.type === 'unlike') {
      delta.unlikes += 1;
    } else if (action.type === 'share') {
      delta.shares += 1;
    }
  }

  return delta;
}

/**
 * Apply action log to server counts
 * 
 * This is the main reconciliation function:
 * 1. Get pending actions (timestamp > server's last_updated)
 * 2. Calculate deltas from pending actions
 * 3. Apply deltas to server counts
 * 
 * @param slug - Article slug
 * @param serverCounts - Counts from server
 * @param serverLastUpdated - Server's last_updated timestamp
 * @returns Adjusted counts with pending actions applied
 */
export function reconcileCounts(
  slug: string,
  serverCounts: { likes: number; shares: number },
  serverLastUpdated: string | null
): { likes: number; shares: number } {
  // Clean up old actions first
  cleanupOldActions();

  // Get pending actions
  const pendingActions = getPendingActions(slug, serverLastUpdated);

  // If no pending actions, return server counts as-is
  if (pendingActions.length === 0) {
    return serverCounts;
  }

  // Calculate deltas
  const delta = calculateDeltaFromActions(pendingActions);

  // Apply deltas (likes and unlikes cancel out)
  const netLikeDelta = delta.likes - delta.unlikes;
  const adjustedLikes = Math.max(0, serverCounts.likes + netLikeDelta);
  const adjustedShares = Math.max(0, serverCounts.shares + delta.shares);

  console.log(`[ActionLog] Reconciled counts for ${slug}:`, {
    server: serverCounts,
    delta: { likes: netLikeDelta, shares: delta.shares },
    adjusted: { likes: adjustedLikes, shares: adjustedShares },
  });

  return {
    likes: adjustedLikes,
    shares: adjustedShares,
  };
}

// ============================================================================
// PART 3: PERMANENT LIKED STATE (Button State)
// ============================================================================

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
    console.error('[ActionLog] Error reading liked articles:', error);
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
    console.log(`[ActionLog] Added ${slug} to liked articles (permanent)`);
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
    console.log(`[ActionLog] Removed ${slug} from liked articles (permanent)`);
  }
}

// ============================================================================
// PART 4: DEBUGGING & MONITORING
// ============================================================================

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
 */
export function debugActionLog(): void {
  console.group('📋 Action Log Debug');
  
  const actions = getAllActions();
  const likedArticles = getLikedArticles();
  const stats = getActionLogStats();

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
  } else {
    console.log('No actions logged');
  }

  console.groupEnd();
}