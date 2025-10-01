// src/main/lib/directus/fetchRubricDetails.ts

import { Lang } from '../dictionary/types';
import { DIRECTUS_URL, Rubric, fetchAssetMetadata } from './index';

export async function fetchRubricDetails(slug: string, lang: Lang): Promise<Rubric | null> {
  try {
    const fields = [
      'slug',
      'nav_icon',
      'translations.languages_code',
      'translations.name',
      'translations.description',
      'translations.meta_title',
      'translations.meta_description',
      'translations.og_title',
      'translations.og_description',
      'translations.yandex_description',
      'translations.focus_keyword'
    ].join(',');

    const filter = encodeURIComponent(JSON.stringify({ slug: { _eq: slug } }));
    const deepFilter = encodeURIComponent(JSON.stringify({
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    }));

    const url = `${DIRECTUS_URL}/items/rubrics?fields=${fields}&filter=${filter}&deep=${deepFilter}`;
    const response = await fetch(url, { 
      next: { 
        revalidate: 3600,
        tags: ['rubrics', `rubric-${slug}`]
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rubric details. Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    const rubric = data.data[0];

    // Fetch icon metadata if nav_icon exists
    let iconMetadata = null;
    if (rubric.nav_icon) {
      iconMetadata = await fetchAssetMetadata(rubric.nav_icon);
    }

    // Count articles for this rubric
    const articleCountResponse = await fetch(
      `${DIRECTUS_URL}/items/articles?aggregate[count]=*&filter[rubric_slug][_eq]=${slug}&filter[status][_eq]=published`,
      { cache: 'no-store' }
    );
    
    let articleCount = 0;
    if (articleCountResponse.ok) {
      const countData = await articleCountResponse.json();
      articleCount = countData.data?.[0]?.count || 0;
    }

    const rubricDetails: Rubric = {
      slug: rubric.slug,
      nav_icon: rubric.nav_icon || undefined,
      iconMetadata,
      translations: rubric.translations || [],
      articleCount
    };

    return rubricDetails;
  } catch (error) {
    console.error(`Error fetching rubric details for ${slug}:`, error);
    return null;
  }
}