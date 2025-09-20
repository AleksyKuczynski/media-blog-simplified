// src/main/lib/directus/fetchSearchPropositions.ts

import { DIRECTUS_URL, MAX_SEARCH_PROPOSITIONS } from "./directusConstants";
import { Lang } from '../dictionary/types';
import { SearchProposition } from "./directusInterfaces";

export async function fetchSearchPropositions(search: string, lang: Lang): Promise<SearchProposition[]> {
  try {
    const filter = {
      _and: [
        {
          translations: {
            languages_code: {
              _eq: lang
            }
          }
        },
        {
          _or: [
            {
              translations: {
                title: {
                  _icontains: search
                }
              }
            },
            {
              translations: {
                description: {
                  _icontains: search
                }
              }
            }
          ]
        }
      ]
    };

    const fields = [
      'slug',
      'rubric_slug.slug',
      'translations.languages_code',
      'translations.title',
      'translations.description'
    ].join(',');

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));

    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${encodedFilter}&limit=${MAX_SEARCH_PROPOSITIONS}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch search propositions. Status: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map((item: any) => {
      const translation = item.translations.find((t: any) => t.languages_code === lang);
      if (!translation) {
        return null; // Skip items without a translation for the current language
      }
      return {
        slug: item.slug,
        title: translation.title || '',
        description: translation.description || '',
        rubric_slug: item.rubric_slug?.slug || '',
        languages_code: translation.languages_code
      };
    }).filter((item: SearchProposition | null) => item !== null) as SearchProposition[];
  } catch (error) {
    console.error('Error fetching search propositions:', error);
    return [];
  }
}