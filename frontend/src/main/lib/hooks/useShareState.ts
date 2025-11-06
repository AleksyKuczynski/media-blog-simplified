// frontend/src/main/lib/hooks/useShareState.ts
/**
 * Share State Management Hook
 * 
 * FIXED v2: Updated to use separate share delta storage
 * 
 * CHANGES:
 * - Now uses getShareDelta() with separate storage from likes
 * - 120s expiry window (updated from 60s)
 * - Timestamp resets on each share action (accumulates count)
 * - No interference with like deltas
 * 
 * BEHAVIOR:
 * - When user shares: +1 delta saved to localStorage (expires after 120s)
 * - Multiple shares: Accumulate count and reset 120s timer each time
 * - On page refresh: Delta applied to server count (cache compensation)
 * - After 120s: Delta expires, server count displayed directly
 */

import { useState, useEffect } from 'react';
import { getShareDelta } from '../engagement/localStorage';

export interface UseShareStateOptions {
  slug: string;
  currentShares: number; // Server count (might be stale)
  refreshTrigger?: number; // Optional trigger to force re-read of delta
}

export interface UseShareStateReturn {
  optimisticShares: number; // Displayed count (with delta applied)
}

/**
 * Share state hook - manages optimistic share count
 * 
 * @param slug - Article slug
 * @param currentShares - Current share count from server
 * @param refreshTrigger - Optional counter to force re-reading delta
 * @returns Optimistic share count with delta applied
 * 
 * @example
 * ```tsx
 * const { optimisticShares } = useShareState({
 *   slug: 'my-article',
 *   currentShares: 10,
 * });
 * // If user shared recently: optimisticShares = 11
 * // After 120s or no delta: optimisticShares = 10
 * ```
 */
export function useShareState({
  slug,
  currentShares,
  refreshTrigger = 0,
}: UseShareStateOptions): UseShareStateReturn {
  // Get delta from localStorage (expires after 120s, separate from likes)
  const localDelta = getShareDelta(slug);
  
  // Apply delta to server count
  const adjustedShares = Math.max(0, currentShares + localDelta);
  const [optimisticShares, setOptimisticShares] = useState(adjustedShares);

  // Log delta application for debugging
  useEffect(() => {
    if (localDelta > 0) {
      console.log(`[ShareState] Applied share delta for ${slug}:`, {
        serverCount: currentShares,
        delta: localDelta,
        displayCount: adjustedShares,
      });
    }
  }, [slug, currentShares, localDelta, adjustedShares]);

  // Update optimistic count when server count OR delta changes OR triggered to refresh
  useEffect(() => {
    const newDelta = getShareDelta(slug);
    const newAdjustedShares = Math.max(0, currentShares + newDelta);
    setOptimisticShares(newAdjustedShares);
  }, [currentShares, slug, refreshTrigger]);

  return {
    optimisticShares,
  };
}