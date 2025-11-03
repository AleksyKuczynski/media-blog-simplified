// frontend/src/main/lib/hooks/index.ts
export { useDebounce } from '@/main/lib/hooks/useDebounce';
export { useFocusInput } from '@/main/lib/hooks/useFocusInput';
export { useKeyboardNavigation } from '@/main/lib/hooks/useKeyboardNavigation';
export { useOutsideClick } from '@/main/lib/hooks/useOutsideClick';

export {
  useEngagement,
  type UseEngagementOptions,
  type UseEngagementReturn,
} from '@/main/lib/hooks/useEngagement';

export {
  useViewTracking,
  type UseViewTrackingOptions,
  type UseViewTrackingReturn,
} from '@/main/lib/hooks/useViewTracking';

export {
  useLikeState,
  type UseLikeStateOptions,
  type UseLikeStateReturn,
} from '@/main/lib/hooks/useLikeState';

// NEW: Share state hook
export {
  useShareState,
  type UseShareStateOptions,
  type UseShareStateReturn,
} from '@/main/lib/hooks/useShareState';