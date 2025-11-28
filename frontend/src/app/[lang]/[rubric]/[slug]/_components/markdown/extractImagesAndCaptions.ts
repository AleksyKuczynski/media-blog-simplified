// app/[lang]/[rubric]/[slug]/_components/markdown/extractImagesAndCaptions.ts
/**
 * Article Markdown - Image & Caption Extractor
 * 
 * Separates images with captions from markdown text.
 * Handles both inline images and figure blocks.
 * 
 * Patterns Recognized:
 * - ![alt](src) - Inline image
 * - ![alt](src)\nCaption text - Image with caption
 * 
 * Features:
 * - Caption detection (text following image)
 * - Multi-line caption support
 * - Image/text chunk separation
 * 
 * Dependencies:
 * - ./markdownTypes (ContentChunk)
 * 
 * @param content - Markdown string
 * @returns {chunks: ContentChunk[]} Separated image and text chunks
 */

import { ContentChunk, ImageAttributes } from './markdownTypes';
import { extractCaption } from './captionUtils';
import { parseMarkdownImage } from './parseMarkdownImage';
import { fetchAssetMetadata } from '@/main/lib/directus';

async function getImageAttributes(markdown: string): Promise<ImageAttributes | undefined> {
  const parsed = parseMarkdownImage(markdown);
  if (!parsed) return undefined;

  const { alt, src, assetId } = parsed;
  
  const metadata = await fetchAssetMetadata(assetId);

  return {
    src,
    alt,
    width: metadata?.width || 1200,
    height: metadata?.height || 800
  };
}

export async function extractImagesAndCaptions(content: string): Promise<{ chunks: ContentChunk[], remainingContent: string }> {
  const chunks: ContentChunk[] = [];
  const lines = content.split('\n');
  let currentMarkdown = '';

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.match(/^!\[.*?\]\(.*?\)$/)) {
      if (currentMarkdown.trim()) {
        chunks.push({
          type: 'markdown',
          content: currentMarkdown.trim()
        });
        currentMarkdown = '';
      }

      const imageAttributes = await getImageAttributes(line);
      if (!imageAttributes) {
        i++;
        continue;
      }

      const { caption, endIndex } = extractCaption(lines, i + 1);

      if (caption) {
        chunks.push({
          type: 'figure',
          content: line,
          imageAttributes,
          caption
        });
        i = endIndex + 1;
      } else {
        chunks.push({
          type: 'image',
          content: line,
          imageAttributes
        });
        i++;
      }
    } else {
      currentMarkdown += line + '\n';
      i++;
    }
  }

  if (currentMarkdown.trim()) {
    chunks.push({
      type: 'markdown',
      content: currentMarkdown.trim()
    });
  }

  return {
    chunks,
    remainingContent: ''
  };
}