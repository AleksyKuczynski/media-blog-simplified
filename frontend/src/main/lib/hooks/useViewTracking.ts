// frontend/src/main/lib/hooks/useViewTracking.ts
/**
 * View Tracking Hook
 * 
 * Handles delayed view tracking with loading state and prevents double-tracking
 */

import { useEffect, useRef, useState } from 'react';
import { updateEngagement } from '../engagement/api';
import type { EngagementData } from '../engagement/types';

export interface UseViewTrackingOptions {
  slug: string;
  delayMs?: number;
  onSuccess?: (data: EngagementData) => void;
  onError?: (error: Error) => void;
}

export interface UseViewTrackingReturn {
  isTracking: boolean;
  hasTracked: boolean;
  error: Error | null;
}

/**
 * Hook for tracking article views with delay
 * 
 * @param options - Tracking configuration
 * @returns Tracking state
 * 
 * @example
 * ```tsx
 * const { isTracking, hasTracked } = useViewTracking({
 *   slug: 'my-article',
 *   delayMs: 2000,
 *   onSuccess: (data) => setEngagement(data)
 * });
 * ```
 */
export function useViewTracking({
  slug,
  delayMs = 2000,
  onSuccess,
  onError,
}: UseViewTrackingOptions): UseViewTrackingReturn {
  const [isTracking, setIsTracking] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Prevent double-tracking (React StrictMode in dev)
    if (hasTrackedRef.current) {
      return;
    }

    // Delay view tracking to filter bots and accidental clicks
    const timer = setTimeout(async () => {
      if (hasTrackedRef.current) return;
      
      hasTrackedRef.current = true;
      setIsTracking(true);
      setHasTracked(false);

      try {
        console.log('[ViewTracking] Tracking view for:', slug);

        const data = await updateEngagement(slug, 'view');
        
        console.log('[ViewTracking] View tracked successfully:', data);
        setHasTracked(true);
        setError(null);
        
        // Notify parent component of success
        onSuccess?.(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to track view');
        console.error('[ViewTracking] Error:', error);
        setError(error);
        
        // Notify parent component of error
        onError?.(error);
      } finally {
        setIsTracking(false);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [slug, delayMs, onSuccess, onError]);

  return {
    isTracking,
    hasTracked,
    error,
  };
}