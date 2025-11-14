// src/main/components/SEO/metadata/RubricMetadata.tsx
// Rubric-specific metadata generation following established patterns

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';

export interface RubricMetadataProps {
  dictionary: Dictionary;
  rubricData: {
    name: string;
    slug: string;
    description?: string;
    articleCount: number;
    path: string;
    customKeywords?: string;
    featured?: boolean;
  };
}

/**
 * Generate comprehensive metadata for individual rubric pages
 */
export const generateRubricMetadata = async ({
  dictionary,
  rubricData
}: RubricMetadataProps): Promise<Metadata> => {
  const { name, slug, description, articleCount, path, customKeywords, featured } = rubricData;

  // Use SEO template for consistent title formatting
  const finalTitle = processTemplate(dictionary.seo.templates.pageTitle, {
    title: name,
    siteName: dictionary.seo.site.name,
  });

  // Generate description with fallback using dictionary templates
  let metaDescription: string;
  if (description) {
    // Use rubric description if available with site context
    metaDescription = `${description} Читайте статьи в рубрике ${name} на ${dictionary.seo.site.name}.`;
  } else {
    // Use fallback description from dictionary templates
    const rubricInfo = `Изучите рубрику ${name} на ${dictionary.seo.site.name}`;
    const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
    metaDescription = `${rubricInfo}. ${countInfo}.`;
  }

  // Ensure description length is appropriate using template
  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  // Generate keywords using established pattern
  const rubricKeywords = customKeywords || name;
  const keywords = [
    rubricKeywords,
    dictionary.seo.keywords.rubrics,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  // Generate canonical URL using established pattern
  const canonicalUrl = `${dictionary.seo.site.url}${path}`;

  // Generate Open Graph image URL
  const finalImageUrl = `${dictionary.seo.site.url}/og-rubric-${slug}.jpg`;

  // Create SEO data using established pattern
  const seoData = createWebsiteSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    finalImageUrl
  );

  // Validate SEO data
  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for rubric:', slug);
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('Rubric SEO content validation warnings:', contentValidation.warnings);
  }

  return buildMetadata(seoData);
};

/**
 * Generate metadata for rubric not found cases
 */
export const generateRubricNotFoundMetadata = (
  dictionary: Dictionary,
  rubricSlug?: string
): Metadata => {
  const notFoundMeta = dictionary.metadata.notFound.rubric;
  
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

/**
 * Validation helper for rubric metadata following established pattern
 */
export const validateRubricMetadata = (
  metadata: Metadata, 
  rubricData: RubricMetadataProps['rubricData']
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Basic validation
  if (!metadata.title) errors.push('Rubric title is required');
  if (!metadata.description) errors.push('Rubric description is required');
  
  // Rubric-specific validation
  if (rubricData.articleCount < 0) errors.push('Article count cannot be negative');
  if (!rubricData.name.trim()) errors.push('Rubric name cannot be empty');
  if (!rubricData.slug.trim()) errors.push('Rubric slug cannot be empty');
  
  // Content validation using established pattern
  const contentValidation = validateSEOContent({
    title: metadata.title as string,
    description: metadata.description as string,
    keywords: metadata.keywords as string,
  });
  
  warnings.push(...contentValidation.warnings);
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export default generateRubricMetadata;