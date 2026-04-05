// frontend/src/shared/seo/metadata/RubricMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { validateSEOContent } from '@/config/i18n/helpers/validation';
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

export const generateRubricMetadata = async ({
  dictionary,
  rubricData
}: RubricMetadataProps): Promise<Metadata> => {
  const { name, slug, description, articleCount, path, customKeywords } = rubricData;

  const finalTitle = processTemplate(dictionary.seo.templates.pageTitle, {
    title: name,
    siteName: dictionary.seo.site.name,
  });

  let metaDescription: string;
  if (description) {
    metaDescription = `${description} ${processTemplate(dictionary.sections.templates.rubricArticlesOn, { rubric: name, siteName: dictionary.seo.site.name })}.`;
  } else {
    const rubricInfo = processTemplate(dictionary.sections.templates.exploreRubricOn, { rubric: name, siteName: dictionary.seo.site.name });
    const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
    metaDescription = `${rubricInfo}. ${countInfo}.`;
  }

  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  const rubricKeywords = customKeywords || name;
  const keywords = [
    rubricKeywords,
    dictionary.seo.keywords.rubrics,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  const canonicalUrl = `${dictionary.seo.site.url}${path}`;
  const finalImageUrl = `${dictionary.seo.site.url}/og-rubric-${slug}.jpg`;

  const seoData = createWebsiteSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    dictionary.locale,
    finalImageUrl
  );

  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for rubric:', slug);
  }

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
  
  if (!metadata.title) errors.push('Rubric title is required');
  if (!metadata.description) errors.push('Rubric description is required');
  
  if (rubricData.articleCount < 0) errors.push('Article count cannot be negative');
  if (!rubricData.name.trim()) errors.push('Rubric name cannot be empty');
  if (!rubricData.slug.trim()) errors.push('Rubric slug cannot be empty');
  
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