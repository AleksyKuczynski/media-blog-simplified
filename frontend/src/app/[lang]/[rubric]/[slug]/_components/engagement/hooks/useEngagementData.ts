// app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useEngagementData.ts
/**
 * Article Engagement - Data Fetching Hook
 * 
 * Fetches initial engagement data from API on component mount.
 * Handles session-based view deduplication.
 * 
 * Features:
 * - Initial data fetch
 * - Session storage check
 * - Loading state management
 * - View tracking flag
 * 
 * Dependencies:
 * - ../lib/types (EngagementData)
 * 
 * @param slug - Article slug
 * 
 * @returns {UseEngagementDataReturn} Fetched data, loading state, view tracking flag
 */

import { useState, useEffect } from 'react';
import { EngagementData } from '../lib';

export interface UseEngagementDataReturn {
  data: EngagementData;
  isLoading: boolean;
  viewWasTracked: boolean;
}

interface EngagementResponse {
  success: boolean;
  data: EngagementData;
  viewTracked?: boolean;
}

/**
 * Hook for fetching engagement data on mount
 */
export function useEngagementData(slug: string): UseEngagementDataReturn {
  const [data, setData] = useState<EngagementData>({
    slug,
    views: 0,
    likes: 0,
    shares: 0,
  });
  const [viewWasTracked, setViewWasTracked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionKey = `viewed_${slug}`;
    const alreadyViewedInSession = typeof window !== 'undefined' 
      ? sessionStorage.getItem(sessionKey) === 'true'
      : false;

    async function fetchData() {
      try {
        const response = await fetch(`/api/engagement/${slug}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch engagement data');
        }

        const result: EngagementResponse = await response.json();

        if (result.success && result.data) {
          setData(result.data);
          setViewWasTracked(result.viewTracked || false);

          // Mark as viewed in session if not already
          if (result.viewTracked && typeof window !== 'undefined') {
            sessionStorage.setItem(sessionKey, 'true');
          }
        }
      } catch (error) {
        // Silent failure - use default values
        console.error('Failed to fetch engagement data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (alreadyViewedInSession) {
      setViewWasTracked(false);
    }

    fetchData();
  }, [slug]);

  return {
    data,
    isLoading,
    viewWasTracked,
  };
}