// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * FIXED v4: Simplest approach - two sequential setState calls, no nesting
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

export function useLikeState({
  slug,
  currentLikes,
}: UseLikeStateOptions): UseLikeStateReturn {
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(currentLikes);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);
  const isApiCallInFlightRef = useRef<boolean>(false);

  // Sync with localStorage after mount
  useEffect(() => {
    setIsLiked(isArticleLiked(slug));
  }, [slug]);

  // Update optimistic count when prop changes
  useEffect(() => {
    setOptimisticLikes(currentLikes);
  }, [currentLikes]);

  // SAFETY GUARD: Never liked with 0 count
  useEffect(() => {
    if (optimisticLikes === 0 && isLiked) {
      console.warn('[LikeState] Fixing inconsistent state');
      setIsLiked(false);
      removeLikedArticle(slug);
    }
  }, [optimisticLikes, isLiked, slug]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const toggleLike = useCallback(() => {
    if (isApiCallInFlightRef.current) {
      console.warn('[LikeState] Ignoring click - API call in progress');
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 1. Update isLiked and store action for later use
    setIsLiked(prev => {
      const next = !prev;
      const action = next ? 'like' : 'unlike';
      
      // CRITICAL: Set pendingActionRef HERE where we know the action
      // Not outside where timing might be wrong!
      pendingActionRef.current = action;
      
      // Side effects
      if (next) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }
      
      console.log(`[LikeState] Liked: ${prev} → ${next} (action: ${action})`);
      return next;
    });

    // 2. Update count - determine delta from pendingActionRef
    // Note: pendingActionRef was just set in the previous setState
    setOptimisticLikes(prev => {
      // Use pendingActionRef which was set in the setIsLiked callback above
      const delta = pendingActionRef.current === 'like' ? 1 : -1;
      const next = Math.max(0, prev + delta);
      
      console.log(`[LikeState] Count: ${prev} ${delta > 0 ? '+' : ''}${delta} = ${next} (action: ${pendingActionRef.current})`);
      return next;
    });

    // 3. Start processing
    setIsProcessing(true);
    
    timerRef.current = setTimeout(() => {
      const action = pendingActionRef.current;
      if (!action) {
        setIsProcessing(false);
        return;
      }

      isApiCallInFlightRef.current = true;
      console.log(`[LikeState] Sending ${action} to API`);

      updateEngagement(slug, action)
        .then(() => console.log(`[LikeState] ${action} completed`))
        .catch((error) => console.error(`[LikeState] ${action} error:`, error))
        .finally(() => {
          setIsProcessing(false);
          pendingActionRef.current = null;
          isApiCallInFlightRef.current = false;
        });
    }, 1000);

  }, [slug]);

  return {
    isLiked,
    isProcessing,
    optimisticLikes,
    toggleLike,
  };
}