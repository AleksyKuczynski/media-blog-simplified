// src/features/article-display/RandomArticles.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import { DIRECTUS_URL } from '@/api/directus';
import { ArticleCardData } from '../shared/CardCarousel/types';
import CardCarousel from '../shared/CardCarousel/CardCarousel';

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

interface RandomArticlesProps {
  lang: Lang;
  dictionary: Dictionary;
  limit?: number;
}

export default function RandomArticles({
  lang,
  dictionary,
  limit = 6,
}: RandomArticlesProps) {
  const [cards, setCards] = useState<ArticleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRandomArticles() {
      try {
        const response = await fetch(`/api/random-articles?lang=${lang}&limit=${limit}`);
        
        if (!response.ok) {
          console.error('Failed to fetch random articles');
          setIsLoading(false);
          return;
        }

        const { data } = await response.json();
        
        const transformedCards: ArticleCardData[] = data.map((article: RandomArticle) => {
          const translation = article.translations.find(t => t.languages_code === lang);
          const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const imageSrc = article.article_heading_img 
            ? `${DIRECTUS_URL}/assets/${article.article_heading_img}?width=400&height=300&fit=cover&quality=80`
            : '/images/fallback-article.jpg';

          return {
            slug: article.slug,
            rubricSlug: article.rubric_slug || 'articles',
            title: translation?.title || article.slug,
            publishedAt: formattedDate,
            layout: article.layout,
            imageSrc,
            lang,
          };
        });

        setCards(transformedCards);
      } catch (error) {
        console.error('Error fetching random articles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRandomArticles();
  }, [lang, limit]);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-80 h-96 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <CardCarousel
      cards={cards}
      dictionary={dictionary}
      lang={lang}
    />
  );
}