// frontend/src/main/components/SEO/metadata/ArticleMetadata.tsx
/**
 * Article Metadata Generation
 * 
 * Enhanced with:
 * - Optimized social sharing images (OG, Twitter, VK)
 * - Article-specific OpenGraph fields (tags, dates, author, section)
 * - Directus image transformations
 */

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { 
  buildMetadata, 
  createArticleSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { getSafeArticleDates } from '@/main/lib/utils/seoDateUtils';
import { getOptimizedImageUrl } from '@/main/lib/utils/imageOptimization';

export interface ArticleMetadataProps {
  dictionary: Dictionary;
  articleData: {
    title: string;
    seoTitle?: string;
    description?: string;
    seoDescription?: string;
    lead?: string;
    slug: string;
    rubricSlug: string;
    rubricName?: string;
    author: string;
    publishedAt: string;
    updatedAt: string | null;
    imageId?: string | null;
    tags?: string[];
  };
}

/**
 * Generate comprehensive metadata for individual article pages
 * with optimized social sharing images
 */
export const generateArticleMetadata = ({
  dictionary,
  articleData
}: ArticleMetadataProps): Metadata => {
  const { 
    title, 
    seoTitle, 
    description, 
    seoDescription, 
    lead, 
    slug, 
    rubricSlug,
    rubricName,
    author, 
    publishedAt, 
    updatedAt, 
    imageId, 
    tags = [] 
  } = articleData;

  // Handle dates safely
  const safeDates = getSafeArticleDates(publishedAt, updatedAt);

  // Use SEO title or fallback to regular title
  const finalTitle = seoTitle || title;

  // Use SEO description or fallback hierarchy
  const finalDescription = seoDescription || description || lead || 
    processTemplate(dictionary.content.templates.publishedIn, {
      rubric: rubricName || rubricSlug,
    });

  // Generate canonical URL
  const canonicalUrl = `${dictionary.seo.site.url}/ru/${rubricSlug}/${slug}`;

  // ENHANCED: Use optimized image for social sharing
  // Generates OG-optimized variant (1200x630, cover fit, quality 85)
  const finalImageUrl = imageId 
    ? getOptimizedImageUrl(imageId, 'og')
    : `${dictionary.seo.site.url}/og-default.jpg`;

  // Generate article tags for keywords
  const articleTags = tags.length > 0 
    ? tags.join(', ')
    : processTemplate(dictionary.sections.templates.itemInCollection, {
        item: dictionary.sections.labels.articles,
        collection: rubricName || rubricSlug,
      });

  // Build comprehensive keywords
  const keywords = [
    articleTags,
    rubricName || rubricSlug,
    author,
    dictionary.seo.keywords.articles,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  // ENHANCED: Create article SEO data with all OpenGraph fields
  const articleSEOData = createArticleSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    safeDates.publishedTime,    // publishedTime for og:article:published_time
    safeDates.modifiedTime,     // modifiedTime for og:article:modified_time
    author,                 // author for og:article:author
    rubricName || rubricSlug, // section for og:article:section
    tags,                   // tags for og:article:tag
    finalImageUrl          // Optimized OG image
  );

  // Validate SEO data
  if (!validateSEOData(articleSEOData)) {
    console.warn('SEO data validation failed for article:', slug);
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('Article SEO content validation warnings:', contentValidation.warnings);
  }

  // Build metadata with enhanced OpenGraph fields
  // The buildMetadata function automatically handles article-specific fields:
  // - og:type = "article"
  // - og:article:published_time
  // - og:article:modified_time
  // - og:article:author
  // - og:article:section
  // - og:article:tag (for each tag)
  return buildMetadata(articleSEOData);
};

/**
 * Generate metadata for article not found cases
 */
export const generateArticleNotFoundMetadata = (
  dictionary: Dictionary,
  articleSlug?: string
): Metadata => {
  const notFoundMeta = dictionary.metadata.notFound.article;
  
  return {
    title: processTemplate(dictionary.seo.templates.pageTitle, {
      title: notFoundMeta.title,
      siteName: dictionary.seo.site.name
    }),
    description: notFoundMeta.description,
    robots: {
      index: false,
      follow: true,
    },
  };
};

export default generateArticleMetadata;