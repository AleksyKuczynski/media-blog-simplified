// frontend/src/main/components/SEO/metadata/ArticleMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { validateSEOContent } from '@/config/i18n/helpers/validation';
import { 
  buildMetadata, 
  createArticleSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { getSafeArticleDates } from '@/lib/utils/seoDateUtils';
import { getOptimizedImageUrl } from '@/lib/utils/imageOptimization';

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

  const safeDates = getSafeArticleDates(publishedAt, updatedAt);
  const finalTitle = seoTitle || title;
  const finalDescription = seoDescription || description || lead || 
    processTemplate(dictionary.content.templates.publishedIn, {
      rubric: rubricName || rubricSlug,
    });

  const canonicalUrl = `${dictionary.seo.site.url}/ru/${rubricSlug}/${slug}`;
  const finalImageUrl = imageId 
    ? getOptimizedImageUrl(imageId, 'og')
    : `${dictionary.seo.site.url}/og-default.jpg`;

  const baseKeywords = dictionary.seo.keywords.base;
  const rubricKeywords = dictionary.seo.keywords.articles;
  const tagKeywords = tags.length > 0 ? tags.slice(0, 5).join(', ') : '';
  
  const keywords = [
    finalTitle,
    rubricName || rubricSlug,
    tagKeywords,
    rubricKeywords,
    baseKeywords,
  ].filter(Boolean).join(', ');

  const seoData = createArticleSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    dictionary.locale,
    safeDates.publishedTime,
    safeDates.modifiedTime,
    author,
    rubricName || rubricSlug,
    tags,
    finalImageUrl
  );

  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for article:', slug);
  }

  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('Article SEO content validation warnings:', contentValidation.warnings);
  }

  return buildMetadata(seoData);
};

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