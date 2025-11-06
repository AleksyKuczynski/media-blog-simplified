// frontend/src/main/lib/hooks/useShareState.ts
/**
 * Share State Management Hook - Phase 2
 * 
 * UPDATED: Uses action log with timestamp-based reconciliation
 * REMOVED: baseServerValue approach (replaced with timestamp comparison)
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
 * @param currentShares - Server share count
 * @param lastUpdated - Server's last_updated timestamp (ISO string)
 * @param refreshTrigger - Optional counter to force re-calculation
 * @returns Optimistic share count with pending actions applied
 * 
 * @example
 * ```tsx
 * const { optimisticShares } = useShareState({
 *   slug: 'my-article',
 *   currentShares: 10,
 *   lastUpdated: '2025-11-06T14:30:00.000Z',
 * });
 * // If user shared recently: optimisticShares = 11
 * // If server processed: optimisticShares = 10 (converged)
 * ```
 */
export function useShareState({
  slug,
  currentShares,
  lastUpdated,
  refreshTrigger = 0,
}: UseShareStateOptions): UseShareStateReturn {
  // Reconcile counts (server + pending actions)
  const reconciledCounts = reconcileCounts(
    slug,
    { likes: 0, shares: currentShares }, // Only care about shares here
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
      { likes: 0, shares: currentShares },
      lastUpdated
    );
    setOptimisticShares(newReconciled.shares);
  }, [currentShares, slug, lastUpdated, refreshTrigger]);

  return {
    optimisticShares,
  };
}