// src/main/lib/utils/index.ts
export { createSearchUrl } from '@/features/search/common/createSearchUrl';
export { generateArticleLinkAsync } from '@/main/lib/utils/generateArticleLinkAsync';
export { generateArticleLink } from '@/main/lib/utils/generateArticleLink';
export { parseMarkdownImage } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/parseMarkdownImage';
export { smoothScrollTo } from '@/main/lib/utils/smoothScrollTo';
export { cn } from '@/main/lib/utils/utils';
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
