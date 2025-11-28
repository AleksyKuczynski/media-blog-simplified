// src/main/lib/directus/fetchEngagementData.ts
// PHASE 1 - UPDATED: Added date_updated field for timestamp-based reconciliation

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function fetchEngagementData(slug: string) {
  try {
    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    // Request specific fields including date_updated for timestamp-based reconciliation
    const fields = 'article_slug,view_count,like_count,share_count,date_updated';
    // Add timestamp to bust Directus cache
    const timestamp = Date.now();
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&fields=${fields}&limit=1&_=${timestamp}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const record = data.data[0];
      return record;
    }

    // If no record exists, return defaults (Flow will create it)
    return {
      article_slug: slug,
      view_count: 0,
      like_count: 0,
      share_count: 0,
      date_updated: null, // NEW: No timestamp for non-existent records
    };
  } catch (error) {
    throw error;
  }
}