// frontend/src/shared/seo/core/MetadataBuilder.tsx
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
      languages: {
        'ru': seoData.canonicalUrl.replace(/\/(en|ru)\//, '/ru/'),
        'en': seoData.canonicalUrl.replace(/\/(en|ru)\//, '/en/'),
        'x-default': seoData.canonicalUrl.replace(/\/(en|ru)\//, '/ru/'),
      },
    },

    openGraph: {
      // Use OG overrides if available, otherwise use main title/description
      title: (seoData.type === 'article' && (seoData as ArticleSEOData).ogTitle) 
        ? (seoData as ArticleSEOData).ogTitle! 
        : seoData.title,
      description: (seoData.type === 'article' && (seoData as ArticleSEOData).ogDescription)
        ? (seoData as ArticleSEOData).ogDescription!
        : seoData.description,
      url: seoData.canonicalUrl,
      siteName: seoData.siteName,
      locale: seoData.locale || 'en_US',
      type: seoData.type === 'article' ? 'article' : 'website',
      images: seoData.imageUrl ? [
        {
          url: seoData.imageUrl,
          width: 1200,
          height: 630,
          alt: (seoData.type === 'article' && (seoData as ArticleSEOData).imageAlt)
            ? (seoData as ArticleSEOData).imageAlt!
            : seoData.title,
        },
      ] : [],
    },

    twitter: {
      card: 'summary_large_image',
      // Twitter can use same OG overrides
      title: (seoData.type === 'article' && (seoData as ArticleSEOData).ogTitle)
        ? (seoData as ArticleSEOData).ogTitle!
        : seoData.title,
      description: (seoData.type === 'article' && (seoData as ArticleSEOData).ogDescription)
        ? (seoData as ArticleSEOData).ogDescription!
        : seoData.description,
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
    
    // Add content metrics if available - ENHANCED
    if (articleData.wordCount) {
      otherMetadata['article:word_count'] = articleData.wordCount.toString();
    }
    if (articleData.readingTime) {
      otherMetadata['article:reading_time'] = articleData.readingTime.toString();
    }
    if (articleData.focusKeyword) {
      otherMetadata['article:focus_keyword'] = articleData.focusKeyword;
    }
    
    // Yandex-specific meta description
    if (articleData.yandexDescription) {
      otherMetadata['yandex:description'] = articleData.yandexDescription;
    }
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
  imageUrl?: string,
  
  // OG overrides - ENHANCED
  ogTitle?: string,
  ogDescription?: string,
  imageAlt?: string,
  
  // Content metrics - ENHANCED
  wordCount?: number,
  readingTime?: number,
  focusKeyword?: string,
  yandexDescription?: string
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
  
  // OG overrides
  ogTitle,
  ogDescription,
  imageAlt,
  
  // Content metrics
  wordCount,
  readingTime,
  focusKeyword,
  yandexDescription,
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