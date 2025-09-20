// src/main/components/SEO/metadata/RubricMetadata.tsx
// Rubric-specific metadata generation for individual rubric pages like /music, /culture

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { createSEOVariables, processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';

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
 * Optimized for Russian market with semantic keywords and descriptions
 */
export const generateRubricMetadata = async ({
  dictionary,
  rubricData
}: RubricMetadataProps): Promise<Metadata> => {
  const { seo, sections, common } = dictionary;
  const { name, slug, description, articleCount, path, customKeywords, featured } = rubricData;

  // Create template variables for processing
  const variables = createSEOVariables({
    siteName: seo.site.name,
    rubric: name,
    articleCount: articleCount.toString(),
  });

  // Generate title using template
  const title = processTemplate(seo.titles.rubricTemplate, variables);

  // Generate description using template with fallback
  let metaDescription: string;
  if (description) {
    // Use rubric description if available
    metaDescription = `${description} Читайте статьи в рубрике ${name} на ${seo.site.name}.`;
  } else {
    // Use template
    metaDescription = processTemplate(seo.descriptions.rubricTemplate, variables);
  }

  // Generate canonical URL
  const canonicalUrl = `${seo.site.url}${path.startsWith('/') ? path : `/${path}`}`;

  // Standard metadata structure
  const imageUrl = `${dictionary.seo.site.url}/og-rubric-${slug}.jpg`;
  
  const openGraphData = {
    title,
    description: metaDescription,
    url: canonicalUrl,
    siteName: dictionary.seo.site.name,
    locale: 'ru_RU',
    type: 'website' as const,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    article: {
      section: name,
      tag: [name, 'рубрика', 'культурные события'],
    },
  };

  const twitterData = {
    card: 'summary_large_image' as const,
    title,
    description: metaDescription,
    images: [imageUrl],
  };

  return {
    title,
    description: metaDescription,
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ru': canonicalUrl,
        'ru-RU': canonicalUrl,
      },
    },

    openGraph: openGraphData,
    twitter: twitterData,

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

    category: slug,
  };
};

/**
 * Validation helper for rubric metadata
 * Uses centralized validation instead of duplicating logic
 */
export const validateRubricMetadata = (
  metadata: Metadata, 
  rubricData: RubricMetadataProps['rubricData']
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  // Use centralized validation helper
  return validateSEOContent({
    title: metadata.title || '',
    description: metadata.description || '',
    keywords: metadata.keywords || '',
    pageType: 'rubric',
  });
};

export default generateRubricMetadata;