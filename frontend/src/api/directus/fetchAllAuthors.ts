// src/api/directus/fetchAllAuthors.ts

import { Lang } from "@/config/i18n";
import { AuthorDetails, DIRECTUS_URL } from "./index";

export async function fetchAllAuthors(
  lang: Lang,
  roleFilter?: 'author' | 'illustrator' // Keep simple
): Promise<AuthorDetails[]> {
  try {
    // Build filter based on role
    const roleQueryFilter = roleFilter === 'author'
      ? '&filter[is_author][_eq]=true'
      : roleFilter === 'illustrator'
      ? '&filter[is_illustrator][_eq]=true'
      : ''; // No filter = all

    const authorsUrl = `${DIRECTUS_URL}/items/authors?fields=slug,avatar,is_author,is_illustrator${roleQueryFilter}&sort=slug`;
    
    const authorsResponse = await fetch(authorsUrl, { 
      next: { 
        revalidate: 3600,
        tags: ['authors', 'structure']
      }
    });
    
    if (!authorsResponse.ok) {
      throw new Error(`Failed to fetch authors. Status: ${authorsResponse.status}`);
    }

    const authorsData = await authorsResponse.json();
    const authors = authorsData.data;

    const slugs = authors.map((author: any) => author.slug);
    const translationsUrl = `${DIRECTUS_URL}/items/authors_translations?filter[authors_slug][_in]=${slugs.join(',')}&filter[languages_code][_eq]=${lang}&fields=authors_slug,name,bio`;
    
    const translationsResponse = await fetch(translationsUrl, { 
      next: { 
        revalidate: 3600,
        tags: ['authors', 'translations']
      }
    });

    if (!translationsResponse.ok) {
      throw new Error(`Failed to fetch author translations. Status: ${translationsResponse.status}`);
    }

    const translationsData = await translationsResponse.json();
    const translations = translationsData.data;

    const completeAuthors: AuthorDetails[] = authors.map((author: any) => {
      const translation = translations.find((t: any) => t.authors_slug === author.slug);
      return {
        slug: author.slug,
        avatar: author.avatar || '',
        is_author: author.is_author,
        is_illustrator: author.is_illustrator,
        name: translation ? translation.name : author.slug,
        bio: translation ? translation.bio : ''
      };
    });

    return completeAuthors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}