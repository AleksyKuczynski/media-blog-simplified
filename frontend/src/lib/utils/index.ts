// src/main/lib/utils/index.ts
export { generateArticleLinkAsync } from '@/lib/utils/generateArticleLinkAsync';
export { generateArticleLink } from '@/lib/utils/generateArticleLink';
export { smoothScrollTo } from '@/lib/utils/smoothScrollTo';
export { cn } from '@/lib/utils/utils';
export { validateArticleSlug } from './validateArticleSlug';
export { getClientIP } from './getClientIP';
export {
  getOptimizedImageUrl,
  getCustomOptimizedImageUrl,
  getSocialImageVariants,
  isValidAssetId,
  IMAGE_PRESETS,
  type ImagePreset,
  type ImageTransformOptions,
} from './imageOptimization';
