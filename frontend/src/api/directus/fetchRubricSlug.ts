// src/api/directus/fetchRubricSlug.ts

import { DIRECTUS_URL } from "../../config/constants/directusConstants";

export async function fetchRubricSlug(articleSlug: string): Promise<string | null> {
    try {
      const url = `${DIRECTUS_URL}/items/articles?fields=rubric_slug&filter[slug][_eq]=${articleSlug}`;
    const response = await fetch(url, { 
      next: { 
        revalidate: 3600,
        tags: ['articles', `article-${articleSlug}`]
      }
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch rubric slug. Status: ${response.status}`);
      }
      const data = await response.json();
      return data.data[0]?.rubric_slug || null;
    } catch (error) {
      return null;
    }
  }