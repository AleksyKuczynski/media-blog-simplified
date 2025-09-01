// src/main/lib/directus/interfaces.ts

export interface AuthorTranslation {
  languages_code: string;
  name: string;
  bio: string;
}

export interface Author {
  slug: string;
  avatar: string;
}

export interface AuthorDetails extends Author {
  name: string | '::EDITORIAL::'; // Holds the translated name
  bio: string; // Holds the translated bio
}

export interface RubricTranslation {
  languages_code: string;
  name: string;
}

export interface Rubric {
  slug: string;
  translations: RubricTranslation[];
  articleCount: number;
  articles?: ArticleCardType[];
  hasMore?: boolean;
}

export interface RubricBasic {
  slug: string;
  name: string; // Holds the translated name
}

export interface CategoryTranslation {
  categories_slug: string;
  languages_code: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string; // Holds the translated name
}

export interface PromotedArticle {
  article: string; // Stores the promoted article slug
}

export interface ArticleSlugInfo {
  slug: string;
  layout: 'regular' | 'advertising' | 'news';
}

export interface ArticleCardTranslation {
  languages_code: string;
  title: string;
  description: string;
}

export interface ArticleCardAuthor {
  name: string;
  slug: string;
}

export interface ArticleCardType {
  slug: string;
  status: string;
  layout: 'promoted' | 'latest' | 'regular' | 'advertising' | 'news';
  published_at: string;
  external_link: string | null;
  article_heading_img: string;
  rubric_slug: string;
  translations: ArticleCardTranslation[];
  authors: ArticleCardAuthor[];
  link: string;
}

export interface ArticleCarousel {
  id: string;
  '1_slide': string | null;
  '2_slide': string | null;
  '3_slide': string | null;
  '4_slide': string | null;
  '5_slide': string | null;
}

export interface ArticleTranslation {
  languages_code: string;
  title: string;
  description: string;
  lead: string;
  seo_title?: string;
  seo_description?: string;
  article_body: ArticleBlock[];
}

export interface ArticleBlockItem {
  id: string;
  content: string;
}

export interface ArticleBlock {
  collection: string;
  item: ArticleBlockItem;
}

export interface BlockMarkdown {
  id: string;
  content: string;
}

export interface FullArticle {
  slug: string;
  status: string;
  layout: 'regular' | 'promoted' | 'latest' | 'advertising' | 'news';
  published_at: string;
  updated_at: string | null;
  external_link: string | null;
  article_heading_img: string;
  rubric_slug: string;
  translations: ArticleTranslation[];
  authors: { name: string; slug: string }[];
  categories: Category[];
}

export interface SearchProposition { //  Results of search in translated titles and descriptions
  slug: string;
  title: string;
  description: string;
  rubric_slug: string;
  languages_code: string;
}

export interface Asset {
  id: string;
  width: number;
  height: number;
  type: string;
  filename: string;
  title: string;
}

