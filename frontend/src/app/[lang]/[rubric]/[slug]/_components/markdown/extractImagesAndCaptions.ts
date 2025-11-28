// src/main/lib/markdown/extractImagesAndCaptions.ts
import { ContentChunk, ImageAttributes } from './markdownTypes';
import { extractCaption } from './captionUtils';
import { fetchAssetMetadata } from '../../../../../../main/lib/directus';
import { parseMarkdownImage } from '../../../../../../main/lib/utils';

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