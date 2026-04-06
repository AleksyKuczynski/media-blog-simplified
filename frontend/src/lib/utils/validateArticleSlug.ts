// src/main/lib/utils/validateArticleSlug.ts


const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function validateArticleSlug(slug: string): Promise<boolean> {
  try {
    const filter = encodeURIComponent(JSON.stringify({ 
      slug: { _eq: slug },
      status: { _eq: 'published' }
    }));
    
    const url = `${DIRECTUS_URL}/items/articles?fields=slug&filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { 'Authorization': `Bearer ${DIRECTUS_API_TOKEN}` }
        : {},
      next: { revalidate: 3600, tags: ['article', 'slug-check'] },
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    console.error('Error validating article slug:', error);
    return false;
  }
}