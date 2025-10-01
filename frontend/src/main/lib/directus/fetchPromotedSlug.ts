import { DIRECTUS_URL, PromotedArticle } from "./index";

export async function fetchPromotedSlug(): Promise<string | null> {
    try {
      const url = `${DIRECTUS_URL}/items/promoted`;
      const response = await fetch(url, { 
        next: { 
          revalidate: 300,
          tags: ['promoted']
        }
      });      

      if (!response.ok) {
        throw new Error(`Failed to fetch promoted article. Status: ${response.status}`);
      }
      const data: { data: PromotedArticle } = await response.json();
      return data.data.article;
    } catch (error) {
      console.error('Error fetching promoted article:', error);
      return null;
    }
  }