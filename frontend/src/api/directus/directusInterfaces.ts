// src/api/directus/interfaces.ts

export interface ArticleBlockItem {
  id: string;
  content: string;
}

export interface ArticleBlock {
  collection: string;
  item: ArticleBlockItem;
}

export interface ArticleCardAuthor {
  name: string;
  slug: string;
}

export interface ArticleCardTranslation {
  languages_code: string;
  title: string;
  description: string;
  local_slug?: string;
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

export interface ArticleRubric {
  slug: string;
  nav_icon?: string;
}

export interface ArticleSlugInfo {
  slug: string;
  layout: 'regular' | 'advertising' | 'news';
}

export interface ArticleTranslation {
  languages_code: string;
  title: string;
  description: string;
  lead: string;
  article_body: ArticleBlock[];
  
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  og_title?: string;
  og_description?: string;
  focus_keyword?: string;
  meta_keywords?: string;
  yandex_description?: string;
  
  // Content metrics
  reading_time?: number;
  word_count?: number;
  excerpt?: string;
  
  local_slug?: string;
}

export interface Author {
  slug: string;
  avatar: string;
  
  // Social profiles
  telegram_url?: string;
  // Add these if/when you add them to Directus:
  // twitter_url?: string;
  // linkedin_url?: string;
  // vk_url?: string;
}

export interface AuthorDetails extends Author {
  name: string | '::EDITORIAL::';
  bio: string;
  
  // Enhanced fields - ADDED
  credentials?: string;
  expertise_areas?: string;
  meta_description?: string;
}

export interface AuthorTranslation {
  languages_code: string;
  name: string;
  bio: string;
  
  // Enhanced fields
  credentials?: string;
  expertise_areas?: string;
  meta_description?: string;
}

export interface BlockMarkdown {
  id: string;
  content: string;
}

export interface RubricTranslation {
  languages_code: string;
  name: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  yandex_description?: string;
  focus_keyword?: string;
}

export interface Rubric {
  slug: string;
  nav_icon?: string;
  translations: RubricTranslation[];
  articleCount: number;
  iconMetadata?: Asset | null;
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



export interface FullArticle {
  slug: string;
  status: string;
  layout: 'regular' | 'promoted' | 'latest' | 'advertising' | 'news';
  published_at: string;
  updated_at: string | null;
  external_link: string | null;
  article_heading_img: string;
  toc: boolean;
  rubric_slug: ArticleRubric;
  translations: ArticleTranslation[];
  authors: AuthorDetails[];
  categories: Category[];
}

export type SearchResultType = 'author' | 'category' | 'article';

export interface BaseSearchResult {
  type: SearchResultType;
  slug: string;
}

export interface AuthorSearchResult extends BaseSearchResult {
  type: 'author';
  name: string;
  bio?: string;
  articleCount: number;
}

export interface CategorySearchResult extends BaseSearchResult {
  type: 'category';
  name: string;
  articleCount: number;
}

export interface ArticleSearchResult extends BaseSearchResult {
  type: 'article';
  title: string;
  description: string;
  rubric_slug: string;
  languages_code: string;
}

export type SearchResult = AuthorSearchResult | CategorySearchResult | ArticleSearchResult;

export interface SearchProposition { //  Results of search in translated titles and descriptions
  slug: string;
  title: string;
  description: string;
  rubric_slug: string;
  languages_code: string;
}

export interface Asset {
  id: string;
  filename_disk: string;
  filename_download: string;
  title?: string;
  description?: string;
  tags?: string[];
  type: string;
  filesize: number;
  width: number | null;
  height: number | null;
  uploaded_on: string;
}

/**
 * Article Engagement Metrics
 * Tracks views, likes, and shares per article
 */
export interface ArticleEngagement {
  id: number;
  article_slug: string;
  view_count: number;
  like_count: number;
  share_count: number;
  date_created: string;
  date_updated: string;
}

/**
 * Engagement API Response (from Next.js API routes)
 */
export interface EngagementResponse {
  success: boolean;
  data: {
    slug: string;
    views: number;
    likes: number;
    shares: number;
  };
  action?: 'view' | 'like' | 'unlike' | 'share';
}

/**
 * Engagement API Error Response
 */
export interface EngagementError {
  error: string;
}


