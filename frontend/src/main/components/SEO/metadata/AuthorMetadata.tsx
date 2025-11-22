// frontend/src/main/components/SEO/metadata/AuthorMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary';
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
  if (bio) {
    metaDescription = `${bio} Статьи автора ${name} на ${dictionary.seo.site.name}.`;
  } else {
    const countInfo = processTemplate(dictionary.sections.templates.totalCount, {
      count: articleCount.toString(),
      countLabel: dictionary.common.count.articles,
    });
    metaDescription = `Статьи автора ${name} на ${dictionary.seo.site.name}. ${countInfo}`;
  }

  const finalDescription = processTemplate(dictionary.seo.templates.metaDescription, {
    description: metaDescription,
    siteName: dictionary.seo.site.name,
  });

  const authorKeywords = `${name}, автор`;
  const keywords = [
    authorKeywords,
    dictionary.seo.keywords.authors,
    dictionary.seo.keywords.base
  ].filter(Boolean).join(', ');

  const canonicalUrl = `${dictionary.seo.site.url}${path}`;

  const finalImageUrl = avatar 
    ? `${dictionary.seo.site.url}${avatar}` 
    : `${dictionary.seo.site.url}/og-author-default.jpg`;

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