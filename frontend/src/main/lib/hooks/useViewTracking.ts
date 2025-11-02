// frontend/src/main/lib/hooks/useViewTracking.ts
/**
 * View Tracking Hook
 * 
 * UPDATED: Made optional via 'enabled' flag
 * Now primarily used only if view tracking is NOT handled by GET endpoint
 */

import { useEffect, useRef } from 'react';
import { updateEngagement } from '../engagement/api';

export interface UseViewTrackingOptions {
  slug: string;
  delayMs?: number;
  enabled?: boolean; // CHANGED: Make tracking optional (default: true for backward compatibility)
  onTrack?: () => void; // Called when view is tracked (for optimistic UI update)
}

export interface UseViewTrackingReturn {
  hasTracked: boolean;
}

/**
 * Hook for tracking article views with delay
 * 
 * BEHAVIOR:
 * 1. Waits for specified delay (default 1 second)
 * 2. Calls onTrack callback immediately (for optimistic UI update)
 * 3. Fires API call in background (fire-and-forget)
 * 4. Does NOT wait for response or sync state
 * 
 * NOTE: As of latest architecture, view tracking is handled by GET endpoint.
 * This hook is kept for backward compatibility or optional client-side tracking.
 * 
 * @param options - Tracking configuration
 * @returns Tracking state
 * 
 * @example
 * ```tsx
 * // Disabled (view tracking handled by GET endpoint)
 * const { hasTracked } = useViewTracking({
 *   slug: 'my-article',
 *   enabled: false
 * });
 * 
 * // Enabled (optional client-side tracking)
 * const { hasTracked } = useViewTracking({
 *   slug: 'my-article',
 *   delayMs: 1000,
 *   enabled: true,
 *   onTrack: () => setEngagement(prev => ({ ...prev, views: prev.views + 1 }))
 * });
 * ```
 */
export function useViewTracking({
  slug,
  delayMs = 1000,
  enabled = true, // Default to true for backward compatibility
  onTrack,
}: UseViewTrackingOptions): UseViewTrackingReturn {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // CHANGED: Check if tracking is enabled
    if (!enabled) {
      console.log('[ViewTracking] Tracking disabled for:', slug);
      return;
    }

    // Prevent double-tracking (React StrictMode in dev)
    if (hasTrackedRef.current) {
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

      console.log('[ViewTracking] Tracking view for:', slug);

      // 1. Optimistic UI update (immediate)
      onTrack?.();

      // 2. Fire API call (background, fire-and-forget)
      updateEngagement(slug, 'view')
        .then(() => {
          console.log('[ViewTracking] View tracked successfully (background)');
        })
        .catch((error) => {
          console.error('[ViewTracking] Error (non-critical, ignored):', error);
          // Don't revert - optimistic update already done
        });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [slug, delayMs, enabled, onTrack]); // CHANGED: Added 'enabled' to deps

  return {
    hasTracked: hasTrackedRef.current,
  };
}