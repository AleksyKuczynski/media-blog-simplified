// frontend/src/main/lib/directus/resolveArticleSlug.ts

import { DIRECTUS_URL } from "./index";
import { Lang } from '../dictionary';

/**
 * Resolves URL slug param to main article slug
 * 
 * Logic:
 * 1. Check if slugParam exists as main article slug
 * 2. If yes → return slugParam
 * 3. If no → search in local_slugs for this language
 * 4. If found → return the main article slug
 * 5. If not found → return null
 */
export async function resolveArticleSlug(
  slugParam: string,
  lang: Lang
): Promise<string | null> {
  // Step 1: Check if it's a main article slug
  const existsAsMainSlug = await checkMainSlugExists(slugParam);
  
  if (existsAsMainSlug) {
    return slugParam;
  }
  
  // Step 2: Check if it's a local_slug, get corresponding main slug
  const mainSlug = await findMainSlugByLocalSlug(slugParam, lang);
  
  return mainSlug;
}

/**
 * Check if article exists by main slug (lightweight query)
 */
async function checkMainSlugExists(slug: string): Promise<boolean> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      slug: { _eq: slug },
      status: { _eq: 'published' }
    }));

    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=slug&limit=1`;

    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['article', 'slug-check'] }
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Find main article slug by local_slug in translations
 */
async function findMainSlugByLocalSlug(
  localSlug: string,
  lang: Lang
): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      local_slug: { _eq: localSlug },
      languages_code: { _eq: lang }
    }));

    const url = `${DIRECTUS_URL}/items/articles_translations?filter=${filter}&fields=articles_slug&limit=1`;

    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['article', 'slug-resolve'] }
    });

    if (!response.ok) {
      console.log(`Could not search local_slug: ${localSlug}, status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.data?.[0]?.articles_slug) {
      return data.data[0].articles_slug;
    }

    return null;
  } catch (error) {
    console.error('Error finding main slug by local_slug:', error);
    return null;
  }
}