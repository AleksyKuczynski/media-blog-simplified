// src/main/lib/markdown/processLinks.ts
import { ContentChunk } from './markdownTypes';
import { isValidSlugFormat } from './validateSlug';

const balloonContainerStyles = [
  // Base styles
  'relative inline-block group cursor-help',
  // Theme variants
  'theme-default:border-b theme-default:border-dotted theme-default:border-txcolor-muted',
  'theme-rounded:border-b theme-rounded:border-dotted theme-rounded:border-txcolor-muted',
  'theme-sharp:border-b theme-sharp:border-dashed theme-sharp:border-prcolor'
].join(' ');

const balloonTipStyles = [
  // Base styles
  'absolute bottom-full left-1/2 transform -translate-x-1/2 min-w-[200px] max-w-xs',
  'opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10',
  'p-2 text-xs text-bgcolor bg-txcolor shadow-lg',
  // Theme variants
  'theme-default:rounded',
  'theme-rounded:rounded-xl',
  'theme-sharp:border theme-sharp:border-prcolor'
].join(' ');

/**
 * Process markdown links and categorize them into three types:
 * 1. External links (http/https) - leave unchanged
 * 2. Article slugs - mark with UNIQUE delimiter for later processing
 * 3. Everything else - convert to balloon tips
 * 
 * ✅ FIX: Use unique delimiter instead of HTML spans
 * This prevents issues with markdown-to-HTML conversion
 */
export function processLinks(chunks: ContentChunk[]): ContentChunk[] {
  return chunks.map(chunk => {
    if (chunk.type === 'markdown' && chunk.content) {
      chunk.content = chunk.content.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (match, text, url) => {
          const trimmedUrl = url.trim();
          
          // Type 1: External links - keep as-is
          if (/^https?:\/\//i.test(trimmedUrl)) {
            return match;
          }
          
          // Type 2: Article slugs - use UNIQUE delimiter
          // Format: ___ARTICLE_CARD:slug___ (unlikely to appear naturally)
          if (isValidSlugFormat(trimmedUrl)) {
            return `___ARTICLE_CARD:${trimmedUrl}___`;
          }
          
          // Type 3: Everything else - balloon tip (as HTML is safe here)
          return `<span class="${balloonContainerStyles}">
            ${text}
            <span class="${balloonTipStyles}">
              ${trimmedUrl}
            </span>
          </span>`;
        }
      );
    }
    return chunk;
  });
}