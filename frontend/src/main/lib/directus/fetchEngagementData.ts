// src/main/lib/directus/fetchEngagementData.ts

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function fetchEngagementData(slug: string) {
  try {
    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    // Add timestamp to bust Directus cache
    const timestamp = Date.now();
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1&_=${timestamp}`;

    console.log('📊 Fetching engagement data for:', slug);

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
      console.error('❌ Directus API Error:', errorText);
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const record = data.data[0];
      console.log('✅ Found engagement record:', {
        slug: record.article_slug,
        views: record.view_count,
        likes: record.like_count,
        shares: record.share_count,
      });
      return record;
    }

    // If no record exists, return defaults (Flow will create it)
    console.warn('⚠️ No record found - returning defaults');
    return {
      article_slug: slug,
      view_count: 0,
      like_count: 0,
      share_count: 0,
    };
  } catch (error) {
    console.error('❌ Error fetching engagement data:', error);
    throw error;
  }
}