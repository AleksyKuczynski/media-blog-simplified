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
  // UPDATED v2: Use baseServerValue to prevent double-counting
  const shareDelta = getShareDelta(slug);
  
  // Apply delta to base server value (not current server value!)
  const adjustedShares = shareDelta
    ? Math.max(0, shareDelta.baseServerValue + shareDelta.delta)
    : currentShares;
  const [optimisticShares, setOptimisticShares] = useState(adjustedShares);

  // Log delta application for debugging
  useEffect(() => {
    if (shareDelta) {
      console.log(`[ShareState] Applied share delta for ${slug}:`, {
        baseServerValue: shareDelta.baseServerValue,
        delta: shareDelta.delta,
        displayCount: adjustedShares,
        currentServerValue: currentShares,
        usingBase: true,
      });
    }
  }, [slug, currentShares, shareDelta, adjustedShares]);

  // Update optimistic count when server count OR delta changes OR triggered to refresh
  useEffect(() => {
    const newDelta = getShareDelta(slug);
    const newAdjustedShares = newDelta
      ? Math.max(0, newDelta.baseServerValue + newDelta.delta)
      : currentShares;
    setOptimisticShares(newAdjustedShares);
  }, [currentShares, slug, refreshTrigger]);

  return {
    optimisticShares,
  };
}