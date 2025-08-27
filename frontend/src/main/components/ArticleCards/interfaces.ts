// src/main/components/ArticleCards/interfaces.ts - IMPROVED IMAGE SUPPORT
import { Lang } from "@/main/lib/dictionaries/dictionariesTypes";
import { ArticleCardType } from "@/main/lib/directus";

// Enhanced ImageProps with proper Next.js Image support
export interface ImageProps {
  src: string;
  alt: string;
  aspectRatio: number;
  // Optional explicit dimensions - calculated from aspectRatio if not provided
  width?: number;
  height?: number;
}

interface BaseArticleCardProps {
  article: ArticleCardType;
  articleLink: string;
  dict: { common: { readMore: string } };
}

export interface ArticleCardProps {
  slug: string;
  lang: Lang;
  authorSlug?: string;
  rubricSlug?: string;
  layout?: ArticleCardType['layout'];
}

export interface ArticleCardVariantProps extends BaseArticleCardProps {
  formattedDate: string;
  imageProps: ImageProps | null;
  layout: ArticleCardType['layout'];
  lang: string;
}

export interface NewsCardProps extends BaseArticleCardProps {
  formattedDate: string;
}

export interface AdvertisingCardProps extends BaseArticleCardProps {}

export interface StandardCardProps extends BaseArticleCardProps {
  formattedDate: string;
  imageProps: ImageProps | null;
  layout: 'regular' | 'latest' | 'promoted';
  lang: string;
}

// Utility function to calculate image dimensions
export function getImageDimensions(imageProps: ImageProps, baseWidth: number = 600): {
  width: number;
  height: number;
} {
  if (imageProps.width && imageProps.height) {
    return { width: imageProps.width, height: imageProps.height };
  }
  
  const width = baseWidth;
  const height = Math.round(width / imageProps.aspectRatio);
  
  return { width, height };
}