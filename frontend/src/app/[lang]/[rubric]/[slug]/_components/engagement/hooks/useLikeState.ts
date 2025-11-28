// frontend/src/app/[lang]/[rubric]/[slug]/_components/engagement/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * Manages like button state and count with timestamp-based reconciliation
 * - Button state: Permanent (persists in localStorage)
 * - Count display: Server count + pending action deltas
 * - Debounced: 1 second delay before API call
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateEngagement } from '../api/api';
import { 
  isArticleLiked,
  addLikedArticle,
  removeLikedArticle,
  logAction,
  reconcileCounts,
} from '../api/actionLog';

export interface UseLikeStateOptions {
  slug: string;
  currentLikes: number;
  currentViews: number;
  currentShares: number;
  lastUpdated: string | null;
}

export interface UseLikeStateReturn {
  isLiked: boolean;
  isProcessing: boolean;
  optimisticLikes: number;
  toggleLike: () => void;
}

/**
 * Like state hook with timestamp-based reconciliation
 */
export function useLikeState({
  slug,
  currentLikes,
  currentViews,
  currentShares,
  lastUpdated,
}: UseLikeStateOptions): UseLikeStateReturn {
  const [isLiked, setIsLiked] = useState(() => isArticleLiked(slug));
  const [isProcessing, setIsProcessing] = useState(false);
  
  const reconciledCounts = reconcileCounts(
    slug,
    { views: currentViews, likes: currentLikes, shares: currentShares },
    lastUpdated
  );
  const [optimisticLikes, setOptimisticLikes] = useState(reconciledCounts.likes);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);
  const isApiCallInFlightRef = useRef<boolean>(false);

  // Sync button state when slug changes
  useEffect(() => {
    const liked = isArticleLiked(slug);
    setIsLiked(liked);
  }, [slug]);

  // Update optimistic count when server count changes
  useEffect(() => {
    const newReconciled = reconcileCounts(
      slug,
      { views: currentViews, likes: currentLikes, shares: currentShares },
      lastUpdated
    );
    setOptimisticLikes(newReconciled.likes);
  }, [currentViews, currentLikes, currentShares, slug, lastUpdated]);

  const toggleLike = useCallback(() => {
    if (isProcessing || isApiCallInFlightRef.current) {
      return;
    }

    const newLikedState = !isLiked;
    const action = newLikedState ? 'like' : 'unlike';

    // Update UI immediately
    setIsLiked(newLikedState);
    setIsProcessing(true);

    // Update permanent storage
    if (newLikedState) {
      addLikedArticle(slug);
    } else {
      removeLikedArticle(slug);
    }

    // Update optimistic count
    setOptimisticLikes(prev => prev + (newLikedState ? 1 : -1));

    // Log action for reconciliation
    logAction(slug, action);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Store pending action
    pendingActionRef.current = action;

    // Debounce API call (1 second)
    timerRef.current = setTimeout(() => {
      const actionToSend = pendingActionRef.current;
      if (!actionToSend) return;

      isApiCallInFlightRef.current = true;
      
      updateEngagement(slug, actionToSend)
        .catch(() => {
          // Silent failure - optimistic update already applied
        })
        .finally(() => {
          isApiCallInFlightRef.current = false;
          setIsProcessing(false);
          pendingActionRef.current = null;
        });
    }, 1000);
  }, [isLiked, isProcessing, slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isLiked,
    isProcessing,
    optimisticLikes,
    toggleLike,
  };
}