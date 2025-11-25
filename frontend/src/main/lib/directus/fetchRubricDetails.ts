// src/main/lib/directus/fetchRubricDetails.ts

import { Lang } from '../dictionary';
import { DIRECTUS_URL, Rubric, fetchAssetMetadata } from './index';
import { fetchArticleSlugs } from './fetchArticleSlugs';

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

    // FIXED: Use fetchArticleSlugs to get proper language-filtered count
    const { totalCount } = await fetchArticleSlugs(
      1,
      'desc',
      lang,
      undefined,
      undefined,
      [],
      undefined,
      slug
    );

    const rubricDetails: Rubric = {
      slug: rubric.slug,
      nav_icon: rubric.nav_icon || undefined,
      iconMetadata,
      translations: rubric.translations || [],
      articleCount: totalCount
    };

    return rubricDetails;
  } catch (error) {
    return null;
  }
}