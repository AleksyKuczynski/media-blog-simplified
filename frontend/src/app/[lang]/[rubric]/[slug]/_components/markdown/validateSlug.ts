// app/[lang]/[rubric]/[slug]/_components/markdown/validateSlug.ts
/**
 * Article Markdown - Slug Validator
 * 
 * Validates article slug format for embedded cards.
 * 
 * Valid Format:
 * - Lowercase letters (a-z)
 * - Numbers (0-9)
 * - Hyphens (-)
 * - No spaces or special characters
 * 
 * Example Valid Slugs:
 * - "introduction-to-ai"
 * - "article-2024"
 * - "my-article"
 * 
 * Example Invalid Slugs:
 * - "My Article" (spaces, uppercase)
 * - "article_name" (underscores)
 * - "article@123" (special chars)
 * 
 * Dependencies: None
 * 
 * @param slug - Slug string to validate
 * @returns {boolean} True if valid format
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