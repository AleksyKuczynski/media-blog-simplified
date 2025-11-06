// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * FIXED v8: Updated to use separate like delta storage
 * 
 * CHANGES:
 * - Now uses getLikeDelta() instead of getArticleDelta()
 * - Delta storage is separate from shares (no interference)
 * - 120s expiry window (updated from 60s)
 * - Timestamp resets on each like/unlike action
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateEngagement } from '../engagement/api';
import { 
  isArticleLiked, 
  saveLikedArticle, 
  removeLikedArticle,
  getLikeDelta 
} from '../engagement/localStorage';

export interface UseLikeStateOptions {
  slug: string;
  currentLikes: number; // Server count (might be stale)
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
  // PART 1: Button state from PERMANENT storage
  // This never expires - user preference persists forever
  const [isLiked, setIsLiked] = useState(() => isArticleLiked(slug));
  const [isProcessing, setIsProcessing] = useState(false);
  
  // PART 2: Count adjustment from TEMPORARY delta (separate from shares)
  // This expires after 120s - only for cache compensation
  const localDelta = getLikeDelta(slug);
  const adjustedLikes = Math.max(0, currentLikes + localDelta);
  const [optimisticLikes, setOptimisticLikes] = useState(adjustedLikes);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);
  const isApiCallInFlightRef = useRef<boolean>(false);

  // Log delta application for debugging
  useEffect(() => {
    if (localDelta !== 0) {
      console.log(`[LikeState] Applied like delta for ${slug}:`, {
        serverCount: currentLikes,
        delta: localDelta,
        displayCount: adjustedLikes,
      });
    } else if (isLiked) {
      console.log(`[LikeState] Liked state restored for ${slug} (delta expired, using server count)`);
    }
  }, [slug, currentLikes, localDelta, adjustedLikes, isLiked]);

  // Sync isLiked when slug changes (navigation)
  // IMPORTANT: This reads from PERMANENT storage
  useEffect(() => {
    const liked = isArticleLiked(slug);
    setIsLiked(liked);
    console.log(`[LikeState] Loaded liked state for ${slug}: ${liked ? '✅ liked' : '❌ not liked'}`);
  }, [slug]);

  // Update optimistic count when server count OR delta changes
  useEffect(() => {
    const newDelta = getLikeDelta(slug);
    const newAdjustedLikes = Math.max(0, currentLikes + newDelta);
    setOptimisticLikes(newAdjustedLikes);
  }, [currentLikes, slug]);

  // Cleanup timer on unmount
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

    // 1. Update isLiked state and BOTH storages
    setIsLiked(prev => {
      const next = !prev;
      const action = next ? 'like' : 'unlike';
      
      pendingActionRef.current = action;
      
      // Update BOTH:
      // - Permanent liked state (for button)
      // - Temporary delta (for count adjustment, 120s expiry, timestamp resets)
      if (next) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }
      
      console.log(`[LikeState] Toggled: ${prev} → ${next} (action: ${action})`);
      console.log(`[LikeState] ✅ Permanent state saved, ⏱️ temporary delta created (120s, timestamp reset)`);
      return next;
    });

    // 2. Update optimistic count
    setOptimisticLikes(prev => {
      const delta = pendingActionRef.current === 'like' ? 1 : -1;
      const next = Math.max(0, prev + delta);
      
      console.log(`[LikeState] Count: ${prev} ${delta > 0 ? '+' : ''}${delta} = ${next}`);
      return next;
    });

    // 3. Debounced API call
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
        .then(() => {
          console.log(`[LikeState] ✅ ${action} completed on server`);
          // Note: We don't clear the delta here
          // Permanent liked state stays forever
          // Temporary delta expires after 120s automatically
        })
        .catch((error) => {
          console.error(`[LikeState] ❌ ${action} error:`, error);
          // On error, we keep both states
          // User can retry, and states will persist
        })
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