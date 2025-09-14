// src/main/components/SEO/metadata/CollectionMetadata.tsx
// Collection-specific metadata generation for pages like /rubrics, /authors

import { Metadata } from 'next';
import { Dictionary, SEOPageType } from '@/main/lib/dictionary/types';
import { processTemplate, createSEOVariables } from '@/main/lib/dictionary/helpers';

export interface CollectionMetadataProps {
  dictionary: Dictionary;
  collectionType: 'rubrics' | 'authors' | 'articles';
  collectionData: {
    totalCount: number;
    featured?: Array<{
      name: string;
      slug: string;
      description?: string;
    }>;
    path: string;
    customTitle?: string;
    customDescription?: string;
    customKeywords?: string;
  };
}

/**
 * Generate comprehensive metadata for collection pages
 * Optimized for Russian market with Google and Yandex SEO
 */
export const generateCollectionMetadata = async ({
  dictionary,
  collectionType,
  collectionData
}: CollectionMetadataProps): Promise<Metadata> => {
  const { seo, sections, common } = dictionary;
  const { totalCount, featured, path, customTitle, customDescription, customKeywords } = collectionData;

  // Create template variables for processing
  const variables = createSEOVariables({
    siteName: seo.site.name,
    totalCount: totalCount.toString(),
  });

  // Determine titles and descriptions based on collection type
  let title: string;
  let description: string; 
  let keywords: string;

  switch (collectionType) {
    case 'rubrics':
      title = customTitle || processTemplate(seo.titles.rubricsList, variables);
      description = customDescription || processTemplate(seo.descriptions.rubricsList, variables);
      keywords = customKeywords || `${seo.keywords.rubricsList}, ${seo.keywords.general}`;
      break;

    case 'authors':
      title = customTitle || `${sections.authors.allAuthors} — ${seo.site.name}`;
      description = customDescription || `Все авторы ${seo.site.name}. Познакомьтесь с нашими экспертами и журналистами, пишущими о культурных событиях и современных идеях.`;
      keywords = customKeywords || `${seo.keywords.authors}, ${seo.keywords.general}`;
      break;

    case 'articles':
      title = customTitle || `${sections.articles.allArticles} — ${seo.site.name}`;
      description = customDescription || `Все статьи ${seo.site.name} о культурных событиях, музыке и современных идеях. Читайте актуальные материалы наших авторов.`;
      keywords = customKeywords || `${seo.keywords.articles}, ${seo.keywords.general}`;
      break;

    default:
      title = `${seo.site.name}`;
      description = seo.site.description;
      keywords = seo.keywords.general;
  }

  // Generate canonical URL
  const canonicalUrl = `${seo.site.url}${path.startsWith('/') ? path : `/${path}`}`;

  // Create Open Graph data optimized for Russian social networks
  const openGraphData = {
    title,
    description,
    url: canonicalUrl,
    siteName: seo.site.name,
    locale: 'ru_RU',
    type: 'website' as const,
    images: [
      {
        url: `${seo.site.url}/og-${collectionType}.jpg`,
        width: 1200,
        height: 630,
        alt: `${title} — ${seo.site.name}`,
      },
    ],
  };

  // Enhanced Twitter Card for better social sharing
  const twitterData = {
    card: 'summary_large_image' as const,
    title,
    description,
    images: [`${seo.site.url}/twitter-${collectionType}.jpg`],
    site: '@eventforme',
    creator: '@eventforme',
  };

  // Additional meta tags for Russian search engines and social networks
  const additionalMetaTags = [
    // Yandex specific
    { name: 'yandex-verification', content: process.env.YANDEX_VERIFICATION || '' },
    
    // Russian social networks
    { property: 'vk:card', content: 'summary_large_image' },
    { property: 'vk:title', content: title },
    { property: 'vk:description', content: description },
    
    // Geographic targeting
    { name: 'geo.region', content: 'RU' },
    { name: 'geo.placename', content: 'Russia' },
    { name: 'ICBM', content: '55.751244, 37.618423' }, // Moscow coordinates
    
    // Content classification
    { name: 'content-language', content: 'ru' },
    { name: 'audience', content: 'all' },
    { name: 'rating', content: 'general' },
    
    // Publisher information
    { name: 'publisher', content: seo.site.name },
    { name: 'author', content: seo.site.name },
    
    // Collection-specific metadata
    { name: 'collection-type', content: collectionType },
    { name: 'collection-count', content: totalCount.toString() },
  ];

  return {
    title,
    description,
    keywords,
    
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

    category: collectionType,
  };
};

/**
 * Validation helper for collection metadata
 * Uses centralized validation helpers
 */
export const validateCollectionMetadata = (metadata: Metadata): boolean => {
  // Use existing validation helpers instead of duplicating logic
  return Boolean(metadata.title && metadata.description);
};

export default generateCollectionMetadata;