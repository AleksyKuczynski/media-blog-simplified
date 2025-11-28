// src/main/lib/markdown/processCaptionLinks.ts

/**
 * Process links in image captions with simplified logic:
 * 
 * 1. External links (http/https) → keep as-is for remark to convert to <a> tags
 * 2. Article slugs → convert to plain text (from link text)
 * 3. Invalid/internal links → convert to plain text if text exists, otherwise remove
 * 
 * No balloon tips, no article cards - keep captions simple and focused on the image.
 * 
 * @example
 * processCaptionLinks('[Photo](https://example.com)') 
 * // → '[Photo](https://example.com)' (external link preserved)
 * 
 * processCaptionLinks('[Related article](my-article-slug)')
 * // → 'Related article' (slug stripped, text kept)
 * 
 * processCaptionLinks('[](invalid-link)')
 * // → '' (no text, removed completely)
 * 
 * processCaptionLinks('[Photo credit](Photo by John)')
 * // → 'Photo credit' (invalid link, text preserved)
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