// src/features/shared/CardCarousel/types.ts

import { Dictionary, Lang } from "@/config/i18n";

// Card data types
interface ArticleCardData {
  type: 'article';
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string;
  rubricSlug: string;
  formattedDate: string;
}

interface RubricCardData {
  type: 'rubric';
  slug: string;
  name: string;
  description?: string;
  iconSrc?: string;
  url: string;
  articleCount?: number;
}

interface AuthorCardData {
  type: 'author';
  slug: string;
  name: string;
  bio?: string;
  avatarSrc?: string;
  url: string;
}

type CardData = ArticleCardData | RubricCardData | AuthorCardData;

export interface CardCarouselProps {
  cards: CardData[];
  lang: Lang;
  dictionary: Dictionary;
  isLoading?: boolean;
}