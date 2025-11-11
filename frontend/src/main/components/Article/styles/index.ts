// src/main/components/Article/styles/index.ts
/**
 * Centralized Article styling exports
 * 
 * Import patterns:
 * 
 * // Full styles object
 * import { ARTICLE_STYLES } from '@/main/components/Article/styles';
 * <div className={ARTICLE_STYLES.layout.header.container} />
 * 
 * // Specific sections
 * import { ELEMENTS_STYLES, MEDIA_STYLES } from '@/main/components/Article/styles';
 * <p className={ELEMENTS_STYLES.paragraph.base} />
 * 
 * // Individual style groups
 * import { LAYOUT_STYLES } from '@/main/components/Article/styles';
 */

export {
  // Main combined export
  ARTICLE_STYLES,
  
  // Individual section exports (recommended for clarity)
  LAYOUT_STYLES,
  ELEMENTS_STYLES,
  MEDIA_STYLES,
  BLOCKS_STYLES,
  NAVIGATION_STYLES,
  WIDGETS_STYLES,
  
  // Type exports (for TypeScript users)
  type LayoutStyles,
  type ElementsStyles,
  type MediaStyles,
  type BlocksStyles,
  type NavigationStyles,
  type WidgetsStyles,
  type ArticleStyles,
} from './Article.styles';