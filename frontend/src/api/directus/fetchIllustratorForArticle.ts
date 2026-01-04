// frontend/src/api/directus/fetchIllustratorForArticle.ts

import { Lang } from "@/config/i18n";
import { DIRECTUS_URL } from "./directusConstants";
import { AuthorDetails } from "./directusInterfaces";

export async function fetchIllustratorForArticle(
  slug: string, 
  lang: Lang
): Promise<AuthorDetails | null> {
  try {
    const fields = [
      'illustrator_slug.slug',
      'illustrator_slug.avatar',
      'illustrator_slug.telegram_url',
      'illustrator_slug.is_author',
      'illustrator_slug.is_illustrator',
      'illustrator_slug.translations.name',
      'illustrator_slug.translations.bio',
      'illustrator_slug.translations.languages_code',
    ].join(',');

    const filter = encodeURIComponent(JSON.stringify({
      slug: { _eq: slug }
    }));

    const deepFilter = encodeURIComponent(JSON.stringify({
      illustrator_slug: {
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }
    }));

    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${filter}&deep=${deepFilter}`;
    
    const response = await fetch(url, { 
      cache: 'no-store',
      next: {
        tags: ['illustrators', 'article-illustrator']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article illustrator. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0 || !data.data[0].illustrator_slug) {
      return null;
    }

    const illustratorData = data.data[0].illustrator_slug;
    const translation = illustratorData.translations[0];
    
    return {
      slug: illustratorData.slug,
      avatar: illustratorData.avatar || '',
      telegram_url: illustratorData.telegram_url,
      is_author: illustratorData.is_author,
      is_illustrator: illustratorData.is_illustrator,
      name: translation?.name || illustratorData.slug,
      bio: translation?.bio || '',
    };
  } catch (error) {
    console.error('Error in fetchIllustratorForArticle:', error);
    return null;
  }
}