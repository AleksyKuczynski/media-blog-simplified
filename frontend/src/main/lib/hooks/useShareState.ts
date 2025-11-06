// frontend/src/main/lib/hooks/useShareState.ts
/**
 * Share State Management Hook - Phase 2 (Views Fix)
 * 
 * UPDATED: Now passes views through reconciliation to ensure all counts stay in sync
 * 
 * BEHAVIOR:
 * - Count display: Server count + pending action deltas
 * - Reconciliation: Compare action timestamps with server's last_updated
 * - No debouncing: Shares are immediate (but still fire-and-forget)
 */

import { useState, useEffect } from 'react';
import { reconcileCounts } from '../engagement/actionLog';

export interface UseShareStateOptions {
  slug: string;
  currentViews: number;        // Server count (needed for reconciliation)
  currentLikes: number;        // Server count (needed for reconciliation)
  currentShares: number;       // Server count
  lastUpdated: string | null;  // Server's last_updated timestamp
  refreshTrigger?: number;     // Optional trigger to force re-calculation
}

export interface UseShareStateReturn {
  optimisticShares: number;    // Displayed count (with pending actions)
}

/**
 * Share state hook with timestamp-based reconciliation
 * 
 * @param slug - Article slug
 * @param currentViews - Server view count
 * @param currentLikes - Server like count
 * @param currentShares - Server share count
 * @param lastUpdated - Server's last_updated timestamp (ISO string)
 * @param refreshTrigger - Optional counter to force re-calculation
 * @returns Optimistic share count with pending actions applied
 * 
 * @example
 * ```tsx
 * const { optimisticShares } = useShareState({
 *   slug: 'my-article',
 *   currentViews: 100,
 *   currentLikes: 10,
 *   currentShares: 5,
 *   lastUpdated: '2025-11-06T14:30:00.000Z',
 * });
 * // If user shared recently: optimisticShares = 6
 * // If server processed: optimisticShares = 5 (converged)
 * ```
 */
export function useShareState({
  slug,
  currentViews,
  currentLikes,
  currentShares,
  lastUpdated,
  refreshTrigger = 0,
}: UseShareStateOptions): UseShareStateReturn {
  // Reconcile counts (server + pending actions)
  const reconciledCounts = reconcileCounts(
    slug,
    { views: currentViews, likes: currentLikes, shares: currentShares },
    lastUpdated
  );
  
  const [optimisticShares, setOptimisticShares] = useState(reconciledCounts.shares);

  // Log reconciliation for debugging
  useEffect(() => {
    if (reconciledCounts.shares !== currentShares) {
      console.log(`[ShareState] Reconciled shares for ${slug}:`, {
        serverCount: currentShares,
        reconciledCount: reconciledCounts.shares,
        delta: reconciledCounts.shares - currentShares,
        lastUpdated,
      });
    }
  }, [slug, currentShares, reconciledCounts.shares, lastUpdated]);

  // Update optimistic count when server count OR timestamp OR trigger changes
  useEffect(() => {
    const newReconciled = reconcileCounts(
      slug,
      { views: currentViews, likes: currentLikes, shares: currentShares },
      lastUpdated
    );
    setOptimisticShares(newReconciled.shares);
  }, [currentViews, currentLikes, currentShares, slug, lastUpdated, refreshTrigger]);

  return {
    optimisticShares,
  };
}