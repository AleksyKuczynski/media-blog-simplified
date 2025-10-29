// frontend/src/main/lib/engagement/engagementService.ts
// FIXED: Added exponential backoff, better error handling, retry logic
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
// RETRY LOGIC
// ===================================================================

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: any) => boolean;
}

/**
 * Exponential backoff retry utility
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt or if we shouldn't retry this error
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelayMs * Math.pow(2, attempt),
        maxDelayMs
      );

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Determine if an error should be retried
 */
function shouldRetryError(error: any): boolean {
  const errorMessage = error?.message || '';
  
  // Retry on rate limits (with backoff)
  if (errorMessage.includes('Rate limit')) {
    return true;
  }
  
  // Retry on network errors
  if (errorMessage.includes('fetch failed') || errorMessage.includes('Network')) {
    return true;
  }
  
  // Don't retry on client errors (400, 401, 403, 404)
  if (errorMessage.includes('400') || 
      errorMessage.includes('401') || 
      errorMessage.includes('403') || 
      errorMessage.includes('404')) {
    return false;
  }
  
  // Retry on server errors (500, 502, 503, 504)
  return true;
}

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
      cache: 'no-store', // Prevent stale data
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
 * FIXED: Added retry logic with exponential backoff
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
  return retryWithBackoff(
    async () => {
      const response = await fetch(`/api/engagement/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData: EngagementError = await response.json();
        const errorMessage = errorData.message || errorData.error || 'Failed to update engagement';
        
        // Add status code to error for better retry logic
        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const result: EngagementResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      return result.data;
    },
    {
      maxRetries: 2,
      initialDelayMs: 1000,
      maxDelayMs: 5000,
      shouldRetry: shouldRetryError,
    }
  );
}

/**
 * Track a page view (convenience function)
 * NOTE: Consider calling this server-side instead of client-side
 * 
 * @param slug - Article slug
 * @returns Promise with updated engagement data
 * 
 * @example
 * ```typescript
 * // Don't use useEffect - this is an anti-pattern
 * // Instead, call from server component or on user interaction
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
 *   // UI should update optimistically, not wait for this
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
 *   // Update UI optimistically first
 *   setShareCount(prev => prev + 1);
 *   
 *   // Then track in background
 *   trackShare(slug).catch(console.error);
 * };
 * ```
 */
export async function trackShare(slug: string): Promise<EngagementData> {
  return updateEngagement(slug, 'share');
}

// ===================================================================
// LOCALSTORAGE HELPERS
// ===================================================================

const LIKED_ARTICLES_KEY = 'liked_articles';

/**
 * Get liked articles from localStorage
 * 
 * @returns Array of liked article slugs
 */
export function getLikedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
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
      localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
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
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(filtered));
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