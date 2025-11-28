// src/main/lib/markdown/processBalloonTips.ts
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