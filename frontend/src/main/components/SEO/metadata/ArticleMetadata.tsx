// frontend/src/main/components/SEO/metadata/ArticleMetadata.tsx
/**
 * Article Metadata Generation with Enhanced Debugging
 * 
 * Enhanced with:
 * - Optimized social sharing images (OG, Twitter, VK)
 * - Article-specific OpenGraph fields (tags, dates, author, section)
 * - Directus image transformations
 * - DEBUGGING: Comprehensive logging for troubleshooting
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

  // 🐛 DEBUG: Log image ID
  console.log('=== Article Metadata Generation ===');
  console.log('Article:', slug);
  console.log('Image ID received:', imageId);
  console.log('Image ID type:', typeof imageId);
  console.log('Image ID is falsy?', !imageId);

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

  // 🐛 DEBUG: Log final image URL
  console.log('Final image URL:', finalImageUrl);
  console.log('Using fallback image?', !imageId);
  console.log('SITE_URL:', dictionary.seo.site.url);

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

  // 🐛 DEBUG: Log SEO data
  console.log('SEO Data created:');
  console.log('- Title:', articleSEOData.title);
  console.log('- Image URL:', articleSEOData.imageUrl);
  console.log('- Type:', articleSEOData.type);

  // Validate SEO data
  if (!validateSEOData(articleSEOData)) {
    console.warn('⚠️ SEO data validation failed for article:', slug);
  } else {
    console.log('✅ SEO data validation passed');
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('⚠️ Article SEO content validation warnings:', contentValidation.warnings);
  } else {
    console.log('✅ Content validation passed');
  }

  // Build metadata with enhanced OpenGraph fields
  const metadata = buildMetadata(articleSEOData);

  // 🐛 DEBUG: Log final metadata (avoid type issues)
  console.log('Final metadata:');
  console.log('- Has OpenGraph?', !!metadata.openGraph);
  console.log('- Has Twitter?', !!metadata.twitter);
  if (metadata.openGraph?.images) {
    const images = metadata.openGraph.images;
    console.log('- OpenGraph images:', Array.isArray(images) ? `Array(${images.length})` : 'Single image');
  }
  if (metadata.twitter?.images) {
    const images = metadata.twitter.images;
    console.log('- Twitter images:', Array.isArray(images) ? `Array(${images.length})` : 'Single image');
  }
  console.log('====================================\n');

  return metadata;
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