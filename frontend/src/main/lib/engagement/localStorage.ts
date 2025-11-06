// frontend/src/main/lib/engagement/localStorage.ts
/**
 * LocalStorage Operations for Engagement
 * 
 * FIXED v5: Separate delta tracking for likes and shares
 * 
 * TWO SEPARATE STORAGE KEYS:
 * 1. "liked_articles" - Permanent list of liked articles (for button state)
 * 2. "engagement_deltas" - Temporary count adjustments (for cache compensation)
 * 
 * WHY SEPARATE DELTAS FOR LIKES AND SHARES?
 * - Prevents interference: User can like AND share within 120s window
 * - Independent expiry: Each action has its own 120s timer
 * - Accurate counts: No data loss when both actions occur
 * 
 * STRUCTURE:
 * liked_articles: ["slug-1", "slug-2", "slug-3"]
 * engagement_deltas: {
 *   "slug-1": {
 *     likes: { delta: 1, timestamp: 1699... },
 *     shares: { delta: 2, timestamp: 1699... }
 *   }
 * }
 * 
 * BEHAVIOR:
 * - Likes: delta resets timestamp on each like/unlike
 * - Shares: delta accumulates and resets timestamp on each share
 * - Both: expire after 120s of last action
 */

const LIKED_ARTICLES_KEY = 'liked_articles';
const ENGAGEMENT_DELTAS_KEY = 'engagement_deltas';
const DELTA_EXPIRY_MS = 120 * 1000; // 120 seconds (2 minutes cache latency)

/**
 * Delta value for a single metric (likes or shares)
 */
export interface DeltaValue {
  delta: number; // +1 for like/share, -1 for unlike
  timestamp: number; // When action occurred (resets on each new action)
}

/**
 * All deltas for a single article
 */
export interface ArticleDeltas {
  likes?: DeltaValue;
  shares?: DeltaValue;
}

/**
 * All engagement deltas across all articles
 */
export interface EngagementDeltas {
  [slug: string]: ArticleDeltas;
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

    // 2. Create/update temporary delta for count adjustment
    const deltas = getEngagementDeltas();
    if (!deltas[slug]) {
      deltas[slug] = {};
    }
    
    deltas[slug].likes = {
      delta: 1,
      timestamp: Date.now(), // Reset timestamp on each like action
    };
    
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Created like delta +1 for ${slug} (temporary, 120s)`);
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

    // 2. Create/update temporary delta for count adjustment
    const deltas = getEngagementDeltas();
    if (!deltas[slug]) {
      deltas[slug] = {};
    }
    
    deltas[slug].likes = {
      delta: -1,
      timestamp: Date.now(), // Reset timestamp on each unlike action
    };
    
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Created like delta -1 for ${slug} (temporary, 120s)`);
  } catch (error) {
    console.error('[localStorage] Error removing liked article:', error);
  }
}

// ============================================================================
// PART 2: TEMPORARY DELTAS (Count Adjustment During Cache Delay)
// ============================================================================

/**
 * Get all engagement deltas (temporary)
 * Automatically filters out expired deltas (>120s old)
 * Handles migration from old format
 */
export function getEngagementDeltas(): EngagementDeltas {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(ENGAGEMENT_DELTAS_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    const now = Date.now();
    const filtered: EngagementDeltas = {};

    // Check if we need to migrate from old format
    let needsMigration = false;
    for (const [slug, value] of Object.entries(parsed)) {
      // Old format: { delta, timestamp, action }
      // New format: { likes?: {delta, timestamp}, shares?: {delta, timestamp} }
      if (value && typeof value === 'object') {
        if ('action' in value) {
          needsMigration = true;
          break;
        }
      }
    }

    if (needsMigration) {
      console.log('[localStorage] Migrating deltas to new format (old deltas will be cleared)');
      saveEngagementDeltas({});
      return {};
    }

    // Filter out expired deltas
    for (const [slug, articleDeltas] of Object.entries(parsed as EngagementDeltas)) {
      const filteredArticle: ArticleDeltas = {};
      
      // Check likes delta
      if (articleDeltas.likes) {
        const age = now - articleDeltas.likes.timestamp;
        if (age < DELTA_EXPIRY_MS) {
          filteredArticle.likes = articleDeltas.likes;
        } else {
          console.log(`[localStorage] Like delta expired for ${slug} (${Math.round(age / 1000)}s old)`);
        }
      }
      
      // Check shares delta
      if (articleDeltas.shares) {
        const age = now - articleDeltas.shares.timestamp;
        if (age < DELTA_EXPIRY_MS) {
          filteredArticle.shares = articleDeltas.shares;
        } else {
          console.log(`[localStorage] Share delta expired for ${slug} (${Math.round(age / 1000)}s old)`);
        }
      }
      
      // Only keep article if it has at least one active delta
      if (filteredArticle.likes || filteredArticle.shares) {
        filtered[slug] = filteredArticle;
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
 * Get like delta for specific article
 * Returns 0 if not found or expired
 */
export function getLikeDelta(slug: string): number {
  const deltas = getEngagementDeltas();
  return deltas[slug]?.likes?.delta || 0;
}

/**
 * Get share delta for specific article
 * Returns 0 if not found or expired
 */
export function getShareDelta(slug: string): number {
  const deltas = getEngagementDeltas();
  return deltas[slug]?.shares?.delta || 0;
}

/**
 * Save share delta (temporary)
 * Accumulates count and resets timestamp on each share
 * This persists optimistic share counts across page refreshes
 */
export function saveShareDelta(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const deltas = getEngagementDeltas();
    
    if (!deltas[slug]) {
      deltas[slug] = {};
    }
    
    // Get current share delta or default to 0
    const currentDelta = deltas[slug].shares?.delta || 0;
    
    // Increment the delta (accumulate multiple shares)
    // Reset timestamp to restart 120s window
    deltas[slug].shares = {
      delta: currentDelta + 1,
      timestamp: Date.now(), // Reset timestamp on each share
    };
    
    saveEngagementDeltas(deltas);
    console.log(`[localStorage] Share delta +${deltas[slug].shares!.delta} for ${slug} (120s timer restarted)`);
  } catch (error) {
    console.error('[localStorage] Error saving share delta:', error);
  }
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
    console.log(`[localStorage] Cleared all deltas for ${slug}`);
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

  console.log('⏱️ Active Deltas (Temporary, 120s expiry):');
  const deltaTable: any[] = [];
  for (const [slug, articleDeltas] of Object.entries(deltas)) {
    if (articleDeltas.likes) {
      const age = Math.round((Date.now() - articleDeltas.likes.timestamp) / 1000);
      deltaTable.push({
        slug,
        type: 'likes',
        delta: articleDeltas.likes.delta > 0 ? `+${articleDeltas.likes.delta}` : articleDeltas.likes.delta,
        age: `${age}s`,
        expires: `in ${120 - age}s`,
      });
    }
    if (articleDeltas.shares) {
      const age = Math.round((Date.now() - articleDeltas.shares.timestamp) / 1000);
      deltaTable.push({
        slug,
        type: 'shares',
        delta: `+${articleDeltas.shares.delta}`,
        age: `${age}s`,
        expires: `in ${120 - age}s`,
      });
    }
  }
  console.table(deltaTable);

  console.groupEnd();
}

/**
 * Get storage stats for monitoring
 */
export function getStorageStats(): {
  likedCount: number;
  activeLikeDeltasCount: number;
  activeShareDeltasCount: number;
  totalSize: number;
} {
  if (typeof window === 'undefined') {
    return { 
      likedCount: 0, 
      activeLikeDeltasCount: 0, 
      activeShareDeltasCount: 0, 
      totalSize: 0 
    };
  }

  const likedArticles = getLikedArticles();
  const deltas = getEngagementDeltas();
  
  let activeLikeDeltasCount = 0;
  let activeShareDeltasCount = 0;
  
  for (const articleDeltas of Object.values(deltas)) {
    if (articleDeltas.likes) activeLikeDeltasCount++;
    if (articleDeltas.shares) activeShareDeltasCount++;
  }
  
  const likedSize = JSON.stringify(likedArticles).length;
  const deltasSize = JSON.stringify(deltas).length;

  return {
    likedCount: likedArticles.length,
    activeLikeDeltasCount,
    activeShareDeltasCount,
    totalSize: likedSize + deltasSize,
  };
}