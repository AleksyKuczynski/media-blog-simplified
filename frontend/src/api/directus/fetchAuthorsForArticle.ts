// frontend/src/api/directus/fetchAuthorsForArticle.ts

import { AuthorDetails, DIRECTUS_URL } from "./index";
import { Lang } from "@/config/i18n";

export async function fetchAuthorsForArticle(slug: string, lang: Lang): Promise<AuthorDetails[]> {
  try {
    const fields = [
      // Base author fields
      'authors_slug.slug',
      'authors_slug.avatar',
      'authors_slug.telegram_url',
      
      // Translation fields
      'authors_slug.translations.name',
      'authors_slug.translations.bio',
      'authors_slug.translations.languages_code',
      
      // Enhanced translation fields
      'authors_slug.translations.credentials',
      'authors_slug.translations.expertise_areas',
      'authors_slug.translations.meta_description',
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
    const response = await fetch(url, { 
      cache: 'no-store',
      next: {
        tags: ['authors', 'article-authors']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article-author relations. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [{ 
        name: '::EDITORIAL::', 
        slug: '', 
        bio: '', 
        avatar: '',
        is_author: true,
        is_illustrator: false, 
      }];
    }

    const authors: AuthorDetails[] = data.data.map((item: any) => {
      const authorData = item.authors_slug;
      const translation = authorData.translations[0];
      
      return {
        slug: authorData.slug,
        avatar: authorData.avatar || '',
        telegram_url: authorData.telegram_url,
        is_author: authorData.is_author,
        is_illustrator: authorData.is_illustrator,
        name: translation?.name || authorData.slug,
        bio: translation?.bio || '',
        
        // Enhanced fields
        credentials: translation?.credentials,
        expertise_areas: translation?.expertise_areas,
        meta_description: translation?.meta_description,
      };
    });

    return authors;
  } catch (error) {
    console.error('Error in fetchAuthorsForArticle:', error);
    return [];
  }
}