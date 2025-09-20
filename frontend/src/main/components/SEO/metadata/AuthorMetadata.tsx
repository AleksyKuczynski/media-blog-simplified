// src/main/components/SEO/metadata/AuthorMetadata.tsx
// Author-specific metadata generation using new dictionary structure

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { 
  getPageTitle, 
  getMetaDescription, 
  getKeywords, 
  generateCanonicalUrl 
} from '@/main/lib/dictionary/helpers/seo';

export interface AuthorMetadataProps {
  dictionary: Dictionary;
  authorData: {
    name: string;
    slug: string;
    bio?: string;
    avatar?: string;
    articleCount: number;
    path: string;
    featured?: boolean;
  };
}

/**
 * Generate comprehensive metadata for individual author pages
 */
export const generateAuthorMetadata = async ({
  dictionary,
  authorData
}: AuthorMetadataProps): Promise<Metadata> => {
  const { name, slug, bio, avatar, articleCount, path, featured } = authorData;

  // Generate title using SEO helper function
  const title = getPageTitle(dictionary, name);

  // Generate description with fallback using dictionary templates
  let metaDescription: string;
  if (bio) {
    // Use author bio if available with site context
    metaDescription = `${bio} ${processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    })} на ${dictionary.seo.site.name}.`;
  } else {
    // Use fallback description from dictionary
    metaDescription = processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    }) + ` на ${dictionary.seo.site.name}. ` + processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
  }

  // Ensure description length is appropriate
  const finalDescription = getMetaDescription(dictionary, metaDescription);

  // Generate keywords using helper function
  const authorKeywords = `${name}, автор`;
  const keywords = getKeywords(dictionary, 'authors', authorKeywords);

  // Generate canonical URL using helper
  const canonicalUrl = generateCanonicalUrl(path, dictionary.seo.site.url);

  // Generate Open Graph image URL (author avatar or default)
  const imageUrl = avatar 
    ? `${dictionary.seo.site.url}/assets/${avatar}`
    : `${dictionary.seo.site.url}/og-author-${slug}.jpg`;
  
  // Validate SEO content
  const validation = validateSEOContent({
    title,
    description: finalDescription,
    keywords,
  });

  if (!validation.isValid) {
    console.warn('Author SEO validation warnings:', validation.warnings);
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
      type: 'profile',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} — автор на ${dictionary.seo.site.name}`,
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
      'author:name': name,
      'author:slug': slug,
      'author:articleCount': articleCount.toString(),
      'author:featured': featured?.toString() || 'false',
      'DC.type': 'Text.Author',
      'DC.language': 'ru',
      'geo.region': 'RU',
    },

    category: 'authors',
  };

  return metadata;
};

/**
 * Validation helper for author metadata
 */
export const validateAuthorMetadata = (
  metadata: Metadata, 
  authorData: AuthorMetadataProps['authorData']
): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Basic validation
  if (!metadata.title) errors.push('Author title is required');
  if (!metadata.description) errors.push('Author description is required');
  
  // Author-specific validation
  if (authorData.articleCount < 0) errors.push('Article count cannot be negative');
  if (!authorData.name.trim()) errors.push('Author name cannot be empty');
  if (!authorData.slug.trim()) errors.push('Author slug cannot be empty');
  
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

export default generateAuthorMetadata;