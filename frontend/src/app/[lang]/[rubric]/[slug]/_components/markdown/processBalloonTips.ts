// app/[lang]/[rubric]/[slug]/_components/markdown/processBalloonTips.ts
/**
 * Article Markdown - Balloon Tip Processor
 * 
 * Processes data-balloon-tip attributes for client-side rendering.
 * Transforms data attributes into interactive tooltip elements.
 * 
 * HTML Input:
 * <span data-balloon-tip="tooltip text">trigger text</span>
 * 
 * Process:
 * 1. Find all spans with data-balloon-tip attribute
 * 2. Extract tooltip text from attribute
 * 3. Create BalloonTip component wrapper
 * 4. Preserve original text as trigger
 * 
 * Features:
 * - Data attribute parsing
 * - HTML entity decoding
 * - Client-side tooltip generation
 * 
 * Dependencies:
 * - ./markdownTypes (ContentChunk)
 * - ../content/BalloonTip (tooltip component)
 * 
 * NOTE: Used for non-link references in content
 * (e.g., terms, definitions, side notes)
 * 
 * @param chunks - HTML content chunks
 * @returns {ContentChunk[]} Chunks with balloon tips
 */

import { ContentChunk } from './markdownTypes';

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

export function processBalloonTips(chunks: ContentChunk[]): ContentChunk[] {
  return chunks.map(chunk => {
    if (chunk.type === 'markdown' && chunk.content) {
      chunk.content = chunk.content.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        (match, text, url) => {
          if (!/^(https?:\/\/)/i.test(url)) {
            return `<span class="${balloonContainerStyles}">
              ${text}
              <span class="${balloonTipStyles}">
                ${url}
              </span>
            </span>`;
          }
          return match;
        }
      );
    }
    return chunk;
  });
}