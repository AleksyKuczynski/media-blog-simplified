// src/main/lib/utils/seoDateUtils.ts - New utility file
/**
 * Safely handles article dates for SEO purposes
 * Ensures valid ISO 8601 dates for structured data
 */

export interface ArticleDates {
  publishedTime: string;
  modifiedTime: string;
}

/**
 * Generates safe article dates for SEO metadata
 * @param publishedAt - Article publication date (required)
 * @param updatedAt - Article last updated date (optional, can be null)
 * @returns Safe ISO date strings for SEO
 */
export function getSafeArticleDates(
  publishedAt: string | Date | null | undefined,
  updatedAt: string | Date | null | undefined
): ArticleDates {
  // Ensure we have a valid publication date
  if (!publishedAt) {
    throw new Error('Article must have a valid publication date');
  }

  const publishedDate = new Date(publishedAt);
  const updatedDate = updatedAt ? new Date(updatedAt) : null;

  // Validate dates
  if (isNaN(publishedDate.getTime())) {
    throw new Error('Invalid publication date provided');
  }

  if (updatedDate && isNaN(updatedDate.getTime())) {
    console.warn('Invalid updated_at date provided, using published_at as fallback');
  }

  // Use published date if updated date is invalid or missing
  const safeUpdatedDate = (updatedDate && !isNaN(updatedDate.getTime())) 
    ? updatedDate 
    : publishedDate;

  return {
    publishedTime: publishedDate.toISOString(),
    modifiedTime: safeUpdatedDate.toISOString()
  };
}

/**
 * Checks if an article has been actually modified
 * @param publishedAt - Publication date
 * @param updatedAt - Last update date
 * @returns true if article was modified after publication
 */
export function isArticleModified(
  publishedAt: string | Date | null | undefined,
  updatedAt: string | Date | null | undefined
): boolean {
  if (!publishedAt || !updatedAt) return false;

  const publishedDate = new Date(publishedAt);
  const updatedDate = new Date(updatedAt);

  // Consider modified if updated more than 1 minute after publication
  return (updatedDate.getTime() - publishedDate.getTime()) > 60000;
}
