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

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function getRandomArticles(
  lang: Lang,
  limit: number = 6
): Promise<ArticleCardData[]> {
  if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN) {
    console.error('Server configuration error');
    return [];
  }

  try {
    const fetchLimit = Math.min(limit * 3, 18);
    
    const params = new URLSearchParams({
      fields: 'slug,published_at,layout,rubric_slug,article_heading_img,translations.title,translations.languages_code',
      filter: JSON.stringify({
        status: { _eq: 'published' }
      }),
      deep: JSON.stringify({
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }),
      sort: '-published_at',
      limit: fetchLimit.toString()
    });

    const url = `${DIRECTUS_URL}/items/articles?${params}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch articles from Directus');
      return [];
    }

    const data = await response.json();
    const articles: RandomArticle[] = data.data || [];

    const shuffled = [...articles].sort(() => Math.random() - 0.5);
    const randomArticles = shuffled.slice(0, limit);

    const carouselCards: ArticleCardData[] = randomArticles.map((article) => {
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