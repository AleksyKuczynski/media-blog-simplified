// src/api/directus/fetchLocalSlug.ts

import { DIRECTUS_URL } from "../../config/constants/directusConstants";
import { Lang } from "@/config/i18n";

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
      articles_slug: { _contains: articleSlug },
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
    return null;
  }
}

/**
 * Fetch the slug to use for an article in a given language.
 * Returns local_slug if set, main slug if translation exists without local_slug,
 * or null if no translation exists for that language.
 */
export async function fetchArticleAltSlug(
  mainSlug: string,
  lang: Lang
): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      articles_slug: { _contains: mainSlug },
      languages_code: { _eq: lang }
    }));

    const url = `${DIRECTUS_URL}/items/articles_translations?filter=${filter}&fields=local_slug&limit=1`;

    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['articles', 'translations'] }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.data || data.data.length === 0) return null;
    return data.data[0].local_slug || mainSlug;
  } catch {
    return null;
  }
}