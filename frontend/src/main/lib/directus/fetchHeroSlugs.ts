// src/main/lib/directus/fetchHeroSlugs.ts

import { DIRECTUS_URL, HERO_LATEST_ARTICLES_COUNT } from "./index";
import { Lang } from '../dictionary';

interface FilterType {
  status: { _eq: string };
  translations: { languages_code: { _eq: Lang } };
  slug?: { _neq: string };
}

export async function fetchHeroSlugs(lang: Lang): Promise<string[]> {
  try {
    // First, fetch the promoted slug
    const promotedResponse = await fetch(`${DIRECTUS_URL}/items/promoted?fields=article`);
    if (!promotedResponse.ok) {
      throw new Error(`Failed to fetch promoted article. Status: ${promotedResponse.status}`);
    }
    const promotedData = await promotedResponse.json();
    const promotedSlug = promotedData.data?.article;

    // Prepare the query for fetching article slugs
    const fields = 'slug';
    const sort = '-published_at'; // Sort by publish date, newest first
    const filter: FilterType = {
      status: { _eq: 'published' },
      translations: { languages_code: { _eq: lang } }
    };
    if (promotedSlug) {
      filter.slug = { _neq: promotedSlug };
    }
    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    
    // Fetch one extra article to account for the promoted one
    const limit = promotedSlug ? HERO_LATEST_ARTICLES_COUNT : HERO_LATEST_ARTICLES_COUNT - 1;
    
    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&sort=${sort}&filter=${encodedFilter}&limit=${limit}`;

    const response = await fetch(url, { 
      next: { 
        revalidate: 300,
        tags: ['articles', 'hero']
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest article slugs. Status: ${response.status}`);
    }
    const data = await response.json();
    
    const latestSlugs = data.data.map((item: any) => item.slug);

    // Combine promoted slug (if exists) with latest slugs
    let heroSlugs = promotedSlug ? [promotedSlug, ...latestSlugs] : latestSlugs;
    
    // Ensure we don't exceed the desired count
    heroSlugs = heroSlugs.slice(0, HERO_LATEST_ARTICLES_COUNT);
    return heroSlugs;
  
  } catch (error) {
    console.error('Error in fetchHeroArticles:', error);
    return [];
  }
}