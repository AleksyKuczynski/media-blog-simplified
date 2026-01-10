// src/features/article-display/actions/getRandomArticles.ts
'use server';

import { Lang } from '@/config/i18n';
import { ArticleCardData } from '@/features/shared/CardCarousel/types';

interface RandomArticle {
  slug: string;
  published_at: string;
  layout: string;
  rubric_slug?: string;
  article_heading_img?: string;
  translations: Array<{
    title: string;
    languages_code: string;
  }>;
}

export async function getRandomArticles(
  lang: Lang,
  limit: number = 6
): Promise<ArticleCardData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/random-articles?lang=${lang}&limit=${limit}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      console.error('Failed to fetch random articles');
      return [];
    }

    const { data } = await response.json();

    const carouselCards: ArticleCardData[] = data.map((article: RandomArticle) => {
      const translation = article.translations.find(t => t.languages_code === lang);

      const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const imageSrc = article.article_heading_img
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${article.article_heading_img}`
        : undefined;

      return {
        type: 'article' as const,
        slug: article.slug,
        title: translation?.title || '',
        publishedAt: article.published_at,
        imageSrc,
        rubricSlug: article.rubric_slug || '',
        formattedDate,
      };
    });

    return carouselCards;
  } catch (error) {
    console.error('Error fetching random articles:', error);
    return [];
  }
}