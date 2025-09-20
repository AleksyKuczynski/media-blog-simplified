// src/main/components/SEO/metadata/RubricMetadata.tsx
// FIXED: Updated imports and dictionary structure compatibility

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate, createSEOVariables } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { getPageTitle, getMetaDescription, getKeywords, generateCanonicalUrl } from '@/main/lib/dictionary/helpers/seo';

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
 * FIXED: Uses new dictionary structure and helper imports
 */
export const generateRubricMetadata = async ({
  dictionary,
  rubricData
}: RubricMetadataProps): Promise<Metadata> => {
  const { name, slug, description, articleCount, path, customKeywords, featured } = rubricData;

  // FIXED: Use helper functions from seo.ts instead of direct template access
  const title = getPageTitle(dictionary, name);

  // Generate description using dictionary structure
  let metaDescription: string;
  if (description) {
    // Use rubric description if available
    metaDescription = `${description} Читайте статьи в рубрике ${name} на ${dictionary.seo.site.name}.`;
  } else {
    // FIXED: Use sections description as fallback
    metaDescription = `${dictionary.sections.rubrics.categoriesDescription} Изучите рубрику ${name} на ${dictionary.seo.site.name}.`;
  }

  // Use helper to get final meta description
  const finalDescription = getMetaDescription(dictionary, metaDescription);

  // FIXED: Generate keywords using helper function
  const rubricKeywords = customKeywords || name;
  const keywords = getKeywords(dictionary, 'rubrics', rubricKeywords);

  // FIXED: Generate canonical URL using helper
  const canonicalUrl = generateCanonicalUrl(path, dictionary.seo.site.url);

  // Standard metadata structure
  const imageUrl = `${dictionary.seo.site.url}/og-rubric-${slug}.jpg`;
  
  // Validate SEO content
  const validation = validateSEOContent({
    title,
    description: finalDescription,
    keywords,
  });

  if (!validation.isValid) {
    console.warn('Rubric SEO validation warnings:', validation.warnings);
  }

  const metadata: Metadata = {
    title,
    description: finalDescription,
    keywords,
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ru': canonicalUrl,
        'ru-RU': canonicalUrl,
      },
    },

    openGraph: {
      title,
      description: finalDescription,
      url: canonicalUrl,
      siteName: dictionary.seo.site.name,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional metadata with proper types
    other: {
      'rubric:name': name,
      'rubric:slug': slug,
      'rubric:articleCount': articleCount.toString(),
      'rubric:featured': featured?.toString() || 'false',
      'DC.type': 'Text.Rubric',
      'DC.language': 'ru',
      'DC.coverage': dictionary.seo.regional.region,
      'geo.region': dictionary.seo.regional.region,
    },

    category: slug,
  };

  return metadata;
};

/**
 * Validation helper for rubric metadata
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
  
  // Content validation
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