// frontend/src/main/lib/hooks/useShareState.ts
/**
 * Share State Management Hook
 * 
 * Manages share count display with timestamp-based reconciliation
 * - Count display: Server count + pending action deltas
 * - No debouncing: Shares are immediate
 */

import { useState, useEffect } from 'react';
import { reconcileCounts } from '../engagement/actionLog';

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