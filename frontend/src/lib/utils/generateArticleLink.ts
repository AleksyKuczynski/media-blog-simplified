// src/main/lib/utils/generateArticleLink.ts

/**
 * Generate article link using local_slug if available, otherwise main slug
 */
export function generateArticleLink(
  rubricSlug: string,
  articleSlug: string, 
  lang: string,
  localSlug?: string
): string {
  const displaySlug = localSlug || articleSlug;
  return `/${lang}/${rubricSlug}/${displaySlug}`;
}