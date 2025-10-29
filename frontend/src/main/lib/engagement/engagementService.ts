// frontend/src/main/lib/engagement/engagementService.ts
/**
 * Engagement Service
 * 
 * Centralized service for fetching and updating article engagement data
 * Works with /api/engagement/[slug] API routes
 */

// ===================================================================
// TYPES
// ===================================================================

export interface EngagementData {
  slug: string;
  views: number;
  likes: number;
  shares: number;
}

export interface EngagementResponse {
  success: boolean;
  data: EngagementData;
  action?: 'view' | 'like' | 'unlike' | 'share';
}

export interface EngagementError {
  error: string;
  message?: string;
}

export type EngagementAction = 'view' | 'like' | 'unlike' | 'share';

// ===================================================================
// SERVICE FUNCTIONS
// ===================================================================

/**
 * Fetch current engagement data for an article
 * 
 * @param slug - Article slug
 * @returns Promise with engagement data
 * 
 * @example
 * ```typescript
 * const data = await fetchEngagement('my-article-slug');
 * console.log(data.views); // 42
 * ```
 */
export async function fetchEngagement(slug: string): Promise<EngagementData> {
  try {
    const response = await fetch(`/api/engagement/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: EngagementError = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to fetch engagement');
    }

    const result: EngagementResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid response format');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching engagement:', error);
    
    // Return default values on error
    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  }
}

/**
 * Update engagement counter (view, like, unlike, share)
 * 
 * @param slug - Article slug
 * @param action - Action to perform
 * @returns Promise with updated engagement data
 * 
 * @example
 * ```typescript
 * // Track a view
 * const data = await updateEngagement('my-article', 'view');
 * 
 * // Like an article
 * const data = await updateEngagement('my-article', 'like');
 * ```
 */
export async function updateEngagement(
  slug: string,
  action: EngagementAction
): Promise<EngagementData> {
  try {
    const response = await fetch(`/api/engagement/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData: EngagementError = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to update engagement');
    }

    const result: EngagementResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid response format');
    }

    return result.data;
  } catch (error) {
    console.error(`Error updating engagement (${action}):`, error);
    throw error;
  }
}

/**
 * Track a page view (convenience function)
 * 
 * @param slug - Article slug
 * @returns Promise with updated engagement data
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   const timer = setTimeout(() => {
 *     trackView(articleSlug);
 *   }, 2000);
 *   return () => clearTimeout(timer);
 * }, [articleSlug]);
 * ```
 */
export async function trackView(slug: string): Promise<EngagementData> {
  return updateEngagement(slug, 'view');
}

/**
 * Toggle like status
 * 
 * @param slug - Article slug
 * @param isCurrentlyLiked - Current like status
 * @returns Promise with updated engagement data
 * 
 * @example
 * ```typescript
 * const handleLike = async () => {
 *   const data = await toggleLike(slug, isLiked);
 *   setIsLiked(!isLiked);
 *   setEngagement(data);
 * };
 * ```
 */
export async function toggleLike(
  slug: string,
  isCurrentlyLiked: boolean
): Promise<EngagementData> {
  const action = isCurrentlyLiked ? 'unlike' : 'like';
  return updateEngagement(slug, action);
}

/**
 * Track a share action
 * 
 * @param slug - Article slug
 * @returns Promise with updated engagement data
 * 
 * @example
 * ```typescript
 * const handleShare = async (platform: string) => {
 *   await trackShare(slug);
 *   openShareWindow(platform);
 * };
 * ```
 */
export async function trackShare(slug: string): Promise<EngagementData> {
  return updateEngagement(slug, 'share');
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get liked articles from localStorage
 * 
 * @returns Array of liked article slugs
 */
export function getLikedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('liked_articles');
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading liked articles:', error);
    return [];
  }
}

/**
 * Check if article is liked
 * 
 * @param slug - Article slug
 * @returns True if article is liked
 */
export function isArticleLiked(slug: string): boolean {
  const likedArticles = getLikedArticles();
  return likedArticles.includes(slug);
}

/**
 * Save liked article to localStorage
 * 
 * @param slug - Article slug
 */
export function saveLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const likedArticles = getLikedArticles();
    
    if (!likedArticles.includes(slug)) {
      likedArticles.push(slug);
      localStorage.setItem('liked_articles', JSON.stringify(likedArticles));
    }
  } catch (error) {
    console.error('Error saving liked article:', error);
  }
}

/**
 * Remove liked article from localStorage
 * 
 * @param slug - Article slug
 */
export function removeLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const likedArticles = getLikedArticles();
    const filtered = likedArticles.filter(s => s !== slug);
    localStorage.setItem('liked_articles', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing liked article:', error);
  }
}

/**
 * Batch fetch engagement for multiple articles
 * Useful for article lists
 * 
 * @param slugs - Array of article slugs
 * @returns Promise with map of slug to engagement data
 * 
 * @example
 * ```typescript
 * const engagementMap = await fetchEngagementBatch(['slug1', 'slug2']);
 * console.log(engagementMap.slug1.views);
 * ```
 */
export async function fetchEngagementBatch(
  slugs: string[]
): Promise<Record<string, EngagementData>> {
  const results: Record<string, EngagementData> = {};

  // Fetch all in parallel
  const promises = slugs.map(async (slug) => {
    try {
      const data = await fetchEngagement(slug);
      results[slug] = data;
    } catch (error) {
      // Return default on error
      results[slug] = {
        slug,
        views: 0,
        likes: 0,
        shares: 0,
      };
    }
  });

  await Promise.all(promises);
  return results;
}