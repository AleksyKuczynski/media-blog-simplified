// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * REFACTORED: Debounced API calls, optimistic updates, safety guards
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateEngagement } from '../engagement/api';
import { isArticleLiked, saveLikedArticle, removeLikedArticle } from '../engagement/localStorage';

export interface UseLikeStateOptions {
  slug: string;
  currentLikes: number;
}

export interface UseLikeStateReturn {
  isLiked: boolean;
  isProcessing: boolean;
  optimisticLikes: number;
  toggleLike: () => void;
}

/**
 * Hook for managing like state with debounced API calls
 * 
 * BEHAVIOR:
 * 1. User clicks → UI updates instantly (optimistic)
 * 2. Start 1-second debounce timer
 * 3. User clicks again → UI updates, timer resets
 * 4. Timer expires → send FINAL action to API (fire-and-forget)
 * 5. Multiple rapid clicks = only ONE API call with final state
 * 
 * SAFETY GUARDS:
 * - Never show negative likes (Math.max(0, count))
 * - Never show "liked" with 0 count
 * - Never trigger "unlike" flow if count is 0
 * - Cleanup timer on unmount
 * 
 * @param options - Like state configuration
 * @returns Like state and toggle function
 * 
 * @example
 * ```tsx
 * const { isLiked, optimisticLikes, toggleLike } = useLikeState({
 *   slug: 'my-article',
 *   currentLikes: 42
 * });
 * ```
 */
export function useLikeState({
  slug,
  currentLikes,
}: UseLikeStateOptions): UseLikeStateReturn {
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(currentLikes);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);

  // Sync with localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    setIsLiked(isArticleLiked(slug));
  }, [slug]);

  // Update optimistic count when prop changes
  useEffect(() => {
    setOptimisticLikes(currentLikes);
  }, [currentLikes]);

  // SAFETY GUARD: Force consistent state (never liked with 0 count)
  useEffect(() => {
    if (optimisticLikes === 0 && isLiked) {
      console.warn('[LikeState] Inconsistent state: likes=0 but isLiked=true. Fixing...');
      setIsLiked(false);
      removeLikedArticle(slug);
    }
  }, [optimisticLikes, isLiked, slug]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /**
   * Toggle like status with debouncing
   */
  const toggleLike = useCallback(() => {
    // Clear existing timer (debouncing)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 1. OPTIMISTIC UI UPDATE (instant)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // 2. Calculate new count with SAFETY GUARD (never negative)
    const newCount = newLikedState
      ? optimisticLikes + 1
      : Math.max(0, optimisticLikes - 1);

    setOptimisticLikes(newCount);

    // 3. Update localStorage immediately
    if (newLikedState) {
      saveLikedArticle(slug);
    } else {
      removeLikedArticle(slug);
    }

    // 4. Set pending action
    const action = newLikedState ? 'like' : 'unlike';
    pendingActionRef.current = action;

    // 5. Start debounce timer (1 second)
    setIsProcessing(true);
    
    timerRef.current = setTimeout(() => {
      const finalAction = pendingActionRef.current;
      
      if (!finalAction) {
        setIsProcessing(false);
        return;
      }

      // SAFETY GUARD: Don't unlike if count is 0
      if (finalAction === 'unlike' && newCount === 0) {
        console.warn('[LikeState] Skipping unlike - count already 0');
        setIsProcessing(false);
        pendingActionRef.current = null;
        return;
      }

      console.log(`[LikeState] Debounce complete, sending ${finalAction} to API`);

      // 6. Fire API call (fire-and-forget)
      updateEngagement(slug, finalAction)
        .then(() => {
          console.log(`[LikeState] ${finalAction} completed successfully (background)`);
        })
        .catch((error) => {
          console.error(`[LikeState] ${finalAction} error (non-critical):`, error);
          // Don't revert - optimistic update already done
        })
        .finally(() => {
          setIsProcessing(false);
          pendingActionRef.current = null;
        });
    }, 1000); // 1 second debounce

  }, [isLiked, optimisticLikes, slug]);

  return {
    isLiked,
    isProcessing,
    optimisticLikes,
    toggleLike,
  };
}