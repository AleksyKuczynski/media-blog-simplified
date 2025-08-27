// src/main/components/ArticleCards/interfaces.ts - CLEANED UP
import { Lang } from "@/main/lib/dictionaries/dictionariesTypes";
import { ArticleCardType } from "@/main/lib/directus";

interface ImageProps {
  src: string;
  alt: string;
  aspectRatio: number;
}

interface BaseArticleCardProps {
  article: ArticleCardType;
  articleLink: string;
  dict: { common: { readMore: string } };
}

// ❌ REMOVED: Complex theme-dependent styling objects
// We now use inline classes directly in components

export interface ArticleCardProps {
  slug: string;
  lang: Lang;
  authorSlug?: string;
  rubricSlug?: string;
  layout?: ArticleCardType['layout'];
  // ❌ REMOVED: cardStyles?: CardStyles;
  // ❌ REMOVED: theme?: Theme;
}

export interface ArticleCardVariantProps extends BaseArticleCardProps {
  formattedDate: string;
  imageProps: ImageProps | null;
  layout: ArticleCardType['layout'];
  lang: string;
  // ❌ REMOVED: cardStyles?: CardStyles;
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