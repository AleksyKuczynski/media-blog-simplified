// src/main/components/ArticleCards/interfaces.ts
// MIGRATED: Clean interfaces using new dictionary system
import { Dictionary, Lang } from "@/config/i18n";
import { ArticleCardType, ArticleSlugInfo } from "@/api/directus";

// Enhanced ImageProps with proper Next.js Image support
export interface ImageProps {
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio: number;
  // Optional explicit dimensions - calculated from aspectRatio if not provided
  readonly width?: number;
  readonly height?: number;
}

export interface ArticleListProps {
  readonly slugInfos: ArticleSlugInfo[];
  readonly lang: Lang;
  readonly dictionary: Dictionary;
  readonly authorSlug?: string;
  readonly categorySlug?: string;
  readonly rubricSlug?: string;
  readonly className?: string;
  readonly ariaLabel?: string;
  readonly errorMessage?: string;
  readonly fromContext?: string;
}

interface BaseArticleCardProps {
  readonly article: ArticleCardType;
  readonly articleLink: string;
  readonly dictionary: Dictionary;
  readonly lang: Lang;
}

export interface ArticleCardProps {
  readonly slug: string;
  readonly lang: Lang;
  readonly authorSlug?: string;
  readonly rubricSlug?: string;
  readonly layout?: ArticleCardType['layout'];
  readonly dictionary: Dictionary;
  readonly fromContext?: string;
}

export interface ArticleCardVariantProps extends BaseArticleCardProps {
  readonly formattedDate: string;
  readonly imageProps: ImageProps | null;
  readonly layout: ArticleCardType['layout'];
  readonly fromContext?: string;
}

export interface NewsCardProps extends BaseArticleCardProps {
  readonly formattedDate: string;
  readonly fromContext?: string;
}

export interface AdvertisingCardProps extends BaseArticleCardProps {
  readonly fromContext?: string;
}

export interface StandardCardProps extends BaseArticleCardProps {
  readonly formattedDate: string;
  readonly imageProps: ImageProps | null;
  readonly layout: 'regular' | 'latest' | 'promoted';
  readonly fromContext?: string;
}

export interface StandardCardSkeletonProps {
  layout?: 'regular' | 'promoted' | 'latest';
  showImage?: boolean;
  className?: string;
  readonly fromContext?: string;
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