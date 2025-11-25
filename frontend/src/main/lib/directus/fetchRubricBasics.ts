// src/main/lib/directus/fetchRubricBasics.ts

import { DIRECTUS_URL } from './directusConstants';
import { RubricBasic } from './directusInterfaces';
import { Lang } from '../dictionary';

export async function fetchRubricBasics(lang: Lang, includeSEO: boolean = false): Promise<RubricBasic[]> {
  try {
    // Base fields for backward compatibility
    let fields = 'slug,translations.languages_code,translations.name';
    
    // Add SEO fields when requested
    if (includeSEO) {
      fields += ',translations.description,translations.meta_title,translations.meta_description,translations.focus_keyword';
    }

    // Use deep filter to get only translations for the specified language
    const deepFilter = JSON.stringify({
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    });
    
    const url = `${DIRECTUS_URL}/items/rubrics?fields=${fields}&deep=${encodeURIComponent(deepFilter)}`;
    
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

    // Map to RubricBasic, ensuring we get the translated name
    return data.data.map((rubric: any) => {
      const translation = rubric.translations?.find((t: any) => t.languages_code === lang);
      return {
        slug: rubric.slug,
        name: translation?.name || rubric.slug,
      };
    });
  } catch (error) {
    return [];
  }
}