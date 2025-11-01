// frontend/src/main/lib/engagement/localStorage.ts
/**
 * LocalStorage Operations for Engagement
 * 
 * Manages client-side storage of user preferences (liked articles)
 */

const LIKED_ARTICLES_KEY = 'liked_articles';

/**
 * Get liked articles from localStorage
 * 
 * @returns Array of liked article slugs
 */
export function getLikedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[localStorage] Error reading liked articles:', error);
    return [];
  }
}

/**
 * Check if article is liked
 * 
 * @param slug - Article slug
 * @returns True if article is liked
 */
export function isArticleLiked(slug: string): boolean {
  const likedArticles = getLikedArticles();
  return likedArticles.includes(slug);
}

/**
 * Save liked article to localStorage
 * 
 * @param slug - Article slug
 */
export function saveLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const likedArticles = getLikedArticles();
    
    if (!likedArticles.includes(slug)) {
      likedArticles.push(slug);
      localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
    }
  } catch (error) {
    console.error('[localStorage] Error saving liked article:', error);
  }
}

/**
 * Remove liked article from localStorage
 * 
 * @param slug - Article slug
 */
export function removeLikedArticle(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const likedArticles = getLikedArticles();
    const filtered = likedArticles.filter(s => s !== slug);
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[localStorage] Error removing liked article:', error);
  }
}