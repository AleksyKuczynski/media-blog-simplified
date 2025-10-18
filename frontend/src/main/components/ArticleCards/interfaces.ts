// src/main/components/ArticleCards/interfaces.ts
// MIGRATED: Clean interfaces using new dictionary system
import { Dictionary, Lang } from "@/main/lib/dictionary/types";
import { ArticleCardType } from "@/main/lib/directus";

// Enhanced ImageProps with proper Next.js Image support
export interface ImageProps {
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio: number;
  // Optional explicit dimensions - calculated from aspectRatio if not provided
  readonly width?: number;
  readonly height?: number;
}

// MIGRATED: Base props now use full dictionary
interface BaseArticleCardProps {
  readonly article: ArticleCardType;
  readonly articleLink: string;
  readonly dictionary: Dictionary; // MIGRATED: Full dictionary instead of dict.common
  readonly lang: Lang;
}

export interface ArticleCardProps {
  readonly slug: string;
  readonly lang: Lang;
  readonly authorSlug?: string;
  readonly rubricSlug?: string;
  readonly layout?: ArticleCardType['layout'];
  readonly dictionary: Dictionary; // MIGRATED: Now properly used
}

export interface ArticleCardVariantProps extends BaseArticleCardProps {
  readonly formattedDate: string;
  readonly imageProps: ImageProps | null;
  readonly layout: ArticleCardType['layout'];
}

export interface NewsCardProps extends BaseArticleCardProps {
  readonly formattedDate: string;
}

export interface AdvertisingCardProps extends BaseArticleCardProps {}

export interface StandardCardProps extends BaseArticleCardProps {
  readonly formattedDate: string;
  readonly imageProps: ImageProps | null;
  readonly layout: 'regular' | 'latest' | 'promoted';
}

export interface StandardCardSkeletonProps {
  layout?: 'regular' | 'promoted' | 'latest';
  showImage?: boolean;
  className?: string;
}

export interface ArticleCardSkeletonVariantProps {
  layout?: string;
  showImage?: boolean;
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