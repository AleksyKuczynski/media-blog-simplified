// frontend/src/app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useViewTracking.ts
/**
 * View Tracking Hook
 * 
 * Optional client-side view tracking (disabled by default)
 * View tracking is primarily handled by the API GET endpoint
 */

import { useEffect, useRef } from 'react';
import { updateEngagement } from '../api/api';

export interface UseViewTrackingOptions {
  slug: string;
  delayMs?: number;
  enabled?: boolean;
  onTrack?: () => void;
}

export interface UseViewTrackingReturn {
  hasTracked: boolean;
}

/**
 * Hook for tracking article views with delay
 * 
 * @param options - Tracking configuration
 * @returns Tracking state
 */
export function useViewTracking({
  slug,
  delayMs = 1000,
  enabled = true,
  onTrack,
}: UseViewTrackingOptions): UseViewTrackingReturn {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!enabled || hasTrackedRef.current) {
      return;
    }

    // Check if already tracked this session
    const sessionKey = `viewed_${slug}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      hasTrackedRef.current = true;
      return;
    }

    // Delay view tracking to filter bots and accidental clicks
    const timer = setTimeout(() => {
      if (hasTrackedRef.current) return;
      
      hasTrackedRef.current = true;

      // Mark as tracked in session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(sessionKey, 'true');
      }

      // Optimistic UI update (immediate)
      onTrack?.();

      // Fire API call (background, fire-and-forget)
      updateEngagement(slug, 'view').catch(() => {
        // Silent failure - optimistic update already applied
      });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [slug, delayMs, enabled, onTrack]);

  return {
    hasTracked: hasTrackedRef.current,
  };
}