// src/api/directus/fetchAllRubrics.ts

import { Lang } from "@/config/i18n";
import { DIRECTUS_URL, Rubric, fetchRubricDetails } from './index';

export async function fetchAllRubrics(lang: Lang): Promise<Rubric[]> {
  try {
    // Fetch all rubric slugs
    const url = `${DIRECTUS_URL}/items/rubrics?fields=slug`;
    const response = await fetch(url, { 
      next: { 
        revalidate: 3600,
        tags: ['rubrics', 'structure']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rubric slugs. Status: ${response.status}`);
    }

    const data = await response.json();
    const slugs = data.data.map((item: { slug: string }) => item.slug);

    // Fetch details for each rubric (now includes SEO data by default)
    const rubricPromises = slugs.map((slug: string) => fetchRubricDetails(slug, lang));
    const rubrics = await Promise.all(rubricPromises);

    // Filter out any null results
    return rubrics.filter((rubric): rubric is Rubric => rubric !== null);
  } catch (error) {
    console.error('Error fetching all rubrics:', error);
    return [];
  }
}