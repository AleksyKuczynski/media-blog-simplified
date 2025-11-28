// src/main/lib/markdown/validateSlug.ts

/**
 * Validates if a string matches the article slug pattern
 * Pattern: lowercase letters, numbers, and hyphens only
 * 
 * Examples:
 * ✓ "my-article-slug"
 * ✓ "article-123"
 * ✓ "test"
 * ✗ "My-Article" (uppercase)
 * ✗ "article_slug" (underscore)
 * ✗ "article.slug" (dot)
 */
export function isValidSlugFormat(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Must contain only lowercase letters, numbers, and hyphens
  // Must not start or end with hyphen
  // Must be at least 1 character
  const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  
  return slugPattern.test(text);
}