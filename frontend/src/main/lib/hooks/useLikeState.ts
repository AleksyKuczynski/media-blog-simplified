// frontend/src/main/lib/hooks/useLikeState.ts
/**
 * Like State Management Hook
 * 
 * FIXED v7: Removed aggressive safety guard that was deleting permanent liked state
 * 
 * BUG FIX:
 * The v6 safety guard was triggering after delta expiry:
 * - Article has 0 likes from server
 * - User likes it → stored in permanent storage
 * - After 60s: delta expires, optimisticLikes = 0
 * - Safety guard: "0 likes but isLiked=true? Remove it!" ❌
 * - This deleted the permanent liked state!
 * 
 * SOLUTION:
 * - Trust permanent storage as source of truth for button state
 * - Remove the aggressive safety guard
 * - Only prevent showing liked button when there's NO permanent storage entry
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
    console.log(`[LikeState] Loaded liked state for ${slug}: ${liked ? '✅ liked' : '❌ not liked'}`);
  }, [slug]);

  // Update optimistic count when server count OR delta changes
  useEffect(() => {
    const newDelta = getArticleDelta(slug);
    const newAdjustedLikes = Math.max(0, currentLikes + newDelta.delta);
    setOptimisticLikes(newAdjustedLikes);
  }, [currentLikes, slug]);

  // ❌ REMOVED: Aggressive safety guard that was deleting permanent liked state
  // The old guard was:
  // if (optimisticLikes === 0 && isLiked) {
  //   removeLikedArticle(slug); // ← This was deleting permanent state!
  // }
  //
  // Why it was wrong:
  // - After 60s, delta expires → optimisticLikes = currentLikes
  // - If server shows 0 (new article or cache delay), but user liked it
  // - Safety guard would delete the permanent liked state!
  //
  // NEW APPROACH:
  // - Trust permanent storage (liked_articles) as source of truth
  // - Don't second-guess it based on count
  // - Permanent storage is explicitly set by user action only

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