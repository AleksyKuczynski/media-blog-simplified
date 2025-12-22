// frontend/src/shared/seo/metadata/ArticleMetadata.tsx

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
    // Basic fields
    title: string;
    description?: string;
    lead?: string;
    slug: string;
    rubricSlug: string;
    rubricName?: string;
    author: string;
    publishedAt: string;
    updatedAt: string | null;
    imageId?: string | null;
    imageAlt?: string;
    tags?: string[];
    
    // SEO fields
    seoTitle?: string;
    seoDescription?: string;
    ogTitle?: string;           
    ogDescription?: string;     
    focusKeyword?: string;      
    metaKeywords?: string;      
    yandexDescription?: string; 
    
    // Content metrics
    readingTime?: number;       
    wordCount?: number;         
  };
}

export const generateArticleMetadata = ({
  dictionary,
  articleData
}: ArticleMetadataProps): Metadata => {
  const { 
    title, 
    description, 
    lead, 
    slug, 
    rubricSlug,
    rubricName,
    author, 
    publishedAt, 
    updatedAt, 
    imageId,
    imageAlt,
    tags = [],
    
    // SEO fields
    seoTitle,
    seoDescription,
    ogTitle,
    ogDescription,
    focusKeyword,
    metaKeywords,
    yandexDescription,
    
    // Content metrics
    readingTime,
    wordCount,
  } = articleData;

  const safeDates = getSafeArticleDates(publishedAt, updatedAt);
  
  // Title hierarchy: seo_title > title
  const finalTitle = seoTitle || title;
  
  // Description hierarchy: seo_description > description > lead
  const finalDescription = seoDescription || description || lead || 
    processTemplate(dictionary.content.templates.publishedIn, {
      rubric: rubricName || rubricSlug,
    });

  // OpenGraph overrides (different from meta title/description)
  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;

  const canonicalUrl = `${dictionary.seo.site.url}/ru/${rubricSlug}/${slug}`;
  const finalImageUrl = imageId 
    ? getOptimizedImageUrl(imageId, 'og')
    : `${dictionary.seo.site.url}/og-default.jpg`;

  // Keywords hierarchy: meta_keywords > focus_keyword > generated
  let keywords: string;
  if (metaKeywords) {
    // Use custom meta_keywords as-is
    keywords = metaKeywords;
  } else {
    // Generate keywords from available data
    const baseKeywords = dictionary.seo.keywords.base;
    const rubricKeywords = dictionary.seo.keywords.articles;
    const tagKeywords = tags.length > 0 ? tags.slice(0, 5).join(', ') : '';
    
    const keywordParts = [
      focusKeyword,              // Priority: focus keyword first
      finalTitle,
      rubricName || rubricSlug,
      tagKeywords,
      rubricKeywords,
      baseKeywords,
    ].filter(Boolean);
    
    keywords = keywordParts.join(', ');
  }

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
    finalImageUrl,
    
    // Add OG overrides - ENHANCED
    finalOgTitle !== finalTitle ? finalOgTitle : undefined,
    finalOgDescription !== finalDescription ? finalOgDescription : undefined,
    imageAlt,
    
    // Add content metrics - ENHANCED
    wordCount,
    readingTime,
    focusKeyword,
    yandexDescription
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