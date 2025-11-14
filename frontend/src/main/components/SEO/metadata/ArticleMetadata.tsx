// src/main/components/SEO/metadata/ArticleMetadata.tsx
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
    author: string;
    publishedAt: string;
    updatedAt: string | null;
    imageUrl?: string;
    tags?: string[];
  };
}

/**
 * FIXED: Made synchronous since dictionary is static
 * Generate comprehensive metadata for individual article pages
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
    author, 
    publishedAt, 
    updatedAt, 
    imageUrl, 
    tags = [] 
  } = articleData;

  // Handle dates safely
  const safeDates = getSafeArticleDates(publishedAt, updatedAt);

  // Use SEO title or fallback to regular title
  const finalTitle = seoTitle || title;

  // Use SEO description or fallback hierarchy
  const finalDescription = seoDescription || description || lead || 
    processTemplate(dictionary.content.templates.publishedIn, {
      rubric: rubricSlug,
    });

  // Generate canonical URL
  const canonicalUrl = `${dictionary.seo.site.url}/ru/${rubricSlug}/${slug}`;

  // Use provided image or fallback to default
  const finalImageUrl = imageUrl || `${dictionary.seo.site.url}/og-default.jpg`;

  // Generate article tags
  const articleTags = tags.length > 0 ? 
    tags : [rubricSlug, ...title.split(' ').slice(0, 3)];

  // Create SEO data using established pattern
  const seoData = createArticleSEOData(
    finalTitle,
    finalDescription,
    dictionary.seo.keywords.articles,
    canonicalUrl,
    safeDates.publishedTime,
    safeDates.modifiedTime,
    author,
    rubricSlug,
    articleTags,
    finalImageUrl
  );

  // Validate SEO data
  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for article:', slug);
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords: dictionary.seo.keywords.articles,
  });

  if (!contentValidation.isValid) {
    console.warn('Article SEO content validation warnings:', contentValidation.warnings);
  }

  return buildMetadata(seoData);
};

/**
 * Generate metadata for article not found cases (already synchronous)
 */
export const generateArticleNotFoundMetadata = (
  dictionary: Dictionary,
  rubricSlug?: string
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