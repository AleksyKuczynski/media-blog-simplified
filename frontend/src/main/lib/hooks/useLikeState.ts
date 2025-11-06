// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook - Phase 2 (Views Fix)
 * 
 * UPDATED: Now passes views through reconciliation to ensure all counts stay in sync
 * 
 * BEHAVIOR:
 * - Button state: Permanent (from liked_articles list)
 * - Count display: Server count + pending action deltas
 * - Reconciliation: Compare action timestamps with server's last_updated
 * - Debounced: 1 second delay before API call
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateEngagement } from '../engagement/api';
import { 
  isArticleLiked,
  addLikedArticle,
  removeLikedArticle,
  logAction,
  reconcileCounts,
} from '../engagement/actionLog';

export interface UseLikeStateOptions {
  slug: string;
  currentLikes: number;        // Server count
  currentViews: number;        // Server count (needed for reconciliation)
  currentShares: number;       // Server count (needed for reconciliation)
  lastUpdated: string | null;  // Server's last_updated timestamp
}

export interface UseLikeStateReturn {
  isLiked: boolean;
  isProcessing: boolean;
  optimisticLikes: number;
  toggleLike: () => void;
}

/**
 * Like state hook with timestamp-based reconciliation
 * 
 * @param slug - Article slug
 * @param currentLikes - Server like count
 * @param currentViews - Server view count
 * @param currentShares - Server share count
 * @param lastUpdated - Server's last_updated timestamp (ISO string)
 * @returns Like state and handlers
 */
export function useLikeState({
  slug,
  currentLikes,
  currentViews,
  currentShares,
  lastUpdated,
}: UseLikeStateOptions): UseLikeStateReturn {
  // PART 1: Button state from permanent storage
  const [isLiked, setIsLiked] = useState(() => isArticleLiked(slug));
  const [isProcessing, setIsProcessing] = useState(false);
  
  // PART 2: Reconciled count (server + pending actions)
  const reconciledCounts = reconcileCounts(
    slug,
    { views: currentViews, likes: currentLikes, shares: currentShares },
    lastUpdated
  );
  const [optimisticLikes, setOptimisticLikes] = useState(reconciledCounts.likes);
  
  // Debounce timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);
  const isApiCallInFlightRef = useRef<boolean>(false);

  // Log reconciliation for debugging
  useEffect(() => {
    if (reconciledCounts.likes !== currentLikes) {
      console.log(`[LikeState] Reconciled likes for ${slug}:`, {
        serverCount: currentLikes,
        reconciledCount: reconciledCounts.likes,
        delta: reconciledCounts.likes - currentLikes,
        lastUpdated,
      });
    }
  }, [slug, currentLikes, reconciledCounts.likes, lastUpdated]);

  // Sync button state when slug changes
  useEffect(() => {
    const liked = isArticleLiked(slug);
    setIsLiked(liked);
    console.log(`[LikeState] Loaded liked state for ${slug}: ${liked ? '✅ liked' : '❌ not liked'}`);
  }, [slug]);

  // Update optimistic count when server count OR timestamp changes
  useEffect(() => {
    const newReconciled = reconcileCounts(
      slug,
      { views: currentViews, likes: currentLikes, shares: currentShares },
      lastUpdated
    );
    setOptimisticLikes(newReconciled.likes);
  }, [currentLikes, currentViews, currentShares, slug, lastUpdated]);

  /**
   * Execute the pending like/unlike action
   */
  const executePendingAction = useCallback(async () => {
    const action = pendingActionRef.current;
    if (!action || isApiCallInFlightRef.current) return;

    isApiCallInFlightRef.current = true;
    console.log(`[LikeState] Executing pending ${action} for ${slug}`);

    try {
      await updateEngagement(slug, action);
      console.log(`[LikeState] ✅ ${action} API call completed`);
    } catch (error) {
      console.error(`[LikeState] ❌ ${action} API call failed:`, error);
      
      // Rollback on error
      if (action === 'like') {
        removeLikedArticle(slug);
        setIsLiked(false);
      } else {
        addLikedArticle(slug);
        setIsLiked(true);
      }
      
      // Recalculate optimistic count
      const rolled = reconcileCounts(
        slug,
        { views: currentViews, likes: currentLikes, shares: currentShares },
        lastUpdated
      );
      setOptimisticLikes(rolled.likes);
    } finally {
      isApiCallInFlightRef.current = false;
      pendingActionRef.current = null;
      setIsProcessing(false);
    }
  }, [slug, currentLikes, currentViews, currentShares, lastUpdated]);

  /**
   * Toggle like/unlike with debouncing
   */
  const toggleLike = useCallback(() => {
    // Prevent spam clicking
    if (isProcessing) {
      console.warn('[LikeState] Like action already in progress, ignoring');
      return;
    }

    setIsProcessing(true);

    // Determine action
    const action: 'like' | 'unlike' = isLiked ? 'unlike' : 'like';
    
    // STEP 1: Update permanent button state immediately
    if (action === 'like') {
      addLikedArticle(slug);
      setIsLiked(true);
    } else {
      removeLikedArticle(slug);
      setIsLiked(false);
    }

    // STEP 2: Log action with timestamp
    logAction(slug, action);

    // STEP 3: Update optimistic count immediately
    const newReconciled = reconcileCounts(
      slug,
      { views: currentViews, likes: currentLikes, shares: currentShares },
      lastUpdated
    );
    setOptimisticLikes(newReconciled.likes);

    console.log(`[LikeState] Optimistic ${action}: ${currentLikes} → ${newReconciled.likes}`);

    // STEP 4: Debounce API call (1 second)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    pendingActionRef.current = action;
    timerRef.current = setTimeout(() => {
      executePendingAction();
    }, 1000);
  }, [isLiked, isProcessing, slug, currentLikes, currentViews, currentShares, lastUpdated, executePendingAction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Execute pending action on unmount
      if (pendingActionRef.current && !isApiCallInFlightRef.current) {
        executePendingAction();
      }
    };
  }, [executePendingAction]);

  return {
    isLiked,
    isProcessing,
    optimisticLikes,
    toggleLike,
  };
}