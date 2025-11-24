// src/main/lib/directus/fetchLocalSlug.ts

import { DIRECTUS_URL } from "./directusConstants";
import { Lang } from '../dictionary';

/**
 * Fetch local_slug for an article in a specific language
 * Returns null if not found or not set
 */
export async function fetchLocalSlug(
  articleSlug: string,
  lang: Lang
): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      articles_slug: { _eq: articleSlug },
      languages_code: { _eq: lang }
    }));

    const url = `${DIRECTUS_URL}/items/articles_translations?filter=${filter}&fields=local_slug&limit=1`;

    const response = await fetch(url, {
      next: { 
        revalidate: 3600,
        tags: ['articles', 'translations']
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.local_slug || null;
  } catch (error) {
    console.error('Error fetching local_slug:', error);
    return null;
  }
}