// src/api/directus/fetchAuthorBySlug.ts

import { AuthorDetails, DIRECTUS_URL } from "./index";
import { Lang } from "@/config/i18n";

export async function fetchAuthorBySlug(slug: string, lang: Lang): Promise<AuthorDetails | null> {
  try {
    const authorUrl = `${DIRECTUS_URL}/items/authors?filter[slug][_eq]=${slug}&fields=slug,avatar,is_author,is_illustrator`;
    
    const authorResponse = await fetch(authorUrl, { 
      next: { 
        revalidate: 3600,
        tags: ['authors', `author-${slug}`]
      }
    });

    if (!authorResponse.ok) {
      throw new Error(`Failed to fetch author. Status: ${authorResponse.status}`);
    }

    const authorData = await authorResponse.json();
    
    if (authorData.data.length === 0) {
      return null;
    }

    const author = authorData.data[0];

    const translationUrl = `${DIRECTUS_URL}/items/authors_translations?filter[authors_slug][_eq]=${slug}&filter[languages_code][_eq]=${lang}&fields=name,bio`;
    
    const translationResponse = await fetch(translationUrl, { 
      next: { 
        revalidate: 3600,
        tags: ['authors', 'translations', `author-${slug}`]
      }
    });
    
    if (!translationResponse.ok) {
      throw new Error(`Failed to fetch author translation. Status: ${translationResponse.status}`);
    }

    const translationData = await translationResponse.json();
    const translation = translationData.data[0];

    return {
      slug: author.slug,
      avatar: author.avatar || '',
      is_author: author.is_author,
      is_illustrator: author.is_illustrator,
      name: translation ? translation.name : author.slug,
      bio: translation ? translation.bio : '',
      telegram_url: author.telegram_url || undefined,
      behance_url: author.behance_url || undefined,
      personal_website_url: author.personal_website_url || undefined,
      facebook_url: author.facebook_url || undefined,
      instagram_url: author.instagram_url || undefined,
      youtube_url: author.youtube_url || undefined,
      twitter_url: author.twitter_url || undefined,
      linkedin_url: author.linkedin_url || undefined
    };
  } catch (error) {
    return null;
  }
}