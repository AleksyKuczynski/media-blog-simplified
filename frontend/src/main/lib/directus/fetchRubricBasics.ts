// src/main/lib/directus/fetchRubricBasics.ts

import { DIRECTUS_URL } from './directusConstants';
import { RubricBasic } from './directusInterfaces';
import { Lang } from '../dictionary/types';

export async function fetchRubricBasics(lang: Lang, includeSEO: boolean = false): Promise<RubricBasic[]> {
  try {
    // Base fields for backward compatibility
    let fields = 'slug,translations.name';
    
    // Add SEO fields when requested
    if (includeSEO) {
      fields += ',translations.description,translations.meta_title,translations.meta_description,translations.focus_keyword';
    }

    const filter = JSON.stringify({
      translations: {
        languages_code: {
          _eq: lang
        }
      }
    });
    
    const url = `${DIRECTUS_URL}/items/rubrics?fields=${fields}&filter=${encodeURIComponent(filter)}`;
    const response = await fetch(url, { 
      next: { 
        revalidate: 3600,
        tags: ['rubrics', 'structure']
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rubric basics. Status: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((rubric: any) => ({
      slug: rubric.slug,
      name: rubric.translations[0]?.name || rubric.slug,
    }));
  } catch (error) {
    console.error('Error fetching rubric basics:', error);
    return [];
  }
}