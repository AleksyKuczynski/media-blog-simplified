// frontend/src/main/lib/engagement/api.ts
/**
 * Engagement API Client
 * 
 * Handles communication with engagement endpoints
 * Uses request deduplication to prevent duplicate API calls
 */

import type { EngagementData, EngagementResponse, EngagementAction, EngagementError } from './types';

const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Fetch current engagement data for an article
 */
export async function fetchEngagement(slug: string): Promise<EngagementData> {
  try {
    const response = await fetch(`/api/engagement/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
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
 * Includes request deduplication to prevent duplicate API calls
 */
export async function updateEngagement(
  slug: string,
  action: EngagementAction
): Promise<EngagementData> {
  const requestKey = `${slug}-${action}`;

  // Check if request is already in flight
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = (async () => {
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

      // Return mock data since server uses fire-and-forget
      return {
        slug,
        views: 0,
        likes: 0,
        shares: 0,
      };
    } finally {
      inFlightRequests.delete(requestKey);
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);
  return requestPromise;
}

/**
 * Batch fetch engagement for multiple articles
 */
export async function fetchEngagementBatch(
  slugs: string[]
): Promise<Record<string, EngagementData>> {
  const results: Record<string, EngagementData> = {};

  const promises = slugs.map(async (slug) => {
    try {
      const data = await fetchEngagement(slug);
      results[slug] = data;
    } catch (error) {
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