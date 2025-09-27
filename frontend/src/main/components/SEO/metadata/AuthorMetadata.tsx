// src/main/components/SEO/metadata/AuthorMetadata.tsx
// Author-specific metadata generation following established patterns

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { validateSEOContent } from '@/main/lib/dictionary/helpers/validation';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';

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

  // Use SEO template for consistent title formatting
  const finalTitle = processTemplate(dictionary.seo.templates.pageTitle, {
    title: name,
    siteName: dictionary.seo.site.name,
  });

  // Generate description with fallback using dictionary templates
  let metaDescription: string;
  if (bio) {
    // Use author bio if available with site context
    const bioWithContext = `${bio} ${processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    })} на ${dictionary.seo.site.name}.`;
    metaDescription = bioWithContext;
  } else {
    // Use fallback description from dictionary
    const authorDescription = processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    });
    const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
    metaDescription = `${authorDescription} на ${dictionary.seo.site.name}. ${countInfo}`;
  }

  // Ensure description length is appropriate using template
  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  // Generate keywords using established pattern
  const authorKeywords = `${name}, автор`;
  const keywords = [
    authorKeywords,
    dictionary.seo.keywords.authors,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  // Generate canonical URL using established pattern
  const canonicalUrl = `${dictionary.seo.site.url}${path}`;

  // Generate Open Graph image URL (author avatar or default)
  const finalImageUrl = avatar 
    ? `${dictionary.seo.site.url}${avatar}` 
    : `${dictionary.seo.site.url}/og-author-default.jpg`;

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
    console.warn('SEO data validation failed for author:', slug);
  }

  // Validate content for SEO requirements
  const contentValidation = validateSEOContent({
    title: finalTitle,
    description: finalDescription,
    keywords,
  });

  if (!contentValidation.isValid) {
    console.warn('Author SEO content validation warnings:', contentValidation.warnings);
  }

  return buildMetadata(seoData);
};

/**
 * Generate metadata for author not found cases
 */
export const generateAuthorNotFoundMetadata = (
  dictionary: Dictionary,
  authorSlug?: string
): Metadata => {
  const notFoundMeta = dictionary.metadata.notFound.author;
  
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

export default generateAuthorMetadata;