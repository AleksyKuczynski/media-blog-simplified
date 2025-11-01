// frontend/src/main/lib/engagement/api.ts
/**
 * Engagement API Client
 * 
 * Clean API interaction layer for engagement endpoints
 */

import type { EngagementData, EngagementResponse, EngagementAction, EngagementError } from './types';
import { retryWithBackoff, shouldRetryError } from './retry';

/**
 * Fetch current engagement data for an article
 * 
 * @param slug - Article slug
 * @returns Promise with engagement data
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
    console.error('[API] Error fetching engagement:', error);
    
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
 * Includes retry logic with exponential backoff
 * 
 * @param slug - Article slug
 * @param action - Action to perform
 * @returns Promise with updated engagement data
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
 * Batch fetch engagement for multiple articles
 * Useful for article lists
 * 
 * @param slugs - Array of article slugs
 * @returns Promise with map of slug to engagement data
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