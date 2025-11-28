// frontend/src/main/components/SEO/core/MetadataBuilder.tsx
import { Metadata } from 'next';
import { 
  SEOData, 
  ArticleSEOData, 
  WebsiteSEOData, 
  CollectionSEOData 
} from './types';

export const buildMetadata = (seoData: SEOData): Metadata => {
  const baseMetadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,

    alternates: {
      canonical: seoData.canonicalUrl,
    },

    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonicalUrl,
      siteName: seoData.siteName,
      locale: seoData.locale || 'en_US',
      type: seoData.type === 'article' ? 'article' : 'website',
      images: seoData.imageUrl ? [
        {
          url: seoData.imageUrl,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ] : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.imageUrl ? [seoData.imageUrl] : [],
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
  };

  const langCode = (seoData.locale || 'en_US').split('_')[0];
  const otherMetadata: Record<string, string | number> = {
    'DC.language': langCode,
    'DC.coverage': langCode === 'ru' ? 'Russia' : 'Europe',
    'geo.region': langCode === 'ru' ? 'RU' : 'EU',
    'geo.placename': langCode === 'ru' ? 'Russia' : 'Europe',
  };

  if (seoData.type === 'article') {
    const articleData = seoData as ArticleSEOData;
    
    otherMetadata['article:author'] = articleData.author;
    otherMetadata['article:section'] = articleData.section;
    otherMetadata['article:published_time'] = articleData.publishedTime;
    otherMetadata['article:modified_time'] = articleData.modifiedTime;
    otherMetadata['article:tag'] = articleData.tags.join(', ');
    otherMetadata['DC.type'] = 'Text.Article';
  }
  else if (seoData.type === 'collection') {
    const collectionData = seoData as CollectionSEOData;
    
    otherMetadata['DC.type'] = 'Text.Collection';
    otherMetadata['collection:type'] = collectionData.collectionType;
    otherMetadata['collection:itemCount'] = collectionData.itemCount.toString();
    otherMetadata['collection:language'] = langCode;
  }

  baseMetadata.other = otherMetadata;

  return baseMetadata;
};

export const createWebsiteSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  locale: string,
  imageUrl?: string
): WebsiteSEOData => ({
  type: 'website',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale,
  siteName: 'EventForMe',
});

export const createArticleSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  locale: string,
  publishedTime: string,
  modifiedTime: string,
  author: string,
  section: string,
  tags: readonly string[],
  imageUrl?: string
): ArticleSEOData => ({
  type: 'article',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale,
  siteName: 'EventForMe',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
});

export const createCollectionSEOData = (
  title: string,
  description: string,
  keywords: string,
  canonicalUrl: string,
  locale: string,
  collectionType: string,
  itemCount: number,
  imageUrl?: string
): CollectionSEOData => ({
  type: 'collection',
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  locale,
  siteName: 'EventForMe',
  collectionType,
  itemCount,
});

export const validateSEOData = (seoData: SEOData): boolean => {
  if (!seoData.title || !seoData.description) {
    console.warn('SEO data missing required fields');
    return false;
  }
  
  if (!seoData.canonicalUrl) {
    console.warn('SEO data missing canonical URL');
    return false;
  }

  if (seoData.title.length > 60) {
    console.warn('SEO title too long (>60 chars):', seoData.title.length);
  }

  if (seoData.description.length > 160) {
    console.warn('SEO description too long (>160 chars):', seoData.description.length);
  }

  return true;
};

export const MetadataBuilder = {
  build: buildMetadata,
  validate: validateSEOData,
  generate: (seoData: SEOData): Metadata => {
    if (!validateSEOData(seoData)) {
      console.warn('SEO data validation failed, proceeding with available data');
    }
    return buildMetadata(seoData);
  },
};

export const generateMetadata = (seoData: SEOData): Metadata => {
  return MetadataBuilder.generate(seoData);
};

export default MetadataBuilder;