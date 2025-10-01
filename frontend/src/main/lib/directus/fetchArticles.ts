// src/main/lib/directus/fetchArticles.ts

import { ArticleCardType, DIRECTUS_URL } from "./index";
import { Lang } from '../dictionary/types';

export async function fetchArticles(slugsAndLayouts: { slug: string; layout: string }[], lang: Lang, sort: string = 'desc'): Promise<ArticleCardType[]> {
  try {
    if (slugsAndLayouts.length === 0) {
      console.log("fetchArticles: No slugs provided, returning empty array");
      return [];
    }

    const filter = {
      "_or": slugsAndLayouts.map(({ slug }) => ({ "slug": { "_eq": slug } }))
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    const fields = 'slug,status,layout,published_at,external_link,article_heading_img,rubric_slug.slug,translations.*';
    const sortQuery = sort === 'asc' ? 'published_at' : '-published_at';
    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${encodedFilter}&sort=${sortQuery}`;

    const response = await fetch(url, { 
      next: { 
        revalidate: 300,
        tags: ['articles', 'article-data']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles. Status: ${response.status}`);
    }

    const data = await response.json();
    const layoutMap = new Map(slugsAndLayouts.map(item => [item.slug, item.layout]));

    const articles: ArticleCardType[] = data.data.map((article: any) => {
      const translation = article.translations.find((t: any) => t.languages_code === lang) || article.translations[0];
      return { 
        ...article, 
        rubric_slug: article.rubric_slug?.slug || '',
        authors: [{ last_name: 'Editorial', slug: '' }], // Simplified as we don't have access to author data
        layout: layoutMap.get(article.slug) || article.layout,
        title: translation?.title || '',
        description: translation?.description || '',
      } as ArticleCardType;
    });

    console.log(`fetchArticles: Processed ${articles.length} articles:`, articles);
    return articles;
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    throw error;
  }
}