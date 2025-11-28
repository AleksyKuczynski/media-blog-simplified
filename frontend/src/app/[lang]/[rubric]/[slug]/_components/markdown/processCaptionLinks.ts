// app/[lang]/[rubric]/[slug]/_components/markdown/processCaptionLinks.ts
/**
 * Article Markdown - Caption Link Processing
 * 
 * Simplified link processing for image captions.
 * No balloon tips or article cards in captions.
 * 
 * Link Handling:
 * 1. External links (http/https) - preserved
 * 2. Article slugs - converted to plain text
 * 3. Invalid/internal links - converted to plain text or removed
 * 
 * Philosophy:
 * - Keep captions simple and focused on image
 * - Avoid interactive elements in captions
 * 
 * Dependencies: None
 * 
 * @param markdown - Caption markdown string
 * @returns {string} Processed caption markdown
 */

export function processCaptionLinks(markdown: string): string {
  return markdown.replace(
    /\[([^\]]*)\]\(([^)]+)\)/g,
    (match, text, url) => {
      const trimmedUrl = url.trim();
      const trimmedText = text.trim();
      
      // Type 1: External links - keep as-is for remark processing
      if (/^https?:\/\//i.test(trimmedUrl)) {
        return match;
      }
      
      // Type 2 & 3: Article slugs and invalid links
      // Keep link text as plain text, or remove if no text
      return trimmedText || '';
    }
  );
}