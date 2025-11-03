// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * IMPROVED v6: Permanent liked state + Temporary count deltas
 * 
 * KEY IMPROVEMENT:
 * - Button state (isLiked) persists FOREVER in localStorage
 * - Count delta persists for 60s (compensates for cache delay)
 * - After 60s: Button still liked, count shows server value
 * 
 * BEHAVIOR:
 * 1. User likes article
 *    - localStorage: ["article-1"] (permanent)
 *    - delta: { delta: +1, timestamp: NOW } (temporary)
 *    - Display: Liked ✅, Count: server+1
 * 
 * 2. Page refresh within 60s
 *    - Button: Liked ✅ (from permanent storage)
 *    - Count: server+1 (delta still active)
 * 
 * 3. Page refresh after 60s
 *    - Button: Liked ✅ (from permanent storage)
 *    - Count: server (delta expired, cache caught up)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateEngagement } from '../engagement/api';
import { 
  isArticleLiked, 
  saveLikedArticle, 
  removeLikedArticle,
  getArticleDelta 
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
  
  // PART 2: Count adjustment from TEMPORARY delta
  // This expires after 60s - only for cache compensation
  const localDelta = getArticleDelta(slug);
  const adjustedLikes = Math.max(0, currentLikes + localDelta.delta);
  const [optimisticLikes, setOptimisticLikes] = useState(adjustedLikes);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);
  const isApiCallInFlightRef = useRef<boolean>(false);

  // Log delta application for debugging
  useEffect(() => {
    if (localDelta.delta !== 0) {
      const age = Math.round((Date.now() - localDelta.timestamp) / 1000);
      console.log(`[LikeState] Applied delta for ${slug}:`, {
        serverCount: currentLikes,
        delta: localDelta.delta,
        displayCount: adjustedLikes,
        deltaAge: `${age}s`,
        expiresIn: `${60 - age}s`,
      });
    } else if (isLiked) {
      console.log(`[LikeState] Liked state restored for ${slug} (delta expired, using server count)`);
    }
  }, [slug, currentLikes, localDelta.delta, localDelta.timestamp, adjustedLikes, isLiked]);

  // Sync isLiked when slug changes (navigation)
  // IMPORTANT: This reads from PERMANENT storage
  useEffect(() => {
    const liked = isArticleLiked(slug);
    setIsLiked(liked);
    console.log(`[LikeState] Loaded liked state for ${slug}: ${liked}`);
  }, [slug]);

  // Update optimistic count when server count OR delta changes
  useEffect(() => {
    const newDelta = getArticleDelta(slug);
    const newAdjustedLikes = Math.max(0, currentLikes + newDelta.delta);
    setOptimisticLikes(newAdjustedLikes);
  }, [currentLikes, slug]);

  // SAFETY GUARD: Never show liked state with 0 count
  // This handles edge cases where data might be inconsistent
  useEffect(() => {
    if (optimisticLikes === 0 && isLiked) {
      console.warn('[LikeState] Inconsistent state: liked but 0 count - resetting');
      setIsLiked(false);
      removeLikedArticle(slug);
    }
  }, [optimisticLikes, isLiked, slug]);

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
      // - Temporary delta (for count adjustment)
      if (next) {
        saveLikedArticle(slug);
      } else {
        removeLikedArticle(slug);
      }
      
      console.log(`[LikeState] Toggled: ${prev} → ${next} (action: ${action})`);
      console.log(`[LikeState] ✅ Permanent state saved, ⏱️ temporary delta created (60s)`);
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
          // Temporary delta expires after 60s automatically
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