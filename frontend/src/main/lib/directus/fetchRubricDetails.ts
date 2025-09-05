// src/main/lib/directus/fetchRubricDetails.ts

import { DIRECTUS_URL, Rubric } from './index';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';

export async function fetchRubricDetails(slug: string, lang: Lang): Promise<Rubric | null> {
  try {
    // Enhanced fields including ALL SEO data (no separate function needed)
    const fields = [
      'slug',
      'nav_icon',
      'translations.languages_code',
      'translations.name',
      'translations.description',
      'translations.meta_title',
      'translations.meta_description', 
      'translations.focus_keyword',
      'translations.og_title',
      'translations.og_description',
      'translations.yandex_description'
    ].join(',');

    const filter = {
      slug: { _eq: slug },
    };

    const rubricUrl = `${DIRECTUS_URL}/items/rubrics?fields=${fields}&filter=${JSON.stringify(filter)}`;
    const rubricResponse = await fetch(rubricUrl, { cache: 'no-store' });

    if (!rubricResponse.ok) {
      throw new Error(`Failed to fetch rubric details. Status: ${rubricResponse.status}`);
    }

    const rubricData = await rubricResponse.json();

    if (!rubricData.data || rubricData.data.length === 0) {
      return null;
    }

    const rubric = rubricData.data[0];

    // Fetch article count
    const countUrl = `${DIRECTUS_URL}/items/articles?aggregate[count]=*&filter[rubric_slug][_eq]=${slug}`;
    const countResponse = await fetch(countUrl, { cache: 'no-store' });

    if (!countResponse.ok) {
      throw new Error(`Failed to fetch article count. Status: ${countResponse.status}`);
    }

    const countData = await countResponse.json();
    const articleCount = countData.data[0]?.count ?? 0;

    return {
      slug: rubric.slug,
      translations: rubric.translations,
      articleCount: articleCount,
    };
  } catch (error) {
    console.error('Error fetching rubric details:', error);
    return null;
  }
}