// app/[lang]/[rubric]/[slug]/_components/markdown/processLinks.ts
/**
 * Article Markdown - Link Processing
 * 
 * Categorizes markdown links into three types:
 * 1. External links (http/https) - preserved for markdown
 * 2. Article slugs - marked with delimiter for article cards
 * 3. Everything else - converted to balloon tips (data-attribute spans)
 * 
 * Delimiter Format:
 * - Article cards: ___ARTICLE_CARD:slug___
 * - Unlikely to appear naturally in content
 * 
 * Features:
 * - Slug format validation
 * - HTML entity escaping (XSS prevention)
 * - Markdown-safe transformations
 * 
 * Dependencies:
 * - ./validateSlug (isValidSlugFormat)
 * - ./markdownTypes (ContentChunk)
 * 
 * @param chunks - Markdown content chunks
 * @returns {ContentChunk[]} Transformed chunks
 * 
 * NOTE: Article card delimiter processed later by processArticleCards.ts
 */

import { ContentChunk } from './markdownTypes';
import { isValidSlugFormat } from './validateSlug';

export function processLinks(chunks: ContentChunk[]): ContentChunk[] {
  return chunks.map(chunk => {
    if (chunk.type === 'markdown' && chunk.content) {
      chunk.content = chunk.content.replace(
        /\[([^\]]*)\]\(([^)]+)\)/g,
        (match, text, url) => {
          const trimmedUrl = url.trim();
          const trimmedText = text.trim();
          
          // Type 1: External links - keep as-is for markdown processing
          if (/^https?:\/\//i.test(trimmedUrl)) {
            return match;
          }
          
          // Type 2: Article slugs - use UNIQUE delimiter
          // Format: ___ARTICLE_CARD:slug___ (unlikely to appear naturally)
          if (isValidSlugFormat(trimmedUrl)) {
            return `___ARTICLE_CARD:${trimmedUrl}___`;
          }
          
          // Type 3: Everything else - balloon tip
          // Generate simple span with data attributes for client-side rendering
          // Escape HTML entities in text and URL to prevent XSS
          const escapedText = trimmedText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          
          const escapedUrl = trimmedUrl
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          
          // Use data-balloon-tip attribute to mark spans for client-side processing
          return `<span data-balloon-tip="${escapedUrl}">${escapedText}</span>`;
        }
      );
    }
    return chunk;
  });
}