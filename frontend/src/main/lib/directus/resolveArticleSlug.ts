// frontend/src/main/lib/directus/resolveArticleSlug.ts

import { DIRECTUS_URL } from "./index";
import { Lang } from '../dictionary';

/**
 * Resolves URL slug param to main article slug
 * 
 * Logic:
 * 1. Normalize Unicode (handles accented characters like ú)
 * 2. Check if slugParam exists as main article slug
 * 3. If yes -> return slugParam
 * 4. If no -> search in local_slugs for this language
 * 5. If found -> return the main article slug
 * 6. If not found -> return null
 */
export async function resolveArticleSlug(
  slugParam: string,
  lang: Lang
): Promise<string | null> {
  // Normalize Unicode: u + combining accent -> single ú character
  const normalizedSlug = slugParam.normalize('NFC');
  
  // Step 1: Check if it's a main article slug
  const existsAsMainSlug = await checkMainSlugExists(normalizedSlug);
  
  if (existsAsMainSlug) {
    return normalizedSlug;
  }
  
  // Step 2: Check if it's a local_slug, get corresponding main slug
  const mainSlug = await findMainSlugByLocalSlug(normalizedSlug, lang);
  
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
      return null;
    }

    const data = await response.json();

    if (data.data?.[0]?.articles_slug) {
      return data.data[0].articles_slug;
    }

    return null;
  } catch (error) {
    return null;
  }
}