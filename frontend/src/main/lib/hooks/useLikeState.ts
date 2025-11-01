// frontend/src/main/lib/engagement/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * Handles like/unlike toggle with optimistic updates and localStorage sync
 */

import { useState, useEffect, useCallback } from 'react';
import { isArticleLiked, saveLikedArticle, removeLikedArticle } from '../localStorage';
import type { EngagementData } from '../types';
import { updateEngagement } from '../engagement/api';

export interface UseLikeStateOptions {
  slug: string;
  currentLikes: number;
  onSuccess?: (data: EngagementData, action: 'like' | 'unlike') => void;
  onError?: (error: Error) => void;
}

export interface UseLikeStateReturn {
  isLiked: boolean;
  isProcessing: boolean;
  optimisticLikes: number;
  toggleLike: () => Promise<void>;
}

/**
 * Hook for managing like state with optimistic updates
 * 
 * @param options - Like state configuration
 * @returns Like state and toggle function
 * 
 * @example
 * ```tsx
 * const { isLiked, isProcessing, optimisticLikes, toggleLike } = useLikeState({
 *   slug: 'my-article',
 *   currentLikes: 42,
 *   onSuccess: (data) => setEngagement(data)
 * });
 * ```
 */
export function useLikeState({
  slug,
  currentLikes,
  onSuccess,
  onError,
}: UseLikeStateOptions): UseLikeStateReturn {
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(currentLikes);

  // Sync with localStorage after mount (prevents hydration mismatch)
  useEffect(() => {
    setIsLiked(isArticleLiked(slug));
  }, [slug]);

  // Update optimistic count when prop changes
  useEffect(() => {
    setOptimisticLikes(currentLikes);
  }, [currentLikes]);

  /**
   * Toggle like status with optimistic updates
   */
  const toggleLike = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Store previous state for rollback
    const previousLikedState = isLiked;
    const previousLikeCount = optimisticLikes;

    try {
      // Step 1: Optimistic update (instant UI feedback)
      const newLikedState = !previousLikedState;
      setIsLiked(newLikedState);

      const newLikeCount = newLikedState
        ? optimisticLikes + 1
        : Math.max(0, optimisticLikes - 1);

      setOptimisticLikes(newLikeCount);

      // Step 2: Update localStorage immediately
      if (newLikedState) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }

      // Step 3: Send action to API (triggers Flow)
      const action = newLikedState ? 'like' : 'unlike';

      try {
        const data = await updateEngagement(slug, action);

        // Update with actual count from server (in case of sync issues)
        setOptimisticLikes(data.likes);

        // Notify parent component
        onSuccess?.(data, action);
      } catch (apiError: any) {
        // Handle rate limiting gracefully
        if (apiError?.message?.includes('Rate limit')) {
          // Keep the optimistic update, but notify
          onError?.(new Error('Rate limit exceeded. Like saved locally.'));
          return;
        }

        // For other errors, throw to trigger rollback
        throw apiError;
      }
    } catch (error) {
      console.error('[LikeState] Error toggling like:', error);

      // Rollback on error
      setIsLiked(previousLikedState);
      setOptimisticLikes(previousLikeCount);

      // Update localStorage to match rollback
      if (previousLikedState) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }

      const errorObj = error instanceof Error ? error : new Error('Failed to update like');
      onError?.(errorObj);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isLiked, optimisticLikes, slug, onSuccess, onError]);

  return {
    isLiked,
    isProcessing,
    optimisticLikes,
    toggleLike,
  };
}