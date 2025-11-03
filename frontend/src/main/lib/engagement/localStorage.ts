// frontend/src/main/lib/engagement/localStorage.ts
/**
 * LocalStorage Operations for Engagement
 * 
 * ENHANCED v4: Added share delta support
 * 
 * TWO SEPARATE STORAGE KEYS:
 * 1. "liked_articles" - Permanent list of liked articles (for button state)
 * 2. "engagement_deltas" - Temporary count adjustments (for cache compensation)
 * 
 * WHY SEPARATE?
 * - Button state should persist forever (user preference)
 * - Count deltas should expire after 60s (cache has caught up)
 * 
 * STRUCTURE:
 * liked_articles: ["slug-1", "slug-2", "slug-3"]
 * engagement_deltas: {
 *   "slug-1": { delta: 1, timestamp: 1699..., action: "like" },
 *   "slug-2": { delta: 1, timestamp: 1699..., action: "share" }
 * }
 * 
 * NEW: Share deltas added - same 60s expiry, no permanent state needed
 */

const LIKED_ARTICLES_KEY = 'liked_articles';
const ENGAGEMENT_DELTAS_KEY = 'engagement_deltas';
const DELTA_EXPIRY_MS = 60 * 1000; // 60 seconds

export interface EngagementDelta {
  delta: number; // +1 for like/share, -1 for unlike
  timestamp: number;
  action: 'like' | 'unlike' | 'share';
}

export interface EngagementDeltas {
  [slug: string]: EngagementDelta;
}

// ============================================================================
// PART 1: PERMANENT LIKED STATE (Button State)
// ============================================================================

/**
 * Get all liked articles (permanent)
 * This determines button state - persists forever
 */
export function getLikedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[localStorage] Error reading liked articles:', error);
    return [];
  }
}

/**
 * Check if article is liked (permanent)
 * This is the source of truth for button state
 */
export function isArticleLiked(slug: string): boolean {
  const likedArticles = getLikedArticles();
  return likedArticles.includes(slug);
}

/**
 * Save liked article (permanent)
 * Adds to liked list and creates temporary delta
 */
export function saveLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Add to permanent liked list
    const likedArticles = getLikedArticles();
    if (!likedArticles.includes(slug)) {
      likedArticles.push(slug);
      localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
      console.log(`[localStorage] Added ${slug} to liked articles (permanent)`);
    }

    // 2. Create temporary delta for count adjustment
    const deltas = getEngagementDeltas();
    deltas[slug] = {
      delta: 1,
      timestamp: Date.now(),
      action: 'like',
    };
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Created delta +1 for ${slug} (temporary, 60s)`);
  } catch (error) {
    console.error('[localStorage] Error saving liked article:', error);
  }
}

/**
 * Remove liked article (permanent)
 * Removes from liked list and creates negative delta
 */
export function removeLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Remove from permanent liked list
    const likedArticles = getLikedArticles();
    const filtered = likedArticles.filter(s => s !== slug);
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(filtered));
    console.log(`[localStorage] Removed ${slug} from liked articles (permanent)`);

    // 2. Create temporary delta for count adjustment
    const deltas = getEngagementDeltas();
    deltas[slug] = {
      delta: -1,
      timestamp: Date.now(),
      action: 'unlike',
    };
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Created delta -1 for ${slug} (temporary, 60s)`);
  } catch (error) {
    console.error('[localStorage] Error removing liked article:', error);
  }
}

// ============================================================================
// PART 2: TEMPORARY DELTAS (Count Adjustment During Cache Delay)
// ============================================================================

/**
 * Get all engagement deltas (temporary)
 * Automatically filters out expired deltas (>60s old)
 */
export function getEngagementDeltas(): EngagementDeltas {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(ENGAGEMENT_DELTAS_KEY);
    if (!stored) return {};

    const parsed: EngagementDeltas = JSON.parse(stored);
    const now = Date.now();
    const filtered: EngagementDeltas = {};

    // Filter out expired deltas
    for (const [slug, delta] of Object.entries(parsed)) {
      const age = now - delta.timestamp;
      if (age < DELTA_EXPIRY_MS) {
        filtered[slug] = delta;
      } else {
        console.log(`[localStorage] Delta expired for ${slug} (${Math.round(age / 1000)}s old) - cache should have caught up`);
      }
    }

    // Save filtered version back if anything was removed
    if (Object.keys(filtered).length !== Object.keys(parsed).length) {
      saveEngagementDeltas(filtered);
    }

    return filtered;
  } catch (error) {
    console.error('[localStorage] Error reading deltas:', error);
    return {};
  }
}

/**
 * Save engagement deltas to localStorage
 */
function saveEngagementDeltas(deltas: EngagementDeltas): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ENGAGEMENT_DELTAS_KEY, JSON.stringify(deltas));
  } catch (error) {
    console.error('[localStorage] Error saving deltas:', error);
  }
}

/**
 * Get delta for specific article
 * Returns { delta: 0 } if not found or expired
 */
export function getArticleDelta(slug: string): EngagementDelta {
  const deltas = getEngagementDeltas();
  return deltas[slug] || { delta: 0, timestamp: 0, action: 'like' };
}

/**
 * NEW: Save share delta (temporary)
 * Creates a +1 delta that expires after 60s
 * This persists optimistic share counts across page refreshes
 */
export function saveShareDelta(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const deltas = getEngagementDeltas();
    
    // Get current delta or default
    const currentDelta = deltas[slug] || { delta: 0, timestamp: Date.now(), action: 'share' };
    
    // Increment the delta (allow multiple shares to accumulate)
    deltas[slug] = {
      delta: currentDelta.delta + 1,
      timestamp: Date.now(), // Reset timestamp on new share
      action: 'share',
    };
    
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Created share delta +${deltas[slug].delta} for ${slug} (temporary, 60s)`);
  } catch (error) {
    console.error('[localStorage] Error saving share delta:', error);
  }
}

/**
 * NEW: Get share delta for specific article
 * Returns only the delta value for shares
 */
export function getShareDelta(slug: string): number {
  const delta = getArticleDelta(slug);
  // Only return delta if it's a share action
  return delta.action === 'share' ? delta.delta : 0;
}

/**
 * Clear delta for article (call this after confirming server has the update)
 * Note: Not actively used, as we rely on time-based expiry
 */
export function clearArticleDelta(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const deltas = getEngagementDeltas();
    delete deltas[slug];
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Cleared delta for ${slug}`);
  } catch (error) {
    console.error('[localStorage] Error clearing delta:', error);
  }
}

/**
 * Clear all deltas (for testing or reset)
 */
export function clearAllDeltas(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ENGAGEMENT_DELTAS_KEY);
    console.log('[localStorage] Cleared all deltas');
  } catch (error) {
    console.error('[localStorage] Error clearing all deltas:', error);
  }
}

/**
 * Clear all liked articles (for testing or user request)
 */
export function clearAllLikedArticles(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(LIKED_ARTICLES_KEY);
    console.log('[localStorage] Cleared all liked articles');
  } catch (error) {
    console.error('[localStorage] Error clearing liked articles:', error);
  }
}

// ============================================================================
// PART 3: DEBUG HELPERS
// ============================================================================

/**
 * Debug helper: Log current state
 */
export function debugEngagementStorage(): void {
  if (typeof window === 'undefined') return;

  const likedArticles = getLikedArticles();
  const deltas = getEngagementDeltas();

  console.group('[localStorage] Engagement Storage Debug');
  
  console.log('📌 Liked Articles (Permanent):');
  console.table(likedArticles.map(slug => ({ slug, liked: '✅' })));

  console.log('⏱️ Active Deltas (Temporary):');
  console.table(
    Object.entries(deltas).map(([slug, delta]) => ({
      slug,
      delta: delta.delta > 0 ? `+${delta.delta}` : delta.delta,
      action: delta.action,
      age: `${Math.round((Date.now() - delta.timestamp) / 1000)}s`,
      expires: `in ${60 - Math.round((Date.now() - delta.timestamp) / 1000)}s`,
    }))
  );

  console.groupEnd();
}

/**
 * Get storage stats for monitoring
 */
export function getStorageStats(): {
  likedCount: number;
  activeDeltasCount: number;
  totalSize: number;
} {
  if (typeof window === 'undefined') {
    return { likedCount: 0, activeDeltasCount: 0, totalSize: 0 };
  }

  const likedArticles = getLikedArticles();
  const deltas = getEngagementDeltas();
  
  const likedSize = JSON.stringify(likedArticles).length;
  const deltasSize = JSON.stringify(deltas).length;

  return {
    likedCount: likedArticles.length,
    activeDeltasCount: Object.keys(deltas).length,
    totalSize: likedSize + deltasSize,
  };
}