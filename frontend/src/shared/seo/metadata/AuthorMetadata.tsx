// frontend/src/shared/seo/metadata/AuthorMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { validateSEOContent } from '@/config/i18n/helpers/validation';
import { 
  buildMetadata, 
  createWebsiteSEOData,
  validateSEOData 
} from '../core/MetadataBuilder';
import { DIRECTUS_ASSETS_URL } from '@/api/directus';

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

export const generateAuthorMetadata = async ({
  dictionary,
  authorData
}: AuthorMetadataProps): Promise<Metadata> => {
  const { name, slug, bio, avatar, articleCount, path } = authorData;

  const finalTitle = processTemplate(dictionary.seo.templates.pageTitle, {
    title: name,
    siteName: dictionary.seo.site.name,
  });

  let metaDescription: string;
  const authorArticlesOn = processTemplate(dictionary.sections.templates.authorArticlesOn, {
    author: name,
    siteName: dictionary.seo.site.name,
  });
  if (bio) {
    metaDescription = `${bio} ${authorArticlesOn}.`;
  } else {
    const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
    metaDescription = `${authorArticlesOn}. ${countInfo}`;
  }

  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  const authorKeywords = `${name}, ${dictionary.sections.labels.author}`;
  const keywords = [
    authorKeywords,
    dictionary.seo.keywords.authors,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  const canonicalUrl = `${dictionary.seo.site.url}${path}`;

  const finalImageUrl = avatar 
    ? `${DIRECTUS_ASSETS_URL}/assets/${avatar}` 
    : `${DIRECTUS_ASSETS_URL}/assets/og-author-default.jpg`;

  const seoData = createWebsiteSEOData(
    finalTitle,
    finalDescription,
    keywords,
    canonicalUrl,
    dictionary.locale,
    finalImageUrl
  );

  if (!validateSEOData(seoData)) {
    console.warn('SEO data validation failed for author:', slug);
  }

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