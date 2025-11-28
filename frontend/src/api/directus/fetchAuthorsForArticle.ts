// /frontend/src/main/lib/directus/fetchAuthorsForArticle.ts

import { AuthorDetails, DIRECTUS_URL } from "./index";
import { Lang } from "@/config/i18n";

export async function fetchAuthorsForArticle(slug: string, lang: Lang): Promise<AuthorDetails[]> {
  try {

    const fields = [
      'authors_slug.slug',
      'authors_slug.translations.name',
      'authors_slug.translations.languages_code'
    ].join(',');

    const filter = encodeURIComponent(JSON.stringify({
      articles_slug: { _eq: slug }
    }));

    const deepFilter = encodeURIComponent(JSON.stringify({
      authors_slug: {
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }
    }));

    const url = `${DIRECTUS_URL}/items/articles_authors?fields=${fields}&filter=${filter}&deep=${deepFilter}`;
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article-author relations. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [{ name: '::EDITORIAL::', slug: '', bio: '', avatar: '' }];
    }

    const authors: AuthorDetails[] = data.data.map((item: any) => {
      const authorData = item.authors_slug;
      const translation = authorData.translations[0];
      return {
        slug: authorData.slug,
        name: translation ? translation.name : authorData.slug // Fallback to slug if no translation
      };
    });

    return authors;
  } catch (error) {
    return [];
  }
}