// frontend/src/main/lib/hooks/index.ts
export { useDebounce } from '@/main/lib/hooks/useDebounce';
export { useFocusInput } from '@/main/lib/hooks/useFocusInput';
export { useKeyboardNavigation } from '@/main/lib/hooks/useKeyboardNavigation';
export { useOutsideClick } from '@/main/lib/hooks/useOutsideClick';

export {
  useEngagement,
  type UseEngagementOptions,
  type UseEngagementReturn,
  type ShareMethod,
} from '@/app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useEngagement';

export {
  useViewTracking,
  type UseViewTrackingOptions,
  type UseViewTrackingReturn,
} from '@/app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useViewTracking';

export {
  useLikeState,
  type UseLikeStateOptions,
  type UseLikeStateReturn,
} from '@/app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useLikeState';

export {
  useShareState,
  type UseShareStateOptions,
  type UseShareStateReturn,
} from '@/app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useShareState';