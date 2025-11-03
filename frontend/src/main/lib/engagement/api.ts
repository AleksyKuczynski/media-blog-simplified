// frontend/src/main/lib/engagement/api.ts
/**
 * Engagement API Client
 * 
 * FIXED: Added request deduplication to prevent multiple simultaneous calls
 */

import type { EngagementData, EngagementResponse, EngagementAction, EngagementError } from './types';
import { retryWithBackoff, shouldRetryError } from './retry';

// FIXED: Request deduplication - track in-flight requests
const inFlightRequests = new Map<string, Promise<any>>();

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
 * FIXED: Includes request deduplication to prevent duplicate API calls
 * 
 * @param slug - Article slug
 * @param action - Action to perform
 * @returns Promise with updated engagement data
 */
export async function updateEngagement(
  slug: string,
  action: EngagementAction
): Promise<EngagementData> {
  // FIXED: Create unique key for this request
  const requestKey = `${slug}-${action}`;
  
  // FIXED: Check if this exact request is already in flight
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) {
    console.warn(`[API] ⚠️ Duplicate ${action} request detected for ${slug}, returning existing promise`);
    return existingRequest;
  }

  // FIXED: Create new request and track it
  const requestPromise = executeUpdateEngagement(slug, action);
  
  inFlightRequests.set(requestKey, requestPromise);
  
  // FIXED: Clean up after request completes (success or error)
  requestPromise
    .finally(() => {
      inFlightRequests.delete(requestKey);
      console.log(`[API] ✓ Cleaned up in-flight request: ${requestKey}`);
    });
  
  return requestPromise;
}

/**
 * Internal function to execute the actual API request
 * Separated from updateEngagement for deduplication logic
 */
async function executeUpdateEngagement(
  slug: string,
  action: EngagementAction
): Promise<EngagementData> {
  console.log(`[API] 🚀 Executing ${action} request for ${slug}`);
  
  // Fire-and-forget pattern: No retries for engagement actions
  // Server returns 200 immediately, actual processing happens async
  try {
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
      throw new Error(errorMessage);
    }

    const result: EngagementResponse = await response.json();

    if (!result.success) {
      throw new Error('Invalid response format');
    }

    console.log(`[API] ✅ ${action} request completed for ${slug}`);

    // Return mock data since server uses fire-and-forget
    // Optimistic updates handle the UI
    return {
      slug,
      views: 0,
      likes: 0,
      shares: 0,
    };
  } catch (error) {
    console.error(`[API] ❌ ${action} request failed for ${slug}:`, error);
    throw error;
  }
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