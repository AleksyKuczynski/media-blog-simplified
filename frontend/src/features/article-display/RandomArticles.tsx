// src/features/article-display/RandomArticles.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import CardCarousel from '../shared/CardCarousel/CardCarousel';
import { ArticleCardData } from '../shared/CardCarousel/types';

// Use NEXT_PUBLIC for client-side access
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

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
  console.log('🎲 RandomArticles component mounted/rendered', { lang, limit });
  
  const [cards, setCards] = useState<ArticleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🎲 About to set up useEffect');

  useEffect(() => {
    console.log('🎲 useEffect FIRED!');
    
    async function fetchRandomArticles() {
      console.log('🎲 RandomArticles: Starting fetch...', { lang, limit });
      
      try {
        const url = `/api/random-articles?lang=${lang}&limit=${limit}`;
        console.log('🎲 Fetching from:', url);
        
        const response = await fetch(url);
        
        console.log('🎲 Response status:', response.status);
        
        if (!response.ok) {
          console.error('🎲 Failed to fetch random articles');
          setIsLoading(false);
          return;
        }

        const json = await response.json();
        console.log('🎲 Response data:', json);
        console.log('🎲 Articles count:', json.data?.length);

        const transformedCards: ArticleCardData[] = json.data.map((article: RandomArticle) => {
          console.log('🎲 Processing article:', article.slug);
          console.log('🎲 Article translations:', article.translations);
          
          const translation = article.translations.find(t => t.languages_code === lang);
          console.log('🎲 Found translation:', translation);
          
          const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          const imageSrc = article.article_heading_img 
            ? `${DIRECTUS_URL}/assets/${article.article_heading_img}?width=400&height=300&fit=cover&quality=80`
            : '/images/fallback-article.jpg';

          const card = {
            slug: article.slug,
            rubricSlug: article.rubric_slug || 'articles',
            title: translation?.title || article.slug,
            publishedAt: formattedDate,
            layout: article.layout,
            imageSrc,
            lang,
          };
          
          console.log('🎲 Transformed card:', card);
          return card;
        });

        console.log('🎲 Total transformed cards:', transformedCards.length);
        setCards(transformedCards);
      } catch (error) {
        console.error('🎲 Error fetching random articles:', error);
      } finally {
        console.log('🎲 Setting isLoading to false');
        setIsLoading(false);
      }
    }

    fetchRandomArticles();
  }, [lang, limit]);

  console.log('🎲 Render state:', { isLoading, cardsCount: cards.length });

  if (isLoading) {
    console.log('🎲 Rendering skeleton');
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
    console.log('🎲 No cards to render - returning null');
    return null;
  }

  console.log('🎲 Rendering CardCarousel with', cards.length, 'cards');
  return (
    <CardCarousel
      cards={cards}
      dictionary={dictionary}
      lang={lang}
    />
  );
}