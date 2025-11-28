// app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useShareState.ts
/**
 * Article Engagement - Share State Hook
 * 
 * Manages share count with timestamp-based reconciliation.
 * 
 * Architecture:
 * - Count display: Server count + pending deltas
 * - No permanent state (shares not tracked per user)
 * - Immediate API calls (no debounce)
 * 
 * Features:
 * - Optimistic UI updates
 * - State reconciliation on server count changes
 * - Fire-and-forget API (no error rollback)
 * - Refresh trigger for external updates
 * 
 * Reconciliation:
 * - Similar to like state
 * - Compares action timestamps against server's last_updated
 * 
 * Dependencies:
 * - ../lib/actionLog (reconcileCounts)
 * 
 * @param slug - Article slug
 * @param currentViews - Current server view count (for reconciliation)
 * @param currentLikes - Current server like count (for reconciliation)
 * @param currentShares - Current server share count
 * @param lastUpdated - Server last_updated timestamp
 * @param refreshTrigger - External trigger for recalculation
 * 
 * @returns {UseShareStateReturn} Share state
 * 
 * NOTE: No user interaction tracking (shares are fire-and-forget)
 */

import { useState, useEffect } from 'react';
import { reconcileCounts } from '../lib/actionLog';

export interface UseShareStateOptions {
  slug: string;
  currentViews: number;
  currentLikes: number;
  currentShares: number;
  lastUpdated: string | null;
  refreshTrigger?: number;
}

export interface UseShareStateReturn {
  optimisticShares: number;
}

/**
 * Share state hook with timestamp-based reconciliation
 */
export function useShareState({
  slug,
  currentViews,
  currentLikes,
  currentShares,
  lastUpdated,
  refreshTrigger = 0,
}: UseShareStateOptions): UseShareStateReturn {
  const reconciledCounts = reconcileCounts(
    slug,
    { views: currentViews, likes: currentLikes, shares: currentShares },
    lastUpdated
  );
  
  const [optimisticShares, setOptimisticShares] = useState(reconciledCounts.shares);

  // Update optimistic count when server count or trigger changes
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