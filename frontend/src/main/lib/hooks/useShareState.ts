// frontend/src/main/lib/hooks/useShareState.ts
/**
 * Share State Management Hook
 * 
 * Handles optimistic share count with localStorage persistence
 * Similar to useLikeState but simpler (no button state, only count)
 * 
 * BEHAVIOR:
 * - When user shares: +1 delta saved to localStorage (expires after 60s)
 * - On page refresh: Delta applied to server count (cache compensation)
 * - After 60s: Delta expires, server count displayed directly
 */

import { useState, useEffect } from 'react';
import { getShareDelta } from '../engagement/localStorage';

export interface UseShareStateOptions {
  slug: string;
  currentShares: number; // Server count (might be stale)
}

export interface UseShareStateReturn {
  optimisticShares: number; // Displayed count (with delta applied)
}

/**
 * Share state hook - manages optimistic share count
 * 
 * @param slug - Article slug
 * @param currentShares - Current share count from server
 * @returns Optimistic share count with delta applied
 * 
 * @example
 * ```tsx
 * const { optimisticShares } = useShareState({
 *   slug: 'my-article',
 *   currentShares: 10,
 * });
 * // If user shared recently: optimisticShares = 11
 * // After 60s or no delta: optimisticShares = 10
 * ```
 */
export function useShareState({
  slug,
  currentShares,
}: UseShareStateOptions): UseShareStateReturn {
  // Get delta from localStorage (expires after 60s)
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

  // Update optimistic count when server count OR delta changes
  useEffect(() => {
    const newDelta = getShareDelta(slug);
    const newAdjustedShares = Math.max(0, currentShares + newDelta);
    setOptimisticShares(newAdjustedShares);
  }, [currentShares, slug]);

  return {
    optimisticShares,
  };
}